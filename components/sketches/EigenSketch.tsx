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

  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    // Clear any previously mounted canvases
    while (el.firstChild) el.removeChild(el.firstChild);

    // Defer mount by one tick so Strict Mode cleanup fires first
    const timer = setTimeout(() => {
      if (cancelled || !el) return;
      if (p5Ref.current) { p5Ref.current.remove(); p5Ref.current = null; }
      p5Ref.current = new p5((p: p5) => {
      const W = 660;
      const H = 440;
      const SF = 80; // px per unit

      p.setup = () => {
        p.createCanvas(W, H);
        p.textFont("Inter");
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

        // Axis labels (unflipped via push/scale)
        p.fill(120);
        p.noStroke();
        p.textSize(11);
        for (let i = -4; i <= 4; i++) {
          if (i === 0) continue;
          p.push();
          p.translate(i * SF, -15);
          p.scale(1, -1);
          p.textAlign(p.CENTER, p.TOP);
          p.text(i.toString(), 0, 0);
          p.pop();
        }
        for (let i = -3; i <= 3; i++) {
          if (i === 0) continue;
          p.push();
          p.translate(-8, i * SF);
          p.scale(1, -1);
          p.textAlign(p.RIGHT, p.CENTER);
          p.text(i.toString(), 0, 0);
          p.pop();
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
        if (showEigenRef.current) {
          const tr = ma + md;
          const det = ma * md - mb * mc;
          const disc = tr * tr - 4 * det;

          if (disc >= 0) {
            const sq = Math.sqrt(disc);
            const l1 = (tr + sq) / 2;
            const l2 = (tr - sq) / 2;

            const getEv = (lambda: number) => {
              if (mb !== 0) return [mb, lambda - ma];
              if (mc !== 0) return [lambda - md, mc];
              return [1, 0];
            };

            const drawEv = (v: number[], col: string) => {
              const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
              if (mag < 1e-10) return;
              const nx = (v[0] / mag) * 120;
              const ny = (v[1] / mag) * 120;
              p.stroke(col);
              p.strokeWeight(2.5);
              p.line(0, 0, nx, ny);
              const ang = p.atan2(ny, nx);
              p.fill(col);
              p.noStroke();
              p.push();
              p.translate(nx, ny);
              p.rotate(ang);
              p.triangle(0, 0, -10, -4, -10, 4);
              p.pop();
            };

            drawEv(getEv(l1), "#F0A500");
            drawEv(getEv(l2), "#5DCAA5");
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

        // Matrix label (top-right, unflipped)
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
    (e: React.ChangeEvent<HTMLInputElement>) => setter(parseFloat(e.target.value));

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex justify-center">
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
            onClick={() => setShowEigen(!showEigen)}
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
              { label: "Shear",   vals: [2, 1, 0, 1] },
              { label: "Rotation", vals: [0, -1, 1, 0] },
              { label: "Scale",   vals: [2, 0, 0, 0.5] },
              { label: "Reflect", vals: [1, 0, 0, -1] },
            ].map(({ label, vals }) => (
              <button
                key={label}
                onClick={() => { setA(vals[0]); setB(vals[1]); setC(vals[2]); setD(vals[3]); }}
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
