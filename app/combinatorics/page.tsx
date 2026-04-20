import Link from "next/link";
import { getAllNotes } from "@/lib/notes";

const COURSE = "combinatorics";

const BG = "#f7f4ef";
const FG = "#1c1917";
const MUTED = "#78716c";
const FAINT = "#a8a29e";
const BORDER = "#e8e5df";
const ACCENT = "#b85c1a";

export default function CombinatoricsPage() {
  const allNotes = getAllNotes(COURSE);
  const companions = allNotes.filter((n) => n.week < 1);
  const sequence = allNotes.filter((n) => n.week >= 1);

  return (
    <>
      <style>{`
        .co-note-row { transition: background 0.15s ease; }
        .co-note-row:hover { background: rgba(0,0,0,0.03) !important; }
        .co-companion-card { transition: background 0.15s ease; }
        .co-companion-card:hover { background: rgba(0,0,0,0.04) !important; }

        @media (max-width: 768px) {
          .co-page-nav, .co-hero, .co-content {
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
        <nav
          className="co-page-nav"
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

        {/* ── HERO ── */}
        <section
          className="co-hero"
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
            intro to combinatorics · math 413
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
            counting, but the kind that tells you something
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
              combinatorics starts with counting. but the interesting part is never
              really the count itself. it&apos;s that the count reveals structure:
              a bijection you didn&apos;t expect, a recurrence hiding in a tiling
              problem, a generating function that makes an impossible sum routine.
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
              the notes run through the main ideas: counting principles, binomial
              coefficients, inclusion-exclusion, generating functions, recurrences,
              graph theory. the arguments are rigorous, but I try to be honest about
              when something was surprising.
            </p>
          </div>
        </section>

        {/* ── COMPANIONS ── */}
        {companions.length > 0 && (
          <div
            className="co-content"
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
                  href={`/combinatorics/${note.slug}`}
                  style={{ textDecoration: "none", color: "inherit", flex: "1 1 260px", maxWidth: 360 }}
                >
                  <div
                    className="co-companion-card"
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
          className="co-content"
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
                  href={`/combinatorics/${note.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="co-note-row"
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
