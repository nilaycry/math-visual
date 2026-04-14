"use client";

import { useState, useRef } from "react";
import p5 from "p5";
import { useP5Sketch } from "@/hooks/useP5Sketch";

export default function GradientSketch() {
  const [learningRate, setLearningRate] = useState(0.05);
  const [showGradient, setShowGradient] = useState(true);
  const posRef = useRef<{ x: number; y: number; trail: { x: number; y: number }[] } | null>(null);
  const clickRef = useRef<{ x: number; y: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const lrRef = useRef(learningRate);
  lrRef.current = learningRate;
  const showGradientRef = useRef(showGradient);
  showGradientRef.current = showGradient;

  // Objective function: f(x,y) = x^2 + 3y^2 + 0.5*x*y + x - 2y + 5
  const f = (x: number, y: number) =>
    x * x + 3 * y * y + 0.5 * x * y + x - 2 * y + 5;

  // Gradient: [df/dx, df/dy]
  const grad = (x: number, y: number): [number, number] => [
    2 * x + 0.5 * y + 1,
    6 * y + 0.5 * x - 2,
  ];

  const buildSketch = (el: HTMLElement) => new p5((p: p5) => {
      const width = 700;
      const height = 500;
      const rangeX = [-4, 4] as const;
      const rangeY = [-3, 3] as const;
      // px per math unit (for converting gradient vectors to screen vectors)
      const scaleX = width / (rangeX[1] - rangeX[0]);
      const scaleY = height / (rangeY[1] - rangeY[0]);
      let contourImg: p5.Image | null = null;
      const levels = [4, 6, 8, 10, 14, 20, 28, 38];
      let contourSegments: { level: number; segs: [number,number,number,number][] }[] = [];

      const toScreenX = (x: number) =>
        p.map(x, rangeX[0], rangeX[1], 0, width);
      const toScreenY = (y: number) =>
        p.map(y, rangeY[0], rangeY[1], 0, height);
      const toMathX = (sx: number) =>
        p.map(sx, 0, width, rangeX[0], rangeX[1]);
      const toMathY = (sy: number) =>
        p.map(sy, 0, height, rangeY[0], rangeY[1]);

      const buildContourLines = () => {
        const step = 4;
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
            const t = p.constrain(p.map(val, 3, 40, 0, 1), 0, 1);

            let r: number, g: number, b: number;
            if (isDark) {
              r = p.lerp(10, 50, t);
              g = p.lerp(180, 20, t);
              b = p.lerp(160, 80, t);
            } else {
              r = p.lerp(230, 100, t);
              g = p.lerp(250, 140, t);
              b = p.lerp(255, 200, t);
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

      // Draw an arrow from (x1,y1) to (x2,y2) in screen coords
      const drawArrow = (x1: number, y1: number, x2: number, y2: number) => {
        p.line(x1, y1, x2, y2);
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLen = 10;
        p.line(
          x2, y2,
          x2 - headLen * Math.cos(angle - Math.PI / 6),
          y2 - headLen * Math.sin(angle - Math.PI / 6)
        );
        p.line(
          x2, y2,
          x2 - headLen * Math.cos(angle + Math.PI / 6),
          y2 - headLen * Math.sin(angle + Math.PI / 6)
        );
      };

      p.setup = () => {
        p.createCanvas(width, height);
        p.textFont("Inter");
        buildContourImage();
        buildContourLines();
        p.noLoop();
      };

      p.mousePressed = () => {
        if (p.mouseX >= 0 && p.mouseX <= 700 && p.mouseY >= 0 && p.mouseY <= 500) {
          const mx = toMathX(p.mouseX);
          const my = toMathY(p.mouseY);
          posRef.current = { x: mx, y: my, trail: [{ x: mx, y: my }] };
          clickRef.current = { x: mx, y: my };
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
        p.stroke(isDark ? p.color(255, 255, 255, 25) : p.color(0, 0, 0, 25));
        for (const { segs } of contourSegments) {
          for (const [x1, y1, x2, y2] of segs) {
            p.line(x1, y1, x2, y2);
          }
        }

        // Gradient descent step
        if (posRef.current) {
          const pos = posRef.current;
          const [gx, gy] = grad(pos.x, pos.y);
          const gradMag = Math.sqrt(gx * gx + gy * gy);

          if (gradMag > 0.001) {
            pos.x -= lrRef.current * gx;
            pos.y -= lrRef.current * gy;
            pos.trail.push({ x: pos.x, y: pos.y });
            if (pos.trail.length > 500) pos.trail.shift();
            if (Math.abs(pos.x) > 6 || Math.abs(pos.y) > 5) {
              setIsRunning(false);
              p.noLoop();
            }
          } else {
            setIsRunning(false);
            p.noLoop();
          }

          // Draw trail
          p.noFill();
          p.strokeWeight(2.5);
          for (let i = 1; i < pos.trail.length; i++) {
            const alpha = p.map(i, 0, pos.trail.length, 50, 255);
            p.stroke(
              isDark
                ? p.color(255, 180, 50, alpha)
                : p.color(220, 120, 0, alpha)
            );
            p.line(
              toScreenX(pos.trail[i - 1].x),
              toScreenY(pos.trail[i - 1].y),
              toScreenX(pos.trail[i].x),
              toScreenY(pos.trail[i].y)
            );
          }

          // Gradient arrow at current position
          if (showGradientRef.current && gradMag > 0.001) {
            const sx = toScreenX(pos.x);
            const sy = toScreenY(pos.y);
            // Convert gradient vector to screen space (no Y flip — toScreenY already maps y=-3→top, y=3→bottom)
            const arrowScreenX = gx * scaleX;
            const arrowScreenY = gy * scaleY;
            // Normalize and cap at 70px so it's always legible
            const arrowLen = Math.min(gradMag * 20, 70);
            const arrowMag = Math.sqrt(arrowScreenX * arrowScreenX + arrowScreenY * arrowScreenY);
            const nx = (arrowScreenX / arrowMag) * arrowLen;
            const ny = (arrowScreenY / arrowMag) * arrowLen;

            p.strokeWeight(2.5);
            p.stroke(p.color(255, 255, 255, 220));
            drawArrow(sx, sy, sx + nx, sy + ny);
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
            14,
            14
          );
          p.text(`Steps: ${pos.trail.length}`, 14, 32);
        }

        // Minimum marker
        const minX = -0.565;
        const minY = 0.380;
        p.stroke(isDark ? p.color(100, 255, 150) : p.color(0, 180, 80));
        p.strokeWeight(2);
        p.noFill();
        const ms = 8;
        p.line(
          toScreenX(minX) - ms, toScreenY(minY) - ms,
          toScreenX(minX) + ms, toScreenY(minY) + ms
        );
        p.line(
          toScreenX(minX) + ms, toScreenY(minY) - ms,
          toScreenX(minX) - ms, toScreenY(minY) + ms
        );
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
            id="gradient-lr-slider"
            type="range"
            min={0.005}
            max={0.35}
            step={0.005}
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-emerald-500 to-cyan-500 cursor-pointer accent-accent"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">0.005</span>
            <span className="text-sm font-mono font-semibold text-accent">
              {learningRate.toFixed(3)}
            </span>
            <span className="text-xs text-muted-foreground">0.35</span>
          </div>
        </div>

        {/* Gradient arrow toggle */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col justify-between">
          <label className="block text-sm font-medium text-foreground mb-2">
            Gradient Arrow
          </label>
          <button
            id="gradient-arrow-toggle"
            onClick={() => setShowGradient(!showGradient)}
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
              showGradient
                ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {showGradient ? "✦ Visible" : "Hidden"}
          </button>
        </div>

        {/* Reset button */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Controls
            </label>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isRunning
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-secondary text-muted-foreground"
            }`}>
              {isRunning ? "running" : "idle"}
            </span>
          </div>
          <button
            id="gradient-reset-btn"
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
