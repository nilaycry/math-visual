"use client";

import { useState, useEffect, useRef } from "react";
import p5 from "p5";

export default function NonLinearSketch() {
  const [mode, setMode] = useState<"linear" | "tanh">("linear");
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
        const W = 660;
        const H = 440;
        const SF = 40; // Scale factor: 1 math unit = 40 pixels

        let t = 0; // 0 = linear, 1 = tanh

        // Points layout: 
        // Red inner circle (r < 1.5), Blue outer ring (r in [2, 4])
        const points: { x: number; y: number; isRed: boolean }[] = [];
        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Inter");

          // Generate points
          for (let i = 0; i < 300; i++) {
            const r = p.random(0, 4);
            const theta = p.random(0, p.TWO_PI);
            if (r > 1.5 && r < 2.0) continue; // gap
            points.push({
              x: r * Math.cos(theta),
              y: r * Math.sin(theta),
              isRed: r <= 1.5
            });
          }
        };

        const transform = (x: number, y: number, tVal: number) => {
          // Matrix A (stretch and rotate slightly)
          const tx = 1.3 * x + 0.5 * y;
          const ty = 0.4 * x + 1.2 * y;

          // Non-linear step
          const fx = Math.tanh(tx);
          const fy = Math.tanh(ty);

          return {
            x: p.lerp(tx, fx * 3, tVal), // scale up tanh for visibility *3
            y: p.lerp(ty, fy * 3, tVal)
          };
        };

        p.draw = () => {
          p.background(13, 17, 23);
          p.translate(W / 2, H / 2);
          p.scale(1, -1);

          // Animate t
          const targetT = modeRef.current === "tanh" ? 1 : 0;
          t = p.lerp(t, targetT, 0.08);

          if (Math.abs(t - targetT) < 0.001) {
            t = targetT;
            p.noLoop();
          } else {
            p.loop();
          }

          // Draw warped grid lines
          p.stroke(40);
          p.strokeWeight(1);
          p.noFill();

          // Vertical grid lines
          for (let x = -5; x <= 5; x += 0.5) {
            p.beginShape();
            for (let y = -5; y <= 5; y += 0.2) {
              const pt = transform(x, y, t);
              p.vertex(pt.x * SF, pt.y * SF);
            }
            p.endShape();
          }

          // Horizontal grid lines
          for (let y = -5; y <= 5; y += 0.5) {
            p.beginShape();
            for (let x = -5; x <= 5; x += 0.2) {
              const pt = transform(x, y, t);
              p.vertex(pt.x * SF, pt.y * SF);
            }
            p.endShape();
          }

          // Draw axes
          p.stroke(80);
          p.strokeWeight(1.5);
          p.beginShape();
          for (let x = -6; x <= 6; x += 0.2) {
             const pt = transform(x, 0, t);
             p.vertex(pt.x * SF, pt.y * SF);
          }
          p.endShape();
          p.beginShape();
          for (let y = -6; y <= 6; y += 0.2) {
             const pt = transform(0, y, t);
             p.vertex(pt.x * SF, pt.y * SF);
          }
          p.endShape();

          // Draw points
          p.noStroke();
          for (const pt of points) {
            const tPt = transform(pt.x, pt.y, t);
            if (pt.isRed) {
              p.fill("rgba(255, 80, 160, 0.9)");
            } else {
              p.fill("rgba(80, 130, 200, 0.7)");
            }
            p.circle(tPt.x * SF, tPt.y * SF, 6);
          }

          // Readout
          p.push();
          p.translate(-W/2 + 15, -H/2 + 15);
          p.scale(1, -1);
          p.fill(220); p.textAlign(p.LEFT, p.TOP); p.noStroke();
          p.text(modeRef.current === "linear" ? "y = A·x" : "y = tanh(A·x)", 0, 0);
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

  const setModeAndLoop = (m: "linear" | "tanh") => {
    setMode(m);
    // Slight delay to ensure ref updates before next animation frame
    setTimeout(() => p5Ref.current?.loop(), 0);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex justify-center">
        <div ref={containerRef} />
      </div>

      <div className="flex gap-4 max-w-sm mx-auto">
        <button
          onClick={() => setModeAndLoop("linear")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === "linear"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Linear Space
        </button>
        <button
          onClick={() => setModeAndLoop("tanh")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === "tanh"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Apply Tanh
        </button>
      </div>
    </div>
  );
}
