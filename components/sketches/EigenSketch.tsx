"use client";

import { useState, useEffect, useRef } from "react";
import p5 from "p5";

export default function EigenSketch() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(0);
  const [d, setD] = useState(1);
  const [showEigen, setShowEigen] = useState(true);

  const aRef = useRef(a);
  const bRef = useRef(b);
  const cRef = useRef(c);
  const dRef = useRef(d);
  const showEigenRef = useRef(showEigen);
  aRef.current = a;
  bRef.current = b;
  cRef.current = c;
  dRef.current = d;
  showEigenRef.current = showEigen;

  // Clicked vector on the unit circle (math coords, y-up)
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
        const SF = 80;

        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Inter");
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

        p.draw = () => {
          p.background(13, 17, 23);
          p.translate(W / 2, H / 2);
          p.scale(1, -1);

          const ma = aRef.current;
          const mb = bRef.current;
          const mc = cRef.current;
          const md = dRef.current;

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

          // Unit circle (gray)
          p.noFill();
          p.stroke(110, 110, 110);
          p.strokeWeight(2);
          p.ellipse(0, 0, SF * 2, SF * 2);

          // Transformed ellipse (purple)
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

          // Eigenvectors
          const tr = ma + md;
          const det = ma * md - mb * mc;
          const disc = tr * tr - 4 * det;

          if (showEigenRef.current) {
            if (disc >= 0) {
              const sq = Math.sqrt(disc);
              const l1 = (tr + sq) / 2;
              const l2 = (tr - sq) / 2;

              const getEv = (lambda: number) => {
                if (Math.abs(mb) > 1e-9) return [mb, lambda - ma];
                if (Math.abs(mc) > 1e-9) return [lambda - md, mc];
                return [1, 0];
              };

              const drawEv = (v: number[], col: string, lambda: number) => {
                const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
                if (mag < 1e-10) return;
                const nx = v[0] / mag;
                const ny = v[1] / mag;
                const tMax = Math.max(W, H);

                // Full dashed line across canvas
                p.stroke(col);
                p.strokeWeight(1);
                (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 6]);
                p.line(-nx * tMax, -ny * tMax, nx * tMax, ny * tMax);
                (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

                // Arrow
                const arrowLen = 110;
                const ax = nx * arrowLen;
                const ay = ny * arrowLen;
                p.stroke(col);
                p.strokeWeight(2.5);
                p.line(0, 0, ax, ay);
                const ang = p.atan2(ay, ax);
                p.fill(col);
                p.noStroke();
                p.push();
                p.translate(ax, ay);
                p.rotate(ang);
                p.triangle(0, 0, -10, -4, -10, 4);
                p.pop();

                // λ label
                p.push();
                p.translate(ax + nx * 18, ay + ny * 18);
                p.scale(1, -1);
                p.fill(col);
                p.noStroke();
                p.textSize(12);
                p.textAlign(p.CENTER, p.CENTER);
                p.text(`λ = ${lambda.toFixed(2)}`, 0, 0);
                p.pop();
              };

              drawEv(getEv(l1), "#F0A500", l1);
              drawEv(getEv(l2), "#5DCAA5", l2);
            } else {
              p.push();
              p.translate(10 - W / 2, 20 - H / 2);
              p.scale(1, -1);
              p.fill(255, 150, 150);
              p.noStroke();
              p.textSize(12);
              p.textAlign(p.LEFT, p.TOP);
              p.text("complex eigenvalues — no real eigenvectors", 0, 0);
              p.pop();
            }
          }

          // Click-to-transform vector
          if (clickedVecRef.current) {
            const vx = clickedVecRef.current.x;
            const vy = clickedVecRef.current.y;
            const tx = ma * vx + mb * vy;
            const ty = mc * vx + md * vy;
            const stretchMag = Math.sqrt(tx * tx + ty * ty);

            // Input vector (white)
            p.stroke(255, 255, 255, 200);
            p.strokeWeight(2);
            p.line(0, 0, vx * SF, vy * SF);
            const inAng = p.atan2(vy * SF, vx * SF);
            p.fill(255, 255, 255, 200);
            p.noStroke();
            p.push();
            p.translate(vx * SF, vy * SF);
            p.rotate(inAng);
            p.triangle(0, 0, -9, -3, -9, 3);
            p.pop();
            p.fill(255, 255, 255, 180);
            p.noStroke();
            p.ellipse(vx * SF, vy * SF, 6);

            // Output vector (pink)
            p.stroke(255, 80, 160, 230);
            p.strokeWeight(2.5);
            p.line(0, 0, tx * SF, ty * SF);
            const outAng = p.atan2(ty * SF, tx * SF);
            p.fill(255, 80, 160, 230);
            p.noStroke();
            p.push();
            p.translate(tx * SF, ty * SF);
            p.rotate(outAng);
            p.triangle(0, 0, -10, -4, -10, 4);
            p.pop();
            p.fill(255, 80, 160, 200);
            p.noStroke();
            p.ellipse(tx * SF, ty * SF, 7);

            // Stretch label
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

          // Matrix label (top-right)
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
          p.textFont("Inter");
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

  const handleToggleEigen = () => {
    setShowEigen(v => !v);
    setTimeout(() => p5Ref.current?.redraw(), 0);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex justify-center cursor-crosshair">
        <div ref={containerRef} />
      </div>

      {/* Matrix sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "a (row 1, col 1)", value: a, setter: setA, id: "eigen-a" },
          { label: "b (row 1, col 2)", value: b, setter: setB, id: "eigen-b" },
          { label: "c (row 2, col 1)", value: c, setter: setC, id: "eigen-c" },
          { label: "d (row 2, col 2)", value: d, setter: setD, id: "eigen-d" },
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
              className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-orange-500 to-rose-500 cursor-pointer accent-primary"
            />
            <div className="text-center mt-1">
              <span className="text-sm font-mono font-semibold text-primary">
                {value.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Toggle + Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col justify-between">
          <label className="block text-sm font-medium text-foreground mb-2">
            Show Eigenvectors
          </label>
          <button
            id="eigen-toggle"
            onClick={handleToggleEigen}
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
              showEigen
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {showEigen ? "✦ Visible" : "Hidden"}
          </button>
        </div>

        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col justify-between">
          <label className="block text-sm font-medium text-foreground mb-2">Presets</label>
          <div className="flex gap-2">
            {[
              { label: "Shear",    vals: [2, 1, 0, 1] },
              { label: "Rotation", vals: [0, -1, 1, 0] },
              { label: "Scale",    vals: [2, 0, 0, 0.5] },
              { label: "Reflect",  vals: [1, 0, 0, -1] },
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
