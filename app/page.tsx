"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const HeroSketch = dynamic(
  () => import("@/components/sketches/HeroSketch"),
  { ssr: false }
);

const subjectAreas = [
  {
    href: "/linear-algebra",
    tag: "linear algebra",
    title: "the structure of space",
    description:
      "vectors, matrices, and transformations — and the connections between them that most courses never get to",
    accent: "#5B8DD9",
    count: 3,
  },
  {
    href: "/machine-learning",
    tag: "machine learning",
    title: "geometry underneath the learning",
    description:
      "gradient descent, backpropagation, and the math that actually drives how neural networks train",
    accent: "#5DCAA5",
    count: 2,
  },
];

export default function HomePage() {
  return (
    <>
      <style>{`
        .scard { transition: border-color 0.2s ease; }
        .scard:hover { border-color: #2a2a2a !important; }

        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column !important;
            padding-top: 48px !important;
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
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0a0a0a",
          color: "#e8e8e8",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* ── NAVBAR ── */}
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
            <a
              href="#explore"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("explore")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                color: "#555",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              explore
            </a>
            <a
              href="https://github.com/nilaycry"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#555",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              github
            </a>
          </div>
        </nav>

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
                fontSize: 42,
                fontWeight: 500,
                lineHeight: 1.15,
                color: "#e8e8e8",
                margin: "0 0 24px 0",
                maxWidth: 480,
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
                maxWidth: 420,
              }}
            >
              won&apos;t cover everything. might change how you see some of it.
            </p>

            <a
              href="#explore"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("explore")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                color: "#7F77DD",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 400,
                cursor: "pointer",
              }}
            >
              explore ↓
            </a>
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
          <span
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: "#555",
              textTransform: "uppercase" as const,
              letterSpacing: "0.14em",
              display: "block",
              marginBottom: 32,
            }}
          >
            topics
          </span>

          <div
            className="subjects-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            {subjectAreas.map((subject) => (
              <Link
                key={subject.href}
                href={subject.href}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="scard"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.025)",
                    border: "0.5px solid #1e1e1e",
                    borderTop: `2px solid ${subject.accent}33`,
                    borderRadius: 12,
                    padding: "28px 28px 24px",
                    cursor: "pointer",
                    height: "100%",
                    boxSizing: "border-box" as const,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: subject.accent,
                        opacity: 0.7,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {subject.tag}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#333",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {subject.count} {subject.count === 1 ? "lesson" : "lessons"}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 500,
                      color: "#e8e8e8",
                      display: "block",
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}
                  >
                    {subject.title}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      color: "#555",
                      lineHeight: 1.6,
                      display: "block",
                    }}
                  >
                    {subject.description}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
