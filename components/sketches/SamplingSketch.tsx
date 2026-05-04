"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";

type PopulationKind = "uniform" | "skewed" | "bimodal";

function sampleFromPopulation(kind: PopulationKind) {
  if (kind === "uniform") return Math.random();
  if (kind === "skewed") return Math.pow(Math.random(), 2.4);
  return Math.random() < 0.5
    ? Math.max(0, Math.min(1, 0.28 + (Math.random() - 0.5) * 0.18))
    : Math.max(0, Math.min(1, 0.74 + (Math.random() - 0.5) * 0.18));
}

export default function SamplingSketch() {
  const [populationKind, setPopulationKind] = useState<PopulationKind>("skewed");
  const [sampleSize, setSampleSize] = useState(8);
  const [sample, setSample] = useState<number[]>([]);
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);

  const kindRef = useRef(populationKind);
  const sizeRef = useRef(sampleSize);
  const sampleRef = useRef(sample);
  const meansRef = useRef(sampleMeans);
  kindRef.current = populationKind;
  sizeRef.current = sampleSize;
  sampleRef.current = sample;
  meansRef.current = sampleMeans;

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

        const makePopulationCurve = (kind: PopulationKind) => {
          const bins = new Array(24).fill(0);
          for (let i = 0; i < 2400; i++) {
            const value = sampleFromPopulation(kind);
            bins[Math.min(bins.length - 1, Math.floor(value * bins.length))] += 1;
          }
          return bins;
        };

        const drawHistogram = (
          bins: number[],
          x: number,
          y: number,
          w: number,
          h: number,
          color: [number, number, number]
        ) => {
          const maxCount = Math.max(...bins, 1);
          const barW = w / bins.length;
          p.noStroke();
          bins.forEach((count, index) => {
            const barH = (count / maxCount) * h;
            p.fill(color[0], color[1], color[2], 150);
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

          const curve = makePopulationCurve(kindRef.current);
          drawHistogram(curve, 52, 66, 556, 110, [91, 141, 217]);

          p.fill(185);
          p.noStroke();
          p.textAlign(p.LEFT, p.TOP);
          p.text("population shape", 52, 40);
          p.fill(120);
          p.text("same source every time, even though each sample is different", 52, 182);

          p.stroke(70);
          p.line(52, 220, 608, 220);

          const activeSample = sampleRef.current;
          p.fill(220);
          p.text("current sample", 52, 202);
          activeSample.forEach((value, index) => {
            const sx = 72 + value * 500;
            const sy = 250 + (index % 4) * 18;
            p.noStroke();
            p.fill(232, 160, 32);
            p.circle(sx, sy, 8);
          });

          if (activeSample.length > 0) {
            const mean = activeSample.reduce((sum, value) => sum + value, 0) / activeSample.length;
            const mx = 72 + mean * 500;
            p.stroke(232, 160, 32);
            p.strokeWeight(2);
            p.line(mx, 230, mx, 328);
            p.noStroke();
            p.fill(232, 160, 32);
            p.text(`sample mean = ${mean.toFixed(3)}`, mx - 46, 332);
          }

          const means = meansRef.current;
          const meanBins = new Array(20).fill(0);
          means.forEach((value) => {
            meanBins[Math.min(meanBins.length - 1, Math.floor(value * meanBins.length))] += 1;
          });
          drawHistogram(meanBins, 52, 292, 556, 96, [93, 202, 165]);

          p.fill(185);
          p.text("means from repeated samples", 52, 268);
          p.fill(130);
          p.text(`n = ${sizeRef.current}, repetitions stored = ${means.length}`, 410, 268);
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

  const takeSample = (repetitions: number) => {
    let latestSample: number[] = sampleRef.current;
    const nextMeans = [...meansRef.current];

    for (let r = 0; r < repetitions; r++) {
      latestSample = Array.from({ length: sizeRef.current }, () => sampleFromPopulation(kindRef.current));
      const mean = latestSample.reduce((sum, value) => sum + value, 0) / latestSample.length;
      nextMeans.push(mean);
    }

    setSample(latestSample);
    setSampleMeans(nextMeans.slice(-400));
    redraw();
  };

  const reset = () => {
    setSample([]);
    setSampleMeans([]);
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
            min={2}
            max={30}
            step={1}
            value={sampleSize}
            onChange={(e) => {
              setSampleSize(parseInt(e.target.value, 10));
              redraw();
            }}
            className="sketch-range"
          />
        </div>

        <button
          onClick={() => {
            setPopulationKind("uniform");
            reset();
          }}
          className={`sketch-btn ${populationKind === "uniform" ? "sketch-btn-active" : ""}`}
        >
          uniform source
        </button>
        <button
          onClick={() => {
            setPopulationKind("skewed");
            reset();
          }}
          className={`sketch-btn ${populationKind === "skewed" ? "sketch-btn-active" : ""}`}
        >
          skewed source
        </button>
        <button
          onClick={() => {
            setPopulationKind("bimodal");
            reset();
          }}
          className={`sketch-btn ${populationKind === "bimodal" ? "sketch-btn-active" : ""}`}
        >
          bimodal source
        </button>
        <button onClick={() => takeSample(1)} className="sketch-btn">
          draw one sample
        </button>
        <button onClick={() => takeSample(50)} className="sketch-btn">
          draw fifty
        </button>
        <button onClick={reset} className="sketch-btn">
          reset
        </button>
      </div>
    </div>
  );
}
