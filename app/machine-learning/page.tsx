import Link from "next/link";
import { getAllLessons, type LessonMeta } from "@/lib/lessons";

export default function MachineLearningPage() {
  const allLessons = getAllLessons();
  const mlLessons = allLessons.filter(
    (l): l is LessonMeta => l.tags.includes("machine learning") && l.lessonType === "lesson"
  );
  const prefaceLessons = mlLessons.filter((l) => l.displayTag === "PREFACE");
  const mainLessons = mlLessons.filter((l) => l.displayTag !== "PREFACE");

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .ml-page-nav, .ml-hero, .ml-content {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .ml-hero {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
          }
          .ml-content {
            padding-bottom: 64px !important;
          }
          .ml-lessons-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .ml-preface-card { transition: background 0.15s ease; }
        .ml-preface-card:hover { background: rgba(255,255,255,0.04) !important; }
        .nav-pill:hover {
          color: #ccc !important;
          border-color: rgba(255,255,255,0.2) !important;
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
            background: "radial-gradient(circle, rgba(93, 202, 165, 0.05) 0%, rgba(10, 10, 10, 0) 65%)",
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
                transition: "all 0.2s"
              }}
            >
              <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1" style={{ marginRight: 4 }}>←</span> back
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
                transition: "all 0.2s"
              }}
            >
              github
            </a>
          </nav>
        </div>

        {/* ── HERO ── */}
        <section
          className="ml-hero"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 48px 48px" }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              display: "block",
              marginBottom: 20,
            }}
          >
            machine learning
          </span>

          <h1
            style={{
              fontSize: 38,
              fontWeight: 500,
              lineHeight: 1.2,
              color: "#e8e8e8",
              margin: "0 0 32px 0",
              maxWidth: 520,
              letterSpacing: "-0.01em",
            }}
          >
            geometry underneath the learning
          </h1>

          <div style={{ maxWidth: 560 }}>
            <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.8, color: "#666", margin: "0 0 18px 0" }}>
              the standard introduction to machine learning is algebraic. you learn the update rule,
              you memorize that backpropagation is just the chain rule, and it&apos;s coherent enough
              to implement. the algebra hides the geometry.
            </p>
            <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.8, color: "#555", margin: 0 }}>
              this is my attempt at a coherent account of what&apos;s actually happening. the series
              I was looking for when I started.
            </p>
          </div>
        </section>

        {/* ── BEFORE YOU START ── */}
        {prefaceLessons.length > 0 && (
          <div className="ml-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 56px" }}>
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 48, marginBottom: 24 }}>
              <span style={{ fontSize: 11, fontWeight: 400, color: "#444", textTransform: "uppercase", letterSpacing: "0.14em" }}>
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
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 400, color: "#ccc", display: "block", marginBottom: 6 }}>
                      {lesson.title}
                    </span>
                    <span style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                      {lesson.description}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── LESSONS ── */}
        <div className="ml-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 120px" }}>
          <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 48, marginBottom: 32, position: "relative", zIndex: 10 }}>
            <h2 style={{ fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.14em", margin: 0 }}>
              lessons
            </h2>
          </div>

          <div
            className="ml-lessons-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}
          >
            {mainLessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/lessons/${lesson.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="lesson-card"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    borderTop: `2px solid ${lesson.accent}40`,
                    borderRadius: 12,
                    padding: "20px 24px",
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
                  <h3 style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", display: "block", marginBottom: 8, lineHeight: 1.3, marginTop: 0 }}>
                    {lesson.title}
                  </h3>
                  <span style={{ fontSize: 13, color: "#999", lineHeight: 1.5, display: "block" }}>
                    {lesson.description}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
