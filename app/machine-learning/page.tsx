"use client";

import Link from "next/link";

const mlLessons = [
  {
    slug: "gradient-descent",
    tag: "optimization",
    title: "which way is downhill",
    description: "the geometry behind how machines learn",
    accent: "#5DCAA5",
  },
  {
    slug: "backpropagation",
    tag: "gradients",
    title: "the chain rule on a graph",
    description: "how neural networks actually compute gradients",
    accent: "#B44FD0",
  },
];

export default function MachineLearningPage() {
  return (
    <>
      <style>{`
        .ml-card { transition: border-color 0.2s ease; }
        .ml-card:hover { border-color: #2a2a2a !important; }

        @media (max-width: 768px) {
          .ml-page-nav, .ml-hero, .ml-content {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .ml-lessons-grid {
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
            style={{ color: "#555", textDecoration: "none", fontSize: 14 }}
          >
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
          className="ml-hero"
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
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.8,
                color: "#666",
                margin: "0 0 18px 0",
              }}
            >
              I spent a lot of time in my ML course confused about gradient descent.
              not because the update rule was hard to implement, but because I wanted
              to know what it was actually doing. where is it stepping? what does the
              loss surface look like? why does the learning rate matter so much? the
              lectures moved past it fast and I kept getting stuck.
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.8,
                color: "#666",
                margin: "0 0 18px 0",
              }}
            >
              same with backpropagation. everyone says it&apos;s just the chain rule.
              that&apos;s true, but it didn&apos;t help me until I saw the computation graph
              and watched the gradients flow backward through it.
            </p>
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.8,
                color: "#555",
                margin: 0,
              }}
            >
              these are the pictures I wish I&apos;d had earlier.
            </p>
          </div>
        </section>

        {/* ── LESSONS ── */}
        <div
          className="ml-content"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 120px" }}
        >
          <div
            style={{
              borderTop: "1px solid #1a1a1a",
              paddingTop: 48,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              lessons
            </span>
          </div>

          <div
            className="ml-lessons-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {mlLessons.map((lesson) => (
              <Link
                key={lesson.slug}
                href={`/lessons/${lesson.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="ml-card"
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
        </div>
      </div>
    </>
  );
}
