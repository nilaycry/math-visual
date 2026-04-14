"use client";

import { useState, useCallback } from "react";
import Canvas from "@/components/Canvas";
import p5 from "p5";

export default function FourierSketch() {
  const [numTerms, setNumTerms] = useState(5);
  const [speed, setSpeed] = useState(1);
  const [showCircles, setShowCircles] = useState(true);

  const sketch = useCallback(
    (p: p5) => {
      let time = 0;
      const wave: number[] = [];
      const width = 700;
      const height = 400;

      p.setup = () => {
        p.createCanvas(width, height);
        p.textFont("Inter");
      };

      p.draw = () => {
        const isDark =
          document.documentElement.classList.contains("dark");
        const bg = isDark ? p.color(20, 24, 37) : p.color(248, 249, 252);
        const fg = isDark ? p.color(210, 215, 230) : p.color(30, 35, 55);
        const waveColor = isDark
          ? p.color(130, 100, 255)
          : p.color(100, 70, 230);
        const circleColor = isDark
          ? p.color(100, 200, 220, 80)
          : p.color(60, 150, 200, 80);
        const lineColor = isDark
          ? p.color(100, 200, 220, 150)
          : p.color(60, 150, 200, 150);
        const dotColor = isDark
          ? p.color(255, 200, 80)
          : p.color(230, 160, 30);

        p.background(bg);

        // Draw grid
        p.stroke(isDark ? 40 : 230);
        p.strokeWeight(0.5);
        for (let gx = 0; gx < width; gx += 40) p.line(gx, 0, gx, height);
        for (let gy = 0; gy < height; gy += 40) p.line(0, gy, width, gy);

        let x = 200;
        let y = height / 2;

        for (let i = 0; i < numTerms; i++) {
          const prevX = x;
          const prevY = y;
          const n = 2 * i + 1; // odd harmonics for square wave
          const radius = (80 * (4 / (n * Math.PI)));
          x += radius * p.cos(n * time);
          y += radius * p.sin(n * time);

          if (showCircles) {
            p.noFill();
            p.stroke(circleColor);
            p.strokeWeight(1);
            p.ellipse(prevX, prevY, radius * 2);

            p.stroke(lineColor);
            p.strokeWeight(1.5);
            p.line(prevX, prevY, x, y);
          }
        }

        // Tip dot
        p.fill(dotColor);
        p.noStroke();
        p.ellipse(x, y, 8);

        // Add current y to wave
        wave.unshift(y);
        if (wave.length > 350) wave.pop();

        // Connect tip to wave (dashed)
        const waveStartX = 320;
        p.stroke(lineColor);
        p.strokeWeight(1);
        (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 4]);
        p.line(x, y, waveStartX, wave[0]);
        (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

        // Draw wave
        p.noFill();
        p.stroke(waveColor);
        p.strokeWeight(2.5);
        p.beginShape();
        for (let i = 0; i < wave.length; i++) {
          p.vertex(waveStartX + i, wave[i]);
        }
        p.endShape();

        // Labels
        p.noStroke();
        p.fill(fg);
        p.textSize(13);
        p.textAlign(p.LEFT, p.TOP);
        p.text(`Terms: ${numTerms}`, 14, 14);

        // Target square wave overlay (faint)
        p.stroke(isDark ? p.color(80, 80, 80) : p.color(200, 200, 200));
        p.strokeWeight(1);
        for (let i = 0; i < wave.length - 1; i += 1) {
          const t = time - i * 0.02 * speed;
          const sq = Math.sign(Math.sin(t));
          const ty = height / 2 + sq * 80 * (4 / Math.PI) * 0.78;
          const ty2 = height / 2 + Math.sign(Math.sin(t - 0.02 * speed)) * 80 * (4 / Math.PI) * 0.78;
          if (Math.abs(ty - ty2) < 2) {
            p.point(waveStartX + i, ty);
          }
        }

        time += 0.02 * speed;
      };
    },
    [numTerms, speed, showCircles]
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card">
        <Canvas sketch={sketch} />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Number of terms slider */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Number of Terms
          </label>
          <input
            id="fourier-terms-slider"
            type="range"
            min={1}
            max={30}
            value={numTerms}
            onChange={(e) => setNumTerms(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">1</span>
            <span className="text-sm font-mono font-semibold text-primary">
              {numTerms}
            </span>
            <span className="text-xs text-muted-foreground">30</span>
          </div>
        </div>

        {/* Speed slider */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Animation Speed
          </label>
          <input
            id="fourier-speed-slider"
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-purple-500 to-blue-500 cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">0.5×</span>
            <span className="text-sm font-mono font-semibold text-primary">
              {speed}×
            </span>
            <span className="text-xs text-muted-foreground">5×</span>
          </div>
        </div>

        {/* Show circles toggle */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col justify-between">
          <label className="block text-sm font-medium text-foreground mb-2">
            Show Epicycles
          </label>
          <button
            id="fourier-circles-toggle"
            onClick={() => setShowCircles(!showCircles)}
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${showCircles
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
          >
            {showCircles ? "✦ Visible" : "Hidden"}
          </button>
        </div>
      </div>
    </div>
  );
}
