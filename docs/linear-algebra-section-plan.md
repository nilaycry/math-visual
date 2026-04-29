# linear algebra section plan

this file is the working plan for expanding the visual linear algebra section.

it is not a general linear algebra curriculum. the project already has a separate `abstract-linear-algebra` section for definitions, proofs, and course-sequenced notes. this plan is only for the visual / conceptual linear algebra section under `/linear-algebra` and `lessons/linear-algebra/*`.

## section purpose

the linear algebra section should answer a narrower question than a course does:

- where does first-course linear algebra stop feeling like disconnected procedures?
- what pictures make the algebra feel motivated instead of arbitrary?
- which recurring structural ideas are actually carrying the subject?

the section should stay selective, geometric, and personal.

it should not try to absorb the role of the abstract notes.

## boundary with abstract linear algebra

the distinction needs to stay clear:

- visual linear algebra: geometric pictures, conceptual bridges, interactive sketches, and the moments where computations suddenly make sense
- abstract linear algebra: vector spaces, linear maps, basis-first structure, proofs, and full theorem-level treatment

use the abstract notes as a companion route, not as content this section needs to re-explain from scratch.

topics like vector spaces, subspaces, bases, dimension, and formal rank-nullity belong primarily in the abstract section unless they are briefly invoked here in service of a picture.

## current state

live core lessons:

- `eigen`
- `null-space`
- `svd`

live connection notes:

- `vectors-columns-rows`
- `row-vectors-are-functions`
- `dot-product-and-matrix-multiplication`
- `eight-ways-to-say-invertible`

unfinished but important:

- `orthogonality-and-projections` is present but still `draft: true`

current strengths:

- the section already has a distinct voice
- the best existing lessons are not generic explainers; they are about the specific points where the subject becomes legible
- `row-vectors-are-functions` and `dot-product-and-matrix-multiplication` give the section a strong point of view
- `eigen`, `null-space`, and `svd` are good anchors for the structural side

current gaps:

- there is no true opening lesson that establishes the matrix-as-transformation lens
- there is no dedicated lesson on column space / image / rank
- orthogonality and projection, which should connect dot products to least squares and SVD, is missing
- there is no bridge note between eigen and SVD explaining when eigenvectors are enough and when they are not
- the current material feels like a set of strong realizations rather than one continuous arc

## intended arc

the section should feel like one path with three movements:

1. what kind of objects these things are
2. what a matrix keeps, destroys, and reaches
3. the hidden structure results that organize everything else

that keeps the section coherent without turning it into a survey.

## proposed reading order

this is the target sequence for the section.

### movement 1: what the objects really are

1. `what-a-matrix-does-to-space`  
   new core lesson. the opening picture for the whole section.

2. `vectors-columns-rows`  
   existing connection note.

3. `row-vectors-are-functions`  
   existing connection note.

4. `dot-product-and-matrix-multiplication`  
   existing connection note.

5. `orthogonality-and-projections`  
   finish existing draft. this should be treated as a major lesson, not a side note.

### movement 2: what a matrix keeps and destroys

6. `null-space`  
   existing core lesson.

7. `what-a-matrix-can-reach`  
   new core lesson on column space / image / rank.

8. `eight-ways-to-say-invertible`  
   existing connection note. works best after null space and column space are already established.

### movement 3: hidden structure

9. `eigen`  
   existing core lesson.

10. `when-eigenvectors-are-enough`  
   new bridge note on diagonalization / symmetric matrices / why eigen is sometimes sufficient and sometimes not.

11. `svd`  
   existing core lesson. should read as the payoff to the whole section.

## lesson briefs

### 1. `what-a-matrix-does-to-space`

status: new

purpose:

- establish the section's main lens before anything more technical happens
- make matrices feel like actions on space rather than boxes of numbers

must accomplish:

- show that columns are where the basis vectors go
- connect matrix multiplication to composition of transformations
- make it natural that later questions will be about preserved directions, erased directions, and reachable outputs

sketch idea:

- draggable basis vectors / grid warp / show transformed unit square
- toggle between reading a matrix as columns and watching the resulting transformation

### 2. `vectors-columns-rows`

status: existing, light revision later

purpose:

- separate abstract vectors from coordinate columns and from rows
- prepare the row-as-function point of view

revision note:

- make sure it clearly points forward to the row-vector lesson and not just backward to notation

### 3. `row-vectors-are-functions`

status: existing, strong

purpose:

- make rows feel like linear functionals, not vectors written sideways

revision note:

- this is central to the section's identity and should stay early

### 4. `dot-product-and-matrix-multiplication`

status: existing, strong

purpose:

- collapse what often feels like separate notation into one idea

revision note:

- works best after the row-as-function lesson

### 5. `orthogonality-and-projections`

status: existing draft, high priority

purpose:

- connect dot product to geometry, projection, approximation, and least squares

must accomplish:

- make orthogonality feel geometric, not ceremonial
- explain projection onto a vector and then onto a subspace
- reach the idea that the residual is orthogonal to the chosen subspace
- set up why least squares is a geometric question before it is a formula

sketch idea:

- vector and subspace projection visual
- draggable point with residual drawn explicitly
- optionally include line fitting / least squares residual picture if it stays clean

### 6. `null-space`

status: existing, solid

purpose:

- explain what a matrix destroys and why that matters

revision note:

- later, add a stronger forward pointer to column space so the pair feels deliberate

### 7. `what-a-matrix-can-reach`

status: new, very high priority

purpose:

- give null space its missing dual partner
- make column space / image / rank feel concrete

must accomplish:

- explain column space as the set of all outputs `Ax`
- connect columns spanning outputs to solvability of `Ax = b`
- set up rank as how much of the output space is actually reachable
- make it obvious why invertibility is about both not destroying too much and reaching enough

sketch idea:

- show all reachable outputs as a line / plane / full region depending on matrix
- drag `b` and indicate whether it lies in the image

### 8. `eight-ways-to-say-invertible`

status: existing, useful after reordering

purpose:

- compress multiple earlier ideas into one structural equivalence

revision note:

- keep it as a connection note, not a main lesson
- it should feel like a satisfying compression, not a checklist theorem

### 9. `eigen`

status: existing, strong anchor

purpose:

- introduce invariant directions as a structural phenomenon

revision note:

- this should remain one of the emotional peaks of the section

### 10. `when-eigenvectors-are-enough`

status: new

purpose:

- bridge eigen to SVD
- explain why diagonalization is great when available but not guaranteed

must accomplish:

- clarify what it means for eigenvectors to form a basis
- make the symmetric case feel special
- make it natural that another decomposition is needed when eigen falls short

form:

- likely better as a connection note than a full sketch-heavy lesson

### 11. `svd`

status: existing, good capstone

purpose:

- present SVD as the full structural answer when eigen is too narrow

revision note:

- should clearly feel like payoff, not just one more advanced result
- the current `rigorousNote: "singular-value-decomposition"` reference appears to point to a note that does not yet exist; fix that later

## content that should probably not be added here

to protect the section's identity, avoid adding lessons just because they are standard.

do not build this into a full sequence on:

- vector spaces
- subspaces
- bases
- dimension
- abstract linear maps
- proof-oriented theorem development

those are already better served by the abstract section.

## landing page direction

the `/linear-algebra` landing page should function as a section front door, not a passive list.

it should communicate:

- what this section is for
- the best reading order for the existing material
- which missing bridges still need to be written
- that the abstract section is a companion, not a duplicate

the current page has already been reworked in that direction.

## recommended implementation order

1. finish `orthogonality-and-projections`
2. write `what-a-matrix-does-to-space`
3. write `what-a-matrix-can-reach`
4. write `when-eigenvectors-are-enough`
5. revise cross-links among existing lessons so the sequence feels intentional
6. audit `rigorousNote` references and only keep ones that point to real companion notes

## authoring reminders

for this section in particular:

- geometry first, formula second
- keep the voice personal and honest
- do not inflate into a textbook tone
- use sketches to show the one thing the prose most needs the reader to see
- prefer one strong insight per lesson over broad coverage
- when the abstract section already does the rigorous job, link to it rather than duplicating it

## useful files

- landing page: `app/linear-algebra/page.tsx`
- lesson renderer: `app/lessons/[slug]/page.tsx`
- linear algebra lessons: `lessons/linear-algebra/*/content.mdx`
- sketch components: `components/sketches/*`
- lesson loader: `lib/lessons.ts`
- abstract companion notes: `notes/abstract-linear-algebra/*`
