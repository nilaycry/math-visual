"use client";

import { useMemo, useState } from "react";

function tx(a: number, b: number, c: number, d: number, x: number, y: number) {
  return { x: a * x + b * y, y: c * x + d * y };
}

function sx(x: number) {
  return 330 + x * 70;
}

function sy(y: number) {
  return 220 - y * 70;
}

export default function MatrixActionSketch() {
  const [a, setA] = useState(1.4);
  const [b, setB] = useState(0.7);
  const [c, setC] = useState(0.2);
  const [d, setD] = useState(1.0);

  const transformedGrid = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let k = -4; k <= 4; k++) {
      const p1 = tx(a, b, c, d, k, -3);
      const p2 = tx(a, b, c, d, k, 3);
      const q1 = tx(a, b, c, d, -4, k);
      const q2 = tx(a, b, c, d, 4, k);
      lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
      lines.push({ x1: q1.x, y1: q1.y, x2: q2.x, y2: q2.y });
    }
    return lines;
  }, [a, b, c, d]);

  const e1 = tx(a, b, c, d, 1, 0);
  const e2 = tx(a, b, c, d, 0, 1);
  const det = a * d - b * c;

  const sliders = [
    ["a", a, setA],
    ["b", b, setB],
    ["c", c, setC],
    ["d", d, setD],
  ] as const;

  return (
    <div className="space-y-5">
      <div className="sketch-wrap">
        <svg viewBox="0 0 660 440" role="img" aria-label="matrix action on a grid">
          <rect width="660" height="440" fill="#0d1117" />

          {Array.from({ length: 9 }, (_, i) => i - 4).map((k) => (
            <g key={k}>
              <line x1={sx(k)} y1={sy(-3)} x2={sx(k)} y2={sy(3)} stroke="#242933" strokeWidth="1" />
              <line x1={sx(-4)} y1={sy(k)} x2={sx(4)} y2={sy(k)} stroke="#242933" strokeWidth="1" />
            </g>
          ))}

          {transformedGrid.map((line, i) => (
            <line
              key={i}
              x1={sx(line.x1)}
              y1={sy(line.y1)}
              x2={sx(line.x2)}
              y2={sy(line.y2)}
              stroke="#5b8dd9"
              strokeOpacity="0.45"
              strokeWidth="1.4"
            />
          ))}

          <line x1="0" y1={sy(0)} x2="660" y2={sy(0)} stroke="#555" strokeWidth="1.4" />
          <line x1={sx(0)} y1="0" x2={sx(0)} y2="440" stroke="#555" strokeWidth="1.4" />

          <defs>
            <marker id="arrow-teal" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#5dcaa5" />
            </marker>
            <marker id="arrow-orange" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#f0a500" />
            </marker>
          </defs>

          <line
            x1={sx(0)}
            y1={sy(0)}
            x2={sx(e1.x)}
            y2={sy(e1.y)}
            stroke="#5dcaa5"
            strokeWidth="4"
            markerEnd="url(#arrow-teal)"
          />
          <line
            x1={sx(0)}
            y1={sy(0)}
            x2={sx(e2.x)}
            y2={sy(e2.y)}
            stroke="#f0a500"
            strokeWidth="4"
            markerEnd="url(#arrow-orange)"
          />

          <text x="24" y="34" fill="#9aa4b2" fontSize="13" fontFamily="monospace">
            A = [{a.toFixed(1)} {b.toFixed(1)}; {c.toFixed(1)} {d.toFixed(1)}]
          </text>
          <text x="24" y="56" fill={Math.abs(det) < 0.08 ? "#f0a500" : "#6f7785"} fontSize="12">
            det = {det.toFixed(2)}
          </text>
          <text x={sx(e1.x) + 10} y={sy(e1.y) - 8} fill="#5dcaa5" fontSize="13">
            col 1 = A e1
          </text>
          <text x={sx(e2.x) + 10} y={sy(e2.y) + 18} fill="#f0a500" fontSize="13">
            col 2 = A e2
          </text>
        </svg>
      </div>

      <div className="sketch-controls" style={{ flexWrap: "wrap" }}>
        {sliders.map(([label, value, setter]) => (
          <div key={label} className="sketch-slider-row" style={{ flex: 1, minWidth: 130 }}>
            <div className="sketch-slider-header">
              <span className="sketch-label">{label}</span>
              <span className="sketch-value">{value.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={value}
              onChange={(event) => setter(Number(event.target.value))}
              className="sketch-range"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
