# Math 314 Course Reference

Use this only as a course-specific reference for the Math 314 notebook sequence.
The general notes workflow is the same as every other course and lives in
`AGENTS.md` and `docs/content-workflow.md`.

## What Math 314 is

- A transition-to-proofs course.
- The throughline is not content coverage alone. It is learning how to read statements, unpack definitions, and justify claims carefully.
- Default output is a notebook note, not an interactive lesson.

## Default deliverable

For a new topic, prefer:

1. `notes/math-314/<slug>/content.mdx`
2. `notes/math-314/<slug>/problems.mdx` if the topic benefits from immediate practice

Only build a visual lesson if the concept has real structural payoff from interaction.

## Writing goals

- Short, sequential, proof-oriented notes.
- Sound like a mathematically serious person explaining something they had to really learn.
- Keep the tone personal enough to feel honest, but not casual enough to get vague.
- Say what the hard part is.

## Writing rules

- Lowercase titles.
- Short paragraphs.
- Define the statement shape before launching into proof technique.
- Prefer hypotheses, conclusion, and definition expansion over abstract motivational filler.
- Do not pretend obviousness where there is none.
- No em dashes.

## Good note pattern

1. Start with why this distinction matters.
2. Name the kind of statement or object being studied.
3. Separate hypotheses from conclusion if a theorem is involved.
4. Expand the exact definition carrying the proof.
5. End by naming what this note does not cover yet.

## Problem set pattern

- Use a few classification or diagnosis exercises first.
- Then include one or two direct proofs.
- Add a short solution block only when it helps expose a common mistake.

## Sequence priorities

Early sequence:

- propositions and open sentences
- truth tables and connectives
- negation and quantifiers
- direct proof, contrapositive, contradiction
- sets and subset proofs
- functions, injective/surjective/bijective
- equivalence relations and quotient sets
- induction

Later sequence:

- counting
- modular arithmetic
- group theory taste
- cardinality

## Before writing

- Read `AGENTS.md`
- Read `docs/content-workflow.md`
- Read `docs/math-314-textbook-outline.md`
- Read `docs/math-314-prose-style.md`
- Check existing notes in `notes/math-314/`
- Match the existing notebook route structure in `app/math-314/`
