# math-visual

personal math visualization site — interactive notes on the math i keep coming back to, written the way it finally clicked for me.

**[math-visual-nu.vercel.app](https://math-visual-nu.vercel.app)**

---

## what this is

each lesson pairs prose with a live p5.js sketch you can play with. geometry first, formula second. writing these out is also how i make sure i actually understand something.

### lessons

| topic | what it covers |
|---|---|
| **gradient descent** | contour plot with click-to-place optimizer, adjustable learning rate, momentum and noisy SGD modes |
| **eigenvectors** | unit circle to ellipse transformation, real-time eigenvector overlay, click-to-transform any vector |

more coming as i work through topics i find interesting.

---

## stack

- **next.js** — app router, typescript
- **p5.js** — all sketches dynamically imported (`ssr: false`), instance mode
- **tailwind css** — dark only
- **mdx** via `next-mdx-remote/rsc` — lessons live in `lessons/<slug>/content.mdx`

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
  page.tsx                    # homepage + lesson cards
  lessons/[slug]/
    page.tsx                  # lesson renderer (register new sketches here)
components/
  sketches/
    GradientSketch.tsx
    NonConvexSketch.tsx
    EigenSketch.tsx
    HeroSketch.tsx
  Navbar.tsx
hooks/
  useP5Sketch.ts              # shared p5 lifecycle hook
lessons/
  gradient-descent/content.mdx
  eigen/content.mdx
lib/
  lessons.ts                  # metadata loader (respects draft: true frontmatter)
```

## adding a lesson

see `CLAUDE.md` for the full guide — sketch rules, lifecycle patterns, design voice, and step-by-step instructions.
