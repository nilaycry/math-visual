// all the content lives here. edit this file to add lectures, ideas or sets.

export type Unit = "u1" | "u2" | "u3" | "u4" | "u5";

export interface Idea {
  id: string;
  title: string;
  says: string;
  why: string;
  ref: string;
  soon?: boolean; // not covered in lecture yet: drawn dashed
}

export interface Question {
  id: string;
  unit: Unit;
  q: string;
  a: string;
  ideas: Idea[];
}

export interface Member {
  kind: "iff" | "implies"; // iff: equivalent to the set's fact. implies: one direction only
  text: string;
  idea: string; // which leaf this statement lives under
}

export interface EquivSet {
  id: string;
  name: string;
  blurb: string;
  ctx: string;
  members: Member[];
}

export const ROOT = {
  title: "linear algebra",
  text: "spaces where you can add and scale, the maps that respect that, and the hunt for coordinates that make those maps simple.",
};

export const QUESTIONS: Question[] = [
  {
    id: "spaces",
    unit: "u2",
    q: "what is a vector space?",
    a: "anywhere you can add things and scale them, with the usual rules.",
    ideas: [
      { id: "field", title: "fields: R vs C", says: "scalars come from F, which is R or C.", why: "almost everything works for both. the big exception is chapter 5: over C every polynomial has a root, so every operator has an eigenvalue.", ref: "Axler 1A" },
      { id: "subspaces", title: "vector spaces and subspaces", says: "Fⁿ, polynomials P(F) and functions are all vector spaces. a subspace contains 0 and is closed under adding and scaling.", why: "one theory covers arrows, polynomials and functions at once.", ref: "Axler 1B, 1C" },
      { id: "sums", title: "sums and direct sums", says: "U + W is everything of the form u + w. the sum is direct when every vector splits in exactly one way.", why: "direct sums break a space into independent pieces, which is the dream of chapter 5.", ref: "Axler 1C" },
      { id: "spanli", title: "span and linear independence", says: "span: everything you can reach. independent: no vector is redundant.", why: "the two halves of a basis: enough vectors, and no extras.", ref: "Axler 2A" },
      { id: "ldl", title: "linear dependence lemma", says: "in a dependent list, some vector lies in the span of the earlier ones, and dropping it doesn't shrink the span.", why: "it proves independent lists are never longer than spanning lists. everything about dimension rests on that.", ref: "Axler 2A" },
      { id: "basis", title: "bases and dimension", says: "a basis spans and is independent. every basis has the same length, called dim V.", why: "a basis is a coordinate system. dimension is the one number that tells finite-dim spaces apart.", ref: "Axler 2B, 2C" },
    ],
  },
  {
    id: "maps",
    unit: "u3",
    q: "what is a linear map?",
    a: "a function that respects adding and scaling: T(u + v) = Tu + Tv, T(λv) = λTv.",
    ideas: [
      { id: "lmap", title: "determined by a basis", says: "choose where each basis vector goes, and exactly one linear map does it.", why: "a linear map on an n-dim space is really just n vectors of data.", ref: "Axler 3A" },
      { id: "nullrange", title: "null space and range", says: "null T is what T kills, range T is what T hits. T is injective ⟺ null T = {0}.", why: "injectivity becomes a question about one subspace, which is way easier to check.", ref: "Axler 3B" },
      { id: "ftlm", title: "fundamental theorem of linear maps", says: "dim V = dim null T + dim range T.", why: "dimension is conserved. in matrix terms: free variables + pivots = columns.", ref: "Axler 3B" },
      { id: "mat", title: "matrix of a linear map", says: "column k of M(T) holds the coordinates of T(vₖ). composing maps = multiplying matrices.", why: "turns abstract maps into numbers you can row reduce.", ref: "Axler 3C" },
      { id: "rank", title: "rank", says: "rank M(T) = dim range T, and column rank = row rank.", why: "the number of pivots you count is a property of T itself, not of the basis you picked.", ref: "Axler 3C, 3F" },
    ],
  },
  {
    id: "undo",
    unit: "u1",
    q: "when can a map be undone?",
    a: "when it loses nothing and misses nothing: injective and surjective.",
    ideas: [
      { id: "inv", title: "invertibility", says: "T is invertible ⟺ T is injective and surjective. the inverse is automatically linear.", why: "two separate conditions, and the next idea shows that for operators one is enough.", ref: "Axler 3D" },
      { id: "opinj", title: "operators: one is enough", says: "for T: V → V with V finite-dim, injective ⟺ surjective ⟺ invertible.", why: "comes straight from FTLM, and it powers half of chapter 5.", ref: "Axler 3D" },
      { id: "iso", title: "isomorphism", says: "V ≅ W ⟺ dim V = dim W. every n-dim space over F is Fⁿ in disguise.", why: "this is why matrices are enough to study every finite-dim linear map.", ref: "Axler 3D" },
      { id: "cob", title: "change of basis", says: "M(T, β) = S⁻¹ M(T, α) S. same operator, new coordinates.", why: "sets up the question behind chapter 5: which basis makes T look simplest?", ref: "Axler 3D" },
    ],
  },
  {
    id: "directions",
    unit: "u4",
    q: "what are a map's natural directions?",
    a: "directions T only stretches. find enough of them and T gets simple.",
    ideas: [
      { id: "invsub", title: "invariant subspaces", says: "U is invariant under T if T(U) ⊆ U.", why: "you can study T on a smaller piece. breaking V into invariant pieces is the goal.", ref: "Axler 5A" },
      { id: "eig", title: "eigenvalues and eigenvectors", says: "Tv = λv with v ≠ 0. λ is an eigenvalue ⟺ T − λI is not invertible.", why: "an eigenvector spans a 1-dim invariant subspace. eigenvalues are exactly where invertibility breaks.", ref: "Axler 5A" },
      { id: "eigli", title: "eigenvectors are independent", says: "eigenvectors with distinct eigenvalues are linearly independent, so T has at most dim V eigenvalues.", why: "different stretch factors force different directions.", ref: "Axler 5A" },
      { id: "poly", title: "polynomials of operators", says: "p(T) = a₀I + a₁T + ⋯ + aₘTᵐ. polynomials in T commute, so null p(T) and range p(T) are invariant.", why: "turns questions about T into questions about polynomials, where algebra helps.", ref: "Axler 5A" },
      { id: "exist", title: "existence of eigenvalues", says: "over C, every operator on a nonzero finite-dim space has an eigenvalue.", why: "v, Tv, …, Tⁿv must be dependent, which gives p(T)v = 0. factor p over C and some T − λI can't be injective.", ref: "Axler 5.19" },
      { id: "ut", title: "upper-triangular matrices", says: "over C some basis makes M(T) upper triangular, and the eigenvalues are exactly the diagonal entries.", why: "the next best thing when diagonal is impossible.", ref: "Axler 5C, 5.41" },
      { id: "diag", title: "diagonalizability", says: "M(T) is diagonal in some basis ⟺ V has a basis of eigenvectors of T.", why: "the best case: T just stretches each basis direction.", ref: "Axler 5D" },
    ],
  },
  {
    id: "measure",
    unit: "u5",
    q: "how do you measure length and angle?",
    a: "add an inner product and vectors get lengths and angles.",
    ideas: [
      { id: "ip", title: "inner products and norms", says: "⟨u, v⟩ is positive, linear in the first slot and conjugate symmetric. ‖v‖ = √⟨v, v⟩.", why: "the dot product, generalized to polynomials and functions.", ref: "Axler 6A" },
      { id: "ineq", title: "pythagoras, cauchy-schwarz, triangle", says: "‖u + v‖² = ‖u‖² + ‖v‖² when u ⊥ v. |⟨u, v⟩| ≤ ‖u‖‖v‖. ‖u + v‖ ≤ ‖u‖ + ‖v‖.", why: "all three come from one move: split u into a multiple of v plus a piece orthogonal to v.", ref: "Axler 6A" },
      { id: "onb", title: "orthonormal bases", says: "unit vectors, pairwise orthogonal. then v = ⟨v, e₁⟩e₁ + ⋯ + ⟨v, eₙ⟩eₙ.", why: "coordinates without solving a system.", ref: "Axler 6B" },
      { id: "gs", title: "gram-schmidt", says: "turns any independent list into an orthonormal one with the same span at every step.", why: "so every finite-dim inner product space has an orthonormal basis.", ref: "Axler 6.32" },
      { id: "schur", title: "schur's theorem (next up)", soon: true, says: "over C, every operator is upper triangular with respect to some orthonormal basis.", why: "upper triangular only cares about the spans span(v₁, …, vₖ), and gram-schmidt keeps every one of them.", ref: "Axler 6B · not in lecture yet" },
    ],
  },
];

const iff = (text: string, idea: string): Member => ({ kind: "iff", text, idea });
const implies = (text: string, idea: string): Member => ({ kind: "implies", text, idea });

export const SETS: EquivSet[] = [
  {
    id: "invertible",
    name: "T is invertible",
    blurb: "ten ways to say T loses nothing.",
    ctx: "T is an operator on a finite-dim V, n = dim V. all of these are equivalent.",
    members: [
      iff("T is invertible", "inv"),
      iff("T is injective", "opinj"),
      iff("null T = {0}", "nullrange"),
      iff("T is surjective", "opinj"),
      iff("range T = V", "nullrange"),
      iff("rank M(T) = n", "rank"),
      iff("M(T) is an invertible matrix (any basis)", "mat"),
      iff("0 is not an eigenvalue of T", "eig"),
      iff("an upper-triangular M(T) has no 0 on its diagonal", "ut"),
      iff("T sends a basis of V to a basis of V", "lmap"),
    ],
  },
  {
    id: "eigenvalue",
    name: "λ is an eigenvalue",
    blurb: "the invertible set again, for T − λI, flipped.",
    ctx: "T is an operator on a finite-dim V. this is the invertible set applied to T − λI and negated.",
    members: [
      iff("Tv = λv for some v ≠ 0", "eig"),
      iff("null(T − λI) ≠ {0}", "nullrange"),
      iff("T − λI is not injective", "opinj"),
      iff("T − λI is not surjective", "opinj"),
      iff("T − λI is not invertible", "inv"),
      iff("λ is on the diagonal of any upper-triangular M(T)", "ut"),
    ],
  },
  {
    id: "diagonalizable",
    name: "T is diagonalizable",
    blurb: "diagonal matrix, eigenbasis, direct sum, dimension count.",
    ctx: "T is an operator on a finite-dim V with distinct eigenvalues λ₁, …, λₘ.",
    members: [
      iff("M(T) is diagonal for some basis", "diag"),
      iff("V has a basis of eigenvectors of T", "diag"),
      iff("V = E(λ₁) ⊕ ⋯ ⊕ E(λₘ)", "sums"),
      iff("dim V = dim E(λ₁) + ⋯ + dim E(λₘ)", "basis"),
      implies("T has dim V distinct eigenvalues (one direction only)", "eigli"),
    ],
  },
  {
    id: "basis",
    name: "v₁, …, vₙ is a basis",
    blurb: "check one half and dimension hands you the other.",
    ctx: "V is finite-dim with n = dim V.",
    members: [
      iff("spans V and is linearly independent", "spanli"),
      iff("every v ∈ V is a combination of v₁, …, vₙ in exactly one way", "basis"),
      iff("linearly independent, and n vectors long", "basis"),
      iff("spans V, and n vectors long", "basis"),
      iff("V = span(v₁) ⊕ ⋯ ⊕ span(vₙ) with every vₖ ≠ 0", "sums"),
      implies("orthonormal and n vectors long (one direction only)", "onb"),
    ],
  },
  {
    id: "ut",
    name: "M(T) is upper triangular",
    blurb: "a matrix shape that's secretly a chain of invariant subspaces.",
    ctx: "M(T) with respect to the basis v₁, …, vₙ.",
    members: [
      iff("M(T) is upper triangular", "ut"),
      iff("Tvₖ ∈ span(v₁, …, vₖ) for each k", "ut"),
      iff("span(v₁, …, vₖ) is invariant under T for each k", "invsub"),
      implies("after gram-schmidt, M(T) is still upper triangular in the orthonormal basis e₁, …, eₙ", "schur"),
    ],
  },
  {
    id: "orthogonal",
    name: "u ⊥ v",
    blurb: "an inner product condition that's really about distance.",
    ctx: "u, v in an inner product space.",
    members: [
      iff("⟨u, v⟩ = 0", "ip"),
      iff("‖u‖ ≤ ‖u + av‖ for every scalar a (u is the closest point to 0 on the line u + Fv)", "ineq"),
      iff("‖u + v‖² = ‖u‖² + ‖v‖² (equivalent over R; over C only ⇒ holds)", "ineq"),
    ],
  },
  {
    id: "direct",
    name: "U + W is direct",
    blurb: "uniqueness, intersection and dimension all say the same thing.",
    ctx: "U, W subspaces of a finite-dim V. for more than two subspaces only the 1st, 2nd and last still work.",
    members: [
      iff("every vector of U + W splits as u + w in exactly one way", "sums"),
      iff("0 = u + w forces u = w = 0", "sums"),
      iff("U ∩ W = {0}", "sums"),
      iff("dim(U + W) = dim U + dim W", "basis"),
    ],
  },
];

// lookups
export const IDEA: Record<string, Idea> = {};
export const PARENT: Record<string, string> = {};
for (const q of QUESTIONS) for (const i of q.ideas) {
  IDEA[i.id] = i;
  PARENT[i.id] = q.id;
}
export const QUESTION: Record<string, Question> = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
export const setsForIdea = (id: string) => SETS.filter((s) => s.members.some((m) => m.idea === id));
export const ideasInSet = (s: EquivSet) => Array.from(new Set(s.members.map((m) => m.idea)));
