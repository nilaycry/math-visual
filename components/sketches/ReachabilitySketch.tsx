"use client";

import { useState } from "react";

function sx(x: number) {
  return 330 + x * 72;
}

function sy(y: number) {
  return 220 - y * 72;
}

export default function ReachabilitySketch() {
  const [a, setA] = useState(1.6);
  const [b, setB] = useState(0.7);
  const [c, setC] = useState(0.5);
  const [d, setD] = useState(1.2);
  const [targetX, setTargetX] = useState(2.1);
  const [targetY, setTargetY] = useState(1.3);
  const det = a * d - b * c;
  const singular = Math.abs(det) < 0.12;
  const col1 = { x: a, y: c };
  const col2 = { x: b, y: d };
  const distToLine = Math.abs(col1.y * targetX - col1.x * targetY) / Math.max(0.001, Math.hypot(col1.x, col1.y));
  const reachable = !singular || distToLine < 0.08;

  const sliders = [
    ["a", a, setA],
    ["b", b, setB],
    ["c", c, setC],
    ["d", d, setD],
  ] as const;

  return (
    <div className="space-y-5">
      <div className="sketch-wrap">
        <svg viewBox="0 0 660 440" role="img" aria-label="column space and reachable outputs">
          <rect width="660" height="440" fill="#0d1117" />
          {Array.from({ length: 9 }, (_, i) => i - 4).map((k) => (
            <g key={k}>
              <line x1={sx(k)} y1="0" x2={sx(k)} y2="440" stroke="#242933" />
              <line x1="0" y1={sy(k)} x2="660" y2={sy(k)} stroke="#242933" />
            </g>
          ))}
          <line x1="0" y1={sy(0)} x2="660" y2={sy(0)} stroke="#555" />
          <line x1={sx(0)} y1="0" x2={sx(0)} y2="440" stroke="#555" />

          <defs>
            <marker id="arrow-reach-teal" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#5dcaa5" />
            </marker>
            <marker id="arrow-reach-orange" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#f0a500" />
            </marker>
          </defs>

          {!singular ? (
            <rect x="0" y="0" width="660" height="440" fill="#5b8dd9" opacity="0.08" />
          ) : (
            <line
              x1={sx(-4 * col1.x)}
              y1={sy(-4 * col1.y)}
              x2={sx(4 * col1.x)}
              y2={sy(4 * col1.y)}
              stroke="#5b8dd9"
              strokeWidth="6"
              strokeOpacity="0.45"
            />
          )}

          <line x1={sx(0)} y1={sy(0)} x2={sx(col1.x)} y2={sy(col1.y)} stroke="#5dcaa5" strokeWidth="4" markerEnd="url(#arrow-reach-teal)" />
          <line x1={sx(0)} y1={sy(0)} x2={sx(col2.x)} y2={sy(col2.y)} stroke="#f0a500" strokeWidth="4" markerEnd="url(#arrow-reach-orange)" />
          <circle cx={sx(targetX)} cy={sy(targetY)} r="7" fill={reachable ? "#5dcaa5" : "#ff6b6b"} />

          <text x="24" y="34" fill="#9aa4b2" fontSize="13" fontFamily="monospace">
            b = ({targetX.toFixed(1)}, {targetY.toFixed(1)})
          </text>
          <text x="24" y="56" fill={reachable ? "#5dcaa5" : "#ff9a9a"} fontSize="12">
            {reachable ? "b is reachable as Ax" : "b is outside the column space"}
          </text>
          <text x={sx(col1.x) + 8} y={sy(col1.y) - 8} fill="#5dcaa5" fontSize="13">
            col 1
          </text>
          <text x={sx(col2.x) + 8} y={sy(col2.y) + 18} fill="#f0a500" fontSize="13">
            col 2
          </text>
        </svg>
      </div>

      <div className="sketch-controls" style={{ flexWrap: "wrap" }}>
        {sliders.map(([label, value, setter]) => (
          <div key={label} className="sketch-slider-row" style={{ flex: 1, minWidth: 120 }}>
            <div className="sketch-slider-header">
              <span className="sketch-label">{label}</span>
              <span className="sketch-value">{value.toFixed(1)}</span>
            </div>
            <input type="range" min="-2" max="2" step="0.1" value={value} onChange={(e) => setter(Number(e.target.value))} className="sketch-range" />
          </div>
        ))}
        <div className="sketch-slider-row" style={{ flex: 1, minWidth: 150 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">target x</span>
            <span className="sketch-value">{targetX.toFixed(1)}</span>
          </div>
          <input type="range" min="-3" max="3" step="0.1" value={targetX} onChange={(e) => setTargetX(Number(e.target.value))} className="sketch-range" />
        </div>
        <div className="sketch-slider-row" style={{ flex: 1, minWidth: 150 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">target y</span>
            <span className="sketch-value">{targetY.toFixed(1)}</span>
          </div>
          <input type="range" min="-3" max="3" step="0.1" value={targetY} onChange={(e) => setTargetY(Number(e.target.value))} className="sketch-range" />
        </div>
      </div>
    </div>
  );
}
