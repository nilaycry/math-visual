"use client";

import { useState } from "react";

function sx(x: number) {
  return 330 + x * 82;
}

function sy(y: number) {
  return 220 - y * 82;
}

export default function ProjectionSketch() {
  const [x, setX] = useState(1.7);
  const [y, setY] = useState(2.1);
  const theta = -0.45;
  const ux = Math.cos(theta);
  const uy = Math.sin(theta);
  const dot = x * ux + y * uy;
  const px = dot * ux;
  const py = dot * uy;

  return (
    <div className="space-y-5">
      <div className="sketch-wrap">
        <svg viewBox="0 0 660 440" role="img" aria-label="projection onto a line">
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
            <marker id="arrow-white" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#e8e8e8" />
            </marker>
            <marker id="arrow-teal-proj" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#5dcaa5" />
            </marker>
          </defs>

          <line
            x1={sx(-4 * ux)}
            y1={sy(-4 * uy)}
            x2={sx(4 * ux)}
            y2={sy(4 * uy)}
            stroke="#5b8dd9"
            strokeWidth="3"
            strokeOpacity="0.8"
          />
          <line
            x1={sx(0)}
            y1={sy(0)}
            x2={sx(x)}
            y2={sy(y)}
            stroke="#e8e8e8"
            strokeWidth="3"
            markerEnd="url(#arrow-white)"
          />
          <line
            x1={sx(0)}
            y1={sy(0)}
            x2={sx(px)}
            y2={sy(py)}
            stroke="#5dcaa5"
            strokeWidth="4"
            markerEnd="url(#arrow-teal-proj)"
          />
          <line
            x1={sx(px)}
            y1={sy(py)}
            x2={sx(x)}
            y2={sy(y)}
            stroke="#f0a500"
            strokeWidth="3"
            strokeDasharray="8 7"
          />

          <circle cx={sx(x)} cy={sy(y)} r="5" fill="#e8e8e8" />
          <circle cx={sx(px)} cy={sy(py)} r="5" fill="#5dcaa5" />
          <text x="24" y="34" fill="#9aa4b2" fontSize="13">
            residual = b - projection
          </text>
          <text x="24" y="56" fill="#f0a500" fontSize="12">
            the shortest error is perpendicular to the subspace
          </text>
          <text x={sx(px) + 10} y={sy(py) + 20} fill="#5dcaa5" fontSize="13">
            projection
          </text>
          <text x={sx((x + px) / 2) + 10} y={sy((y + py) / 2)} fill="#f0a500" fontSize="13">
            error
          </text>
        </svg>
      </div>

      <div className="sketch-controls" style={{ flexWrap: "wrap" }}>
        <div className="sketch-slider-row" style={{ flex: 1, minWidth: 180 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">b x-coordinate</span>
            <span className="sketch-value">{x.toFixed(1)}</span>
          </div>
          <input type="range" min="-3" max="3" step="0.1" value={x} onChange={(e) => setX(Number(e.target.value))} className="sketch-range" />
        </div>
        <div className="sketch-slider-row" style={{ flex: 1, minWidth: 180 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">b y-coordinate</span>
            <span className="sketch-value">{y.toFixed(1)}</span>
          </div>
          <input type="range" min="-3" max="3" step="0.1" value={y} onChange={(e) => setY(Number(e.target.value))} className="sketch-range" />
        </div>
      </div>
    </div>
  );
}
