import Link from "next/link";
import { getAllNotes } from "@/lib/notes";

const BG = "#f7f4ef";
const FG = "#1c1917";
const MUTED = "#78716c";
const FAINT = "#a8a29e";
const BORDER = "#e8e5df";
const ACCENT = "#6d4fc2";

export default function AbstractAlgebraPage() {
  const allNotes = getAllNotes();
  const companions = allNotes.filter((n) => n.week < 1);
  const sequence = allNotes.filter((n) => n.week >= 1);

  return (
    <>
      <style>{`
        .aa-note-row { transition: background 0.15s ease; }
        .aa-note-row:hover { background: rgba(0,0,0,0.03) !important; }
        .aa-companion-card { transition: background 0.15s ease; }
        .aa-companion-card:hover { background: rgba(0,0,0,0.04) !important; }

        @media (max-width: 768px) {
          .aa-page-nav, .aa-hero, .aa-content {
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
        {/* ── NAVBAR ── */}
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
            className="aa-page-nav"
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
              style={{ color: FAINT, textDecoration: "none", fontSize: 14 }}
            >
              ← back
            </Link>
            <a
              href="https://github.com/nilaycry"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: FAINT, textDecoration: "none", fontSize: 14 }}
            >
              github
            </a>
          </nav>
        </div>

        {/* ── HERO ── */}
        <section
          className="aa-hero"
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
            abstract linear algebra · math 416
          </span>

          <h1
            style={{
              fontSize: 38,
              fontWeight: 500,
              lineHeight: 1.2,
              color: FG,
              margin: "0 0 32px 0",
              maxWidth: 560,
              letterSpacing: "-0.01em",
            }}
          >
            the same ideas, built from scratch
          </h1>

          <div style={{ maxWidth: 580 }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.8,
                color: MUTED,
                margin: "0 0 18px 0",
              }}
            >
              concrete linear algebra tells you how to compute. abstract linear
              algebra asks why those computations work, and what the bare minimum
              structure you need for them to work is.
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
              the notes run one definition at a time, from vector spaces to the
              spectral theorem. the definitions are rigorous, but I try to be honest
              about what&apos;s hard. some of this took me a while to actually believe.
            </p>
          </div>
        </section>

        {/* ── COMPANIONS ── */}
        {companions.length > 0 && (
          <div
            className="aa-content"
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
                  href={`/abstract-linear-algebra/${note.slug}`}
                  style={{ textDecoration: "none", color: "inherit", flex: "1 1 260px", maxWidth: 360 }}
                >
                  <div
                    className="aa-companion-card"
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

        {/* ── SEQUENCE NOTES ── */}
        <div
          className="aa-content"
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
                  href={`/abstract-linear-algebra/${note.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="aa-note-row"
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
                      <span
                        style={{ fontSize: 13, color: FAINT, lineHeight: 1.5 }}
                      >
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
