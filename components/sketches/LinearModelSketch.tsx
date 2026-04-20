"use client";

import { useState, useEffect, useRef } from "react";
import p5 from "p5";

export default function LinearModelSketch() {
  const [w, setW] = useState(0.5);
  const [b, setB] = useState(0);

  const wRef = useRef(w);
  const bRef = useRef(b);
  wRef.current = w;
  bRef.current = b;

  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  // Hardcoded dataset
  const pts = [
    { x: -5, y: -4 },
    { x: -2, y: -1 },
    { x: 0, y: 1 },
    { x: 3, y: 3 },
    { x: 6, y: 7 },
  ];

  const computeLoss = (cw: number, cb: number) => {
    let loss = 0;
    for (const p of pts) {
      const yHat = cw * p.x + cb;
      loss += (p.y - yHat) ** 2;
    }
    return loss / pts.length;
  };

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
        const SF = 12; // Data scaling factor

        // Precompute contour marching squares for the right side
        const levels = [2, 10, 30, 70, 150];
        let contourSegments: { level: number; segs: [number, number, number, number][] }[] = [];

        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Inter");
          p.noLoop();

          // Build contour segments
          const step = 4; // Marching square grid size in pixels
          const rightOriginX = W * 0.75;
          const rightOriginY = H / 2;
          
          // Parameter space bounds
          const pWScale = 50; // pixels per unit of w
          const pBScale = 15; // pixels per unit of b

          const toMathW = (px: number) => (px - rightOriginX) / pWScale;
          const toMathB = (py: number) => (rightOriginY - py) / pBScale;

          contourSegments = levels.map(level => {
            const segs: [number, number, number, number][] = [];
            for (let px = W / 2; px < W - step; px += step) {
              for (let py = 0; py < H - step; py += step) {
                const f00 = computeLoss(toMathW(px), toMathB(py)) - level;
                const f10 = computeLoss(toMathW(px + step), toMathB(py)) - level;
                const f01 = computeLoss(toMathW(px), toMathB(py + step)) - level;
                const f11 = computeLoss(toMathW(px + step), toMathB(py + step)) - level;
                const linePts: [number, number][] = [];
                if (f00 * f10 < 0) { const t = f00 / (f00 - f10); linePts.push([px + t * step, py]); }
                if (f10 * f11 < 0) { const t = f10 / (f10 - f11); linePts.push([px + step, py + t * step]); }
                if (f01 * f11 < 0) { const t = f01 / (f01 - f11); linePts.push([px + t * step, py + step]); }
                if (f00 * f01 < 0) { const t = f00 / (f00 - f01); linePts.push([px, py + t * step]); }
                if (linePts.length === 2) segs.push([linePts[0][0], linePts[0][1], linePts[1][0], linePts[1][1]]);
              }
            }
            return { level, segs };
          });
        };

        p.draw = () => {
          p.background(13, 17, 23);

          const cw = wRef.current;
          const cb = bRef.current;
          const currentLoss = computeLoss(cw, cb);

          // Divider
          p.stroke(40);
          p.strokeWeight(1.5);
          p.line(W / 2, 0, W / 2, H);

          // ── LEFT HALF: DATA SPACE ──
          p.push();
          p.translate(W / 4, H / 2);
          p.scale(1, -1);

          // Left Grid & Axes
          p.stroke(40); p.strokeWeight(0.5);
          for (let i = -10; i <= 10; i += 2) {
            p.line(i * SF, -H / 2, i * SF, H / 2);
            p.line(-W / 4, i * SF, W / 4, i * SF);
          }
          p.stroke(80); p.strokeWeight(1.5);
          p.line(-W / 4, 0, W / 4, 0);
          p.line(0, -H / 2, 0, H / 2);

          // Draw error squares
          p.noFill();
          p.stroke("rgba(255,80,160,0.5)"); // Error pink
          p.strokeWeight(1);
          for (const pt of pts) {
            const yHat = cw * pt.x + cb;
            const diff = pt.y - yHat;
            const side = Math.abs(diff) * SF;
            // Draw square. Coordinates must consider p5 rect mode. We want it anchored at yHat.
            p.fill("rgba(255,80,160,0.1)");
            if (diff > 0) {
              p.rect(pt.x * SF, yHat * SF, side, side);
            } else {
              p.rect(pt.x * SF - side, pt.y * SF, side, side);
            }
            // Line from prediction to actual
            p.stroke("rgba(255,80,160,0.8)");
            p.strokeWeight(2);
            p.line(pt.x * SF, yHat * SF, pt.x * SF, pt.y * SF);
          }

          // Draw Line Model
          p.stroke("#5DCAA5"); // Teal line
          p.strokeWeight(2);
          const x1 = -15; const y1 = cw * x1 + cb;
          const x2 = 15;  const y2 = cw * x2 + cb;
          p.line(x1 * SF, y1 * SF, x2 * SF, y2 * SF);

          // Draw Data Points
          p.fill(220);
          p.noStroke();
          for (const pt of pts) {
            p.circle(pt.x * SF, pt.y * SF, 6);
          }
          p.pop();

          // Left Title
          p.fill(180); p.noStroke(); p.textAlign(p.LEFT, p.TOP);
          p.text("data space", 15, 15);

          // ── RIGHT HALF: PARAMETER SPACE ──
          const pWScale = 50;
          const pBScale = 15;
          const rw = W * 0.75;
          const rh = H / 2;

          // Right Grid & Axes
          p.push();
          p.translate(rw, rh);
          p.scale(1, -1);
          
          p.stroke(40); p.strokeWeight(0.5);
          for (let i = -3; i <= 3; i++) p.line(i * pWScale, -H / 2, i * pWScale, H / 2); // w grid
          for (let i = -10; i <= 10; i+=2) p.line(-W / 4, i * pBScale, W / 4, i * pBScale); // b grid
          
          p.stroke(80); p.strokeWeight(1.5);
          p.line(-W / 4, 0, W / 4, 0); // b=0 axis
          p.line(0, -H / 2, 0, H / 2); // w=0 axis
          p.pop();

          // Draw precomputed contours
          p.strokeWeight(1);
          for (let i = 0; i < contourSegments.length; i++) {
            const { segs } = contourSegments[i];
            const alpha = p.map(i, 0, contourSegments.length, 180, 50);
            p.stroke(80, 130, 200, alpha);
            for (const seg of segs) {
              p.line(seg[0], seg[1], seg[2], seg[3]);
            }
          }

          // Indicator Dot
          const currentX = rw + cw * pWScale;
          const currentY = rh - cb * pBScale;
          p.fill("#F0A500"); // Orange
          p.noStroke();
          p.circle(currentX, currentY, 8);

          // Right Title
          p.fill(180); p.noStroke(); p.textAlign(p.LEFT, p.TOP);
          p.text("parameter space", W / 2 + 15, 15);

          // Info Overlay
          p.fill(220); p.textAlign(p.LEFT, p.BOTTOM);
          p.text(`w: ${cw.toFixed(2)}`, W / 2 + 15, H - 35);
          p.text(`b: ${cb.toFixed(2)}`, W / 2 + 15, H - 20);
          p.fill("#5DCAA5");
          p.text(`Loss (MSE): ${currentLoss.toFixed(2)}`, W / 2 + 110, H - 20);
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

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex justify-center">
        <div ref={containerRef} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            w (slope)
          </label>
          <input
            type="range"
            min={-1}
            max={3}
            step={0.05}
            value={w}
            onChange={handleChange(setW)}
            className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-blue-500 to-violet-500 cursor-pointer accent-primary"
          />
          <div className="text-center mt-1">
            <span className="text-sm font-mono font-semibold text-primary">{w.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            b (intercept)
          </label>
          <input
            type="range"
            min={-10}
            max={10}
            step={0.5}
            value={b}
            onChange={handleChange(setB)}
            className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-blue-500 to-violet-500 cursor-pointer accent-primary"
          />
          <div className="text-center mt-1">
            <span className="text-sm font-mono font-semibold text-primary">{b.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
