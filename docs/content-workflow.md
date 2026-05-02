# Content Workflow

Use this as the repeatable playbook for future chats.

## How to ask Codex for content work

For a new lesson:

```text
Read AGENTS.md and docs/content-workflow.md. Add an interactive lesson on <topic>.
Use the ML foundations lessons as the style anchor. Add the MDX, sketch if needed,
registration, and run npm run build.
```

For a new course note:

```text
Read AGENTS.md and docs/content-workflow.md. Add a note for <course> on <topic>.
Use the nearest course notes as the style anchor. Follow any course-specific
note-first loop before adding problems, then run npm run build.
```

For revision:

```text
Read AGENTS.md. Revise <file> for clarity and mathematical correctness.
Preserve the existing route structure and voice. Run npm run build.
```

## Content decision tree

- Use a lesson when interaction or a visual changes the reader's understanding.
- Use a note when the main work is definitions, proof shape, examples, or cumulative course structure.
- Use a problem set when the reader needs to test whether they can use the definition or proof move.
- Use a separate course-specific doc only for syllabus, sequence, or textbook alignment.

## Lesson checklist

- Read a nearby lesson first, especially the ML foundations sequence.
- Put the geometric or operational picture before the formula.
- Use MDX frontmatter with `title`, `description`, `tags`, `displayTag`, and `date`.
- Import only registered sketch components.
- If adding a sketch, register it in `app/lessons/[slug]/page.tsx`.
- Keep "what this does not cover yet" honest and short.

## Note checklist

- Read the first abstract linear algebra notes before drafting.
- For course sequences with a note-first loop, draft and revise the note before adding a problem set.
- Keep titles lowercase.
- Start from the mathematical distinction that matters, not broad motivation.
- Define symbols before using them.
- Use display math for important definitions or theorem statements.
- Keep inline math on one physical line in MDX.
- End by naming what the note leaves out or prepares for.

## Problem set checklist

- Put low-friction diagnostic questions first.
- Include direct exercises using the key definition.
- Add a few proofs only after the reader has practiced the objects.
- Use `Solution` blocks sparingly, mostly to expose a common mistake or model the proof shape.

## Technical checklist

- Prefer existing route patterns over new abstractions.
- Keep generated files, browser profiles, and logs out of the repo.
- Run `npm run build` after content or code changes.
- If the dev server behaves strangely, stop it and run `npm run dev:clean`.
