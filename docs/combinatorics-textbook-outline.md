# Combinatorics Textbook Outline

Condensed reference derived from the attached course text:
`C:\Users\Nilay\OneDrive\Desktop\summer 2026\Introductory Combinatorics.pdf`

Use this as a sequencing reference when planning or drafting new Math 413 notes.
It is not meant to replace the source text. It is the project-local roadmap.

The attached PDF is Richard A. Brualdi, *Introductory Combinatorics*, fifth edition.
The course plan is to cover the first eight chapters.

## What the course is trying to do

Combinatorics begins with finite counting questions, but the real work is not
only producing a number. The course teaches several ways to replace an
unstructured counting problem with a structured object: a choice process, a
bijection, a recurrence, a generating function, or a known family of sequences.

The notes in this repo should keep returning to the same underlying habit:
find the object being counted, choose a representation for it, and explain why
that representation counts each object exactly once.

## Learning loop

For each topic, use this sequence:

1. Draft a focused note.
2. Read the note alongside Brualdi.
3. Collect questions, unclear steps, and places where the book uses a trick too quickly.
4. Revise the note.
5. Add a problem set only after the note has been read once.
6. Use homework and midterm problems later as calibration, not as the first source of exposition.

## Writing and notation standards

The prose should stay readable, but the notes should not avoid formal mathematical
language. Use the standard notation when it clarifies the object being studied:

- write $\mathbb{Z}$, $\mathbb{N}$, $\mathbb{Z}_{\ge 0}$, set-builder notation, and
  cardinalities like $|S|$ where they belong
- state hypotheses with symbols when the theorem depends on them
- introduce informal phrases together with the standard term, such as
  "one-to-one correspondence, or bijection"
- prefer the precise term once it has been introduced
- use short explanations after notation rather than replacing notation with prose

The goal is not to make the notes look formal for its own sake. The goal is to make
the mathematical objects visible.

## Chapter roadmap

### 1. What combinatorics is

- introductory examples rather than one unified technique
- chessboard covers
- magic squares
- four-color problem
- 36 officers problem
- shortest-route problem
- overlapping circles
- Nim

Use for orientation and taste. The existing `what-is-this` note already plays
this role, so this chapter should mostly supply examples to revisit later.

### 2. Permutations and combinations

- basic counting principles
- permutations of sets
- subsets and combinations
- permutations of multisets
- combinations of multisets
- finite probability

This is the first real technical unit. The notes should be careful about the
difference between choosing an ordered list, choosing a subset, arranging repeated
objects, and selecting from repeated object types.

### 3. Pigeonhole principle

- simple form
- strong form
- Ramsey theorem for pairs

This is the first theorem-driven unit. It should feel different from Chapter 2:
the point is not to count all outcomes, but to prove that some structure must
exist because too many objects have been forced into too few categories.

### 4. Generating permutations and combinations

- algorithms for generating permutations
- inversions in permutations
- algorithms for generating combinations
- generating fixed-size subsets
- partial orders and equivalence relations

This chapter is partly constructive. The notes should separate two questions:
how many objects are there, and how can we list them without missing or repeating
any object?

### 5. Binomial coefficients

- Pascal's triangle
- binomial theorem
- unimodality
- multinomial theorem
- Newton's binomial theorem
- partially ordered sets

This chapter should connect algebraic identities to counting arguments. The
central habit is counting the same set in two ways, then recognizing the identity
that falls out.

### 6. Inclusion-exclusion and applications

- inclusion-exclusion
- combinations with repetition
- derangements
- forbidden positions
- Mobius inversion

This is the main unit on overcounting. The notes should emphasize why the
ordinary addition principle fails when sets overlap, and how inclusion-exclusion
repairs the count by tracking intersections.

### 7. Recurrences and generating functions

- familiar number sequences
- ordinary generating functions
- exponential generating functions
- linear homogeneous recurrences
- nonhomogeneous recurrences
- a geometry example

This is the algebraic engine of the course. The notes should introduce generating
functions as a way to store a sequence, not as a formal trick. Recurrences should
be tied to the combinatorial decision that creates them.

### 8. Special counting sequences

- Catalan numbers
- difference sequences
- Stirling numbers
- partition numbers
- a geometric counting problem
- lattice paths and Schroder numbers

This chapter should feel like recognition training. The goal is to learn when a
problem is secretly asking for a known sequence, and why that sequence has the
recurrences, formulas, or generating functions attached to it.

## Suggested notebook order in this repo

The book order is the default spine. The note order can be slightly cleaner than
the raw chapter order when a concept needs a softer ramp.

Recommended sequence:

1. what this is
2. four basic counting principles
3. permutations as ordered choices
4. combinations as subsets
5. arrangements with repeated objects
6. choosing from multisets
7. finite probability as counting ratios
8. the pigeonhole principle
9. the strong pigeonhole principle
10. a first Ramsey theorem
11. generating permutations without repeats
12. inversions and permutation structure
13. generating combinations
14. partial orders and equivalence relations
15. Pascal's triangle
16. the binomial theorem
17. counting two ways
18. multinomial coefficients
19. inclusion-exclusion
20. derangements
21. forbidden positions
22. recurrence relations
23. ordinary generating functions
24. exponential generating functions
25. solving linear recurrences
26. Catalan numbers
27. Stirling numbers
28. partition numbers
29. lattice paths and Schroder numbers

If the instructor follows an older syllabus order, move pigeonhole before the
permutation and combination cluster. The notes are modular enough for that swap.

## First drafting target

Start with `four-basic-counting-principles`.

That note should cover the addition rule, multiplication rule, subtraction rule,
and division rule in the language of sets and choices. It should prepare the
reader for permutations and combinations without turning into a formula list.
