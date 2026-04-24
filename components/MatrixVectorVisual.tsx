import type { ReactNode } from "react";

const TEAL = "#5DCAA5";
const ORANGE = "#F0A500";
const BRACKET = "#555";
const DIM = "#444";
const MUTED = "#888";

function BracketLeft() {
  return (
    <div
      style={{
        alignSelf: "stretch",
        width: 10,
        borderLeft: `2px solid ${BRACKET}`,
        borderTop: `2px solid ${BRACKET}`,
        borderBottom: `2px solid ${BRACKET}`,
        borderRadius: "3px 0 0 3px",
        flexShrink: 0,
      }}
    />
  );
}

function BracketRight() {
  return (
    <div
      style={{
        alignSelf: "stretch",
        width: 10,
        borderRight: `2px solid ${BRACKET}`,
        borderTop: `2px solid ${BRACKET}`,
        borderBottom: `2px solid ${BRACKET}`,
        borderRadius: "0 3px 3px 0",
        flexShrink: 0,
      }}
    />
  );
}

function Matrix({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <BracketLeft />
        <div style={{ padding: "10px 18px" }}>{children}</div>
        <BracketRight />
      </div>
      <span
        style={{
          fontSize: 11,
          color: DIM,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontFamily: "monospace",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Op({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontSize: 20,
        color: DIM,
        fontFamily: "monospace",
        alignSelf: "center",
        paddingBottom: 24,
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

export default function MatrixVectorVisual() {
  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #1e1e1e",
        borderRadius: 12,
        padding: "28px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        overflowX: "auto",
      }}
    >
      {/* W — weight matrix */}
      <Matrix label="W  ·  2×3">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 24, color: TEAL, fontFamily: "monospace", fontSize: 14 }}>
            <span>w₁₁</span>
            <span>w₁₂</span>
            <span>w₁₃</span>
          </div>
          <div style={{ display: "flex", gap: 24, color: ORANGE, fontFamily: "monospace", fontSize: 14 }}>
            <span>w₂₁</span>
            <span>w₂₂</span>
            <span>w₂₃</span>
          </div>
        </div>
      </Matrix>

      <Op>×</Op>

      {/* x — input vector */}
      <Matrix label="x  ·  3×1">
        <div style={{ display: "flex", flexDirection: "column", gap: 14, color: MUTED, fontFamily: "monospace", fontSize: 14, alignItems: "center" }}>
          <span>x₁</span>
          <span>x₂</span>
          <span>x₃</span>
        </div>
      </Matrix>

      <Op>+</Op>

      {/* b — bias vector */}
      <Matrix label="b  ·  2×1">
        <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", fontSize: 14, alignItems: "center" }}>
          <span style={{ color: TEAL }}>b₁</span>
          <span style={{ color: ORANGE }}>b₂</span>
        </div>
      </Matrix>

      <Op>=</Op>

      {/* ŷ — output vector, expanded */}
      <Matrix label="ŷ  ·  2×1">
        <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "monospace", fontSize: 13 }}>
          <span style={{ color: TEAL }}>w₁₁x₁&nbsp;+&nbsp;w₁₂x₂&nbsp;+&nbsp;w₁₃x₃&nbsp;+&nbsp;b₁</span>
          <span style={{ color: ORANGE }}>w₂₁x₁&nbsp;+&nbsp;w₂₂x₂&nbsp;+&nbsp;w₂₃x₃&nbsp;+&nbsp;b₂</span>
        </div>
      </Matrix>
    </div>
  );
}
