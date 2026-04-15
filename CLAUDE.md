# math-visual — project guide for agents

A Next.js personal math visualization site. Lessons are MDX files rendered via `next-mdx-remote/rsc`. Each lesson has an interactive p5.js sketch. The owner adds new lessons over time — keep patterns consistent.

---

## stack

- Next.js (App Router), TypeScript, Tailwind CSS
- MDX via `next-mdx-remote/rsc` — lessons live in `lessons/<slug>/content.mdx`
- p5.js for all interactive sketches — always dynamically imported with `ssr: false`
- No UI component library — all styling is inline styles or Tailwind utility classes

---

## adding a new lesson

1. Create `lessons/<slug>/content.mdx` with frontmatter:
   ```
   ---
   title: "lowercase title like this"
   description: "one line, conversational"
   tags: ["tag1", "tag2"]
   color: "from-X-500 to-Y-500"
   icon: "emoji"
   date: "YYYY-MM-DD"
   ---
   ```
2. Create `components/sketches/<Name>Sketch.tsx` (see sketch rules below)
3. Register it in `app/lessons/[slug]/page.tsx` — add a dynamic import and add to the `components` map
4. Add a card to the `lessonCards` array in `app/page.tsx`

---

## sketch rules (read carefully before writing a new sketch)

### lifecycle — always use the shared hook
```ts
import { useP5Sketch } from "@/hooks/useP5Sketch";
// ...
const containerRef = useP5Sketch(buildSketch);
// in JSX:
<div ref={containerRef} />
```
Never copy-paste the `useEffect` / `p5Ref` lifecycle manually — the hook handles it.

### state vs refs in p5 closures
p5's `draw` loop captures variables at sketch creation time. React state goes stale.
**Rule:** mirror every piece of state that the draw loop reads into a ref:
```ts
const [learningRate, setLearningRate] = useState(0.05);
const lrRef = useRef(learningRate);
lrRef.current = learningRate; // keep in sync every render
```
Inside `buildSketch`, read `lrRef.current`, never `learningRate` directly.

### noLoop / loop — always implement this
Sketches must not run the draw loop when idle (wastes CPU while user reads).

**Simulation sketches** (gradient descent, etc.) — start stopped, run on click, stop on convergence:
```ts
p.setup = () => { ...; p.noLoop(); }
p.mousePressed = () => { ...; p.loop(); }
// when converged or done:
p.noLoop();
```

**Static/slider-driven sketches** (EigenSketch, etc.) — use `noLoop` + `redraw()`. These need direct p5 instance access so they keep the inline `useEffect` lifecycle instead of `useP5Sketch`:
```ts
// In p.setup: p.noLoop()
// In p.mousePressed: p.redraw()
// In slider onChange handlers:
setter(parseFloat(e.target.value));
setTimeout(() => p5Ref.current?.redraw(), 0);
```
The `setTimeout(..., 0)` ensures the ref update from the setter has flushed before redraw fires.

### contour lines — use marching squares, not polar rays
The polar ray approach (`for angle ... for r ...`) produces jagged lines on non-circular landscapes.
Use the precomputed marching squares pattern:
```ts
const buildContourLines = () => {
  const step = 4; // pixels per grid cell
  contourSegments = levels.map(level => {
    const segs: [number,number,number,number][] = [];
    for (let px = 0; px < width - step; px += step) {
      for (let py = 0; py < height - step; py += step) {
        const f00 = f(toMathX(px),       toMathY(py))       - level;
        const f10 = f(toMathX(px+step),  toMathY(py))       - level;
        const f01 = f(toMathX(px),       toMathY(py+step))  - level;
        const f11 = f(toMathX(px+step),  toMathY(py+step))  - level;
        const pts: [number,number][] = [];
        if (f00*f10 < 0) { const t=f00/(f00-f10); pts.push([px+t*step, py]); }
        if (f10*f11 < 0) { const t=f10/(f10-f11); pts.push([px+step, py+t*step]); }
        if (f01*f11 < 0) { const t=f01/(f01-f11); pts.push([px+t*step, py+step]); }
        if (f00*f01 < 0) { const t=f00/(f00-f01); pts.push([px, py+t*step]); }
        if (pts.length === 2) segs.push([pts[0][0],pts[0][1],pts[1][0],pts[1][1]]);
      }
    }
    return { level, segs };
  });
};
```
Call `buildContourLines()` in `p.setup()`. In `p.draw()`, just iterate the stored segments.

### coordinate system
`toScreenY` maps `rangeY[0]` → top of canvas, `rangeY[1]` → bottom. Math Y and screen Y increase in the **same direction** (both downward). Do NOT negate the Y component when converting gradient vectors to screen space:
```ts
// correct
const arrowScreenX = gx * scaleX;
const arrowScreenY = gy * scaleY;  // no negation
```

### minimum markers
Never hardcode minimum positions from the function formula if there's a bowl/well interaction that shifts them. Find actual minima by running gradient descent from the analytical guess:
```ts
const findMin = (startX: number, startY: number) => {
  let x = startX, y = startY;
  for (let i = 0; i < 500; i++) {
    const [gx, gy] = grad(x, y);
    x -= 0.01 * gx; y -= 0.01 * gy;
  }
  return { x, y };
};
```

---

## design / voice

### content voice
The eigen lesson (`lessons/eigen/content.mdx`) is the gold standard. Key traits:
- Lowercase titles
- Personal first-person — "I stared at that for a while", "I find this cool"
- Geometry/picture first, formula second
- Honest scope: ends with "what this doesn't cover yet"
- Hints for intuition rather than full derivations
- Connects to real projects or experiences where possible

Do not write in generic AI explainer style. Do not over-bold. Do not use Bertrand Russell quotes.

### visual style
- Dark background: `#0a0a0a`, text: `#e8e8e8`, muted: `#888`, very muted: `#555`
- No light/dark mode toggle — site is dark-only in UI chrome (the p5 sketches have theme detection but the nav/page chrome does not expose a toggle)
- Navbar on lesson pages: minimal — `← lessons` on left, `github` on right, no logo/branding
- Main page navbar: `lessons` scroll link + `github` external link, no logo
- Lesson cards: accent color top border, lowercase tag, conversational description

### math display
Inline math uses `<div className="math-highlight">` — not a LaTeX renderer, just styled divs. Keep math readable as plain text (e.g. `∇f(x, y) = [ ∂f/∂x, ∂f/∂y ]`).

---

## file map

```
app/
  page.tsx              — main page (lessonCards array here)
  layout.tsx            — root layout
  lessons/[slug]/
    page.tsx            — lesson renderer (register new sketches here)
components/
  Navbar.tsx            — lesson page nav (hidden on homepage)
  sketches/
    GradientSketch.tsx
    NonConvexSketch.tsx
    FourierSketch.tsx
    EigenSketch.tsx
hooks/
  useP5Sketch.ts        — shared p5 lifecycle hook (use this, don't inline)
lessons/
  gradient-descent/content.mdx
  eigen/content.mdx
  fourier-series/content.mdx
lib/
  lessons.ts            — lesson metadata + content loader
```
