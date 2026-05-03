import Link from "next/link";
import { getAllNotes } from "@/lib/notes";

const COURSE = "real-analysis";

const BG = "#f7f4ef";
const FG = "#1c1917";
const MUTED = "#78716c";
const FAINT = "#a8a29e";
const BORDER = "#e8e5df";
const ACCENT = "#9a4f3d";

export default function RealAnalysisPage() {
  const allNotes = getAllNotes(COURSE);
  const companions = allNotes.filter((n) => n.week < 1);
  const sequence = allNotes.filter((n) => n.week >= 1);

  return (
    <>
      <style>{`
        .ra-note-row { transition: background 0.15s ease; }
        .ra-note-row:hover { background: rgba(0,0,0,0.03) !important; }
        .ra-companion-card:hover { background: rgba(0,0,0,0.04) !important; }
        .nav-pill:hover {
          color: #1c1917 !important;
          border-color: rgba(0,0,0,0.15) !important;
          background: rgba(0,0,0,0.02);
        }

        @media (max-width: 768px) {
          .ra-page-nav, .ra-hero, .ra-content {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: BG,
          color: FG,
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            backgroundColor: "rgba(247, 244, 239, 0.85)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <nav
            className="ra-page-nav"
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
                color: FAINT,
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.06em",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 20,
                padding: "5px 14px",
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <span
                className="inline-block transition-transform duration-200 group-hover:-translate-x-1"
                style={{ marginRight: 4 }}
              >
                ←
              </span>
              back
            </Link>
            <a
              href="https://github.com/nilaycry"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-pill"
              style={{
                color: FAINT,
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.06em",
                border: "1px solid rgba(0,0,0,0.06)",
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
          className="ra-hero"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 48px 72px",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: ACCENT,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              display: "block",
              marginBottom: 20,
            }}
          >
            real analysis · notebook
          </span>

          <h1
            style={{
              fontSize: 38,
              fontWeight: 500,
              lineHeight: 1.2,
              color: FG,
              margin: "0 0 32px 0",
              maxWidth: 620,
              letterSpacing: "-0.01em",
            }}
          >
            where limits stop being pictures and start being logic
          </h1>

          <div style={{ maxWidth: 620 }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.8,
                color: MUTED,
                margin: "0 0 18px 0",
              }}
            >
              real analysis is the point where familiar objects like sequences,
              continuity, and derivatives have to survive exact definitions. the
              subject looks technical from the outside, but most of that technical
              work is really about learning what completeness, approximation, and
              limiting behavior are allowed to mean.
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.8,
                color: MUTED,
                margin: 0,
              }}
            >
              these notes are set up as a writing scaffold: orientation first, then
              short notes that can grow into sequences, limits, continuity, and
              convergence without changing the surrounding structure.
            </p>
          </div>
        </section>

        {companions.length > 0 && (
          <div
            className="ra-content"
            style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 56px" }}
          >
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                paddingTop: 48,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 400,
                  color: FAINT,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                }}
              >
                before you start
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {companions.map((note) => (
                <Link
                  key={note.slug}
                  href={`/real-analysis/${note.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    flex: "1 1 260px",
                    maxWidth: 360,
                  }}
                >
                  <div
                    className="ra-companion-card"
                    style={{
                      border: `1px solid ${BORDER}`,
                      borderRadius: 8,
                      padding: "18px 20px",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: FG,
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      {note.title}
                    </span>
                    <span style={{ fontSize: 12, color: FAINT, lineHeight: 1.6 }}>
                      {note.description}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div
          className="ra-content"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 120px" }}
        >
          <div
            style={{
              borderTop: `1px solid ${BORDER}`,
              paddingTop: 48,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: FAINT,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              notes
            </span>
          </div>

          {sequence.length === 0 ? (
            <p style={{ color: FAINT, fontSize: 14, marginTop: 24 }}>no notes yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sequence.map((note) => (
                <Link
                  key={note.slug}
                  href={`/real-analysis/${note.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="ra-note-row"
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      padding: "16px 0",
                      borderBottom: `1px solid ${BORDER}`,
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 400,
                          color: FG,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        {note.title}
                      </span>
                      <span style={{ fontSize: 13, color: FAINT, lineHeight: 1.5 }}>
                        {note.description}
                      </span>
                    </div>
                    {Number.isInteger(note.week) && (
                      <span
                        style={{
                          fontSize: 11,
                          color: FAINT,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          flexShrink: 0,
                          marginLeft: 24,
                        }}
                      >
                        week {note.week}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
