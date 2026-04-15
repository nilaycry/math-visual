"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const HeroSketch = dynamic(
  () => import("@/components/sketches/HeroSketch"),
  { ssr: false }
);

const lessonCards = [
  {
    slug: "fourier-series",
    tag: "analysis",
    title: "Fourier series",
    description: "any shape, if you're patient enough with circles",
    accent: "#7F77DD",
  },
  {
    slug: "gradient-descent",
    tag: "optimization",
    title: "which way is downhill",
    description: "the geometry behind how machines learn",
    accent: "#5DCAA5",
  },
  {
    slug: "eigen",
    tag: "linear algebra",
    title: "the directions a matrix can't change",
    description: "what a matrix actually does to space",
    accent: "#D85A30",
  },
];

export default function HomePage() {
  return (
    <>
      {/*
        The global layout injects a fixed navbar (64px) with pt-16 on <main>,
        plus a footer. We counteract both here so the page owns its full viewport.
      */}
      <style>{`
        /* Card hover */
        .lcard { transition: border-color 0.2s ease, border-top-color 0.2s ease; }
        .lcard:hover { border-color: #2a2a2a !important; }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section {
            flex-direction: column !important;
            padding-top: 48px !important;
            gap: 40px !important;
          }
          .hero-canvas-col { display: none !important; }
          .lessons-grid-3 {
            grid-template-columns: 1fr !important;
          }
          .page-nav, .hero-section, .lessons-section {
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
              href="#lessons"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("lessons")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                color: "#555",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              lessons
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
              notes on the math I keep coming back to — written in way I think about it, not the way it&apos;s usually taught. half teaching, half making sure I really get it
            </p>

            <a
              href="#lessons"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("lessons")
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
              see the lessons ↓
            </a>
          </div>

          {/* Right — canvas */}
          <div className="hero-canvas-col" style={{ flexShrink: 0 }}>
            <HeroSketch />
          </div>
        </section>

        {/* ── LESSONS GRID ── */}
        <section
          id="lessons"
          className="lessons-section"
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
            lessons
          </span>

          <div
            className="lessons-grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {lessonCards.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/lessons/${lesson.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="lcard"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.025)",
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
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 10,
                    }}
                  >
                    {lesson.tag}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "#e8e8e8",
                      display: "block",
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}
                  >
                    {lesson.title}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      color: "#666",
                      lineHeight: 1.5,
                      display: "block",
                    }}
                  >
                    {lesson.description}
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
