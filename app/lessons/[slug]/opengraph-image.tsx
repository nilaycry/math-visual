import { ImageResponse } from "next/og";

// Edge runtime avoids the @vercel/og fileURLToPath issue on Windows
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OGData = { title: string; description: string; tag: string; accent: string };

// Inline table — update when adding new lessons
const LESSONS: Record<string, OGData> = {
  "eigen": {
    title: "the directions a matrix can't change",
    description: "what a matrix actually does to space",
    tag: "linear algebra",
    accent: "#D85A30",
  },
  "svd": {
    title: "rotate, stretch, rotate",
    description: "the three hidden steps inside every matrix",
    tag: "linear algebra",
    accent: "#5B8DD9",
  },
  "null-space": {
    title: "the directions a matrix destroys",
    description: "what the null space is and why it matters",
    tag: "linear algebra",
    accent: "#E05A7A",
  },
  "gradient-descent": {
    title: "which way is downhill",
    description: "the geometry behind how machines learn",
    tag: "optimization",
    accent: "#5DCAA5",
  },
  "backpropagation": {
    title: "the chain rule on a graph",
    description: "how neural networks actually compute gradients",
    tag: "calculus",
    accent: "#FF64A0",
  },
  "dot-product-and-matrix-multiplication": {
    title: "dot product is matrix multiplication",
    description: "or is it the other way round",
    tag: "linear algebra",
    accent: "#E8A020",
  },
};

const FALLBACK: OGData = {
  title: "math visual",
  description: "",
  tag: "math",
  accent: "#E8A020",
};

export default function Image({ params }: { params: { slug: string } }) {
  const d = LESSONS[params.slug] ?? FALLBACK;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Accent line */}
        <div
          style={{
            width: 52,
            height: 3,
            background: d.accent,
            marginBottom: 48,
            display: "flex",
          }}
        />

        {/* Tag */}
        <div
          style={{
            fontSize: 13,
            color: d.accent,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            marginBottom: 24,
            display: "flex",
          }}
        >
          {d.tag}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 500,
            color: "#e8e8e8",
            lineHeight: 1.15,
            marginBottom: 28,
            display: "flex",
            maxWidth: 900,
          }}
        >
          {d.title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: "#888",
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          {d.description}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "auto", display: "flex" }}>
          <div style={{ fontSize: 14, color: "#2a2a2a", display: "flex" }}>
            math · uiuc
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
