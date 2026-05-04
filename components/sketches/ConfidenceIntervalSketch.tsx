"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";

type IntervalRecord = {
  mean: number;
  lower: number;
  upper: number;
  covers: boolean;
};

const zValues: Record<number, number> = {
  90: 1.645,
  95: 1.96,
  99: 2.576,
};

function sampleNormal() {
  const u1 = Math.max(Math.random(), 1e-8);
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export default function ConfidenceIntervalSketch() {
  const [sampleSize, setSampleSize] = useState(20);
  const [confidence, setConfidence] = useState<90 | 95 | 99>(95);
  const [intervals, setIntervals] = useState<IntervalRecord[]>([]);

  const sizeRef = useRef(sampleSize);
  const confRef = useRef(confidence);
  const intervalsRef = useRef(intervals);
  sizeRef.current = sampleSize;
  confRef.current = confidence;
  intervalsRef.current = intervals;

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
        const trueMean = 0;
        const xMin = -1.3;
        const xMax = 1.3;
        const xToScreen = (x: number) => 70 + ((x - xMin) / (xMax - xMin)) * 520;

        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Space Grotesk");
          p.noLoop();
        };

        p.draw = () => {
          p.background(13, 17, 23);

          p.stroke(65);
          p.strokeWeight(1);
          for (let tick = -1; tick <= 1; tick += 0.5) {
            const sx = xToScreen(tick);
            p.line(sx, 70, sx, 390);
            p.noStroke();
            p.fill(110);
            p.textAlign(p.CENTER, p.TOP);
            p.text(tick.toFixed(1), sx, 396);
            p.stroke(65);
          }

          const meanX = xToScreen(trueMean);
          p.stroke(232, 160, 32);
          p.strokeWeight(2.5);
          p.line(meanX, 54, meanX, 390);
          p.noStroke();
          p.fill(232, 160, 32);
          p.textAlign(p.CENTER, p.TOP);
          p.text("true mean", meanX, 28);

          const records = intervalsRef.current.slice(-18);
          records.forEach((record, index) => {
            const y = 86 + index * 16;
            p.stroke(record.covers ? p.color(93, 202, 165) : p.color(224, 90, 106));
            p.strokeWeight(2);
            p.line(xToScreen(record.lower), y, xToScreen(record.upper), y);
            p.line(xToScreen(record.lower), y - 4, xToScreen(record.lower), y + 4);
            p.line(xToScreen(record.upper), y - 4, xToScreen(record.upper), y + 4);
            p.noStroke();
            p.fill(record.covers ? p.color(93, 202, 165) : p.color(224, 90, 106));
            p.circle(xToScreen(record.mean), y, 5);
          });

          const coverage =
            intervalsRef.current.length === 0
              ? 0
              : intervalsRef.current.filter((record) => record.covers).length / intervalsRef.current.length;

          p.fill(180);
          p.textAlign(p.LEFT, p.TOP);
          p.text("each horizontal segment is one interval from one fresh sample", 18, 18);
          p.fill(130);
          p.text(
            `nominal level = ${confRef.current}%   observed coverage = ${(coverage * 100).toFixed(1)}%`,
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

  const redraw = () => setTimeout(() => p5Ref.current?.redraw(), 0);

  const generateIntervals = (count: number) => {
    const z = zValues[confRef.current];
    const next = [...intervalsRef.current];

    for (let i = 0; i < count; i++) {
      const sample = Array.from({ length: sizeRef.current }, () => sampleNormal());
      const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
      const margin = z / Math.sqrt(sizeRef.current);
      next.push({
        mean,
        lower: mean - margin,
        upper: mean + margin,
        covers: mean - margin <= 0 && 0 <= mean + margin,
      });
    }

    setIntervals(next.slice(-60));
    redraw();
  };

  const reset = () => {
    setIntervals([]);
    redraw();
  };

  return (
    <div>
      <div className="sketch-wrap">
        <div ref={containerRef} />
      </div>

      <div className="sketch-controls">
        <div className="sketch-slider-row" style={{ minWidth: 180 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">sample size</span>
            <span className="sketch-value">{sampleSize}</span>
          </div>
          <input
            type="range"
            min={5}
            max={80}
            step={1}
            value={sampleSize}
            onChange={(e) => {
              setSampleSize(parseInt(e.target.value, 10));
              reset();
            }}
            className="sketch-range"
          />
        </div>

        {[90, 95, 99].map((level) => (
          <button
            key={level}
            onClick={() => {
              setConfidence(level as 90 | 95 | 99);
              reset();
            }}
            className={`sketch-btn ${confidence === level ? "sketch-btn-active" : ""}`}
          >
            {level}% level
          </button>
        ))}

        <button onClick={() => generateIntervals(1)} className="sketch-btn">
          generate one
        </button>
        <button onClick={() => generateIntervals(25)} className="sketch-btn">
          generate 25
        </button>
        <button onClick={reset} className="sketch-btn">
          reset
        </button>
      </div>
    </div>
  );
}
