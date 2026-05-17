# summer 2026 prep plan

This is the working plan for using the site, the iPad, and AI to prepare for
Math 314 honors and Math 416 in Fall 2026.

The goal is not to make perfect notes. The goal is to build proof fluency and
arrive in Math 416 with the first half of abstract linear algebra feeling like
known terrain.

## sources

Current source PDFs:

- `C:\dev\notebook\sources\314 textbook.pdf`
- `C:\dev\notebook\sources\math 314 reference.pdf`
- `C:\dev\notebook\sources\416 springer.pdf`

The Math 314 textbook is the course-shaped roadmap. The Math 314 reference is
the deeper proof-method backup. The 416 text is Axler's *Linear Algebra Done
Right*, which should drive the abstract linear algebra sequence.

## the basic loop

Every chapter goes through five passes.

1. Chapter map from Codex
   Before the detailed read, Codex extracts the important definitions, theorem
   statements, proof ideas, examples, notation, and warning signs from the
   chapter. This is a reading map, not a replacement for the textbook.

2. First textbook read
   Read the chapter once on the iPad with the map beside it. Mark what makes
   sense, what feels slippery, and where the proof uses a move you would not
   have guessed.

3. Question pass
   Bring questions back to Codex. The goal is not just to get answers, but to
   identify which definitions or proof patterns were unstable.

4. Site note update
   Codex updates the online notes based on the chapter map and the actual
   questions that came up. The site should reflect what was hard, not merely
   what the textbook listed.

5. Selected problems
   After the note is stable, solve selected textbook problems. Start by choosing
   problems that test the definitions, then add proof problems. Codex can help
   choose the set, critique attempts, and add a companion problem page when the
   topic deserves it.

The iPad is the personal working notebook. Codex builds the reading map and
maintains the cleaned-up site notes. The textbook stays the source of truth.

## weekly rhythm

Use this as the default week.

- Day 1: ask Codex for the chapter map.
- Day 2: read the chapter once with the map beside the textbook.
- Day 3: ask questions and clean up confusing definitions or proof moves.
- Day 4: update the online note from the question pass.
- Day 5: choose selected textbook problems.
- Day 6: solve problems cold, then get proof critique.
- Day 7: revise the note or problem page based on what the problems exposed.

If the week is busy, keep Days 1, 2, 3, and 6. The map, the reading, the
questions, and the cold problem attempts are the non-negotiable learning days.

## phase 1: proof language for Math 314

Target length: 3 to 4 weeks.

Primary source:

- `314 textbook.pdf`, chapters 1 to 3

Backup source:

- `math 314 reference.pdf`, Fundamentals and proof-method chapters

Site queue:

- existing: `how-to-read-a-proof-course`
- existing: `propositions-and-proof-shape`
- existing: `truth-tables-and-what-connectives-really-say`
- add: `quantifiers-and-negation`
- add: `direct-proof-contrapositive-contradiction`
- add: `sets-and-subset-proofs`
- add: `functions-domains-and-codomains`
- add: `injective-surjective-bijective`

What has to be solid:

- separating hypotheses from conclusions
- negating quantified statements
- expanding definitions instead of arguing from vibes
- proving subset statements by element chasing
- proving injectivity and surjectivity from the exact definitions

This phase supports Math 416 more than it may seem. Most early 416 struggle is
not vector spaces. It is proof grammar.

## phase 2: Math 416 foundations

Target length: 5 to 6 weeks.

Primary source:

- `416 springer.pdf`, chapters 1 to 3D

Site queue:

- existing: `vector-spaces`
- existing: `subspaces`
- existing: `span-and-linear-independence`
- existing: `bases`
- existing: `dimension`
- existing: `a-single-space-completely`
- existing: `linear-maps`
- existing: `rank-nullity`
- existing: `matrices`
- existing: `invertibility-and-isomorphisms`

Work to do:

- revise problem sets after doing Axler exercises
- add more "find the false proof" problems
- add one checkpoint problem set after `rank-nullity`
- make sure every note has at least one exercise that forces the exact definition

What has to be solid:

- constructing examples of vector spaces and subspaces
- telling span from linear independence without relying on geometry
- proving a list is a basis
- using dimension as a theorem, not just a number
- seeing null space and range as the two halves of a linear map
- understanding matrices as coordinates for maps, not as the main object

This is the highest-value part of the summer.

## phase 3: structure after rank-nullity

Target length: 3 to 4 weeks.

Primary source:

- `416 springer.pdf`, chapters 3E to 5D

Site queue:

- existing: `quotient-spaces-and-duality`
- existing: `eigenvalues-and-eigenvectors`
- existing: `upper-triangular-and-diagonalization`
- add or revise: quotient space problem set
- add or revise: duality problem set
- add: `polynomials-applied-to-operators` if the course text requires it
- add: diagonalization problem set

What has to be solid:

- quotient spaces as "collapsing a subspace to zero"
- dual space as the space of linear measurements
- eigenvectors as one-dimensional invariant subspaces
- diagonalization as choosing a basis where the operator becomes simple

Do not rush this phase. It is better to understand chapters 1 to 3 deeply than
to skim all of Axler.

## phase 4: optional preview

Only do this after the foundations are comfortable.

Primary source:

- `416 springer.pdf`, chapters 6 and 7

Site queue:

- inner products
- orthonormal bases
- orthogonal complements
- spectral theorem
- singular value decomposition

The existing visual linear algebra section can help here, especially projection,
eigen, and SVD lessons. But the proof-note sequence should stay separate from the
visual intuition sequence.

## iPad setup

Use one notebook per source.

- `Math 314 scratch`
- `Math 416 Axler scratch`
- `Problem attempts`
- `Questions to resolve`

For every theorem, write:

- assumptions
- conclusion
- definitions likely to be expanded
- proof strategy
- one example
- one non-example or failure case when possible

Do not spend time making the scratch notes beautiful. Beauty belongs on the site
after understanding has settled.

## AI rules

Good prompts:

- "Make me a chapter map: definitions, theorem statements, proof ideas,
  examples, notation, and likely traps."
- "Here are my questions from the chapter. Which ones reveal a definition I do
  not actually understand yet?"
- "Update the site note based on these questions and my scratch notes."
- "Choose selected textbook problems that test the chapter without trying to do
  every exercise."
- "Here is my proof. Find the first unsupported step."
- "Ask me questions until you can tell whether I understand this definition."
- "Give me one easier version and one harder version of this problem."
- "Turn this theorem into hypotheses, conclusion, and likely proof strategy."
- "Help me turn these scratch notes into a concise site note."

Bad prompts:

- "Solve this proof."
- "Summarize the chapter so I do not have to read it."
- "Write the notes from the textbook" before there is handwritten work.

The test is simple: AI can help before reading by making a map, but it cannot
replace the reading. After reading, the most useful AI work should be based on
actual questions, scratch notes, and proof attempts.

## site policy

For Math 314, default to notes under:

- `notes/math-314/<slug>/content.mdx`
- `notes/math-314/<slug>/problems.mdx`

For Math 416, default to notes under:

- `notes/abstract-linear-algebra/<slug>/content.mdx`
- `notes/abstract-linear-algebra/<slug>/problems.mdx`

Build visual lessons only when the picture changes the concept. Good candidates:

- injective, surjective, bijective maps
- quotient sets and equivalence classes
- modular arithmetic patterns
- projections
- eigenspaces and diagonalization

Do not build visuals as procrastination from proof work.

## success criteria

By the end of summer, the target is:

- Math 314 notes through functions, relations, induction, and cardinality
- Abstract linear algebra notes through rank-nullity, matrices, and isomorphisms
- Problem sets for every foundational 416 note
- A handwritten archive of real proof attempts
- Enough comfort that Fall 2026 feels like refinement, not first contact
