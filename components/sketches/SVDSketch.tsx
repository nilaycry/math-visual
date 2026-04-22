"use client";

import { useState, useEffect, useRef } from "react";
import p5 from "p5";

export default function SVDSketch() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0.5);
  const [d, setD] = useState(1.5);
  const [showSteps, setShowSteps] = useState(false);
  const [showSingular, setShowSingular] = useState(true);

  const aRef = useRef(a);
  const bRef = useRef(b);
  const cRef = useRef(c);
  const dRef = useRef(d);
  const showStepsRef = useRef(showSteps);
  const showSingularRef = useRef(showSingular);
  aRef.current = a;
  bRef.current = b;
  cRef.current = c;
  dRef.current = d;
  showStepsRef.current = showSteps;
  showSingularRef.current = showSingular;

  const clickedVecRef = useRef<{ x: number; y: number } | null>(null);
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
        const W = 660;
        const H = 440;
        const SF = 75;

        const computeSVD = (ma: number, mb: number, mc: number, md: number) => {
          // Build AᵀA
          const pp = ma * ma + mc * mc;
          const qq = mb * mb + md * md;
          const r  = ma * mb + mc * md;

          const tr   = pp + qq;
          const det  = pp * qq - r * r;
          const disc = Math.sqrt(Math.max(0, (tr / 2) * (tr / 2) - det));

          const lam1 = tr / 2 + disc;
          const lam2 = Math.max(0, tr / 2 - disc);

          const sig1 = Math.sqrt(lam1);
          const sig2 = Math.sqrt(lam2);

          // Right singular vectors (eigenvectors of AᵀA)
          let v1x: number, v1y: number, v2x: number, v2y: number;
          if (Math.abs(r) > 1e-9) {
            v1x = r; v1y = lam1 - pp;
            // v2 is 90° rotation of v1 (orthogonal eigenvector of symmetric matrix)
            v2x = -v1y; v2y = v1x;
          } else if (pp >= qq) {
            v1x = 1; v1y = 0; v2x = 0; v2y = 1;
          } else {
            v1x = 0; v1y = 1; v2x = 1; v2y = 0;
          }

          const m1 = Math.sqrt(v1x * v1x + v1y * v1y);
          const m2 = Math.sqrt(v2x * v2x + v2y * v2y);
          if (m1 > 1e-12) { v1x /= m1; v1y /= m1; }
          if (m2 > 1e-12) { v2x /= m2; v2y /= m2; }

          // Left singular vectors: u = Av / σ
          let u1x = 0, u1y = 0, u2x = 0, u2y = 0;
          if (sig1 > 1e-9) {
            u1x = (ma * v1x + mb * v1y) / sig1;
            u1y = (mc * v1x + md * v1y) / sig1;
          }
          if (sig2 > 1e-9) {
            u2x = (ma * v2x + mb * v2y) / sig2;
            u2y = (mc * v2x + md * v2y) / sig2;
          }

          return { sig1, sig2, v1: [v1x, v1y], v2: [v2x, v2y], u1: [u1x, u1y], u2: [u2x, u2y] };
        };

        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Space Grotesk");
          p.noLoop();
        };

        p.mousePressed = () => {
          if (p.mouseX < 0 || p.mouseX > W || p.mouseY < 0 || p.mouseY > H) return;
          const mx = (p.mouseX - W / 2) / SF;
          const my = -(p.mouseY - H / 2) / SF;
          const mag = Math.sqrt(mx * mx + my * my);
          if (mag < 0.1) return;
          clickedVecRef.current = { x: mx / mag, y: my / mag };
          p.redraw();
        };

        const drawArrow = (
          ox: number, oy: number, tx: number, ty: number,
          col: string, weight: number, headSize: number
        ) => {
          p.stroke(col);
          p.strokeWeight(weight);
          p.line(ox, oy, tx, ty);
          const ang = p.atan2(ty - oy, tx - ox);
          p.fill(col);
          p.noStroke();
          p.push();
          p.translate(tx, ty);
          p.rotate(ang);
          p.triangle(0, 0, -headSize, -headSize * 0.4, -headSize, headSize * 0.4);
          p.pop();
        };

        p.draw = () => {
          p.background(13, 17, 23);
          p.translate(W / 2, H / 2);
          p.scale(1, -1);

          const ma = aRef.current;
          const mb = bRef.current;
          const mc = cRef.current;
          const md = dRef.current;
          const { sig1, sig2, v1, v2, u1, u2 } = computeSVD(ma, mb, mc, md);

          // Grid
          p.stroke(40);
          p.strokeWeight(0.5);
          for (let gx = -SF * 5; gx <= SF * 5; gx += SF) p.line(gx, -H / 2, gx, H / 2);
          for (let gy = -SF * 4; gy <= SF * 4; gy += SF) p.line(-W / 2, gy, W / 2, gy);

          // Axes
          p.stroke(80);
          p.strokeWeight(1.5);
          p.line(-W / 2, 0, W / 2, 0);
          p.line(0, -H / 2, 0, H / 2);

          // Axis labels
          p.fill(120);
          p.noStroke();
          p.textSize(11);
          for (let i = -4; i <= 4; i++) {
            if (i === 0) continue;
            p.push(); p.translate(i * SF, -15); p.scale(1, -1);
            p.textAlign(p.CENTER, p.TOP); p.text(i.toString(), 0, 0); p.pop();
          }
          for (let i = -3; i <= 3; i++) {
            if (i === 0) continue;
            p.push(); p.translate(-8, i * SF); p.scale(1, -1);
            p.textAlign(p.RIGHT, p.CENTER); p.text(i.toString(), 0, 0); p.pop();
          }

          // ── Σ STEP: axis-aligned intermediate ellipse ──
          if (showStepsRef.current) {
            p.noFill();
            p.stroke(80, 130, 200, 130);
            p.strokeWeight(1.5);
            (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 4]);
            p.ellipse(0, 0, sig1 * SF * 2, sig2 * SF * 2);
            (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

            // σ labels on intermediate ellipse axes
            p.push();
            p.translate(sig1 * SF + 6, 14);
            p.scale(1, -1);
            p.fill(80, 130, 200, 200);
            p.noStroke();
            p.textSize(11);
            p.textAlign(p.LEFT, p.CENTER);
            p.text(`σ₁ = ${sig1.toFixed(2)}`, 0, 0);
            p.pop();

            if (sig2 > 0.05) {
              p.push();
              p.translate(8, sig2 * SF + 14);
              p.scale(1, -1);
              p.fill(80, 130, 200, 200);
              p.noStroke();
              p.textSize(11);
              p.textAlign(p.LEFT, p.CENTER);
              p.text(`σ₂ = ${sig2.toFixed(2)}`, 0, 0);
              p.pop();
            }
          }

          // ── Unit circle (gray) ──
          p.noFill();
          p.stroke(110, 110, 110);
          p.strokeWeight(2);
          p.ellipse(0, 0, SF * 2, SF * 2);

          // ── Transformed ellipse (purple) ──
          p.stroke("#7F77DD");
          p.strokeWeight(2.5);
          p.noFill();
          p.beginShape();
          for (let i = 0; i <= 120; i++) {
            const angle = (i / 120) * p.TWO_PI;
            const ox = p.cos(angle);
            const oy = p.sin(angle);
            p.vertex((ma * ox + mb * oy) * SF, (mc * ox + md * oy) * SF);
          }
          p.endShape(p.CLOSE);

          // ── Singular vectors ──
          if (showSingularRef.current) {
            // Right singular vectors on unit circle (input)
            drawArrow(0, 0, v1[0] * SF, v1[1] * SF, "#F0A500", 2.5, 9);
            drawArrow(0, 0, v2[0] * SF, v2[1] * SF, "#5DCAA5", 2.5, 9);

            // v₁, v₂ labels
            p.push(); p.translate(v1[0] * SF + v1[0] * 16, v1[1] * SF + v1[1] * 16); p.scale(1, -1);
            p.fill("#F0A500"); p.noStroke(); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text("v₁", 0, 0); p.pop();
            p.push(); p.translate(v2[0] * SF + v2[0] * 16, v2[1] * SF + v2[1] * 16); p.scale(1, -1);
            p.fill("#5DCAA5"); p.noStroke(); p.textSize(12); p.textAlign(p.CENTER, p.CENTER); p.text("v₂", 0, 0); p.pop();

            // Left singular vectors scaled by σ (output)
            if (sig1 > 1e-9) {
              drawArrow(0, 0, u1[0] * sig1 * SF, u1[1] * sig1 * SF, "#F0A50088", 2, 8);
              p.push(); p.translate(u1[0] * sig1 * SF + u1[0] * 18, u1[1] * sig1 * SF + u1[1] * 18); p.scale(1, -1);
              p.fill("#F0A50099"); p.noStroke(); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.text("σ₁u₁", 0, 0); p.pop();
            }
            if (sig2 > 1e-9) {
              drawArrow(0, 0, u2[0] * sig2 * SF, u2[1] * sig2 * SF, "#5DCAA588", 2, 8);
              p.push(); p.translate(u2[0] * sig2 * SF + u2[0] * 18, u2[1] * sig2 * SF + u2[1] * 18); p.scale(1, -1);
              p.fill("#5DCAA599"); p.noStroke(); p.textSize(11); p.textAlign(p.CENTER, p.CENTER); p.text("σ₂u₂", 0, 0); p.pop();
            }
          }

          // ── Click vector ──
          if (clickedVecRef.current) {
            const vx = clickedVecRef.current.x;
            const vy = clickedVecRef.current.y;
            const tx = ma * vx + mb * vy;
            const ty = mc * vx + md * vy;
            const stretchMag = Math.sqrt(tx * tx + ty * ty);

            // Input (white)
            drawArrow(0, 0, vx * SF, vy * SF, "rgba(255,255,255,0.8)", 2, 8);

            // Output (pink)
            drawArrow(0, 0, tx * SF, ty * SF, "rgba(255,80,160,0.9)", 2.5, 9);

            p.push();
            p.translate(tx * SF + 14, ty * SF + 14);
            p.scale(1, -1);
            p.fill(255, 80, 160, 220);
            p.noStroke();
            p.textSize(11);
            p.textAlign(p.LEFT, p.CENTER);
            p.text(`|Av| = ${stretchMag.toFixed(2)}`, 0, 0);
            p.pop();
          }

          // ── Matrix label (top-right) ──
          p.push();
          p.translate(W / 2 - 14, H / 2 - 14);
          p.scale(1, -1);
          p.fill(220, 225, 240);
          p.noStroke();
          p.textSize(13);
          p.textAlign(p.RIGHT, p.TOP);
          p.textFont("JetBrains Mono");
          p.text(`A = [${ma.toFixed(1)}, ${mb.toFixed(1)}]`, 0, 0);
          p.text(`    [${mc.toFixed(1)}, ${md.toFixed(1)}]`, 0, 18);
          p.textFont("Space Grotesk");
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

  const handleChange = (setter: (v: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(parseFloat(e.target.value));
      setTimeout(() => p5Ref.current?.redraw(), 0);
    };

  const handlePreset = (vals: number[]) => {
    setA(vals[0]); setB(vals[1]); setC(vals[2]); setD(vals[3]);
    clickedVecRef.current = null;
    setTimeout(() => p5Ref.current?.redraw(), 0);
  };

  return (
    <div className="space-y-5">
      <div className="sketch-wrap" style={{ cursor: "crosshair" }}>
        <div ref={containerRef} />
      </div>

      {/* Matrix sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "a (row 1, col 1)", value: a, setter: setA, id: "svd-a" },
          { label: "b (row 1, col 2)", value: b, setter: setB, id: "svd-b" },
          { label: "c (row 2, col 1)", value: c, setter: setC, id: "svd-c" },
          { label: "d (row 2, col 2)", value: d, setter: setD, id: "svd-d" },
        ].map(({ label, value, setter, id }) => (
          <div key={id} className="rounded-xl bg-secondary/50 border border-border/50 p-4">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {label}
            </label>
            <input
              id={`${id}-slider`}
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={value}
              onChange={handleChange(setter)}
              className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-blue-500 to-violet-500 cursor-pointer accent-primary"
            />
            <div className="text-center mt-1">
              <span className="text-sm font-mono font-semibold text-primary">
                {value.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Toggles + Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col gap-3">
          <label className="block text-sm font-medium text-foreground">Options</label>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowSingular(v => !v); setTimeout(() => p5Ref.current?.redraw(), 0); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                showSingular
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {showSingular ? "✦ singular vectors" : "singular vectors"}
            </button>
            <button
              onClick={() => { setShowSteps(v => !v); setTimeout(() => p5Ref.current?.redraw(), 0); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                showSteps
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {showSteps ? "✦ Σ step" : "Σ step"}
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col justify-between">
          <label className="block text-sm font-medium text-foreground mb-2">Presets</label>
          <div className="flex gap-2">
            {[
              { label: "Shear",    vals: [2, 1, 0.5, 1.5] },
              { label: "Rotation", vals: [0, -1, 1, 0] },
              { label: "Scale",    vals: [3, 0, 0, 1] },
              { label: "Reflect",  vals: [0, 1, 1, 0] },
            ].map(({ label, vals }) => (
              <button
                key={label}
                onClick={() => handlePreset(vals)}
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary border border-border/50 transition-all"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
