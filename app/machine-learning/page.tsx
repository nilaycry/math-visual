import Link from "next/link";
import { getAllLessons, type LessonMeta } from "@/lib/lessons";

const foundationsOrder = [
  "linear-models",
  "gradient-descent",
  "one-weight-to-many",
  "non-linearities",
  "network-anatomy",
  "first-network",
] as const;

const trainingOrder = [
  "backpropagation",
  "training-loop",
  "gradient-flow",
  "architectures",
] as const;

const extensionOrder = ["fourier-series"] as const;

function bySlug(slug: string, lessons: LessonMeta[]) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export default function MachineLearningPage() {
  const allLessons = getAllLessons();
  const mlLessons = allLessons.filter(
    (lesson): lesson is LessonMeta =>
      lesson.tags.includes("machine learning") && lesson.lessonType === "lesson"
  );

  const prefaceLessons = mlLessons.filter((lesson) => lesson.displayTag === "PREFACE");
  const mainLessons = mlLessons.filter((lesson) => lesson.displayTag !== "PREFACE");
  const liveCount = mainLessons.length;

  const foundations = foundationsOrder
    .map((slug) => bySlug(slug, mainLessons))
    .filter((lesson): lesson is LessonMeta => lesson !== undefined);

  const training = trainingOrder
    .map((slug) => bySlug(slug, mainLessons))
    .filter((lesson): lesson is LessonMeta => lesson !== undefined);

  const extensions = extensionOrder
    .map((slug) => bySlug(slug, mainLessons))
    .filter((lesson): lesson is LessonMeta => lesson !== undefined);

  const groupedSlugs = new Set([
    ...foundations.map((lesson) => lesson.slug),
    ...training.map((lesson) => lesson.slug),
    ...extensions.map((lesson) => lesson.slug),
  ]);
  const remainingLessons = mainLessons.filter((lesson) => !groupedSlugs.has(lesson.slug));
  const extensionLessons = [...extensions, ...remainingLessons];
  const hasSingleExtension = extensionLessons.length === 1;

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .ml-page-nav, .ml-hero, .ml-content {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .ml-hero {
            padding-top: 48px !important;
            padding-bottom: 36px !important;
          }
          .ml-content {
            padding-bottom: 64px !important;
          }
          .ml-sequence-grid, .ml-extensions-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: auto !important;
          }
          .ml-section-head {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .ml-sequence-card {
            min-height: 0 !important;
          }
          .ml-series-spine {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .ml-spine-step {
            min-height: 0 !important;
          }
        }
        @media (max-width: 420px) {
          .ml-hero-title {
            font-size: 34px !important;
            line-height: 1.14 !important;
          }
          .ml-hero-meta {
            align-items: flex-start !important;
            flex-direction: column !important;
          }
          .ml-card-top {
            align-items: flex-start !important;
          }
          .ml-card-label {
            max-width: 190px;
            text-align: right;
          }
        }
        .ml-preface-card {
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .ml-preface-card:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.12) !important;
        }
        .nav-pill:hover {
          color: #ccc !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .ml-sequence-card:hover {
          border-color: rgba(255,255,255,0.14) !important;
          transform: translateY(-2px);
        }
        .ml-sequence-link {
          display: flex;
          min-width: 0;
        }
        .ml-sequence-card {
          min-height: 172px;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .ml-spine-step {
          min-height: 104px;
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
            maxWidth: 800,
            maxHeight: 800,
            background:
              "radial-gradient(circle, rgba(93, 202, 165, 0.05) 0%, rgba(10, 10, 10, 0) 65%)",
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
            backgroundColor: "rgba(10, 10, 10, 0.65)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <nav
            className="ml-page-nav"
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
          className="ml-hero"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 48px 42px" }}
        >
          <div
            className="ml-hero-inner"
            style={{
              maxWidth: 760,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                display: "block",
                marginBottom: 20,
              }}
            >
              machine learning
            </span>

            <h1
              className="ml-hero-title"
              style={{
                fontSize: 42,
                fontWeight: 500,
                lineHeight: 1.16,
                color: "#e8e8e8",
                margin: "0 0 22px 0",
                maxWidth: 660,
                letterSpacing: 0,
              }}
            >
              geometry underneath the learning
            </h1>

            <div style={{ maxWidth: 680 }}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: "#858585",
                  margin: "0 0 18px 0",
                }}
              >
                the standard introduction to machine learning is algebraic. you learn the update
                rule, you memorize that backpropagation is just the chain rule, and it&apos;s coherent
                enough to implement. the algebra hides the geometry.
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: "#777",
                  margin: "0 0 24px 0",
                }}
              >
                this is my attempt at an account of what&apos;s actually happening. the series I was
                looking for when I started.
              </p>

              <div
                className="ml-hero-meta"
                style={{ display: "inline-flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#9ed4bd",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    border: "1px solid rgba(93,202,165,0.22)",
                    background: "rgba(93,202,165,0.08)",
                    borderRadius: 999,
                    padding: "6px 12px",
                  }}
                >
                  {liveCount} live lessons
                </span>
                <span style={{ fontSize: 12, color: "#777", letterSpacing: "0.03em" }}>
                  read in order. the preface notes handle scope and assumptions.
                </span>
              </div>
            </div>
          </div>
        </section>

        {prefaceLessons.length > 0 && (
          <div className="ml-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 56px" }}>
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 48, marginBottom: 24 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 400,
                  color: "#444",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                before you start
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {prefaceLessons.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/lessons/${lesson.slug}`}
                  style={{ textDecoration: "none", color: "inherit", flex: "1 1 260px", maxWidth: 360 }}
                >
                  <div
                    className="ml-preface-card"
                    style={{
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 8,
                      padding: "18px 22px",
                      cursor: "pointer",
                      background: "rgba(255,255,255,0.012)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#ccc",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      {lesson.title}
                    </span>
                    <span style={{ fontSize: 12, color: "#767676", lineHeight: 1.6 }}>
                      {lesson.description}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="ml-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 120px" }}>
          <section style={{ borderTop: "1px solid #1a1a1a", paddingTop: 42, marginBottom: 56 }}>
            <div
              className="ml-series-spine"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {[
                ["01", "data", "start with points and targets"],
                ["02", "model", "choose the shape that makes predictions"],
                ["03", "loss", "turn wrongness into a surface"],
                ["04", "gradient", "read the local direction of improvement"],
                ["05", "update", "move the parameters, then repeat"],
                ["06", "network", "stack the same logic into structure"],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="ml-spine-step"
                  style={{
                    borderTop: "1px solid rgba(93,202,165,0.24)",
                    paddingTop: 14,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 10,
                      color: "#4c6d61",
                      letterSpacing: "0.1em",
                      marginBottom: 10,
                    }}
                  >
                    {number}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 14,
                      color: "#dedede",
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    {title}
                  </span>
                  <span style={{ display: "block", fontSize: 12, lineHeight: 1.55, color: "#707070" }}>
                    {description}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 72 }}>
            <div className="ml-section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", margin: "0 0 6px 0" }}>
                  foundations
                </h3>
                <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
                  fitting, loss, gradients, and the first transition from scalar models to actual
                  network structure.
                </p>
              </div>
            </div>

            <div
              className="ml-sequence-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridAutoRows: "1fr",
                gap: 18,
              }}
            >
              {foundations.map((lesson, index) => (
                <Link
                  key={lesson.slug}
                  href={`/lessons/${lesson.slug}`}
                  className="ml-sequence-link"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="ml-sequence-card"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderTop: `2px solid ${lesson.accent}45`,
                      borderRadius: 16,
                      padding: "22px 22px 20px",
                      cursor: "pointer",
                      transition: "transform 0.2s, border-color 0.2s",
                    }}
                  >
                    <div
                      className="ml-card-top"
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
                        className="ml-card-label"
                      >
                        {lesson.displayTag}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 17, fontWeight: 500, color: "#e8e8e8", margin: "0 0 10px 0", lineHeight: 1.35 }}>
                      {lesson.title}
                    </h4>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: "#999", margin: 0 }}>
                      {lesson.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 72 }}>
            <div
              className="ml-section-head"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderTop: "1px solid #161616",
                paddingTop: 40,
                marginBottom: 20,
              }}
            >
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", margin: "0 0 6px 0" }}>
                  training mechanics
                </h3>
                <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
                  once the model exists, these are the lessons that explain how signals move
                  backward, why training stalls, and what changed to make depth usable.
                </p>
              </div>
            </div>

            <div
              className="ml-sequence-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridAutoRows: "1fr",
                gap: 18,
              }}
            >
              {training.map((lesson, index) => (
                <Link
                  key={lesson.slug}
                  href={`/lessons/${lesson.slug}`}
                  className="ml-sequence-link"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="ml-sequence-card"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderTop: `2px solid ${lesson.accent}45`,
                      borderRadius: 16,
                      padding: "22px 22px 20px",
                      cursor: "pointer",
                      transition: "transform 0.2s, border-color 0.2s",
                    }}
                  >
                    <div
                      className="ml-card-top"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.08em" }}>
                        {String(foundations.length + index + 1).padStart(2, "0")}
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
                        className="ml-card-label"
                      >
                        {lesson.displayTag}
                      </span>
                    </div>
                    <h4 style={{ fontSize: 17, fontWeight: 500, color: "#e8e8e8", margin: "0 0 10px 0", lineHeight: 1.35 }}>
                      {lesson.title}
                    </h4>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: "#999", margin: 0 }}>
                      {lesson.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {extensionLessons.length > 0 && (
            <section>
              <div
                className="ml-section-head"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  borderTop: "1px solid #161616",
                  paddingTop: 40,
                  marginBottom: 20,
                }}
              >
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", margin: "0 0 6px 0" }}>
                    extensions
                  </h3>
                  <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
                    related branches. these are still part of the world this section is building,
                    but they read more like openings than prerequisites.
                  </p>
                </div>
              </div>

              <div
                className="ml-extensions-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: hasSingleExtension ? "minmax(0, 560px)" : "repeat(3, 1fr)",
                  gap: 16,
                }}
              >
                {extensionLessons.map((lesson) => (
                  <Link
                    key={lesson.slug}
                    href={`/lessons/${lesson.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      className="lesson-card"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.018)",
                        border: "0.5px solid rgba(255,255,255,0.08)",
                        borderTop: `2px solid ${lesson.accent}40`,
                        borderRadius: 12,
                        padding: hasSingleExtension ? "22px 24px" : "20px 22px",
                        cursor: "pointer",
                        "--hover-glow": `${lesson.accent}33`,
                      } as React.CSSProperties}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: lesson.accent,
                          opacity: 0.8,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          display: "block",
                          marginBottom: 10,
                        }}
                      >
                        {lesson.displayTag}
                      </span>
                      <h4
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#e8e8e8",
                          display: "block",
                          marginBottom: 8,
                          lineHeight: 1.35,
                          marginTop: 0,
                        }}
                      >
                        {lesson.title}
                      </h4>
                      <span style={{ fontSize: 13, color: "#999", lineHeight: 1.55, display: "block" }}>
                        {lesson.description}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
