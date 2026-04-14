"use client";

import { useState, useRef } from "react";
import p5 from "p5";
import { useP5Sketch } from "@/hooks/useP5Sketch";

export default function NonConvexSketch() {
  const [mode, setMode] = useState<"basic" | "momentum" | "noise">("basic");
  const [learningRate, setLearningRate] = useState(0.05);
  const posRef = useRef<{ x: number; y: number; trail: { x: number; y: number }[] } | null>(null);
  const clickRef = useRef<{ x: number; y: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const lrRef = useRef(learningRate);
  lrRef.current = learningRate;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  // Pure negative-Gaussian landscape: no bowl, just isolated wells.
  // Each well center is a genuine local minimum with natural ridges between them.
  // A tiny bowl (0.04) is added only to push balls in flat outer regions inward.
  const wells = [
    { cx:  0.3, cy: -0.4, depth: 4.0, sigma: 0.8  }, // global min (deepest, center-ish)
    { cx: -1.9, cy:  1.1, depth: 2.6, sigma: 0.72 }, // local min — upper-left, medium
    { cx:  1.7, cy: -1.8, depth: 2.4, sigma: 0.65 }, // local min — lower-right, medium
    { cx: -1.0, cy: -1.7, depth: 2.1, sigma: 0.62 }, // local min — lower-left, shallower
    { cx:  2.0, cy:  1.3, depth: 1.8, sigma: 0.58 }, // local min — upper-right, shallowest
  ];

  const f = (x: number, y: number) => {
    let val = 0.04 * (x * x + y * y); // tiny bowl — only matters far from all wells
    for (const w of wells) {
      const dx = x - w.cx, dy = y - w.cy;
      val -= w.depth * Math.exp(-(dx * dx + dy * dy) / (2 * w.sigma * w.sigma));
    }
    return val;
  };

  const grad = (x: number, y: number): [number, number] => {
    let gx = 0.08 * x;
    let gy = 0.08 * y;
    for (const w of wells) {
      const dx = x - w.cx, dy = y - w.cy;
      const e = Math.exp(-(dx * dx + dy * dy) / (2 * w.sigma * w.sigma));
      gx += w.depth * dx / (w.sigma * w.sigma) * e;
      gy += w.depth * dy / (w.sigma * w.sigma) * e;
    }
    return [gx, gy];
  };

  const buildSketch = (el: HTMLElement) => new p5((p: p5) => {
    const width = 700;
    const height = 500;
    const rangeX = [-3, 3] as const;
    const rangeY = [-3, 3] as const;
    let contourImg: p5.Image | null = null;
    let velocityX = 0;
    let velocityY = 0;
    let stepCount = 0;
    const levels = [-3.5, -2.5, -1.8, -1.2, -0.6, -0.1];
    // Precomputed contour segments [x1,y1,x2,y2] in screen coords
    let contourSegments: { level: number; segs: [number,number,number,number][] }[] = [];
    // Actual local minima found by gradient descent from each well center
    let actualMinima: { x: number; y: number; isGlobal: boolean }[] = [];

    const toScreenX = (x: number) =>
      p.map(x, rangeX[0], rangeX[1], 0, width);
    const toScreenY = (y: number) =>
      p.map(y, rangeY[0], rangeY[1], 0, height);
    const toMathX = (sx: number) =>
      p.map(sx, 0, width, rangeX[0], rangeX[1]);
    const toMathY = (sy: number) =>
      p.map(sy, 0, height, rangeY[0], rangeY[1]);

    // Find actual minimum starting from a well center
    const findMin = (startX: number, startY: number) => {
      let x = startX, y = startY;
      for (let i = 0; i < 500; i++) {
        const [gx, gy] = grad(x, y);
        x -= 0.01 * gx;
        y -= 0.01 * gy;
      }
      return { x, y };
    };

    // Marching squares: precompute contour line segments once
    const buildContourLines = () => {
      const step = 4; // pixels per grid cell
      contourSegments = levels.map(level => {
        const segs: [number,number,number,number][] = [];
        for (let px = 0; px < width - step; px += step) {
          for (let py = 0; py < height - step; py += step) {
            const f00 = f(toMathX(px),        toMathY(py))        - level;
            const f10 = f(toMathX(px + step),  toMathY(py))        - level;
            const f01 = f(toMathX(px),         toMathY(py + step)) - level;
            const f11 = f(toMathX(px + step),  toMathY(py + step)) - level;
            const pts: [number, number][] = [];
            if (f00 * f10 < 0) { const t = f00/(f00-f10); pts.push([px + t*step, py]); }
            if (f10 * f11 < 0) { const t = f10/(f10-f11); pts.push([px + step, py + t*step]); }
            if (f01 * f11 < 0) { const t = f01/(f01-f11); pts.push([px + t*step, py + step]); }
            if (f00 * f01 < 0) { const t = f00/(f00-f01); pts.push([px, py + t*step]); }
            if (pts.length === 2) segs.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
          }
        }
        return { level, segs };
      });
    };

    const buildContourImage = () => {
      contourImg = p.createImage(width, height);
      contourImg.loadPixels();
      const isDark = document.documentElement.classList.contains("dark");

      for (let px = 0; px < width; px++) {
        for (let py = 0; py < height; py++) {
          const mx = toMathX(px);
          const my = toMathY(py);
          const val = f(mx, my);
          const t = p.constrain(p.map(val, -4.5, 1, 0, 1), 0, 1);

          let r: number, g: number, b: number;
          if (isDark) {
            r = p.lerp(10, 60, t);
            g = p.lerp(180, 30, t);
            b = p.lerp(160, 90, t);
          } else {
            r = p.lerp(230, 120, t);
            g = p.lerp(250, 150, t);
            b = p.lerp(255, 210, t);
          }

          const idx = 4 * (py * width + px);
          contourImg!.pixels[idx] = r;
          contourImg!.pixels[idx + 1] = g;
          contourImg!.pixels[idx + 2] = b;
          contourImg!.pixels[idx + 3] = 255;
        }
      }
      contourImg.updatePixels();
    };

    p.setup = () => {
      p.createCanvas(width, height);
      p.textFont("Inter");
      buildContourImage();
      buildContourLines();
      // Find actual minima by descending from each well center
      actualMinima = wells.map((w, i) => ({
        ...findMin(w.cx, w.cy),
        isGlobal: i === 0,
      }));
      p.noLoop();
    };

    p.mousePressed = () => {
      if (p.mouseX >= 0 && p.mouseX <= 700 && p.mouseY >= 0 && p.mouseY <= 500) {
        const mx = toMathX(p.mouseX);
        const my = toMathY(p.mouseY);
        posRef.current = { x: mx, y: my, trail: [{ x: mx, y: my }] };
        clickRef.current = { x: mx, y: my };
        velocityX = 0;
        velocityY = 0;
        stepCount = 0;
        setIsRunning(true);
        p.loop();
      }
    };

    p.draw = () => {
      const isDark = document.documentElement.classList.contains("dark");

      if (!contourImg) buildContourImage();
      if (contourImg) p.image(contourImg, 0, 0);

      // Contour lines (marching squares, precomputed)
      p.noFill();
      p.strokeWeight(1);
      p.stroke(isDark ? p.color(255, 255, 255, 22) : p.color(0, 0, 0, 22));
      for (const { segs } of contourSegments) {
        for (const [x1, y1, x2, y2] of segs) {
          p.line(x1, y1, x2, y2);
        }
      }

      // Minima markers (actual positions found by GD from well centers)
      p.noFill();
      p.strokeWeight(2);
      for (const m of actualMinima) {
        const sx = toScreenX(m.x), sy = toScreenY(m.y);
        if (m.isGlobal) {
          const ms = 10;
          p.stroke(isDark ? p.color(100, 255, 150) : p.color(0, 180, 80));
          p.line(sx - ms, sy - ms, sx + ms, sy + ms);
          p.line(sx + ms, sy - ms, sx - ms, sy + ms);
        } else {
          p.fill(isDark ? p.color(255, 100, 100, 180) : p.color(200, 50, 50, 180));
          p.noStroke();
          p.ellipse(sx, sy, 8);
          p.noFill();
        }
      }

      // Gradient descent step
      if (posRef.current) {
        const pos = posRef.current;

        if (isRunningRef.current) {
          const [gx, gy] = grad(pos.x, pos.y);
          const gradMag = Math.sqrt(gx * gx + gy * gy);

          const stepX = -lrRef.current * gx;
          const stepY = -lrRef.current * gy;

          if (modeRef.current === "momentum") {
            const beta = 0.9;
            velocityX = beta * velocityX + stepX;
            velocityY = beta * velocityY + stepY;
            pos.x += velocityX;
            pos.y += velocityY;
          } else if (modeRef.current === "noise") {
            const noiseScale = 0.1;
            pos.x += stepX + p.randomGaussian(0, noiseScale);
            pos.y += stepY + p.randomGaussian(0, noiseScale);
          } else {
            pos.x += stepX;
            pos.y += stepY;
          }

          pos.trail.push({ x: pos.x, y: pos.y });
          stepCount++;
          if (pos.trail.length > 1000) pos.trail.shift();

          if (gradMag < 0.01 || stepCount > 2000) {
            setIsRunning(false);
            p.noLoop();
          }
        }

        // Draw trail
        p.noFill();
        p.strokeWeight(4);
        p.stroke(isDark ? p.color(255, 180, 80) : p.color(200, 120, 20));
        if (pos.trail.length > 1) {
          p.beginShape();
          for (let i = 0; i < pos.trail.length; i++) {
            p.vertex(toScreenX(pos.trail[i].x), toScreenY(pos.trail[i].y));
          }
          p.endShape();
        }

        // Starting point
        if (clickRef.current) {
          p.fill(isDark ? p.color(255, 100, 100) : p.color(200, 50, 50));
          p.noStroke();
          p.ellipse(
            toScreenX(clickRef.current.x),
            toScreenY(clickRef.current.y),
            10
          );
        }

        // Current position
        p.fill(isDark ? p.color(255, 220, 80) : p.color(230, 160, 30));
        p.noStroke();
        p.ellipse(toScreenX(pos.x), toScreenY(pos.y), 12);
        p.fill(isDark ? p.color(255, 255, 255) : p.color(255, 255, 255));
        p.ellipse(toScreenX(pos.x), toScreenY(pos.y), 5);

        // Info
        p.fill(isDark ? p.color(220, 225, 240) : p.color(30, 35, 55));
        p.noStroke();
        p.textSize(12);
        p.textAlign(p.LEFT, p.TOP);
        p.text(
          `f(${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}) = ${f(pos.x, pos.y).toFixed(3)}`,
          14, 14
        );
        p.text(`Steps: ${stepCount}`, 14, 32);

        // Mode label
        const modeLabels: Record<string, string> = {
          basic: "basic gradient descent",
          momentum: "with momentum (β=0.9)",
          noise: "with noise (SGD-like)",
        };
        p.text(`Mode: ${modeLabels[modeRef.current]}`, 14, 50);
      }
    };
  }, el);

  const containerRef = useP5Sketch(buildSketch);

  const handleReset = () => {
    posRef.current = null;
    clickRef.current = null;
    setIsRunning(false);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card cursor-crosshair">
        <div ref={containerRef} />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Learning rate */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Learning Rate (α)
          </label>
          <input
            id="nonconvex-lr-slider"
            type="range"
            min={0.005}
            max={0.15}
            step={0.005}
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-rose-500 to-orange-500 cursor-pointer accent-accent"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">0.005</span>
            <span className="text-sm font-mono font-semibold text-accent">
              {learningRate.toFixed(3)}
            </span>
            <span className="text-xs text-muted-foreground">0.15</span>
          </div>
        </div>

        {/* Mode selector */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col justify-between">
          <label className="block text-sm font-medium text-foreground mb-2">
            Optimization Mode
          </label>
          <div className="flex gap-2">
            <button
              id="mode-basic"
              onClick={() => { setMode("basic"); handleReset(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode === "basic"
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              basic
            </button>
            <button
              id="mode-momentum"
              onClick={() => { setMode("momentum"); handleReset(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode === "momentum"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              momentum
            </button>
            <button
              id="mode-noise"
              onClick={() => { setMode("noise"); handleReset(); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode === "noise"
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
            >
              noisy
            </button>
          </div>
        </div>

        {/* Reset button */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Controls
            </label>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isRunning
              ? "bg-rose-500/15 text-rose-400"
              : "bg-secondary text-muted-foreground"
              }`}>
              {isRunning ? "running" : "idle"}
            </span>
          </div>
          <button
            id="nonconvex-reset-btn"
            onClick={handleReset}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-secondary text-muted-foreground hover:text-foreground border border-border/50 transition-all"
          >
            reset
          </button>
        </div>
      </div>
    </div>
  );
}
