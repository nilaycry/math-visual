"use client";

import { useState, useEffect, useRef } from "react";
import p5 from "p5";

type Mode = "original" | "matrix" | "tanh";

export default function NonLinearSketch() {
  const [mode, setMode] = useState<Mode>("original");
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    while (el.firstChild) el.removeChild(el.firstChild);

    const timer = setTimeout(() => {
      if (cancelled || !el) return;
      if (p5Ref.current) { p5Ref.current.remove(); p5Ref.current = null; }

      p5Ref.current = new p5((p: p5) => {
        const W = el.clientWidth || 800;
        const H = Math.round(W * 0.56); // ~16:9
        const CX = W / 2;
        const CY = H / 2;

        // Scale: how many pixels per math unit
        // Show roughly -5 to +5 horizontally
        const UNIT = W / 10;

        let tMatrix = 0;
        let tTanh = 0;

        // Matrix A — shear + stretch
        const A = [
          [1.3, 0.5],
          [0.4, 1.2]
        ];

        // Data points: inner cluster (red) + outer ring (blue)
        const points: { x: number; y: number; isRed: boolean }[] = [];

        // Apply the 3-stage transform
        const transform = (x: number, y: number, mT: number, tT: number): [number, number] => {
          // Stage 1→2: identity → matrix A
          const ax = p.lerp(x, A[0][0] * x + A[0][1] * y, mT);
          const ay = p.lerp(y, A[1][0] * x + A[1][1] * y, mT);

          // Stage 2→3: linear → tanh
          const fx = Math.tanh(ax);
          const fy = Math.tanh(ay);

          return [
            p.lerp(ax, fx * 3, tT),
            p.lerp(ay, fy * 3, tT)
          ];
        };

        // Convert math coords to screen
        const toScreen = (mx: number, my: number): [number, number] => {
          return [CX + mx * UNIT, CY - my * UNIT];
        };

        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Space Grotesk");

          for (let i = 0; i < 300; i++) {
            const r = p.random(0, 4);
            const theta = p.random(0, p.TWO_PI);
            if (r > 1.5 && r < 2.0) continue;
            points.push({
              x: r * Math.cos(theta),
              y: r * Math.sin(theta),
              isRed: r <= 1.5
            });
          }
        };

        // Draw a transformed grid line as a smooth curve
        const drawGridCurve = (
          fixed: number,
          axis: "x" | "y",
          from: number,
          to: number,
          mT: number,
          tT: number
        ) => {
          p.beginShape();
          const steps = 80;
          for (let i = 0; i <= steps; i++) {
            const t = from + (to - from) * (i / steps);
            const [mx, my] = axis === "x"
              ? transform(fixed, t, mT, tT)
              : transform(t, fixed, mT, tT);
            const [sx, sy] = toScreen(mx, my);
            p.vertex(sx, sy);
          }
          p.endShape();
        };

        // Draw an arrow
        const drawArrow = (
          x1: number, y1: number, x2: number, y2: number,
          headLen: number = 10
        ) => {
          p.line(x1, y1, x2, y2);
          const angle = Math.atan2(y2 - y1, x2 - x1);
          p.line(x2, y2,
            x2 - headLen * Math.cos(angle - Math.PI / 6),
            y2 - headLen * Math.sin(angle - Math.PI / 6));
          p.line(x2, y2,
            x2 - headLen * Math.cos(angle + Math.PI / 6),
            y2 - headLen * Math.sin(angle + Math.PI / 6));
        };

        p.draw = () => {
          // Dark background
          p.background(10, 12, 18);

          // Compute targets
          let targetMatrix = 0;
          let targetTanh = 0;
          if (modeRef.current === "matrix") {
            targetMatrix = 1; targetTanh = 0;
          } else if (modeRef.current === "tanh") {
            targetMatrix = 1; targetTanh = 1;
          }

          tMatrix = p.lerp(tMatrix, targetMatrix, 0.06);
          tTanh = p.lerp(tTanh, targetTanh, 0.06);

          const done = Math.abs(tMatrix - targetMatrix) < 0.001
                    && Math.abs(tTanh - targetTanh) < 0.001;
          if (done) {
            tMatrix = targetMatrix;
            tTanh = targetTanh;
            p.noLoop();
          } else {
            p.loop();
          }

          const mT = tMatrix;
          const tT = tTanh;

          // ── Grid lines (3b1b style: subtle blue) ──
          p.noFill();
          p.strokeWeight(1);

          // Secondary grid lines (every 1 unit)
          p.stroke(30, 50, 80, 100);
          for (let i = -5; i <= 5; i++) {
            if (i === 0) continue; // skip axes
            drawGridCurve(i, "x", -5, 5, mT, tT); // vertical lines (fixed x)
            drawGridCurve(i, "y", -5, 5, mT, tT); // horizontal lines (fixed y)
          }

          // ── Axes (brighter, thicker) ──
          p.stroke(80, 100, 130);
          p.strokeWeight(2);
          drawGridCurve(0, "x", -6, 6, mT, tT); // y-axis (x=0 line)
          drawGridCurve(0, "y", -6, 6, mT, tT); // x-axis (y=0 line)

          // ── Basis vectors (3b1b: green = î, red = ĵ) ──
          p.strokeWeight(3);

          // î (1,0) — green
          const [i0x, i0y] = toScreen(...transform(0, 0, mT, tT));
          const [i1x, i1y] = toScreen(...transform(1, 0, mT, tT));
          p.stroke(100, 230, 100);
          drawArrow(i0x, i0y, i1x, i1y, 12);

          // ĵ (0,1) — red/crimson
          const [j1x, j1y] = toScreen(...transform(0, 1, mT, tT));
          p.stroke(230, 80, 80);
          drawArrow(i0x, i0y, j1x, j1y, 12);

          // ── Unit square / parallelogram ──
          const [p00x, p00y] = toScreen(...transform(0, 0, mT, tT));

          // Fill the unit parallelogram with semi-transparent yellow
          p.fill(255, 230, 80, 18);
          p.stroke(255, 230, 80, 50);
          p.strokeWeight(1);
          p.beginShape();
          p.vertex(p00x, p00y);
          // Trace the edges as curves for tanh warping
          const edgeSteps = 30;
          // Bottom edge: (0,0) → (1,0)
          for (let s = 1; s <= edgeSteps; s++) {
            const [ex, ey] = toScreen(...transform(s / edgeSteps, 0, mT, tT));
            p.vertex(ex, ey);
          }
          // Right edge: (1,0) → (1,1)
          for (let s = 1; s <= edgeSteps; s++) {
            const [ex, ey] = toScreen(...transform(1, s / edgeSteps, mT, tT));
            p.vertex(ex, ey);
          }
          // Top edge: (1,1) → (0,1)
          for (let s = 1; s <= edgeSteps; s++) {
            const [ex, ey] = toScreen(...transform(1 - s / edgeSteps, 1, mT, tT));
            p.vertex(ex, ey);
          }
          // Left edge: (0,1) → (0,0)
          for (let s = 1; s <= edgeSteps; s++) {
            const [ex, ey] = toScreen(...transform(0, 1 - s / edgeSteps, mT, tT));
            p.vertex(ex, ey);
          }
          p.endShape(p.CLOSE);

          // ── Data points ──
          p.noStroke();
          for (const pt of points) {
            const [tx, ty] = transform(pt.x, pt.y, mT, tT);
            const [sx, sy] = toScreen(tx, ty);
            // Skip points outside canvas
            if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;
            if (pt.isRed) {
              p.fill(255, 80, 160, 200);
            } else {
              p.fill(80, 140, 220, 160);
            }
            p.circle(sx, sy, 5);
          }

          // ── Readout ──
          p.push();
          p.fill(180);
          p.noStroke();
          p.textSize(13);
          p.textAlign(p.LEFT, p.TOP);
          const labels: Record<Mode, string> = {
            original: "y = x",
            matrix: "y = A·x",
            tanh: "y = tanh(A·x)",
          };
          p.text(labels[modeRef.current], 14, 14);

          // Show basis vector labels near tips
          p.textSize(11);
          p.fill(100, 230, 100);
          p.text("î", i1x + 8, i1y - 4);
          p.fill(230, 80, 80);
          p.text("ĵ", j1x + 8, j1y - 4);
          p.pop();
        };
      }, el);
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (p5Ref.current) { p5Ref.current.remove(); p5Ref.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setModeAndLoop = (m: Mode) => {
    setMode(m);
    setTimeout(() => p5Ref.current?.loop(), 0);
  };

  return (
    <div>
      <div className="sketch-wrap">
        <div ref={containerRef} style={{ width: "100%" }} />
      </div>

      <div className="sketch-controls" style={{ marginTop: 14 }}>
        <button
          id="nonlinear-original"
          onClick={() => setModeAndLoop("original")}
          className={`sketch-btn ${mode === "original" ? "sketch-btn-active" : ""}`}
        >
          original space
        </button>
        <button
          id="nonlinear-matrix"
          onClick={() => setModeAndLoop("matrix")}
          className={`sketch-btn ${mode === "matrix" ? "sketch-btn-active" : ""}`}
        >
          matrix A
        </button>
        <button
          id="nonlinear-tanh"
          onClick={() => setModeAndLoop("tanh")}
          className={`sketch-btn ${mode === "tanh" ? "sketch-btn-active" : ""}`}
        >
          tanh
        </button>
      </div>
    </div>
  );
}
