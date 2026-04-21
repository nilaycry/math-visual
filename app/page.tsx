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
  ];

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column !important;
            padding-top: 48px !important;
            padding-bottom: 48px !important;
            gap: 40px !important;
          }
          .hero-canvas-col { display: none !important; }
          .subjects-grid {
            grid-template-columns: 1fr !important;
          }
          .page-nav, .hero-section, .subjects-section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .subjects-section {
            padding-top: 64px !important;
            padding-bottom: 64px !important;
          }
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
            <div style={{ display: "flex", gap: 32 }}>
              <SmoothScrollLink
                targetId="explore"
                style={{
                  color: "#777",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
              >
                explore
              </SmoothScrollLink>
              <a
                href="https://github.com/nilaycry"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#777",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
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
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 48px 60px",
            gap: 64,
          }}
        >
          {/* Left — text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: "#555",
                textTransform: "uppercase" as const,
                letterSpacing: "0.14em",
                display: "block",
                marginBottom: 20,
              }}
            >
              math · uiuc
            </span>

            <h1
              style={{
                fontSize: 46,
                fontWeight: 500,
                lineHeight: 1.15,
                background: "linear-gradient(135deg, #ffffff 0%, #999999 100%)",
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
                color: "#999",
                margin: "0 0 36px 0",
                maxWidth: 420,
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

          {/* Right — canvas */}
          <div className="hero-canvas-col" style={{ flexShrink: 0 }}>
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
            padding: "80px 48px 120px",
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
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}
            >
              {lessons.map((subject) => (
                <Link key={subject.href} href={subject.href} style={{ textDecoration: "none", color: "inherit" }}>
                  <div
                    className="lesson-card"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.02)",
                      border: "0.5px solid rgba(255,255,255,0.08)",
                      borderTop: `2px solid ${subject.accent}40`,
                      borderRadius: 12,
                      padding: "28px 28px 24px",
                      cursor: "pointer",
                      height: "100%",
                      boxSizing: "border-box",
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
                      borderLeft: `2px solid ${subject.accent}44`,
                      borderRadius: 12,
                      padding: "28px 28px 24px",
                      cursor: "pointer",
                      height: "100%",
                      boxSizing: "border-box",
                      "--hover-glow": `${subject.accent}33`,
                    } as React.CSSProperties}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: subject.accent, opacity: 0.8, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
                        {subject.tag}
                      </span>
                      <span style={{ fontSize: 11, color: "#888", letterSpacing: "0.05em" }}>
                        {subject.count} {subject.count === 1 ? "note" : "notes"}
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
      </div>
    </>
  );
}
