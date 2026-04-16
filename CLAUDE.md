# math-visual — project guide for agents

A Next.js personal math visualization site. Lessons are MDX files rendered via `next-mdx-remote/rsc`. Each lesson has an interactive p5.js sketch. The owner adds new lessons over time — keep patterns consistent.

---

## stack

- Next.js (App Router), TypeScript, Tailwind CSS
- MDX via `next-mdx-remote/rsc` — lessons live in `lessons/<slug>/content.mdx`
- p5.js for all interactive sketches — always dynamically imported with `ssr: false`
- No UI component library — all styling is inline styles or Tailwind utility classes

---

## site structure

The main page (`app/page.tsx`) shows **subject area cards**, not individual lesson cards. Each subject card links to a dedicated subject page. Lessons live on subject pages, not on the main page.

Current subject pages:
- `/linear-algebra` → `app/linear-algebra/page.tsx` — eigen, svd
- `/machine-learning` → `app/machine-learning/page.tsx` — gradient-descent, backpropagation

To add a new subject area: create `app/<subject>/page.tsx` (copy an existing subject page as a template), then add an entry to the `subjectAreas` array in `app/page.tsx`.

**What to edit and where:**
- Main page subject card titles/descriptions → `subjectAreas` array in `app/page.tsx`
- Linear algebra page hero text → `<p>` blocks in the hero section of `app/linear-algebra/page.tsx`
- Machine learning page hero text → `<p>` blocks in the hero section of `app/machine-learning/page.tsx`
- Lesson cards on a subject page → the lessons array at the top of that subject page file

---

## adding a new lesson — complete checklist

Do these five things, in order:

1. Create `lessons/<slug>/content.mdx` — follow the content template below
2. Create `components/sketches/<Name>Sketch.tsx` — follow the sketch rules below
3. Register the sketch in `app/lessons/[slug]/page.tsx`: add a dynamic import and add to the `components` map
4. Add the lesson card to the correct **subject page** (e.g. `app/linear-algebra/page.tsx`), NOT to `app/page.tsx`
5. Increment the `count` on the matching subject card in the `subjectAreas` array in `app/page.tsx`

For step 3, the pattern is always:
```ts
const YourSketch = dynamic(() => import("@/components/sketches/YourSketch"), { ssr: false });
// add YourSketch to the components object below
```

For step 4, the lesson card shape used in subject pages is:
```ts
{
  slug: "your-slug",
  tag: "topic area",
  title: "lowercase lesson title",
  description: "one line, conversational",
  accent: "#hexcolor",
}
```

Do NOT add individual lesson cards to `app/page.tsx` — that file only knows about subject areas.

---

## content template

Copy this skeleton for every new lesson. Fill in each section as described.

```mdx
---
title: "lowercase title, like a thought not a heading"
description: "one line, conversational"
tags: ["tag"]
color: "from-X-500 to-Y-500"
icon: "emoji"
date: "YYYY-MM-DD"
---

import YourSketch from '@/components/sketches/YourSketch'

[HOOK — no heading. 2-4 short paragraphs. Start with a visual or geometric observation,
not a definition. What does this thing DO? Why does it matter? No formulas here.]

---

### [name of the key idea]

[Introduce the concept. Define every symbol before you use it. Connect to something
the reader already knows from another lesson if there is a link. Show the formula
only after the reader has a picture to attach it to.]

<div className="math-highlight">[formula as plain unicode text]</div>

---

### the picture

[Describe what the sketch shows. Tell the reader what to click or drag and WHAT
SPECIFICALLY TO LOOK FOR — not just "watch the gradient change" but "watch the
gradient on w collapse to zero while v stays bright — that's the bottleneck".
One focused paragraph is usually enough.]

<div className="not-prose my-8">
  <YourSketch />
</div>

---

### [deeper section — algebra, derivation hint, or edge case]

[Once the reader has the picture, you can go deeper. Keep it short.
Hints for intuition, not full proofs.]

---

### why it matters

[2-4 real applications. One short paragraph each. No overselling.]

---

### what this doesn't cover yet

[2-3 honest sentences about what was left out and why. End every lesson with this.]
```

---

## content voice

Write like you are explaining something to a friend who is good at math but has not seen this topic. Not a textbook. Not a tutorial. Your own voice.

### the rules

- **Lowercase titles.** "the directions a matrix can't change" not "The Directions a Matrix Can't Change"
- **No em dashes.** Use a period or a comma instead.
- **First person where natural.** "I find this cool" or "I stared at that for a while" — not "this is an important concept"
- **Geometry first, formula second.** Describe the picture before you write the equation.
- **Define symbols before using them.** Introduce a name and what it means before you drop it into a formula.
- **Short paragraphs.** 2-4 sentences. One idea per paragraph.
- **No bold for random phrases.** Only use `**bold**` if something would be genuinely lost without it.
- **Admit when something is hard.** If a step is non-obvious, say so. Don't present the whole lesson as a smooth ride if it isn't.
- **Use "stop and think" moments.** When there's a key insight the reader should sit with before moving on, call it out explicitly. See the pattern below.

### stop and think moments

Some ideas need a beat before the reader moves on. When that happens, call it out directly in the prose rather than just flowing past it. A few patterns that work:

```
pause here. this step — forming AᵀA to get a symmetric matrix — is not obvious.
the reason it works is that any symmetric matrix is guaranteed to have real
eigenvectors, even when A itself doesn't. that's the whole trick.
```

```
this is the part that took me the longest to really believe: the gradient doesn't
care about the forward computation. it only cares about the local derivative at
each node. take a minute with that before moving on.
```

```
if the next paragraph feels too fast, it probably is. go back to the sketch,
pick a specific input, and trace where it goes by hand before reading on.
```

Use these sparingly — one or two per lesson, at the genuinely hard steps. Not as a way to pad the content.

### voice examples — write this, not that

| Write this | Not that |
|---|---|
| "try the Rotation preset. the matrix has no real eigenvectors — but SVD still works." | "It is important to note that rotation matrices do not possess real eigenvectors." |
| "I stared at this for a while before it clicked." | "This concept may seem counterintuitive at first." |
| "call them σ₁ and σ₂ — these are the singular values" | "The singular values σ₁ and σ₂ are defined as..." |
| "the ellipse axes are the directions A stretches most and least" | "The principal axes of the transformed ellipse correspond to the directions of maximum and minimum stretching." |
| "rotation has no real eigenvectors. you can check: the discriminant is negative." | "In the case of rotation matrices, the characteristic polynomial yields complex roots, indicating the absence of real eigenvectors." |

### what not to do

- Do not start with "In this lesson we will learn about..."
- Do not say "it is important to note that"
- Do not over-explain. Hints for intuition, not full derivations.
- Do not summarize what you just said at the end of a section.
- Do not use em dashes anywhere in the content.
- Do not present hard things as obvious. If a concept took mathematicians decades to find, or if it genuinely confused you the first time, say that.
- Do not be vague in sketch descriptions. "watch the gradient change" is not useful. Tell the reader the exact thing to look for and what it means when they see it.
- Do not write without any first-person voice. If there are zero "I" sentences in the whole lesson, the voice is wrong.

### math display

Inline math uses `<div className="math-highlight">`. This is not a LaTeX renderer. Write math as readable unicode plain text:

```mdx
<div className="math-highlight">∇f(x, y) = [ ∂f/∂x, ∂f/∂y ]</div>
<div className="math-highlight">A = U Σ Vᵀ</div>
<div className="math-highlight">λ₁ + λ₂ = trace(A) &nbsp;&nbsp;&nbsp; λ₁ · λ₂ = det(A)</div>
```

Use `&nbsp;` for spacing inside the div. Subscripts and superscripts with unicode: ₁ ₂ ᵀ ² ⁺.

---

## sketch rules (read carefully before writing a new sketch)

### pick your sketch type first

There are two types. Choose before you write anything.

**Type A — simulation sketch** (the sketch runs over time, like gradient descent stepping):
- The draw loop runs while the simulation is active, stops when idle
- User clicks to start/restart
- Use `useP5Sketch` hook
- Examples: `GradientSketch.tsx`, `FourierSketch.tsx`

**Type B — static/slider-driven sketch** (redraws on demand, like the eigen matrix explorer):
- `noLoop()` in setup — the canvas never redraws on its own
- Every slider change and click calls `p5Ref.current?.redraw()`
- Needs direct p5 instance access, so use inline `useEffect` with `p5Ref`, NOT `useP5Sketch`
- Examples: `EigenSketch.tsx`, `SVDSketch.tsx`

### Type A — lifecycle with useP5Sketch hook

```ts
import { useP5Sketch } from "@/hooks/useP5Sketch";

export default function YourSketch() {
  const [speed, setSpeed] = useState(0.1);
  const speedRef = useRef(speed);
  speedRef.current = speed; // keep ref in sync on every render

  const buildSketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(660, 440);
      p.noLoop(); // start stopped
    };
    p.mousePressed = () => {
      // reset and start
      p.loop();
    };
    p.draw = () => {
      // read speedRef.current, never speed directly
    };
  };

  const containerRef = useP5Sketch(buildSketch);
  return <div ref={containerRef} />;
}
```

### Type B — lifecycle with inline useEffect

```ts
export default function YourSketch() {
  const [val, setVal] = useState(1);
  const valRef = useRef(val);
  valRef.current = val;

  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    while (el.firstChild) el.removeChild(el.firstChild);

    const timer = setTimeout(() => {
      if (cancelled || !el) return;
      if (p5Ref.current) { p5Ref.current.remove(); p5Ref.current = null; }

      p5Ref.current = new p5((p: p5) => {
        p.setup = () => {
          p.createCanvas(660, 440);
          p.noLoop(); // never redraws on its own
        };
        p.mousePressed = () => {
          p.redraw(); // redraw on click
        };
        p.draw = () => {
          // read valRef.current here
        };
      }, el);
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (p5Ref.current) { p5Ref.current.remove(); p5Ref.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Slider handler: update state, then redraw after ref flushes
  const handleChange = (setter: (v: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(parseFloat(e.target.value));
      setTimeout(() => p5Ref.current?.redraw(), 0);
    };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex justify-center">
        <div ref={containerRef} />
      </div>
      {/* sliders go here */}
    </div>
  );
}
```

### state vs refs — the most common bug

p5's `draw` loop captures variables at sketch creation time. React state goes stale inside the closure.

**Rule:** mirror every piece of state the draw loop reads into a ref, and keep it in sync:
```ts
const [learningRate, setLearningRate] = useState(0.05);
const lrRef = useRef(learningRate);
lrRef.current = learningRate; // this line runs on every render, keeps ref fresh
// inside buildSketch / p.draw: read lrRef.current, never learningRate
```

### canvas setup — standard values

```ts
const W = 660;
const H = 440;
p.createCanvas(W, H);
p.textFont("Inter");
```

For math coordinate systems, center the origin and flip Y so math-Y is up:
```ts
p.translate(W / 2, H / 2);
p.scale(1, -1); // now positive Y goes up, like a math graph
// text rendered inside this transform needs p.scale(1, -1) locally before drawing
```

### colors — use these

```ts
p.background(13, 17, 23);   // canvas background
p.stroke(40);               // grid lines
p.stroke(80);               // axes
p.fill(120);                // axis labels
// accent colors used across sketches:
// "#7F77DD"  purple (transformed shape)
// "#F0A500"  orange (first vector/direction)
// "#5DCAA5"  teal (second vector/direction)
// "rgba(255,80,160,0.9)"  pink (output / result vector)
```

### contour lines — use marching squares, not polar rays

The polar ray approach produces jagged lines on non-circular landscapes. Use precomputed marching squares:

```ts
const buildContourLines = () => {
  const step = 4;
  contourSegments = levels.map(level => {
    const segs: [number,number,number,number][] = [];
    for (let px = 0; px < width - step; px += step) {
      for (let py = 0; py < height - step; py += step) {
        const f00 = f(toMathX(px),      toMathY(py))      - level;
        const f10 = f(toMathX(px+step), toMathY(py))      - level;
        const f01 = f(toMathX(px),      toMathY(py+step)) - level;
        const f11 = f(toMathX(px+step), toMathY(py+step)) - level;
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

Call `buildContourLines()` in `p.setup()`. In `p.draw()`, iterate the stored segments.

### coordinate system note

When using `p.scale(1, -1)` (Y-up math coordinates), do NOT negate gradient Y components when converting to screen space — both coordinate systems now increase downward:

```ts
// correct
const arrowScreenX = gx * scaleX;
const arrowScreenY = gy * scaleY; // no negation
```

---

## visual style

- Dark background: `#0a0a0a`, text: `#e8e8e8`, muted: `#888`, very muted: `#555`
- Site is dark-only — no light/dark toggle
- Navbar on lesson pages: `← lessons` left, `github` right, nothing else
- Lesson cards: accent color top border, lowercase tag, conversational description

---

## file map

```
app/
  page.tsx                      — main page; only contains subjectAreas array (subject cards)
  layout.tsx                    — root layout
  linear-algebra/
    page.tsx                    — LA subject page; edit hero text and laLessons array here
  machine-learning/
    page.tsx                    — ML subject page; edit hero text and mlLessons array here
  lessons/[slug]/
    page.tsx                    — lesson renderer (register new sketches here)
components/
  Navbar.tsx
  sketches/
    GradientSketch.tsx          — Type A (simulation)
    NonConvexSketch.tsx         — Type A (simulation)
    FourierSketch.tsx           — Type A (simulation)
    EigenSketch.tsx             — Type B (static/slider)
    SVDSketch.tsx               — Type B (static/slider)
    BackpropSketch.tsx          — Type A (simulation)
hooks/
  useP5Sketch.ts                — shared hook for Type A sketches only
lessons/
  gradient-descent/content.mdx
  eigen/content.mdx
  fourier-series/content.mdx
  svd/content.mdx
  backpropagation/content.mdx
lib/
  lessons.ts                    — lesson metadata + content loader
```
