# math-visual

personal math visualization site — interactive lessons and course notes on the math i keep coming back to, written the way it finally clicked for me.

**[math-visual-nu.vercel.app](https://math-visual-nu.vercel.app)**

---

## what this is

two kinds of content live here.

**lessons** pair prose with a live p5.js sketch. geometry first, formula second. each one covers a topic i found genuinely confusing and wanted to understand from the ground up.

**course notes** are full written notes for math courses — definitions, proofs, examples, and problem sets. lighter than a textbook, more rigorous than most explainers.

---

## lessons

| topic | subject | what it covers |
|---|---|---|
| **fourier series** | — | decomposing signals into frequency components, interactive frequency slider |
| **eigenvectors** | linear algebra | unit circle to ellipse transformation, real-time eigenvector overlay |
| **SVD** | linear algebra | singular value decomposition, geometric interpretation, interactive preset matrices |
| **gradient descent** | machine learning | contour plot with click-to-place optimizer, adjustable learning rate, momentum and SGD modes |
| **backpropagation** | machine learning | forward and backward pass through a small network, node-by-node gradient visualization |

---

## course notes

### abstract linear algebra

math 416 — axler, *linear algebra done right* (4th ed.)

written notes covering the course from vector spaces through the spectral theorem. currently through chapter 3C (matrices). each note has an optional companion problem set.

| # | topic |
|---|---|
| 1 | vector spaces |
| 2 | subspaces |
| 3 | span and linear independence |
| 4 | bases |
| 5 | dimension |
| 6 | linear maps |
| 7 | the rank-nullity theorem |
| 8 | matrices as linear maps in coordinates |

plus companion notes on proof technique, what definitions are for, and what mathematical understanding feels like.

### combinatorics

math 413 — brualdi, *introductory combinatorics* (3rd ed., 1999)

---

## stack

- **next.js** — app router, typescript
- **p5.js** — all sketches dynamically imported (`ssr: false`), instance mode
- **tailwind css** — dark only (lessons); light/cream theme (notes)
- **mdx** via `next-mdx-remote/rsc`
- **katex** via `remark-math` + `rehype-katex` — math rendering in course notes

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
  page.tsx                          # homepage — subject area cards
  linear-algebra/page.tsx           # LA lessons + connection pages
  machine-learning/page.tsx         # ML lessons
  abstract-linear-algebra/
    layout.tsx                      # loads KaTeX CSS
    page.tsx                        # notes index
    [slug]/page.tsx                 # note renderer
    [slug]/problems/page.tsx        # problem set renderer (auto-discovered)
  combinatorics/                    # same structure as abstract-linear-algebra
  lessons/[slug]/page.tsx           # lesson renderer (register new sketches here)
components/
  sketches/                         # one file per lesson sketch
  Navbar.tsx
hooks/
  useP5Sketch.ts                    # shared p5 lifecycle hook (Type A sketches)
lessons/
  linear-algebra/<slug>/content.mdx
  machine-learning/<slug>/content.mdx
notes/
  abstract-linear-algebra/<slug>/content.mdx
  abstract-linear-algebra/<slug>/problems.mdx   # optional; creates /problems route
  combinatorics/<slug>/content.mdx
lib/
  lessons.ts                        # lesson metadata loader
  notes.ts                          # generic note loader; accepts optional course param
```

## adding content

see `CLAUDE.md` for the full guide — sketch rules, note format, voice guidelines, and step-by-step instructions for lessons, notes, and problem sets.
