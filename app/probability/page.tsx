import Link from "next/link";
import { getAllLessons, type LessonMeta } from "@/lib/lessons";

type PlannedEntry = {
  slug: string;
  title: string;
  description: string;
};

const prefaceEntries: PlannedEntry[] = [
  {
    slug: "what-probability-is-actually-for",
    title: "what probability is actually for",
    description: "not fortune-telling, not vague uncertainty. a language for stable claims about processes that do not resolve the same way twice.",
  },
  {
    slug: "statistics-is-about-procedures",
    title: "statistics is about procedures",
    description: "most first courses talk as if a dataset is the object. it usually is not. the object is the repeatable procedure that could have produced many datasets.",
  },
  {
    slug: "why-averages-end-up-running-everything",
    title: "why averages end up running everything",
    description: "expectation, sample means, variance, standard errors, confidence intervals. a lot of the subject is different versions of the same balancing move.",
  },
];

const seasonOrder = [
  "randomness-as-a-map",
  "distributions-are-pictures-of-uncertainty",
  "expectation-is-center-of-mass",
  "variance-measures-deviation-with-structure",
  "conditioning-changes-the-world",
  "sampling-is-where-statistics-begins",
  "why-the-central-limit-theorem-keeps-showing-up",
  "confidence-intervals-and-tests-are-procedures",
] as const;

const plannedExtensions: PlannedEntry[] = [
  {
    slug: "discrete-distributions-that-deserve-names",
    title: "discrete distributions that deserve names",
    description: "binomial, geometric, and poisson as recurring structural patterns rather than memorized formulas.",
  },
  {
    slug: "covariance-and-correlation-as-geometry",
    title: "covariance and correlation as geometry",
    description: "shape, direction, and why dependence is more than a single number.",
  },
  {
    slug: "normal-distributions-and-z-scores",
    title: "normal distributions and z-scores",
    description: "standardization, bell curves, and when the normal model is a convenience rather than a law.",
  },
  {
    slug: "likelihood-and-estimation",
    title: "likelihood and estimation",
    description: "how a model turns observed data into a preference over parameter values.",
  },
];

function bySlug(slug: string, lessons: LessonMeta[]) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export default function ProbabilityPage() {
  const allLessons = getAllLessons();
  const probabilityLessons = allLessons.filter(
    (lesson): lesson is LessonMeta =>
      lesson.tags.includes("probability") && lesson.lessonType === "lesson"
  );
  const prefaceLessons = probabilityLessons.filter((lesson) => lesson.displayTag === "PREFACE");
  const mainLessons = probabilityLessons.filter((lesson) => lesson.displayTag !== "PREFACE");
  const liveCount = mainLessons.length;

  const season = seasonOrder
    .map((slug) => bySlug(slug, mainLessons))
    .filter((lesson): lesson is LessonMeta => lesson !== undefined);

  const liveSlugs = new Set(probabilityLessons.map((lesson) => lesson.slug));
  const upcoming = plannedExtensions.filter((lesson) => !liveSlugs.has(lesson.slug));
  const remainingPrefaceEntries = prefaceEntries.filter((entry) => !liveSlugs.has(entry.slug));

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .prob-page-nav, .prob-hero, .prob-content {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .prob-hero {
            padding-top: 48px !important;
            padding-bottom: 36px !important;
          }
          .prob-content {
            padding-bottom: 72px !important;
          }
          .prob-sequence-grid, .prob-extensions-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: auto !important;
          }
          .prob-section-head {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .prob-sequence-card {
            min-height: 0 !important;
          }
          .prob-series-spine {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .prob-spine-step {
            min-height: 0 !important;
          }
        }
        @media (max-width: 420px) {
          .prob-hero-title {
            font-size: 34px !important;
            line-height: 1.14 !important;
          }
          .prob-hero-meta {
            align-items: flex-start !important;
            flex-direction: column !important;
          }
          .prob-card-top {
            align-items: flex-start !important;
          }
          .prob-card-label {
            max-width: 190px;
            text-align: right;
          }
        }
        .prob-preface-card {
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .prob-preface-card:hover {
          background: rgba(255,255,255,0.035) !important;
          border-color: rgba(232,160,32,0.16) !important;
        }
        .nav-pill:hover {
          color: #ccc !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
        .prob-sequence-card:hover {
          border-color: rgba(255,255,255,0.14) !important;
          transform: translateY(-2px);
        }
        .prob-sequence-link {
          display: flex;
          min-width: 0;
        }
        .prob-sequence-card {
          min-height: 172px;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .prob-spine-step {
          min-height: 104px;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, rgba(25, 21, 14, 0.55) 0%, rgba(10,10,10,1) 40%), #0a0a0a",
          color: "#e8e8e8",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(circle at 16% 18%, rgba(232,160,32,0.04) 0%, rgba(232,160,32,0) 24%), radial-gradient(circle at 82% 26%, rgba(93,202,165,0.035) 0%, rgba(93,202,165,0) 22%), radial-gradient(circle at 50% 72%, rgba(96,165,250,0.025) 0%, rgba(96,165,250,0) 26%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80vw",
            height: "80vw",
            maxWidth: 840,
            maxHeight: 840,
            background:
              "radial-gradient(circle, rgba(232, 160, 32, 0.06) 0%, rgba(93, 202, 165, 0.04) 28%, rgba(10, 10, 10, 0) 66%)",
            pointerEvents: "none",
            zIndex: 0,
            filter: "blur(10px)",
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
            className="prob-page-nav"
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
          className="prob-hero"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 48px 42px", position: "relative", zIndex: 1 }}
        >
          <div style={{ maxWidth: 760 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: "#8a7855",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                display: "block",
                marginBottom: 20,
              }}
            >
              probability
            </span>

            <h1
              className="prob-hero-title"
              style={{
                fontSize: 42,
                fontWeight: 500,
                lineHeight: 1.16,
                color: "#e8e8e8",
                margin: "0 0 22px 0",
                maxWidth: 700,
                letterSpacing: 0,
              }}
            >
              uncertainty, before it turns procedural
            </h1>

            <div style={{ maxWidth: 700 }}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: "#8a847a",
                  margin: "0 0 18px 0",
                }}
              >
                probability and statistics often arrive as a bag of moves. condition on this.
                integrate that. remember which formula goes with which setting. it can hold
                together long enough to pass a course. it does not always leave a picture behind.
              </p>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.8,
                  color: "#767067",
                  margin: "0 0 24px 0",
                }}
              >
                this section is for the pieces that make the subject feel less arbitrary:
                what is actually random, what a distribution is a distribution of, why averages
                keep taking over, and why inference is really about procedures rather than one
                impressive-looking dataset.
              </p>

              <div
                className="prob-hero-meta"
                style={{ display: "inline-flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#d7be8e",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    border: "1px solid rgba(232,160,32,0.18)",
                    background: "rgba(232,160,32,0.06)",
                    borderRadius: 999,
                    padding: "6px 12px",
                  }}
                >
                  {liveCount} live lessons
                </span>
                <span style={{ fontSize: 12, color: "#777", letterSpacing: "0.03em" }}>
                  read in order. the preface notes are where the framing lives.
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="prob-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 120px", position: "relative", zIndex: 1 }}>
          <section style={{ borderTop: "1px solid #1a1a1a", paddingTop: 48, marginBottom: 24 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              before you start
            </span>
          </section>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 56 }}>
            {prefaceLessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/lessons/${lesson.slug}`}
                style={{ textDecoration: "none", color: "inherit", flex: "1 1 260px", maxWidth: 360 }}
              >
                <div
                  className="prob-preface-card"
                  style={{
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 8,
                    padding: "18px 22px",
                    background: "rgba(255,255,255,0.012)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#d6d0c7",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {lesson.title}
                  </span>
                  <span style={{ fontSize: 12, color: "#7f7a71", lineHeight: 1.6 }}>
                    {lesson.description}
                  </span>
                </div>
              </Link>
            ))}

            {remainingPrefaceEntries.map((entry) => (
              <div key={entry.slug} style={{ flex: "1 1 260px", maxWidth: 360 }}>
                <div
                  className="prob-preface-card"
                  style={{
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 8,
                    padding: "18px 22px",
                    background: "rgba(255,255,255,0.008)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#a9a39a",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {entry.title}
                  </span>
                  <span style={{ fontSize: 12, color: "#68645d", lineHeight: 1.6 }}>
                    {entry.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <section style={{ borderTop: "1px solid #1a1a1a", paddingTop: 42, marginBottom: 56 }}>
            <div
              className="prob-series-spine"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {[
                ["01", "outcomes", "start with what can happen before you attach numbers"],
                ["02", "variables", "choose the measurement rule you actually care about"],
                ["03", "distributions", "look at the shape that rule produces"],
                ["04", "averages", "find the balance point and spread"],
                ["05", "sampling", "turn one sample into a repeatable process"],
                ["06", "inference", "build procedures with controlled error"],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="prob-spine-step"
                  style={{
                    borderTop: "1px solid rgba(232,160,32,0.22)",
                    paddingTop: 14,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: 10,
                      color: "#7e6a48",
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
                      color: "#ded7cb",
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    {title}
                  </span>
                  <span style={{ display: "block", fontSize: 12, lineHeight: 1.55, color: "#757067" }}>
                    {description}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 72 }}>
            <div className="prob-section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", margin: "0 0 6px 0" }}>
                  start here
                </h3>
                <p style={{ fontSize: 13, color: "#777", lineHeight: 1.6, margin: 0, maxWidth: 560 }}>
                  the main path from outcomes to inference. the early lessons are doing conceptual
                  cleanup on purpose, so the later ones are not carrying unspoken confusion.
                </p>
              </div>
            </div>

            <div
              className="prob-sequence-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridAutoRows: "1fr",
                gap: 18,
              }}
            >
              {season.map((lesson, index) => (
                <Link
                  key={lesson.slug}
                  href={`/lessons/${lesson.slug}`}
                  className="prob-sequence-link"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="prob-sequence-card"
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
                      className="prob-card-top"
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
                        className="prob-card-label"
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

          {upcoming.length > 0 && (
            <section>
              <div
                className="prob-section-head"
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
                    related branches. still part of the same subject, but better once the main path
                    is already in place.
                  </p>
                </div>
              </div>

              <div
                className="prob-extensions-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                }}
              >
                {upcoming.map((entry) => (
                  <div
                    key={entry.slug}
                    className="lesson-card"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.018)",
                      border: "0.5px solid rgba(255,255,255,0.08)",
                      borderTop: "2px solid rgba(232,160,32,0.32)",
                      borderRadius: 12,
                      padding: "20px 22px",
                      "--hover-glow": "rgba(232,160,32,0.22)",
                    } as React.CSSProperties}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "#d0a158",
                        opacity: 0.8,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        display: "block",
                        marginBottom: 10,
                      }}
                    >
                      later
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
                      {entry.title}
                    </h4>
                    <span style={{ fontSize: 13, color: "#999", lineHeight: 1.55, display: "block" }}>
                      {entry.description}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
