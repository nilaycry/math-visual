import Link from "next/link";
import { getAllLessons, type LessonMeta } from "@/lib/lessons";

// Planned connections not yet written — remove an entry when its MDX goes live
const plannedConnections = [
  {
    slug: "vectors-columns-rows",
    title: "a vector, a column, a row",
    description: "what's the same object and what isn't",
  },
  {
    slug: "row-vectors-are-functions",
    title: "row vectors are linear functions",
    description: "not vectors written sideways — something else entirely",
  },
  {
    slug: "eight-ways-to-say-invertible",
    title: "eight ways to say the same thing",
    description: "the invertible matrix theorem, all at once",
  },
];

export default function LinearAlgebraPage() {
  const allLessons = getAllLessons();
  const laLessons = allLessons.filter(
    (l): l is LessonMeta => l.tags.includes("linear algebra") && l.lessonType === "lesson"
  );
  const liveConnections = allLessons.filter(
    (l): l is LessonMeta => l.tags.includes("linear algebra") && l.lessonType === "connection"
  );
  const liveConnectionSlugs = new Set(liveConnections.map((l) => l.slug));
  const stillPlanned = plannedConnections.filter((p) => !liveConnectionSlugs.has(p.slug));

  return (
    <>
      <style>{`
        .la-card { transition: border-color 0.2s ease; }
        .la-card:hover { border-color: #2a2a2a !important; }
        .la-conn-card { transition: background 0.15s ease; }
        .la-conn-card:hover { background: rgba(255,255,255,0.04) !important; }

        @media (max-width: 768px) {
          .la-page-nav, .la-hero, .la-content {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .la-lessons-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0a0a0a",
          color: "#e8e8e8",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* ── NAVBAR ── */}
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
          <Link href="/" style={{ color: "#555", textDecoration: "none", fontSize: 14 }}>
            ← back
          </Link>
          <a
            href="https://github.com/nilaycry"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#555", textDecoration: "none", fontSize: 14 }}
          >
            github
          </a>
        </nav>

        {/* ── HERO ── */}
        <section
          className="la-hero"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px 72px" }}
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
            linear algebra
          </span>

          <h1
            style={{
              fontSize: 38,
              fontWeight: 500,
              lineHeight: 1.2,
              color: "#e8e8e8",
              margin: "0 0 32px 0",
              maxWidth: 560,
              letterSpacing: "-0.01em",
            }}
          >
            the basics look boring until they don&apos;t
          </h1>

          <div style={{ maxWidth: 580 }}>
            <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.8, color: "#666", margin: "0 0 18px 0" }}>
              the first semester of linear algebra is mostly procedures. row
              reduction, matrix multiplication, determinants. you follow the steps,
              you get the answer, you move on. nothing about it suggests that any of
              it is connected, or that any of it is beautiful.
            </p>
            <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.8, color: "#666", margin: "0 0 18px 0" }}>
              then things start clicking, usually slowly and out of order. and when
              they do, you realize the subject goes a lot deeper than the first course
              let on. the same idea keeps showing up in different clothes and you
              start to feel like you&apos;ve been missing something the whole time.
            </p>
            <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.8, color: "#555", margin: 0 }}>
              I get genuinely uncomfortable when I know I&apos;ve been computing
              something correctly without understanding it. that feeling shows up
              a lot in linear algebra. these are the places where I finally got it.
            </p>
          </div>
        </section>

        <div className="la-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 120px" }}>

          {/* ── LESSONS ── */}
          <section style={{ marginBottom: 80 }}>
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 48, marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontWeight: 400, color: "#555", textTransform: "uppercase", letterSpacing: "0.14em" }}>
                lessons
              </span>
            </div>

            <div
              className="la-lessons-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}
            >
              {laLessons.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/lessons/${lesson.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="la-card"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.025)",
                      border: "0.5px solid #1e1e1e",
                      borderTop: `2px solid ${lesson.accent}33`,
                      borderRadius: 12,
                      padding: "20px 24px",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: lesson.accent,
                        opacity: 0.7,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        display: "block",
                        marginBottom: 10,
                      }}
                    >
                      {lesson.displayTag}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 500, color: "#e8e8e8", display: "block", marginBottom: 8, lineHeight: 1.3 }}>
                      {lesson.title}
                    </span>
                    <span style={{ fontSize: 13, color: "#666", lineHeight: 1.5, display: "block" }}>
                      {lesson.description}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CONNECTIONS ── */}
          <section>
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 48, marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 400, color: "#555", textTransform: "uppercase", letterSpacing: "0.14em", display: "block", marginBottom: 12 }}>
                connections
              </span>
              <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, margin: "0 0 32px 0", maxWidth: 480 }}>
                shorter notes on why two things that look different are secretly the same,
                or why something that seemed obvious is actually subtle.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {liveConnections.map((conn) => (
                <Link key={conn.slug} href={`/lessons/${conn.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div
                    className="la-conn-card"
                    style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #141414", cursor: "pointer" }}
                  >
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 400, color: "#c8c8c8", display: "block", marginBottom: 3 }}>
                        {conn.title}
                      </span>
                      <span style={{ fontSize: 12, color: "#3a3a3a", lineHeight: 1.5 }}>
                        {conn.description}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {stillPlanned.map((conn) => (
                <div
                  key={conn.slug}
                  className="la-conn-card"
                  style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #141414" }}
                >
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 400, color: "#444", display: "block", marginBottom: 3 }}>
                      {conn.title}
                    </span>
                    <span style={{ fontSize: 12, color: "#3a3a3a", lineHeight: 1.5 }}>
                      {conn.description}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: "#333", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0, marginLeft: 24 }}>
                    soon
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
