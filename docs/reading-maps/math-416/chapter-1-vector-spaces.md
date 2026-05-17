# chapter 1 reading map: vector spaces

Source: `C:\dev\notebook\sources\416 springer.pdf`, Chapter 1 of Axler's
*Linear Algebra Done Right*.

Use this while reading the chapter once. It is a map of what matters, not a
replacement for the text. The point of the first read is to make the objects feel
real enough that the definitions stop looking like a list of rules.

## what this chapter is really about

Chapter 1 builds the object that the whole course studies: a vector space.

The chapter starts with familiar coordinate spaces like `R^n` and `C^n`, then
abstracts away from coordinates. After that, it asks a second question: once you
have a vector space, which subsets are themselves vector spaces? Those are
subspaces.

The real arc is:

- scalars come from `R` or `C`
- vectors live in a set where addition and scalar multiplication make sense
- the vector space axioms say exactly how those operations must behave
- many examples are not coordinate spaces
- a subspace is a subset that keeps the same vector-space structure
- sums of subspaces replace unions
- direct sums mean every vector has a unique decomposition

If you understand the difference between "subset", "subspace", "sum", and
"direct sum", the chapter has done its main job.

## sections in the chapter

### 1A: `R^n` and `C^n`

This section gives the concrete model.

Important objects:

- complex numbers
- the field notation `F`
- lists and length
- `F^n`
- coordinatewise addition
- scalar multiplication

Do not get stuck trying to visualize high-dimensional spaces. Axler's point is
that the algebra still works even when the picture disappears.

### 1B: definition of vector space

This is the core of the chapter.

The important move is that a vector space is not defined by what its elements
look like. It is defined by what you can do with them.

You need:

- a set `V`
- addition on `V`
- scalar multiplication by elements of `F`
- the vector space axioms

The examples matter because they stop you from thinking vectors are always
arrows or coordinate lists.

### 1C: subspaces

This section is where the chapter becomes useful.

Subspaces are the subsets that are compatible with the vector-space operations.
The subspace test is the practical tool. Sums and direct sums are the first hints
that the course will care about decomposing spaces into simpler pieces.

## definitions to know cold

### scalar

A scalar is an element of `F`, where `F` means either `R` or `C`.

This is why the course keeps separating scalars from vectors. They interact, but
they are different kinds of objects.

### list

A list is an ordered finite collection.

Order matters and repetition matters. This is different from a set.

Examples:

- `(3, 5)` and `(5, 3)` are different lists
- `(4, 4)` and `(4, 4, 4)` are different lists
- `{4, 4}` and `{4, 4, 4}` are the same set, namely `{4}`

This distinction matters because vectors in `F^n` are lists, not sets.

### `F^n`

`F^n` is the set of all lists of length `n` whose entries are in `F`.

An element looks like:

```text
(x_1, ..., x_n)
```

where each `x_k` is a scalar.

### coordinate

The `k`th coordinate of `(x_1, ..., x_n)` is `x_k`.

This is simple, but it is the language used whenever a proof drops from abstract
notation into coordinates.

### addition in `F^n`

Addition in `F^n` is coordinatewise:

```text
(x_1, ..., x_n) + (y_1, ..., y_n)
= (x_1 + y_1, ..., x_n + y_n)
```

The proof that addition is commutative in `F^n` is just the commutativity of
addition in `F`, applied coordinate by coordinate.

### additive identity in `F^n`

The zero vector in `F^n` is:

```text
0 = (0, ..., 0)
```

Watch the notation. The same symbol `0` can mean the scalar zero or the vector
zero, depending on context.

### additive inverse in `F^n`

If `x = (x_1, ..., x_n)`, then:

```text
-x = (-x_1, ..., -x_n)
```

It is the vector that adds to `x` to give the zero vector.

### scalar multiplication in `F^n`

Scalar multiplication multiplies every coordinate by the same scalar:

```text
a(x_1, ..., x_n) = (a x_1, ..., a x_n)
```

Do not confuse this with a product of two vectors. In this chapter, scalar
multiplication takes one scalar and one vector and returns a vector.

### vector space

A vector space over `F` is a set `V` with addition and scalar multiplication
satisfying the vector space axioms.

The axioms say, in compressed form, that:

- addition is commutative
- addition is associative
- there is an additive identity
- every vector has an additive inverse
- scalar multiplication is compatible with scalar multiplication in `F`
- multiplying by scalar `1` leaves vectors unchanged
- scalar multiplication distributes over vector addition
- scalar multiplication distributes over scalar addition

The definition is long because it has to work for coordinate lists, functions,
sequences, polynomials, and more.

### vector and point

An element of a vector space is called a vector or a point.

In this course, "vector" does not mean "arrow". An arrow is one useful picture
for some vectors, especially in `R^2` and `R^3`.

### real and complex vector spaces

If `F = R`, then `V` is a real vector space.

If `F = C`, then `V` is a complex vector space.

The same set can behave differently depending on which scalars are allowed.

### function spaces

If `S` is a set, then `F^S` is the set of functions from `S` to `F`.

Addition and scalar multiplication are defined pointwise:

```text
(f + g)(x) = f(x) + g(x)
(a f)(x) = a f(x)
```

This is the first major warning that vector spaces are not just coordinate
spaces.

### subspace

A subspace of `V` is a subset `U` of `V` that is itself a vector space using the
same addition, scalar multiplication, and additive identity as `V`.

The phrase "same operations" matters. A subset is not allowed to invent new
operations and call itself a subspace.

### sum of subspaces

If `V_1, ..., V_m` are subspaces of `V`, then their sum is the set of all vectors
that can be written as:

```text
v_1 + ... + v_m
```

where each `v_k` is in `V_k`.

This is the vector-space replacement for union.

### direct sum

A sum `V_1 + ... + V_m` is a direct sum if every vector in the sum has exactly
one representation:

```text
v_1 + ... + v_m
```

with each `v_k` in `V_k`.

The word "direct" means uniqueness of decomposition.

## theorems and results to understand

### properties of complex arithmetic

Complex numbers satisfy the familiar arithmetic rules: commutativity,
associativity, identities, inverses, and distributivity.

You do not need to memorize complex multiplication as a dead formula. You
should know that it comes from treating `i^2 = -1` consistently.

### unique additive identity

In a vector space, the additive identity is unique.

Proof idea:

If two vectors both act like zero, add them in the right order and use the
identity property twice.

This is one of the first places where an axiom becomes a proof tool.

### unique additive inverse

Every vector has a unique additive inverse.

Proof idea:

If two candidates both add to `v` to make zero, add one candidate to the equation
and use associativity and identity.

The point is not the result itself. The point is learning how little the proof
uses.

### `0v = 0`

The scalar zero times any vector is the zero vector.

Important notation warning: the first `0` is a scalar, the second `0` is a
vector.

Proof idea:

Use distributivity:

```text
0v = (0 + 0)v = 0v + 0v
```

Then cancel using additive inverses.

### `a0 = 0`

Any scalar times the zero vector is the zero vector.

Again, the zero on the left side is a vector inside the product, and the zero on
the right side is the zero vector.

### `(-1)v = -v`

Multiplying by scalar `-1` gives the additive inverse of `v`.

Proof idea:

Show that `v + (-1)v = 0`, then use uniqueness of additive inverses.

### subspace criterion

A subset `U` of `V` is a subspace if and only if:

1. `0` is in `U`
2. `U` is closed under addition
3. `U` is closed under scalar multiplication

This is the practical test you will use constantly.

Proof idea:

If `U` is already a subspace, these conditions are automatic. Conversely, these
conditions make the operations stay inside `U`, and all the other vector space
axioms are inherited from `V`.

### sum of subspaces is the smallest containing subspace

The sum `V_1 + ... + V_m` is the smallest subspace of `V` containing all the
subspaces `V_1, ..., V_m`.

This is why sums are better than unions. A union of subspaces is usually not a
subspace.

### condition for direct sum

The sum `V_1 + ... + V_m` is direct if and only if the only way to write:

```text
0 = v_1 + ... + v_m
```

with each `v_k` in `V_k` is to have every `v_k = 0`.

Proof idea:

Uniqueness for every vector can be tested by uniqueness for zero. If a vector
has two decompositions, subtract them and get a decomposition of zero.

### direct sum of two subspaces

For two subspaces `U` and `W`:

```text
U + W is direct iff U intersection W = {0}
```

This is only enough for two subspaces. For three or more, pairwise intersections
being `{0}` is not enough.

## examples to understand, not memorize

### `F^n`

This is the standard coordinate example. It gives you a safe place to test the
definitions.

### function spaces

The set of functions from a set to `F` is a vector space with pointwise
operations.

This is the example that should break the "vectors are arrows" habit.

### continuous and differentiable functions as subspaces

Continuous functions form a subspace because adding continuous functions and
scaling them keeps them continuous.

Differentiable functions form a subspace for the same kind of reason.

The structure is not visual. It is closure.

### equations with constants

A set like:

```text
{x in F^4 : x_3 = 5x_4 + b}
```

is a subspace only when the constant term is compatible with containing zero.
In this example, that means `b = 0`.

This is a recurring theme: homogeneous conditions usually produce subspaces;
shifted conditions usually do not.

### sums of coordinate subspaces

If one subspace controls one group of coordinates and another subspace controls
another group, their sum often describes all vectors you can build by combining
those coordinate freedoms.

Practice translating both ways:

- from symbolic description to words
- from words to symbolic description

### sum that is not direct

A sum can equal the whole space without being direct.

Directness is not about whether the subspaces reach enough vectors. It is about
whether they reach vectors uniquely.

## likely traps

### trap 1: thinking vectors must look like arrows

Arrows are a useful picture in `R^2` and `R^3`, but the abstract definition is
about operations, not appearance.

### trap 2: ignoring the scalar field

The same set can be a real vector space but not a complex vector space, depending
on whether complex scalar multiplication stays inside the set.

### trap 3: confusing the scalar zero and vector zero

Axler uses `0` for both. Context decides which one is meant.

When stuck, ask: is this object supposed to be in `F` or in `V`?

### trap 4: checking only some vector space axioms from scratch

For subspaces, do not re-prove every vector space axiom. Use the subspace
criterion. The big three are zero, addition closure, and scalar closure.

### trap 5: forgetting zero in subspace tests

If the zero vector is not in a subset, it is not a subspace.

This catches most shifted lines, shifted planes, and equations with nonzero
constant terms.

### trap 6: thinking unions of subspaces are usually subspaces

They are usually not. If you need the smallest subspace containing two
subspaces, use their sum, not their union.

### trap 7: thinking `U + W = V` means `V = U direct-sum W`

Reaching every vector is not enough. You also need uniqueness of representation.

### trap 8: using the intersection test for more than two subspaces

For two subspaces, `U + W` is direct exactly when `U intersection W = {0}`.

For three or more subspaces, pairwise intersections being `{0}` does not
guarantee a direct sum.

## what to write in your iPad notes

Make one page for each of these:

1. `F`, scalars, and the difference between `R` and `C`
2. lists vs sets
3. `F^n`, coordinates, addition, scalar multiplication
4. the vector space axioms, grouped by what they control
5. examples of vector spaces that are not coordinate spaces
6. the proofs of unique zero and unique additive inverse
7. the proofs of `0v = 0`, `a0 = 0`, and `(-1)v = -v`
8. the subspace test
9. homogeneous vs shifted conditions
10. sum of subspaces vs union of subspaces
11. direct sum as unique decomposition
12. why the intersection test works only for two subspaces

For this chapter, your handwritten examples matter more than polished prose.

## questions to ask yourself while reading

- What is the scalar field?
- What set are the vectors living in?
- What are the two operations?
- If this is a subspace claim, where is the zero vector?
- Is the subset closed under addition?
- Is the subset closed under scalar multiplication?
- Is this condition homogeneous?
- Is the author using a coordinate proof or an abstract axiom proof?
- If this is a sum of subspaces, can every vector be decomposed?
- If this is a direct sum, is the decomposition unique?
- Can I write zero in a nontrivial way using vectors from the summands?

## first problem priorities

After the first read, prioritize problems that make the definitions automatic.

Good first batch:

- Section 1A: complex arithmetic and inverse exercises if complex numbers feel rusty
- Section 1B: exercises about additive inverses, zero scalar multiplication, and whether strange examples satisfy the vector space axioms
- Section 1C: exercises that ask whether subsets of `F^3` are subspaces
- Section 1C: exercises about unions, sums, intersections, and direct sums

Suggested first selected set after the question pass:

- 1B: 1, 2, 3, 4
- 1C: 1, 2, 7, 8, 11, 12, 14
- optional stretch: 1C: 20, 23, 24

Do not try to do every exercise on the first pass. This chapter is about making
the definitions usable.

## site notes this chapter connects to

Existing notes:

- `notes/abstract-linear-algebra/definitions-as-questions/content.mdx`
- `notes/abstract-linear-algebra/complex-numbers/content.mdx`
- `notes/abstract-linear-algebra/complex-numbers/problems.mdx`
- `notes/abstract-linear-algebra/vector-spaces/content.mdx`
- `notes/abstract-linear-algebra/vector-spaces/problems.mdx`
- `notes/abstract-linear-algebra/subspaces/content.mdx`
- `notes/abstract-linear-algebra/subspaces/problems.mdx`

Likely updates after your question pass:

- revise `vector-spaces` with any confusion about fields, function spaces, or the axioms
- revise `subspaces` with more examples of homogeneous versus shifted conditions
- add or revise problems around sums and direct sums if those feel unstable
