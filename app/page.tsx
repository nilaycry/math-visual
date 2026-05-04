import Link from "next/link";
import dynamic from "next/dynamic";
import { getAllLessons } from "@/lib/lessons";
import { getAllNotes } from "@/lib/notes";
import SmoothScrollLink from "@/components/SmoothScrollLink";

const HeroSketch = dynamic(
  () => import("@/components/sketches/HeroSketch"),
  { ssr: false }
);

export default function HomePage() {
  const allLessons = getAllLessons();
  const allNotes = getAllNotes();
  const allComboNotes = getAllNotes("combinatorics");
  const all314Notes = getAllNotes("math-314");
  const allRealAnalysisNotes = getAllNotes("real-analysis");
  const allProbabilityLessons = allLessons.filter((l) => l.tags.includes("probability"));
  const latestLesson = allLessons[allLessons.length - 1];
  const latestComboNote = allComboNotes.filter((n) => n.week >= 1).at(-1);
  const latest314Note = all314Notes.filter((n) => n.week >= 1).at(-1);

  const lessons = [
    {
      href: "/linear-algebra",
      tag: "linear algebra",
      title: "the structure of space",
      description:
        "vectors, matrices, and transformations, and the connections between them that most courses never get to",
      accent: "#5B8DD9",
      count: allLessons.filter((l) => l.tags.includes("linear algebra")).length,
      unit: "lesson",
    },
    {
      href: "/machine-learning",
      tag: "machine learning",
      title: "geometry underneath the learning",
      description:
        "gradient descent, backpropagation, and the math that actually drives how neural networks train",
      accent: "#5DCAA5",
      count: allLessons.filter((l) => l.tags.includes("machine learning")).length,
      unit: "lesson",
    },
    {
      href: "/probability",
      tag: "probability",
      title: "uncertainty, before it turns procedural",
      description:
        "a visual companion for stat 400: random variables, sampling, and inference built from the pictures first",
      accent: "#E8A020",
      count: allProbabilityLessons.length,
      unit: "lesson",
    },
  ];

  const courseNotes = [
    {
      href: "/abstract-linear-algebra",
      tag: "abstract linear algebra",
      title: "the same ideas, built from scratch",
      description:
        "rigorous definitions, but written the way the intuition came.",
      accent: "#9B7FDD",
      count: allNotes.length,
      unit: "note",
    },
    {
      href: "/combinatorics",
      tag: "combinatorics",
      title: "counting, but the kind that tells you something",
      description:
        "bijections, generating functions, graph theory, and the structure hiding inside counting problems.",
      accent: "#b85c1a",
      count: allComboNotes.filter((n) => n.week >= 1).length,
      unit: "note",
    },
    {
      href: "/math-314",
      tag: "introduction to higher mathematics",
      title: "the grammar of proof",
      description:
        "logic, sets, functions, induction, and the habits that make upper-level math readable.",
      accent: "#2f6b6f",
      count: all314Notes.filter((n) => n.week >= 1).length,
      unit: "note",
    },
    {
      href: "/real-analysis",
      tag: "real analysis",
      title: "where limits become exact",
      description:
        "completeness, convergence, continuity, and the proof language underneath calculus.",
      accent: "#9a4f3d",
      count: allRealAnalysisNotes.filter((n) => n.week >= 1).length,
      unit: "note",
    },
  ];

  const totalLessons = allLessons.length;
  const totalNotes =
    getAllNotes().length +
    allComboNotes.filter((n) => n.week >= 1).length +
    all314Notes.filter((n) => n.week >= 1).length +
    allRealAnalysisNotes.filter((n) => n.week >= 1).length;

  const currentlyOpen = [
    latestComboNote && {
      href: `/combinatorics/${latestComboNote.slug}`,
      tag: "current notebook",
      title: latestComboNote.title,
      description: latestComboNote.description,
      accent: "#b85c1a",
      meta: "math 413",
    },
    latestLesson && {
      href: `/lessons/${latestLesson.slug}`,
      tag: "latest lesson",
      title: latestLesson.title,
      description: latestLesson.description,
      accent: latestLesson.accent,
      meta: latestLesson.displayTag,
    },
    latest314Note && {
      href: `/math-314/${latest314Note.slug}`,
      tag: "recent note",
      title: latest314Note.title,
      description: latest314Note.description,
      accent: "#2f6b6f",
      meta: "math 314",
    },
  ].filter((item): item is {
    href: string;
    tag: string;
    title: string;
    description: string;
    accent: string;
    meta: string;
  } => Boolean(item));

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column !important;
            min-height: auto !important;
            padding-top: 64px !important;
            padding-bottom: 56px !important;
            gap: 40px !important;
          }
          .hero-canvas-col { display: none !important; }
          .subjects-grid {
            grid-template-columns: 1fr !important;
          }
          .studio-grid {
            grid-template-columns: 1fr !important;
          }
          .page-nav, .hero-section, .studio-section, .subjects-section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .studio-section {
            padding-top: 8px !important;
            padding-bottom: 48px !important;
          }
          .subjects-section {
            padding-top: 64px !important;
            padding-bottom: 64px !important;
          }
        }
      `}</style>

      <style>{`
        .nav-explore {
          color: #E8A020;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
          transition: opacity 0.2s;
          opacity: 0.85;
        }
        .nav-explore:hover { opacity: 1; }

        .nav-github {
          color: #888;
          text-decoration: none;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.06em;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 5px 14px;
          transition: color 0.2s, border-color 0.2s;
        }
        .nav-github:hover {
          color: #ccc;
          border-color: rgba(255,255,255,0.2);
        }
        .hero-section .group span {
          position: relative;
          display: inline-block;
          width: 1ch;
          margin-left: 6px;
          overflow: hidden;
          color: transparent;
        }
        .hero-section .group span::after {
          content: "\\2193";
          position: absolute;
          left: 0;
          top: 0;
          color: #E8A020;
          transition: transform 0.22s ease;
        }
        .hero-section .group:hover span {
          transform: none !important;
        }
        .hero-section .group:hover span::after {
          transform: translateY(3px);
        }

        .studio-card {
          transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .studio-card:hover {
          border-color: color-mix(in srgb, var(--studio-accent) 34%, rgba(255,255,255,0.12)) !important;
          background: rgba(255,255,255,0.035) !important;
          transform: translateY(-2px);
          box-shadow: 0 14px 34px -26px var(--studio-accent, rgba(255,255,255,0.18));
        }

        .subjects-section .lesson-card {
          transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .lesson-card:hover {
          border-color: var(--hover-border, rgba(255,255,255,0.15)) !important;
          transform: translateY(-2px);
          box-shadow: 0 14px 34px -24px var(--hover-glow, rgba(255,255,255,0.08));
          background-color: rgba(255,255,255,0.035) !important;
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
        {/* ── BACKGROUND GLOW ── */}
        <div 
          style={{
            position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)",
            width: "80vw", height: "80vw", maxWidth: 800, maxHeight: 800,
            background: "radial-gradient(circle, rgba(232, 160, 32, 0.05) 0%, rgba(10, 10, 10, 0) 65%)",
            pointerEvents: "none", zIndex: 0 
          }} 
        />
        {/* ── NAVBAR ── */}
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
            className="page-nav"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 48px",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            <span />
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <SmoothScrollLink
                targetId="explore"
                className="nav-explore"
              >
                explore
              </SmoothScrollLink>
              <a
                href="https://github.com/nilaycry"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-github"
              >
                github
              </a>
            </div>
          </nav>
        </div>

        {/* ── HERO ── */}
        <section
          className="hero-section"
          style={{
            display: "flex",
            alignItems: "center",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "100px 48px 96px",
            gap: 64,
          }}
        >
          {/* Left — text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#E8A020",
                textTransform: "uppercase" as const,
                letterSpacing: "0.14em",
                display: "block",
                marginBottom: 20,
                opacity: 0.8,
              }}
            >
              math · uiuc
            </span>

            <h1
              style={{
                fontSize: 46,
                fontWeight: 500,
                lineHeight: 1.15,
                background: "linear-gradient(to bottom, #777 0%, #333 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: "0 0 24px 0",
                maxWidth: 480,
                letterSpacing: "-0.01em",
              }}
            >
              some math is easier to feel than to read
            </h1>

            <p
              style={{
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.65,
                color: "#888",
                margin: "0 0 36px 0",
                maxWidth: 380,
              }}
            >
              won&apos;t cover everything. might change how you see some of it.
            </p>

            <SmoothScrollLink
              targetId="explore"
              className="group"
              style={{
                display: "inline-flex",
                color: "#E8A020",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                alignItems: "center",
                transition: "color 0.2s",
              }}
            >
              explore <span className="transform transition-transform duration-300 group-hover:translate-y-1 inline-block ml-1">↓</span>
            </SmoothScrollLink>
          </div>

          {/* Right — canvas, vertically centered */}
          <div className="hero-canvas-col" style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <HeroSketch />
          </div>
        </section>

        {/* ── SUBJECTS ── */}
        <section
          id="explore"
          className="subjects-section"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "32px 48px 100px",
          }}
        >
          {/* ── LESSONS ── */}
          <div style={{ marginBottom: 72 }}>
            <div style={{ marginBottom: 28, position: "relative", zIndex: 10 }}>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#888",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.14em",
                  margin: "0 0 8px 0",
                }}
              >
                lessons
              </h2>
              <p style={{ fontSize: 13, color: "#999", margin: 0, lineHeight: 1.6 }}>
                interactive structural anchors. building the geometric intuition before trusting the algebra.
              </p>
            </div>
            <div
              className="subjects-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}
            >
              {lessons.map((subject) => (
                <Link key={subject.href} href={subject.href} style={{ textDecoration: "none", color: "inherit" }}>
                  <div
                    className="lesson-card"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.02)",
                      border: "0.5px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                      padding: "28px 28px 24px",
                      cursor: "pointer",
                      height: "100%",
                      boxSizing: "border-box",
                      "--hover-border": `${subject.accent}55`,
                      "--hover-glow": `${subject.accent}33`,
                    } as React.CSSProperties}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: subject.accent, opacity: 0.8, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
                        {subject.tag}
                      </span>
                      <span style={{ fontSize: 11, color: "#888", letterSpacing: "0.05em" }}>
                        {subject.count} {subject.count === 1 ? "lesson" : "lessons"}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 500, color: "#e8e8e8", display: "block", marginBottom: 10, lineHeight: 1.3, marginTop: 0 }}>
                      {subject.title}
                    </h3>
                    <span style={{ fontSize: 13, fontWeight: 400, color: "#999", lineHeight: 1.6, display: "block" }}>
                      {subject.description}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div style={{ borderTop: "1px solid #161616", marginBottom: 72 }} />

          {/* ── COURSE NOTES ── */}
          <div>
            <div style={{ marginBottom: 28, position: "relative", zIndex: 10 }}>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#888",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.14em",
                  margin: "0 0 8px 0",
                }}
              >
                notebooks
              </h2>
              <p style={{ fontSize: 13, color: "#999", margin: 0, lineHeight: 1.6 }}>
                written in real time, one definition at a time. sequential, honest about what&apos;s hard.
              </p>
            </div>
            <div
              className="subjects-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}
            >
              {courseNotes.map((subject) => (
                <Link key={subject.href} href={subject.href} style={{ textDecoration: "none", color: "inherit" }}>
                  <div
                    className="lesson-card"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.015)",
                      border: "0.5px solid rgba(255,255,255,0.06)",
                      borderRadius: 12,
                      padding: "28px 28px 24px",
                      cursor: "pointer",
                      height: "100%",
                      boxSizing: "border-box",
                      "--hover-border": `${subject.accent}55`,
                      "--hover-glow": `${subject.accent}33`,
                    } as React.CSSProperties}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: subject.accent, opacity: 0.8, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
                        {subject.tag}
                      </span>
                      <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.05em" }}>
                        {subject.count > 0
                          ? `${subject.count} ${subject.count === 1 ? "note" : "notes"}`
                          : "in progress"}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 500, color: "#d8d8d8", display: "block", marginBottom: 10, lineHeight: 1.3, marginTop: 0 }}>
                      {subject.title}
                    </h3>
                    <span style={{ fontSize: 13, fontWeight: 400, color: "#999", lineHeight: 1.6, display: "block" }}>
                      {subject.description}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CURRENTLY OPEN */}
        <section
          className="studio-section"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 48px 84px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
              alignItems: "end",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 28,
              marginBottom: 18,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#888",
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.14em",
                  margin: "0 0 8px 0",
                }}
              >
                currently open
              </h2>
              <p style={{ fontSize: 13, color: "#999", margin: 0, lineHeight: 1.6 }}>
                recent notes and lessons I&apos;ve been working on.
              </p>
            </div>
            <span
              style={{
                color: "#444",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                flexShrink: 0,
              }}
            >
              recent work
            </span>
          </div>

          <div
            className="studio-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.18fr 0.91fr 0.91fr",
              gap: 14,
            }}
          >
            {currentlyOpen.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <div
                  className="studio-card"
                  style={{
                    "--studio-accent": item.accent,
                    minHeight: 156,
                    height: "100%",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.018)",
                    padding: "22px 22px 20px",
                    boxSizing: "border-box",
                  } as React.CSSProperties}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      alignItems: "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        color: "#aaa",
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase" as const,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background: item.accent,
                          opacity: 0.8,
                        }}
                      />
                      {item.tag}
                    </span>
                    <span
                      style={{
                        color: "#555",
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.meta}
                    </span>
                  </div>
                  <h3
                    style={{
                      color: "#e8e8e8",
                      fontSize: 18,
                      fontWeight: 500,
                      lineHeight: 1.25,
                      margin: "0 0 10px",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "#999",
                      fontSize: 13,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            padding: "32px 48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <span style={{ fontSize: 12, color: "#444", letterSpacing: "0.08em" }}>
            math · uiuc
          </span>
          <span style={{ fontSize: 12, color: "#444", letterSpacing: "0.06em" }}>
            {totalLessons} lessons · {totalNotes} notes
          </span>
        </footer>
      </div>
    </>
  );
}
