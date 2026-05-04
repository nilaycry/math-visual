import Link from "next/link";
import { getAllLessons, type LessonMeta } from "@/lib/lessons";

type RouteEntry = {
  slug: string;
  number: string;
  movement: string;
  note: string;
};

const route: RouteEntry[] = [
  {
    slug: "what-a-matrix-does-to-space",
    number: "01",
    movement: "the action",
    note: "start with the grid moving, not the array of numbers",
  },
  {
    slug: "vectors-columns-rows",
    number: "02",
    movement: "objects",
    note: "separate the vector from its coordinate description",
  },
  {
    slug: "row-vectors-are-functions",
    number: "03",
    movement: "objects",
    note: "rows measure vectors and return numbers",
  },
  {
    slug: "dot-product-and-matrix-multiplication",
    number: "04",
    movement: "measurements",
    note: "dot products, row views, and column views become one calculation",
  },
  {
    slug: "orthogonality-and-projections",
    number: "05",
    movement: "measurements",
    note: "closest points are found by making the error perpendicular",
  },
  {
    slug: "null-space",
    number: "06",
    movement: "collapse",
    note: "what the matrix destroys",
  },
  {
    slug: "what-a-matrix-can-reach",
    number: "07",
    movement: "collapse",
    note: "what outputs are possible at all",
  },
  {
    slug: "eight-ways-to-say-invertible",
    number: "08",
    movement: "collapse",
    note: "the invertible matrix theorem as one picture",
  },
  {
    slug: "eigen",
    number: "09",
    movement: "structure",
    note: "directions whose line survives the transformation",
  },
  {
    slug: "when-eigenvectors-are-enough",
    number: "10",
    movement: "structure",
    note: "why diagonalization is powerful, and why it sometimes fails",
  },
  {
    slug: "svd",
    number: "11",
    movement: "structure",
    note: "the universal rotate, stretch, rotate story",
  },
];

const lens = [
  { verb: "measure", detail: "rows ask questions" },
  { verb: "build", detail: "columns make outputs" },
  { verb: "erase", detail: "null spaces collapse" },
  { verb: "reach", detail: "rank limits targets" },
  { verb: "organize", detail: "eigen and SVD find structure" },
];

function bySlug(slug: string, lessons: LessonMeta[]) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export default function LinearAlgebraPage() {
  const allLessons = getAllLessons();
  const linearAlgebraLessons = allLessons.filter((lesson) =>
    lesson.tags.includes("linear algebra")
  );

  const routeLessons = route.map((entry) => ({
    entry,
    lesson: bySlug(entry.slug, linearAlgebraLessons),
  }));

  return (
    <>
      <style>{`
        .la-back:hover, .la-row:hover .la-row-title, .la-link:hover {
          color: #e8a020 !important;
        }

        .la-row {
          transition: background 0.15s ease;
        }

        .la-row:hover {
          background: rgba(255,255,255,0.025);
        }

        .la-lens-item {
          border-top: 1px solid #232323;
          padding-top: 14px;
        }

        @media (max-width: 760px) {
          .la-nav, .la-shell {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }

          .la-title {
            font-size: 34px !important;
          }

          .la-row {
            grid-template-columns: 42px 1fr !important;
            gap: 14px !important;
          }

          .la-row-movement {
            display: none !important;
          }

          .la-lens {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .la-after-route {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          color: "#e8e8e8",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: "rgba(10, 10, 10, 0.82)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <nav
            className="la-nav"
            style={{
              maxWidth: 840,
              margin: "0 auto",
              padding: "20px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/"
              className="la-back"
              style={{
                color: "#666",
                textDecoration: "none",
                fontSize: 12,
                letterSpacing: "0.06em",
                transition: "color 0.15s ease",
              }}
            >
              {"<-"} back
            </Link>
            <Link
              href="/abstract-linear-algebra"
              className="la-link"
              style={{
                color: "#666",
                textDecoration: "none",
                fontSize: 12,
                letterSpacing: "0.06em",
                transition: "color 0.15s ease",
              }}
            >
              abstract companion
            </Link>
          </nav>
        </div>

        <main
          className="la-shell"
          style={{
            maxWidth: 840,
            margin: "0 auto",
            padding: "72px 28px 120px",
          }}
        >
          <header style={{ marginBottom: 56 }}>
            <span
              style={{
                display: "block",
                color: "#5b8dd9",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 18,
              }}
            >
              linear algebra
            </span>
            <h1
              className="la-title"
              style={{
                margin: "0 0 28px",
                maxWidth: 720,
                fontSize: 48,
                lineHeight: 1.08,
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              when the procedures start talking to each other
            </h1>
            <div style={{ maxWidth: 660 }}>
              <p
                style={{
                  color: "#aaa",
                  fontSize: 16,
                  lineHeight: 1.85,
                  margin: "0 0 18px",
                }}
              >
                Linear algebra often arrives as a pile of instructions. Multiply
                this. Row reduce that. Check whether the determinant vanishes.
                Find the eigenvalues if the problem asks nicely.
              </p>
              <p
                style={{
                  color: "#888",
                  fontSize: 16,
                  lineHeight: 1.85,
                  margin: 0,
                }}
              >
                This section is for the moment those instructions stop feeling
                separate. A matrix acts on space. Rows measure. Columns build.
                Some directions disappear. Some outputs can never be reached.
                The later decompositions are not advanced tricks; they are
                descriptions of that structure.
              </p>
            </div>
          </header>

          <section style={{ marginBottom: 64 }}>
            <div
              style={{
                borderTop: "1px solid #242424",
                borderBottom: "1px solid #242424",
                padding: "28px 0 30px",
              }}
            >
              <p
                style={{
                  color: "#cfcfcf",
                  fontSize: 19,
                  lineHeight: 1.65,
                  margin: "0 0 28px",
                  maxWidth: 690,
                }}
              >
                The goal is one durable reflex: when you see a matrix, ask what
                it is doing to space before you ask which procedure to run.
              </p>
              <div
                className="la-lens"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 18,
                }}
              >
                {lens.map((item) => (
                  <div key={item.verb} className="la-lens-item">
                    <span
                      style={{
                        display: "block",
                        color: "#e8e8e8",
                        fontSize: 14,
                        marginBottom: 6,
                      }}
                    >
                      {item.verb}
                    </span>
                    <span
                      style={{
                        display: "block",
                        color: "#747474",
                        fontSize: 12,
                        lineHeight: 1.45,
                      }}
                    >
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section style={{ marginBottom: 56 }}>
            <h2
              style={{
                color: "#e8e8e8",
                fontSize: 18,
                fontWeight: 500,
                margin: "0 0 18px",
              }}
            >
              the route
            </h2>
            <div style={{ borderTop: "1px solid #1f1f1f" }}>
              {routeLessons.map(({ entry, lesson }) => {
                const content = (
                  <div
                    className="la-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "52px 140px 1fr",
                      gap: 20,
                      alignItems: "baseline",
                      padding: "18px 0",
                      borderBottom: "1px solid #1f1f1f",
                    }}
                  >
                    <span
                      style={{
                        color: "#555",
                        fontSize: 12,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {entry.number}
                    </span>
                    <span
                      className="la-row-movement"
                      style={{
                        color: "#666",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {entry.movement}
                    </span>
                    <span>
                      <span
                        className="la-row-title"
                        style={{
                          display: "block",
                          color: lesson ? "#e8e8e8" : "#777",
                          fontSize: 15,
                          marginBottom: 5,
                          transition: "color 0.15s ease",
                        }}
                      >
                        {lesson?.title ?? entry.slug.replace(/-/g, " ")}
                      </span>
                      <span
                        style={{
                          display: "block",
                          color: "#777",
                          fontSize: 13,
                          lineHeight: 1.6,
                        }}
                      >
                        {entry.note}
                      </span>
                    </span>
                  </div>
                );

                return lesson ? (
                  <Link
                    key={entry.slug}
                    href={`/lessons/${lesson.slug}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={entry.slug}>{content}</div>
                );
              })}
            </div>
          </section>

          <section
            className="la-after-route"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              borderTop: "1px solid #242424",
              paddingTop: 34,
            }}
          >
            <div>
              <span
                style={{
                  display: "block",
                  color: "#686868",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                boundary
              </span>
              <p
                style={{
                  color: "#999",
                  fontSize: 14,
                  lineHeight: 1.75,
                  margin: "0 0 16px",
                }}
              >
                Vector spaces, subspaces, bases, dimension, and proof-level
                rank-nullity are real linear algebra. They are just not the job
                of this section.
              </p>
              <Link
                href="/abstract-linear-algebra"
                className="la-link"
                style={{
                  color: "#9b7fdd",
                  textDecoration: "none",
                  fontSize: 13,
                  transition: "color 0.15s ease",
                }}
              >
                open the rigorous companion {"->"}
              </Link>
            </div>

            <div>
              <span
                style={{
                  display: "block",
                  color: "#686868",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                reading rule
              </span>
              <p
                style={{
                  color: "#999",
                  fontSize: 14,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Start with the picture before the formula. If a calculation feels
                arbitrary, ask which verb it belongs to: measure, build, erase,
                reach, or organize.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
