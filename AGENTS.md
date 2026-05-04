# math-visual

Lean project guide for Codex and future coding agents. Read this first, then inspect nearby files as needed.

## What this repo is

- Next.js App Router + TypeScript + Tailwind.
- Two content systems live side by side:
  - `lessons/`: dark interactive lessons with MDX prose and p5 sketches.
  - `notes/`: light notebook-style course notes rendered with KaTeX.
- The homepage at `app/page.tsx` shows subject or notebook cards, not individual lesson cards.

## Core rule

Do not guess the pattern. Copy the nearest existing page, lesson, note, or component and stay consistent with it.

## Common commands

- `npm run dev`: start the local Next.js dev server.
- `npm run dev:clean`: clear `.next`, then start the dev server.
- `npm run build`: production build and type check.
- `npm run clean`: remove the generated `.next` cache.

Use `npm run dev:clean` when the dev server reports missing generated chunks from `.next`.

## Publishing rule

When the user asks to commit and push changes, check the resulting Vercel build/deployment
with the Vercel plugin after pushing. If the build fails, inspect the Vercel logs, fix the
problem, commit the fix, push again, and repeat until the Vercel build succeeds. If Vercel
access is unavailable, say that explicitly instead of treating the push as fully verified.

## Technical defaults

- Prefer server components unless a file needs browser state, effects, event handlers, or p5.
- Keep new dependencies rare. Use the current stack unless a new library clearly removes real risk or complexity.
- Keep routing and discovery data-driven. Lessons and notes should appear from filesystem/frontmatter patterns whenever possible.
- Keep styling local and consistent with the surrounding page. Notes use explicit cream/light colors. Lessons use the dark site style.
- Run `npm run build` after code, routing, MDX, or config changes.

## Repeatable workflow

1. Read this file.
2. Identify the work type: lesson, course note, problem set, route/page, sketch, or infrastructure.
3. Inspect the closest good example before editing.
4. Make the smallest coherent change.
5. Run `npm run build`.

For more content-specific guidance and templates, see `docs/content-workflow.md` and `docs/templates/`.

## Canonical examples

Use these as style anchors when creating new material.

- Course notes: `notes/abstract-linear-algebra/vector-spaces/content.mdx`, `notes/abstract-linear-algebra/subspaces/content.mdx`, `notes/abstract-linear-algebra/bases/content.mdx`.
- Problem sets: `notes/abstract-linear-algebra/vector-spaces/problems.mdx`, `notes/abstract-linear-algebra/bases/problems.mdx`.
- ML foundations lessons: `lessons/machine-learning/before-we-begin/content.mdx`, `lessons/machine-learning/linear-models/content.mdx`, `lessons/machine-learning/gradient-descent/content.mdx`.
- Sketch registration: `app/lessons/[slug]/page.tsx`.

## Lessons

Use lessons for interactive visual intuition.

### Add a lesson

1. Create `lessons/<subject>/<slug>/content.mdx`.
2. Create `components/sketches/<Name>Sketch.tsx` when the lesson needs interaction.
3. Register the sketch in `app/lessons/[slug]/page.tsx`.
4. Confirm the lesson frontmatter has the right `tags`, `displayTag`, and no accidental `draft: true`.

Start from `docs/templates/lesson-content.mdx` when drafting a new lesson.

### Lesson routing and discovery

- Subject pages such as `app/linear-algebra/page.tsx` and `app/machine-learning/page.tsx` read from `getAllLessons()`.
- A lesson appears automatically when its frontmatter has the right tag and is not marked `draft: true`.
- `displayTag` controls the card label and theme color through `lib/theme.ts`.
- Do not add individual lesson cards to `app/page.tsx`.

### Lesson writing style

- Lowercase titles.
- Conversational but rigorous.
- Geometry first, formula second.
- Define symbols before using them.
- Short paragraphs.
- No em dashes.
- Be honest when a step is hard.

## Sketches

- Always dynamic import sketches with `ssr: false`.
- Choose sketch type before coding:
  - Type A: simulation over time. Use `useP5Sketch`.
  - Type B: static or slider-driven. Use inline `useEffect` plus `p5Ref`.
- Any React state read by `p.draw` must be mirrored into a ref. Read the ref inside the sketch, not stale state.
- Standard canvas size is `660 x 440`.
- For math coordinates, center the origin and flip Y with `p.scale(1, -1)`.
- Use marching squares for contour lines, not polar rays.

Templates:

- `docs/templates/sketch-simulation.tsx.template`
- `docs/templates/sketch-static-slider.tsx.template`

## Course notes

Every course uses the same notes system. Math 314, abstract linear algebra, and combinatorics should be treated as peers.

### Note structure

- Notes live at `notes/<course>/<slug>/content.mdx`.
- Optional problem sets live at `notes/<course>/<slug>/problems.mdx`.
- `lib/notes.ts` is generic. Pass the course name when needed.
- `week < 1` means companion or orientation notes.
- `week >= 1` means the main sequence.
- Fractional weeks are allowed for checkpoints or interludes.

Start from `docs/templates/note-content.mdx` and `docs/templates/problems.mdx` when drafting.

### Add a new course section

1. Create notes under `notes/<course>/`.
2. Copy `app/combinatorics/` or another notebook section to `app/<course>/`.
3. Update the `COURSE` constant, displayed title, and accent color.
4. Suppress the global navbar for `/<course>` in `components/Navbar.tsx`.
5. Add the course card and count to `app/page.tsx`.

### Note rendering constraints

- Notebook pages use a cream background and explicit hex colors. Do not use Tailwind theme color variables on these pages.
- Load KaTeX in the course layout.
- Use `$...$` for inline math and `$$...$$` for display math.
- Never split inline math across line breaks in MDX.
- Use the shared `.co-note-*` control classes and course accent classes for note navigation, problem links, and action buttons. Keep button behavior consistent across Math 314, abstract linear algebra, and combinatorics.

## Course-specific docs

Course-specific docs are allowed, but they are references, not global project rules. Keep the reusable workflow in this file and `docs/content-workflow.md`.

Current course-specific docs:

- `docs/combinatorics-textbook-outline.md`
- `docs/math-314-workflow.md`
- `docs/math-314-textbook-outline.md`
- `docs/math-314-prose-style.md`

## Good first files to inspect

- `app/page.tsx`
- `lib/lessons.ts`
- `lib/notes.ts`
- `components/Navbar.tsx`
- `app/lessons/[slug]/page.tsx`
- `app/combinatorics/page.tsx`
- `notes/abstract-linear-algebra/`
- `lessons/machine-learning/`
