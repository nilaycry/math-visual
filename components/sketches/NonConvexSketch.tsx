"use client";

import { useState, useRef } from "react";
import p5 from "p5";
import { useP5Sketch } from "@/hooks/useP5Sketch";

export default function NonConvexSketch() {
  const [mode, setMode] = useState<"basic" | "momentum" | "noise">("basic");
  const [learningRate, setLearningRate] = useState(0.05);
  const [speed, setSpeed] = useState(8);
  const posRef = useRef<{ x: number; y: number; trail: { x: number; y: number }[] } | null>(null);
  const clickRef = useRef<{ x: number; y: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const lrRef = useRef(learningRate);
  lrRef.current = learningRate;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const speedRef = useRef(speed);
  speedRef.current = speed;

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
    const width = el.clientWidth || 700;
    const height = Math.round(width * (5 / 7));
    const rangeX = [-3, 3] as const;
    const rangeY = [-3, 3] as const;
    let contourImg: p5.Image | null = null;
    let velocityX = 0;
    let velocityY = 0;
    let stepCount = 0;
    let localFrameCount = 0;
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
            // Rose/crimson: deep wells = warm rose glow, ridges = deep wine
            r = p.lerp(224, 26, t);
            g = p.lerp(90, 18, t);
            b = p.lerp(106, 24, t);
          } else {
            r = p.lerp(255, 140, t);
            g = p.lerp(230, 100, t);
            b = p.lerp(180, 80, t);
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
      p.textFont("Space Grotesk");
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
      if (p.mouseX >= 0 && p.mouseX <= width && p.mouseY >= 0 && p.mouseY <= height) {
        const mx = toMathX(p.mouseX);
        const my = toMathY(p.mouseY);
        posRef.current = { x: mx, y: my, trail: [{ x: mx, y: my }] };
        clickRef.current = { x: mx, y: my };
        velocityX = 0;
        velocityY = 0;
        stepCount = 0;
        localFrameCount = 0;
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

      // Gradient descent step — only on every N-th frame
      if (posRef.current) {
        const pos = posRef.current;
        localFrameCount++;

        if (isRunningRef.current && localFrameCount % speedRef.current === 0) {
          const [gx, gy] = grad(pos.x, pos.y);
          const gradMag = Math.sqrt(gx * gx + gy * gy);

          const stepX = -lrRef.current * gx;
          const stepY = -lrRef.current * gy;

          if (modeRef.current === "momentum") {
            const beta = 0.95;
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
        p.stroke(isDark ? p.color(80, 220, 255) : p.color(0, 120, 180));
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
          momentum: "with momentum (β=0.95)",
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
      <div className="sketch-wrap" style={{ cursor: "crosshair" }}>
        <div ref={containerRef} style={{ width: "100%" }} />
      </div>

      {/* Controls */}
      <div className="sketch-controls" style={{ flexWrap: "wrap" }}>
        {/* Learning rate */}
        <div className="sketch-slider-row" style={{ flex: 1, maxWidth: 180 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">learning rate α</span>
            <span className="sketch-value">{learningRate.toFixed(3)}</span>
          </div>
          <input
            id="nonconvex-lr-slider"
            type="range"
            min={0.005}
            max={0.15}
            step={0.005}
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="sketch-range"
          />
        </div>

        {/* Speed */}
        <div className="sketch-slider-row" style={{ flex: 1, maxWidth: 140 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">speed</span>
            <span className="sketch-value">{speed === 1 ? "max" : `1/${speed}`}</span>
          </div>
          <input
            id="nonconvex-speed-slider"
            type="range"
            min={1}
            max={30}
            step={1}
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="sketch-range"
          />
        </div>

        {/* Mode buttons */}
        <button
          id="mode-basic"
          onClick={() => { setMode("basic"); handleReset(); }}
          className={`sketch-btn ${mode === "basic" ? "sketch-btn-active" : ""}`}
        >
          basic
        </button>
        <button
          id="mode-momentum"
          onClick={() => { setMode("momentum"); handleReset(); }}
          className={`sketch-btn ${mode === "momentum" ? "sketch-btn-active" : ""}`}
        >
          momentum
        </button>
        <button
          id="mode-noise"
          onClick={() => { setMode("noise"); handleReset(); }}
          className={`sketch-btn ${mode === "noise" ? "sketch-btn-active" : ""}`}
        >
          noisy
        </button>

        <button
          id="nonconvex-reset-btn"
          onClick={handleReset}
          className="sketch-btn"
        >
          reset
        </button>

        {isRunning && (
          <span className="sketch-note" style={{ marginLeft: 0 }}>running</span>
        )}
      </div>
    </div>
  );
}
