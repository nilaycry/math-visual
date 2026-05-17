# chapter 1 reading map: logic and the language of proofs

Source: `C:\dev\notebook\sources\314 textbook.pdf`, Chapter 1.

Use this while reading the chapter once. It is not meant to replace the
textbook. The goal is to tell you what to pay attention to, what to copy into
your iPad notes, and where questions are likely to come from.

## what this chapter is really about

Chapter 1 is setting up the grammar of proof.

The main shift is from reading mathematical sentences as English to reading
them as objects with structure. A proof is not just an explanation. It is a
sequence of justified steps from assumptions to a conclusion. Logic is the
language for tracking which steps are allowed.

The big ideas are:

- propositions have truth values
- connectives build compound propositions
- conditionals have hypotheses and conclusions
- negation changes the logical structure of a statement
- proof techniques come from the truth table for implication
- quantifiers turn open sentences into propositions
- the order of quantifiers matters
- negating quantifiers swaps `for all` with `there exists`

If you understand those eight ideas, the chapter has done its job.

## definitions to know cold

### proposition or statement

A proposition is a sentence that is either true or false, but not both.

Copy examples and non-examples into your notes. The non-examples matter more:

- `x = 2` is not a proposition until `x` has a specified value or domain.
- a question is not a proposition
- a command is not a proposition
- a paradox is not behaving like a normal proposition

The habit to build: before proving anything, ask whether the sentence even has
a definite truth value.

### truth value

The truth value of a proposition is whether it is true or false.

This is basic, but it matters because the whole chapter studies how truth values
change when statements are combined.

### logical connectives

For propositions `P` and `Q`:

- conjunction: `P and Q`, read "`P` and `Q`"
- negation: `not P`, read "not `P`"
- disjunction: `P or Q`, read "`P` or `Q`"
- conditional: `P => Q`, read "if `P`, then `Q`"
- biconditional: `P <=> Q`, read "`P` if and only if `Q`"

For `P => Q`, `P` is the hypothesis and `Q` is the conclusion.

This vocabulary is not decorative. Every proof starts by figuring out which
part is being assumed and which part must be shown.

### compound proposition

A compound proposition is built from simpler propositions using logical
connectives.

When you see a complicated sentence, your job is to find its smaller pieces.

### truth table

A truth table lists every possible truth value for the atomic propositions and
then computes the truth value of the compound proposition.

Truth tables are the first brute-force way to check logical equivalence.

### tautology and contradiction

A tautology is always true, no matter the truth values of its pieces.

A contradiction is always false, no matter the truth values of its pieces.

These are useful because proof by contradiction works by showing that some
assumption leads to a contradiction.

### theorem

A theorem is a justified assertion, usually with the shape `P => Q`.

Other labels like lemma, proposition, and corollary are also theorem-like
statements. The label changes the role, not the need for proof.

### propositional function

A propositional function is a sentence like `P(x)` that becomes a proposition
after the variable is given a value from a domain.

Example shape:

```text
P(x): x > 0
```

This is not true or false by itself. It becomes true or false after `x` is
specified.

### domain of definition

The domain of definition is the set of values the variable is allowed to take.

This matters because statements like `forall x P(x)` and `exists x P(x)` are
meaningless until you know what `x` is ranging over.

### quantifiers

For a propositional function `P(x)`:

- `forall x P(x)` means `P(x)` holds for every `x` in the domain
- `exists x P(x)` means `P(x)` holds for at least one `x` in the domain

The proof burden is different:

- to prove `exists x P(x)`, one example is enough
- to prove `forall x P(x)`, you need an argument for an arbitrary element of the domain

## theorems and logical facts

### truth table for implication

The conditional `P => Q` is false only in the case where `P` is true and `Q` is
false.

That is the strange row to respect: if `P` is false, then `P => Q` is true
regardless of `Q`.

This is called vacuous truth. The chapter does not need the name yet, but you
should remember the phenomenon.

### de Morgan's laws

For propositions `P` and `Q`:

```text
not (P and Q) <=> (not P) or (not Q)
not (P or Q) <=> (not P) and (not Q)
```

Translation:

- not both means at least one fails
- not either means both fail

These laws are practice for the bigger quantifier-negation rules later.

### negating a conditional

For propositions `P` and `Q`:

```text
not (P => Q) <=> P and (not Q)
```

Translation:

To say "if `P`, then `Q`" is false, you must show that `P` happens while `Q`
fails.

This fact is one of the most important in the chapter. It explains both
counterexamples and proof by contradiction.

### contrapositive equivalence

The implication

```text
P => Q
```

is logically equivalent to

```text
not Q => not P
```

The converse `Q => P` is not generally equivalent to the original statement.

This is the difference to burn in:

- contrapositive: safe
- converse: usually a new statement

### quantifier negation

For a propositional function `P(x)`:

```text
not (forall x P(x)) <=> exists x not P(x)
not (exists x P(x)) <=> forall x not P(x)
```

Translation:

- not all means at least one counterexample
- not even one means every case fails

With multiple quantifiers, negate one layer at a time.

Example pattern:

```text
not (forall y exists x P(x, y)) <=> exists y forall x not P(x, y)
```

## proof techniques introduced

### direct proof

To prove `P => Q` directly:

1. Assume `P`.
2. Use definitions and known facts.
3. Derive `Q`.

The example in the chapter proves that the product of an odd integer and an even
integer is even.

The key move is definition expansion:

- odd means `2k + 1`
- even means `2m`
- then the product can be rewritten as `2` times an integer

Do not just remember the algebra. Remember the proof shape.

### proof by contrapositive

To prove `P => Q` by contrapositive:

1. Identify `not Q`.
2. Identify `not P`.
3. Prove `not Q => not P` directly.

The chapter uses the theorem: if `x^2` is even, then `x` is even.

The contrapositive is: if `x` is odd, then `x^2` is odd.

This is easier because "odd" has a direct algebraic form.

### proof by contradiction

To prove `P => Q` by contradiction:

1. Assume `P and not Q`.
2. Derive something impossible.
3. Conclude that `P and not Q` was false, so `P => Q` is true.

This method is powerful but easy to misuse. The dangerous part is losing track
of which assumptions produced the contradiction.

When reading a contradiction proof, write the assumed false setup explicitly.

## examples to understand, not memorize

### soda conditional

This example explains why `P => Q` is true when `P` is false.

Pay attention to the contract-like meaning: the only way an implication fails is
if the hypothesis happens and the promised conclusion does not.

### odd times even is even

This is the first direct proof.

The important skill is translating "odd" and "even" into algebraic definitions.

### if `x^2` is even, then `x` is even

This is the first contrapositive proof.

The important skill is noticing that the contrapositive has definitions that are
easier to use.

### positive roots of a polynomial

This is the first contradiction proof.

The important skill is assuming the hypothesis and the negation of the
conclusion at the same time, then showing that setup cannot survive.

### `forall y exists x e^x = y`

This is the main multiple-quantifier example.

The important skill is negating one quantifier at a time:

```text
not (forall y exists x e^x = y)
```

becomes

```text
exists y forall x e^x != y
```

Then choosing `y = -1` shows why the original statement is false over the real
numbers.

## likely traps

### trap 1: treating `x = 2` as a proposition

It is not a proposition until `x` is assigned or quantified.

Ask: what is the domain, and is `x` fixed?

### trap 2: thinking "or" means exclusive or

In this chapter, `P or Q` allows both `P` and `Q` to be true.

### trap 3: misunderstanding false hypotheses

In formal logic, a false hypothesis makes `P => Q` true. The only false row is:

```text
P true, Q false
```

### trap 4: confusing converse and contrapositive

For `P => Q`:

- converse: `Q => P`
- contrapositive: `not Q => not P`

Only the contrapositive is automatically equivalent.

### trap 5: negating a conditional incorrectly

The negation of `P => Q` is not `P => not Q`.

It is:

```text
P and not Q
```

### trap 6: swapping quantifiers casually

`forall x exists y P(x, y)` and `exists y forall x P(x, y)` usually mean very
different things.

The first lets `y` depend on `x`. The second asks for one `y` that works for
every `x`.

### trap 7: forgetting the domain

The truth of quantified statements depends on the domain.

For example, a statement may be true over positive real numbers and false over
all real numbers.

## what to write in your iPad notes

Make one page for each of these:

1. proposition vs non-proposition
2. truth tables for `not P`, `P and Q`, `P or Q`, `P => Q`, `P <=> Q`
3. de Morgan's laws
4. negation of a conditional
5. direct proof template
6. contrapositive proof template
7. contradiction proof template
8. quantifier meanings and proof burdens
9. quantifier negation rules
10. examples where quantifier order changes meaning

Do not make the pages pretty first. Make them useful first.

## questions to ask yourself while reading

- Is this sentence actually a proposition?
- What are the atomic propositions?
- If this is `P => Q`, what exactly are `P` and `Q`?
- What would a counterexample have to look like?
- Am I accidentally proving the converse?
- What domain is the variable living in?
- If there are multiple quantifiers, can the later variable depend on the earlier one?
- When I negate the statement, did I change every quantifier and negate the inside?

## first problem priorities

After the first read, prioritize problems that ask you to:

- classify propositions and non-propositions
- build truth tables
- negate compound propositions
- identify hypotheses and conclusions
- write contrapositives and converses
- negate quantified statements
- prove simple parity statements

Do not start with the hardest contradiction proofs. First make the grammar
automatic.

## site notes this chapter connects to

Existing notes:

- `notes/math-314/how-to-read-a-proof-course/content.mdx`
- `notes/math-314/propositions-and-proof-shape/content.mdx`
- `notes/math-314/truth-tables-and-what-connectives-really-say/content.mdx`

Likely next notes to add after your question pass:

- `notes/math-314/quantifiers-and-negation/content.mdx`
- `notes/math-314/direct-proof-contrapositive-contradiction/content.mdx`

