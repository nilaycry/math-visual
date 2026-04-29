import Link from "next/link";
import { getAllLessons, type LessonMeta } from "@/lib/lessons";

type PlannedEntry = {
  slug: string;
  title: string;
  description: string;
};

const mainPathOrder = [
  "vectors-columns-rows",
  "row-vectors-are-functions",
  "dot-product-and-matrix-multiplication",
  "null-space",
  "eigen",
  "svd",
] as const;

const plannedCoreLessons: PlannedEntry[] = [
  {
    slug: "what-a-matrix-does-to-space",
    title: "what a matrix does to space",
    description: "the opening picture. grids, basis vectors, and why columns matter",
  },
  {
    slug: "orthogonality-and-projections",
    title: "orthogonality and projections",
    description: "the bridge to least squares, closest points, and error geometry",
  },
  {
    slug: "what-a-matrix-can-reach",
    title: "what a matrix can reach",
    description: "column space, rank, and the other half of the null space story",
  },
  {
    slug: "when-eigenvectors-are-enough",
    title: "when eigenvectors are enough",
    description: "why diagonalization works when it works, and why SVD has to take over",
  },
];

const plannedConnections: PlannedEntry[] = [
  {
    slug: "eight-ways-to-say-invertible",
    title: "eight ways to say the same thing",
    description: "the invertible matrix theorem, once the surrounding picture is already in your head",
  },
];

function bySlug(slug: string, lessons: LessonMeta[]) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export default function LinearAlgebraPage() {
  const allLessons = getAllLessons();
  const linearAlgebraLessons = allLessons.filter(
    (lesson): lesson is LessonMeta => lesson.tags.includes("linear algebra")
  );

  const mainPath = mainPathOrder
    .map((slug) => bySlug(slug, linearAlgebraLessons))
    .filter((lesson): lesson is LessonMeta => lesson !== undefined);

  const liveConnections = linearAlgebraLessons.filter(
    (lesson): lesson is LessonMeta =>
      lesson.lessonType === "connection" && !mainPathOrder.includes(lesson.slug as (typeof mainPathOrder)[number])
  );

  const liveSlugs = new Set(linearAlgebraLessons.map((lesson) => lesson.slug));
  const upcomingCore = plannedCoreLessons.filter((lesson) => !liveSlugs.has(lesson.slug));
  const upcomingConnections = plannedConnections.filter((lesson) => !liveSlugs.has(lesson.slug));

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .la-page-nav, .la-hero, .la-content {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .la-hero {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
          }
          .la-content {
            padding-bottom: 72px !important;
          }
          .la-main-grid, .la-note-grid, .la-companion-grid {
            grid-template-columns: 1fr !important;
          }
          .la-section-head {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
        }
        .nav-pill:hover {
          color: #ccc !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .path-card:hover {
          border-color: rgba(255,255,255,0.12) !important;
          transform: translateY(-2px);
        }
        .note-row:hover {
          background-color: rgba(255,255,255,0.02) !important;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0a0a0a",
          color: "#e8e8e8",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80vw",
            height: "80vw",
            maxWidth: 900,
            maxHeight: 900,
            background:
              "radial-gradient(circle, rgba(91, 141, 217, 0.06) 0%, rgba(127, 119, 221, 0.04) 28%, rgba(10, 10, 10, 0) 68%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            backgroundColor: "rgba(10, 10, 10, 0.7)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <nav
            className="la-page-nav"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 48px",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            <Link
              href="/"
              className="nav-pill group"
              style={{
                color: "#888",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 400,
                letterSpacing: "0.06em",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: "5px 14px",
                transition: "all 0.2s",
              }}
            >
              <span
                className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
                style={{ marginRight: 4 }}
              >
                ←
              </span>{" "}
              back
            </Link>
            <a
              href="https://github.com/nilaycry"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-pill"
              style={{
                color: "#888",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 400,
                letterSpacing: "0.06em",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: "5px 14px",
                transition: "all 0.2s",
              }}
            >
              github
            </a>
          </nav>
        </div>

        <section
          className="la-hero"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "84px 48px 64px" }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#5B8DD9",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              display: "block",
              marginBottom: 18,
            }}
          >
            linear algebra
          </span>

          <h1
            style={{
              fontSize: 42,
              fontWeight: 500,
              lineHeight: 1.14,
              color: "#e8e8e8",
              margin: "0 0 24px 0",
              maxWidth: 700,
              letterSpacing: "-0.02em",
            }}
          >
            where the procedures start to feel like the same subject
          </h1>

          <div style={{ maxWidth: 720 }}>
            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.8,
                color: "#777",
                margin: "0 0 16px 0",
              }}
            >
              linear algebra usually arrives as a pile of techniques. multiply this. row reduce
              that. check whether the determinant vanishes. it can take a while before any of it
              feels connected.
            </p>
            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.8,
                color: "#666",
                margin: 0,
              }}
            >
              this section is for the places where the geometry finally clarifies the algebra.
              matrices act on space. some directions survive. some get erased. some turn out to
              organize everything else. I&apos;m not trying to cover the whole course here. just the
              ideas that made the rest of it feel less arbitrary. the abstract linear algebra
              notes are separate on purpose. those are slower, more formal, and built from
              definitions outward.
            </p>
          </div>
        </section>

        <div
          className="la-content"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 120px" }}
        >
          <section style={{ marginBottom: 72 }}>
            <div
              className="la-main-grid"
              style={{ display: "grid", gridTemplateColumns: "1.35fr 0.9fr", gap: 20 }}
            >
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.02)",
                  padding: "28px 28px 24px",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    display: "block",
                    marginBottom: 14,
                  }}
                >
                  what this section is doing
                </span>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "#9a9a9a", margin: "0 0 14px 0" }}>
                  the through-line here is simple: what kind of object a vector is, what a row
                  really does, what information a matrix keeps, what it destroys, and why eigen
                  and SVD are really descriptions of structure rather than advanced tricks.
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "#777", margin: 0 }}>
                  so this page stays with the visual and conceptual spine. when I want the
                  definition-first, proof-bearing version, that goes in the abstract section
                  instead of stretching this one into something it isn&apos;t.
                </p>
              </div>

              <div
                style={{
                  border: "1px solid rgba(91, 141, 217, 0.14)",
                  borderRadius: 18,
                  background: "linear-gradient(180deg, rgba(91,141,217,0.08) 0%, rgba(255,255,255,0.01) 100%)",
                  padding: "28px 28px 24px",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#5B8DD9",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    display: "block",
                    marginBottom: 14,
                  }}
                >
                  separate companion
                </span>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: "#e8e8e8",
                    lineHeight: 1.35,
                    margin: "0 0 10px 0",
                  }}
                >
                  abstract linear algebra is a different track
                </h2>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "#91a7c8", margin: "0 0 16px 0" }}>
                  same subject, different purpose. those notes are where the formal story lives:
                  vector spaces, linear maps, proofs, and the course-shaped version of the ideas.
                </p>
                <Link
                  href="/abstract-linear-algebra"
                  style={{
                    color: "#d7e7ff",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  open the rigorous companion →
                </Link>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: 80 }}>
            <div
              className="la-section-head"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderTop: "1px solid #1a1a1a",
                paddingTop: 44,
                marginBottom: 28,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    margin: "0 0 10px 0",
                  }}
                >
                  start here
                </h2>
                <p style={{ fontSize: 13, color: "#999", lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
                  the best order to read what&apos;s already here. not a syllabus. just the route that
                  makes the later lessons land better.
                </p>
              </div>
              <span style={{ fontSize: 12, color: "#555", letterSpacing: "0.04em" }}>
                {mainPath.length} live now
              </span>
            </div>

            <div
              className="la-main-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}
            >
              {mainPath.map((lesson, index) => (
                <Link
                  key={lesson.slug}
                  href={`/lessons/${lesson.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="path-card"
                    style={{
                      height: "100%",
                      backgroundColor: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderTop: `2px solid ${lesson.accent}55`,
                      borderRadius: 16,
                      padding: "22px 22px 20px",
                      transition: "transform 0.2s, border-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.08em" }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: lesson.accent,
                          opacity: 0.85,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {lesson.displayTag}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 500,
                        color: "#e8e8e8",
                        margin: "0 0 10px 0",
                        lineHeight: 1.35,
                      }}
                    >
                      {lesson.title}
                    </h3>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: "#999", margin: 0 }}>
                      {lesson.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 80 }}>
            <div
              className="la-section-head"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderTop: "1px solid #1a1a1a",
                paddingTop: 44,
                marginBottom: 22,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    margin: "0 0 10px 0",
                  }}
                >
                  the next pieces
                </h2>
                <p style={{ fontSize: 13, color: "#999", lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
                  the missing bridges. these are the lessons that would make the section feel less
                  like scattered realizations and more like one continuous argument.
                </p>
              </div>
            </div>

            <div
              className="la-note-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}
            >
              {upcomingCore.map((lesson) => (
                <div
                  key={lesson.slug}
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "18px 18px 16px",
                    backgroundColor: "rgba(255,255,255,0.015)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <h3 style={{ fontSize: 15, fontWeight: 500, color: "#bdbdbd", margin: 0 }}>
                      {lesson.title}
                    </h3>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#555",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        flexShrink: 0,
                      }}
                    >
                      soon
                    </span>
                  </div>
                  <p style={{ fontSize: 12, lineHeight: 1.65, color: "#6f6f6f", margin: 0 }}>
                    {lesson.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 80 }}>
            <div
              className="la-section-head"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderTop: "1px solid #1a1a1a",
                paddingTop: 44,
                marginBottom: 14,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    margin: "0 0 10px 0",
                  }}
                >
                  connection notes
                </h2>
                <p style={{ fontSize: 13, color: "#999", lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
                  shorter pieces for the moments where two separately taught ideas collapse into
                  the same picture.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {liveConnections.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/lessons/${lesson.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="note-row"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 18,
                      padding: "15px 12px",
                      margin: "0 -12px",
                      borderBottom: "1px solid #141414",
                      borderRadius: 10,
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 400, color: "#e8e8e8", margin: "0 0 4px 0" }}>
                        {lesson.title}
                      </h3>
                      <p style={{ fontSize: 12, color: "#888", lineHeight: 1.55, margin: 0 }}>
                        {lesson.description}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, color: "#444", letterSpacing: "0.08em", flexShrink: 0 }}>
                      live
                    </span>
                  </div>
                </Link>
              ))}

              {upcomingConnections.map((lesson) => (
                <div
                  key={lesson.slug}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 18,
                    padding: "15px 12px",
                    margin: "0 -12px",
                    borderBottom: "1px solid #141414",
                    borderRadius: 10,
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 400, color: "#777", margin: "0 0 4px 0" }}>
                      {lesson.title}
                    </h3>
                    <p style={{ fontSize: 12, color: "#555", lineHeight: 1.55, margin: 0 }}>
                      {lesson.description}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#444",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      flexShrink: 0,
                    }}
                  >
                    soon
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div
              className="la-section-head"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderTop: "1px solid #1a1a1a",
                paddingTop: 44,
                marginBottom: 22,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    margin: "0 0 10px 0",
                  }}
                >
                  companion route
                </h2>
                <p style={{ fontSize: 13, color: "#999", lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
                  if a visual lesson makes you want the formal version, these are the right notes
                  to open next.
                </p>
              </div>
            </div>

            <div
              className="la-companion-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}
            >
              <Link
                href="/abstract-linear-algebra/matrices"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="path-card"
                  style={{
                    height: "100%",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "18px 18px 16px",
                    backgroundColor: "rgba(255,255,255,0.015)",
                    transition: "transform 0.2s, border-color 0.2s",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#9B7FDD", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    abstract notes
                  </span>
                  <h3 style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", margin: "10px 0 8px 0" }}>
                    matrices
                  </h3>
                  <p style={{ fontSize: 12, lineHeight: 1.65, color: "#999", margin: 0 }}>
                    coordinates, basis choices, and the formal version of what a matrix actually is.
                  </p>
                </div>
              </Link>

              <Link
                href="/abstract-linear-algebra/rank-nullity"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="path-card"
                  style={{
                    height: "100%",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "18px 18px 16px",
                    backgroundColor: "rgba(255,255,255,0.015)",
                    transition: "transform 0.2s, border-color 0.2s",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#9B7FDD", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    abstract notes
                  </span>
                  <h3 style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", margin: "10px 0 8px 0" }}>
                    rank-nullity
                  </h3>
                  <p style={{ fontSize: 12, lineHeight: 1.65, color: "#999", margin: 0 }}>
                    the theorem-level version of what null space and range are counting.
                  </p>
                </div>
              </Link>

              <Link
                href="/abstract-linear-algebra/eigenvalues-and-eigenvectors"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="path-card"
                  style={{
                    height: "100%",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 14,
                    padding: "18px 18px 16px",
                    backgroundColor: "rgba(255,255,255,0.015)",
                    transition: "transform 0.2s, border-color 0.2s",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#9B7FDD", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    abstract notes
                  </span>
                  <h3 style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", margin: "10px 0 8px 0" }}>
                    eigenvalues and eigenvectors
                  </h3>
                  <p style={{ fontSize: 12, lineHeight: 1.65, color: "#999", margin: 0 }}>
                    invariant subspaces, operators, and the proof-oriented version of the idea.
                  </p>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
