"use client";

import { useState, useRef } from "react";
import { useP5Sketch } from "@/hooks/useP5Sketch";
import p5 from "p5";

export default function FourierSketch() {
  const [numTerms, setNumTerms] = useState(5);
  const [speed, setSpeed] = useState(1);
  const [showCircles, setShowCircles] = useState(true);

  const numTermsRef = useRef(numTerms);
  const speedRef = useRef(speed);
  const showCirclesRef = useRef(showCircles);
  numTermsRef.current = numTerms;
  speedRef.current = speed;
  showCirclesRef.current = showCircles;

  const containerRef = useP5Sketch((el) => {
    return new p5((p: p5) => {
      let time = 0;
      const wave: number[] = [];
      const W = 700;
      const H = 400;

      p.setup = () => {
        p.createCanvas(W, H);
        p.textFont("Space Grotesk");
      };

      p.draw = () => {
        const n = numTermsRef.current;
        const spd = speedRef.current;
        const circles = showCirclesRef.current;

        p.background(13, 17, 23);

        p.stroke(40);
        p.strokeWeight(0.5);
        for (let gx = 0; gx < W; gx += 40) p.line(gx, 0, gx, H);
        for (let gy = 0; gy < H; gy += 40) p.line(0, gy, W, gy);

        let x = 200;
        let y = H / 2;

        for (let i = 0; i < n; i++) {
          const prevX = x;
          const prevY = y;
          const harmonic = 2 * i + 1;
          const radius = 80 * (4 / (harmonic * Math.PI));
          x += radius * p.cos(harmonic * time);
          y += radius * p.sin(harmonic * time);

          if (circles) {
            p.noFill();
            p.stroke(100, 200, 220, 80);
            p.strokeWeight(1);
            p.ellipse(prevX, prevY, radius * 2);
            p.stroke(100, 200, 220, 150);
            p.strokeWeight(1.5);
            p.line(prevX, prevY, x, y);
          }
        }

        p.fill(255, 200, 80);
        p.noStroke();
        p.ellipse(x, y, 8);

        wave.unshift(y);
        if (wave.length > 350) wave.pop();

        const waveStartX = 320;
        p.stroke(100, 200, 220, 150);
        p.strokeWeight(1);
        (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 4]);
        p.line(x, y, waveStartX, wave[0]);
        (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

        p.noFill();
        p.stroke(130, 100, 255);
        p.strokeWeight(2.5);
        p.beginShape();
        for (let i = 0; i < wave.length; i++) {
          p.vertex(waveStartX + i, wave[i]);
        }
        p.endShape();

        p.noStroke();
        p.fill(210, 215, 230);
        p.textSize(13);
        p.textAlign(p.LEFT, p.TOP);
        p.text(`Terms: ${n}`, 14, 14);

        time += 0.02 * spd;
      };
    }, el);
  });

  return (
    <div className="space-y-5">
      <div className="sketch-wrap">
        <div ref={containerRef} />
      </div>

      <div className="sketch-controls" style={{ flexWrap: "wrap" }}>
        <div className="sketch-slider-row" style={{ flex: 1, minWidth: 160 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">terms</span>
            <span className="sketch-value">{numTerms}</span>
          </div>
          <input
            type="range" min={1} max={30} value={numTerms}
            onChange={(e) => setNumTerms(parseInt(e.target.value))}
            className="sketch-range"
          />
        </div>

        <div className="sketch-slider-row" style={{ flex: 1, minWidth: 160 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">speed</span>
            <span className="sketch-value">{speed}×</span>
          </div>
          <input
            type="range" min={0.5} max={5} step={0.5} value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="sketch-range"
          />
        </div>

        <button
          onClick={() => setShowCircles(!showCircles)}
          className={`sketch-btn ${showCircles ? "sketch-btn-active" : ""}`}
        >
          {showCircles ? "epicycles: on" : "epicycles: off"}
        </button>
      </div>
    </div>
  );
}
