"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const ConceptGraphSketch = dynamic(
  () => import("@/components/sketches/ConceptGraphSketch"),
  { ssr: false }
);

export default function GraphPage() {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .graph-nav, .graph-hero, .graph-body {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .graph-canvas-wrap {
            border-radius: 8px !important;
            overflow-x: auto;
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
          className="graph-nav"
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
          className="graph-hero"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 48px 28px",
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
              marginBottom: 16,
            }}
          >
            concept map
          </span>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 500,
              lineHeight: 1.2,
              color: "#e8e8e8",
              margin: "0 0 24px 0",
              letterSpacing: "-0.01em",
            }}
          >
            how the ideas connect
          </h1>

          <div style={{ maxWidth: 520 }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.8,
                color: "#666",
                margin: "0 0 14px 0",
              }}
            >
              each node is a lesson or a connection note. the lines are real
              relationships: zero eigenvalues live in the null space, the dot product
              and matrix multiplication are the same operation. I add edges as I notice them.
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
              the dimmer nodes are planned but not written yet. hover any node to
              see what it covers.
            </p>
          </div>

          <p style={{ fontSize: 13, color: "#444", margin: "20px 0 0 0", letterSpacing: "0.01em" }}>
            drag to rearrange · click any node to open
          </p>
        </section>

        {/* ── GRAPH ── */}
        <div
          className="graph-body"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 80px" }}
        >
          <div
            className="graph-canvas-wrap"
            style={{
              border: "0.5px solid #1e1e1e",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <ConceptGraphSketch />
          </div>

          {/* Legend */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 24,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1.5px solid rgba(255,255,255,0.18)",
                }}
              />
              <span style={{ fontSize: 12, color: "#444" }}>lesson</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1.5px dashed rgba(255,255,255,0.18)",
                }}
              />
              <span style={{ fontSize: 12, color: "#444" }}>connection</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
