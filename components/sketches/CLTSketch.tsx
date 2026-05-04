"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";

type SourceKind = "bernoulli" | "uniform" | "skewed";

function drawSourceValue(kind: SourceKind) {
  if (kind === "bernoulli") return Math.random() < 0.25 ? 1 : 0;
  if (kind === "uniform") return Math.random();
  return Math.pow(Math.random(), 3);
}

export default function CLTSketch() {
  const [sourceKind, setSourceKind] = useState<SourceKind>("bernoulli");
  const [sampleSize, setSampleSize] = useState(5);
  const [means, setMeans] = useState<number[]>([]);

  const sourceRef = useRef(sourceKind);
  const sizeRef = useRef(sampleSize);
  const meansRef = useRef(means);
  sourceRef.current = sourceKind;
  sizeRef.current = sampleSize;
  meansRef.current = means;

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

        const drawBars = (
          values: number[],
          x: number,
          y: number,
          w: number,
          h: number,
          color: [number, number, number]
        ) => {
          const bins = new Array(24).fill(0);
          values.forEach((value) => {
            bins[Math.min(bins.length - 1, Math.floor(value * bins.length))] += 1;
          });
          const maxCount = Math.max(...bins, 1);
          const barW = w / bins.length;
          p.noStroke();
          bins.forEach((count, index) => {
            const barH = (count / maxCount) * h;
            p.fill(color[0], color[1], color[2], 160);
            p.rect(x + index * barW, y + h - barH, barW - 1, barH);
          });
          p.noFill();
          p.stroke(70);
          p.rect(x, y, w, h);
        };

        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Space Grotesk");
          p.noLoop();
        };

        p.draw = () => {
          p.background(13, 17, 23);

          const sourceSamples = Array.from({ length: 1600 }, () => drawSourceValue(sourceRef.current));
          drawBars(sourceSamples, 52, 70, 556, 110, [224, 90, 106]);
          p.fill(185);
          p.noStroke();
          p.textAlign(p.LEFT, p.TOP);
          p.text("source distribution", 52, 42);
          p.fill(125);
          p.text("this does not need to look normal", 52, 184);

          drawBars(meansRef.current, 52, 260, 556, 130, [96, 165, 250]);
          p.fill(185);
          p.text("distribution of sample means", 52, 232);
          p.fill(125);
          p.text(
            `sample size n = ${sizeRef.current}, stored means = ${meansRef.current.length}`,
            340,
            232
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

  const generateMeans = (count: number) => {
    const next = [...meansRef.current];
    for (let i = 0; i < count; i++) {
      const sample = Array.from({ length: sizeRef.current }, () => drawSourceValue(sourceRef.current));
      next.push(sample.reduce((sum, value) => sum + value, 0) / sample.length);
    }
    setMeans(next.slice(-1000));
    redraw();
  };

  const reset = () => {
    setMeans([]);
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
            min={1}
            max={40}
            step={1}
            value={sampleSize}
            onChange={(e) => {
              setSampleSize(parseInt(e.target.value, 10));
              reset();
            }}
            className="sketch-range"
          />
        </div>

        <button
          onClick={() => {
            setSourceKind("bernoulli");
            reset();
          }}
          className={`sketch-btn ${sourceKind === "bernoulli" ? "sketch-btn-active" : ""}`}
        >
          bernoulli
        </button>
        <button
          onClick={() => {
            setSourceKind("uniform");
            reset();
          }}
          className={`sketch-btn ${sourceKind === "uniform" ? "sketch-btn-active" : ""}`}
        >
          uniform
        </button>
        <button
          onClick={() => {
            setSourceKind("skewed");
            reset();
          }}
          className={`sketch-btn ${sourceKind === "skewed" ? "sketch-btn-active" : ""}`}
        >
          skewed
        </button>
        <button onClick={() => generateMeans(50)} className="sketch-btn">
          add 50 means
        </button>
        <button onClick={() => generateMeans(250)} className="sketch-btn">
          add 250 means
        </button>
        <button onClick={reset} className="sketch-btn">
          reset
        </button>
      </div>
    </div>
  );
}
