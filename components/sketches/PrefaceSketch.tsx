"use client";
import { useP5Sketch } from "@/hooks/useP5Sketch";
import p5 from "p5";

const W = 660;
const H = 440;
const CX = W / 2;
const CY = H / 2;
const SCALE = 150;
const LR = 0.05;
const SPF = 3;

const sx = (x: number) => CX + x * SCALE;
const sy = (y: number) => CY - y * SCALE;

function mse(w: number, b: number, pts: { x: number; y: number }[]) {
  return pts.reduce((sum, p) => sum + (p.y - (w * p.x + b)) ** 2, 0) / pts.length;
}

function gradStep(w: number, b: number, pts: { x: number; y: number }[]) {
  let dw = 0,
    db = 0;
  const n = pts.length;
  for (const pt of pts) {
    const e = pt.y - (w * pt.x + b);
    dw -= 2 * pt.x * e;
    db -= 2 * e;
  }
  return { w: w - (LR * dw) / n, b: b - (LR * db) / n };
}

function makePoints() {
  return Array.from({ length: 9 }, (_, i) => {
    const x = (i / 8) * 1.4 - 0.7;
    return { x, y: 0.65 * x + 0.05 + (Math.random() - 0.5) * 0.26 };
  });
}

export default function PrefaceSketch() {
  const buildSketch = (p: p5) => {
    let w = 0,
      b = 0;
    let pts: { x: number; y: number }[] = makePoints();
    let active = false,
      converged = false;
    let loss = 0,
      iter = 0;

    const reset = () => {
      pts = makePoints();
      w = (Math.random() - 0.5) * 2.5;
      b = (Math.random() - 0.5) * 1.5;
      iter = 0;
      active = true;
      converged = false;
      loss = mse(w, b, pts);
    };

    p.setup = () => {
      p.createCanvas(W, H);
      p.textFont("Inter");
      p.noLoop();
    };

    p.mousePressed = () => {
      reset();
      p.loop();
    };

    p.draw = () => {
      p.background(13, 17, 23);

      // Grid
      p.strokeWeight(1);
      for (const v of [-0.5, 0, 0.5]) {
        p.stroke(v === 0 ? 48 : 26);
        p.line(sx(v), 18, sx(v), H - 18);
        p.line(18, sy(v), W - 18, sy(v));
      }

      // Data points
      p.noStroke();
      p.fill("#5DCAA5");
      for (const pt of pts) {
        p.ellipse(sx(pt.x), sy(pt.y), 10, 10);
      }

      // Line and loss label
      if (active || converged) {
        const x1 = -1.2,
          x2 = 1.2;
        p.stroke(converged ? "#5DCAA5" : "#F0A500");
        p.strokeWeight(2);
        p.line(sx(x1), sy(w * x1 + b), sx(x2), sy(w * x2 + b));

        p.noStroke();
        p.fill(110);
        p.textSize(12);
        p.textAlign(p.LEFT);
        p.text(
          converged
            ? `loss: ${loss.toFixed(4)} — converged`
            : `loss: ${loss.toFixed(4)}`,
          22,
          H - 20
        );
      }

      // Click prompt (shown before first click)
      if (!active && !converged) {
        p.noStroke();
        p.fill(90);
        p.textSize(13);
        p.textAlign(p.CENTER);
        p.text("click to fit", CX, H - 24);
      }

      // Gradient descent steps
      if (active) {
        for (let i = 0; i < SPF; i++) {
          const next = gradStep(w, b, pts);
          w = next.w;
          b = next.b;
          iter++;
        }
        loss = mse(w, b, pts);
        if (loss < 0.003 || iter > 500) {
          active = false;
          converged = true;
          p.noLoop();
        }
      }
    };
  };

  const containerRef = useP5Sketch((el) => new p5(buildSketch, el));
  return (
    <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex justify-center">
      <div ref={containerRef} />
    </div>
  );
}
