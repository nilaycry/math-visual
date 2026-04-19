import Link from "next/link";
import { getAllNotes } from "@/lib/notes";

const BG = "#f7f4ef";
const FG = "#1c1917";
const MUTED = "#78716c";
const FAINT = "#a8a29e";
const BORDER = "#e8e5df";
const ACCENT = "#6d4fc2";

export default function AbstractAlgebraPage() {
  const notes = getAllNotes();

  return (
    <>
      <style>{`
        .aa-note-row { transition: background 0.15s ease; }
        .aa-note-row:hover { background: rgba(0,0,0,0.03) !important; }

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
              algebra asks why those computations work, and what the minimum structure
              needed to make them work actually is.
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.8,
                color: MUTED,
                margin: "0 0 18px 0",
              }}
            >
              the notes assume you&apos;ve seen vectors in &#8477;&#8319; and know how
              to multiply matrices. that background isn&apos;t needed to follow the
              definitions, but it gives you something concrete to test them against.
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.8,
                color: MUTED,
                margin: "0 0 18px 0",
              }}
            >
              these are course notes from math 416 at uiuc. rigorous definitions, but
              honest about what&apos;s hard and what took me a while to actually believe.
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.8,
                color: FAINT,
                margin: 0,
              }}
            >
              they&apos;re not a complete textbook. they&apos;re the notes I wish
              I&apos;d had the first time through.
            </p>
          </div>
        </section>

        {/* ── NOTES LIST ── */}
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

          {notes.length === 0 ? (
            <p style={{ color: FAINT, fontSize: 14, marginTop: 24 }}>no notes yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {notes.map((note) => (
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
