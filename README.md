# math-visual

interactive lessons on the math i keep coming back to — built at uiuc, mostly for myself.

**[live →](https://math-visual.vercel.app)** *(deploy link — update after deploying)*

---

## what this is

a small collection of visual, interactive explainers for math concepts that clicked once i could *see* them. each lesson pairs prose with a live p5.js sketch you can play with.

### lessons

| topic | what it covers |
|---|---|
| **fourier series** | epicycle animation building a square wave from sine harmonics |
| **gradient descent** | click-to-place contour plot optimizer with adjustable learning rate |
| **eigenvectors** | unit circle → ellipse transformation with real-time eigenvector overlay |

more coming as i work through math 416 this fall.

---

## stack

- **next.js 14** — app router, typescript
- **p5.js** — all sketches are instance-mode, mounted directly via `useEffect`
- **tailwind css** — dark-mode-first styling
- **mdx** — lesson content (prose + embedded sketch components)

## run locally

```bash
git clone https://github.com/nilaycry/math-visual.git
cd math-visual
npm install
npm run dev
```

open [localhost:3000](http://localhost:3000).

## project structure

```
app/
  page.tsx                          # homepage
  lessons/[slug]/
    page.tsx                        # lesson layout (breadcrumb, header, nav)
    content/
      fourier-series.tsx            # lesson prose + sketch
      gradient-descent.tsx
      eigen.tsx
components/
  sketches/
    FourierSketch.tsx               # epicycle + waveform
    GradientSketch.tsx              # contour plot + gradient descent
    EigenSketch.tsx                 # matrix transformer + eigenvectors
    HeroSketch.tsx                  # homepage animation
  Canvas.tsx                        # shared p5 wrapper
  ConditionalLayout.tsx             # route-aware layout (hides chrome on homepage)
  Navbar.tsx
lib/
  lessons.ts                        # lesson metadata
```

## adding a new lesson

1. add metadata to `lib/lessons.ts`
2. create `components/sketches/YourSketch.tsx` — use direct p5 mount pattern:
   ```tsx
   useEffect(() => {
     const timer = setTimeout(() => {
       if (cancelled) return;
       p5Ref.current = new p5((p) => { /* setup + draw */ }, el);
     }, 0);
     return () => { cancelled = true; clearTimeout(timer); /* cleanup */ };
   }, []);
   ```
3. create `app/lessons/[slug]/content/your-slug.tsx` — prose + `<YourSketch />`
4. import + register in `app/lessons/[slug]/page.tsx`

## license

mit
