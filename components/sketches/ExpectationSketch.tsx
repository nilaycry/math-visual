"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";

const positions = [-3, -1, 1, 3];
const labels = ["A", "B", "C", "D"];

export default function ExpectationSketch() {
  const [weights, setWeights] = useState([0.2, 0.35, 0.3, 0.15]);
  const weightsRef = useRef(weights);
  weightsRef.current = weights;

  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    while (el.firstChild) el.removeChild(el.firstChild);

    const timer = setTimeout(() => {
      if (cancelled || !el) return;
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }

      p5Ref.current = new p5((p: p5) => {
        const W = 660;
        const H = 440;
        const left = 80;
        const right = W - 80;
        const axisY = 270;
        const scale = (right - left) / 8;

        const xToScreen = (x: number) => left + (x + 4) * scale;

        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Space Grotesk");
          p.noLoop();
        };

        p.draw = () => {
          const currentWeights = weightsRef.current;
          const total = currentWeights.reduce((sum, value) => sum + value, 0);
          const normalized = currentWeights.map((value) => value / total);
          const expectation = normalized.reduce(
            (sum, value, index) => sum + value * positions[index],
            0
          );

          p.background(13, 17, 23);

          p.stroke(52);
          p.strokeWeight(1);
          for (let x = -4; x <= 4; x += 1) {
            const sx = xToScreen(x);
            p.line(sx, 110, sx, 330);
          }

          p.stroke(110);
          p.strokeWeight(2);
          p.line(left, axisY, right, axisY);

          for (let x = -4; x <= 4; x += 1) {
            const sx = xToScreen(x);
            p.stroke(120);
            p.line(sx, axisY - 8, sx, axisY + 8);
            p.noStroke();
            p.fill(130);
            p.textAlign(p.CENTER, p.TOP);
            p.text(`${x}`, sx, axisY + 12);
          }

          normalized.forEach((weight, index) => {
            const sx = xToScreen(positions[index]);
            const massHeight = 36 + weight * 160;
            const topY = axisY - massHeight;

            p.noStroke();
            p.fill(91, 141, 217, 55);
            p.rect(sx - 18, topY, 36, massHeight, 8);
            p.fill(91, 141, 217);
            p.circle(sx, topY, 18);

            p.fill(220);
            p.textAlign(p.CENTER, p.BOTTOM);
            p.text(labels[index], sx, topY - 10);
            p.fill(150);
            p.textSize(12);
            p.text(`${weight.toFixed(2)}`, sx, topY - 28);
            p.textSize(14);
          });

          const ex = xToScreen(expectation);
          p.stroke(232, 160, 32);
          p.strokeWeight(2.5);
          p.line(ex, 95, ex, axisY + 2);
          p.noStroke();
          p.fill(232, 160, 32);
          p.triangle(ex, 88, ex - 8, 102, ex + 8, 102);

          p.fill(232, 160, 32);
          p.textAlign(p.CENTER, p.TOP);
          p.text(`expected value = ${expectation.toFixed(2)}`, ex, 52);

          p.fill(180);
          p.textAlign(p.LEFT, p.TOP);
          p.text("weighted masses on a number line", 18, 18);
          p.fill(130);
          p.text(
            "as the weights shift, the balance point shifts with them",
            18,
            38
          );
        };
      }, el);
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
    };
  }, []);

  const updateWeight = (index: number, value: number) => {
    const next = [...weights];
    next[index] = value;
    setWeights(next);
    setTimeout(() => p5Ref.current?.redraw(), 0);
  };

  const expectation = (() => {
    const total = weights.reduce((sum, value) => sum + value, 0);
    return weights.reduce((sum, value, index) => sum + (value / total) * positions[index], 0);
  })();

  return (
    <div>
      <div className="sketch-wrap">
        <div ref={containerRef} />
      </div>

      <div className="sketch-controls" style={{ alignItems: "flex-start" }}>
        {weights.map((weight, index) => (
          <div key={labels[index]} className="sketch-slider-row" style={{ minWidth: 120, flex: 1 }}>
            <div className="sketch-slider-header">
              <span className="sketch-label">{labels[index]} at x = {positions[index]}</span>
              <span className="sketch-value">{weight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.7}
              step={0.01}
              value={weight}
              onChange={(e) => updateWeight(index, parseFloat(e.target.value))}
              className="sketch-range"
            />
          </div>
        ))}
        <span className="sketch-note" style={{ marginLeft: 0 }}>
          E[X] = {expectation.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
