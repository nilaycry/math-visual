"use client";

import { useState, useEffect, useRef } from "react";
import p5 from "p5";

export default function WeightMatrixSketch() {
  // 3 inputs, 2 outputs → 6 weights + 2 biases
  const [x, setX] = useState([1.0, 0.5, -0.5]);
  const [W, setW] = useState([
    [0.8, 0.4, -0.3],
    [-0.2, 0.7, 0.6],
  ]);
  const [b, setB] = useState([0.2, -0.1]);

  const xRef = useRef(x);
  const WRef = useRef(W);
  const bRef = useRef(b);
  xRef.current = x;
  WRef.current = W;
  bRef.current = b;

  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  const getOutputs = (cx: number[], cW: number[][], cb: number[]) => [
    cW[0][0] * cx[0] + cW[0][1] * cx[1] + cW[0][2] * cx[2] + cb[0],
    cW[1][0] * cx[0] + cW[1][1] * cx[1] + cW[1][2] * cx[2] + cb[1],
  ];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    while (el.firstChild) el.removeChild(el.firstChild);

    const timer = setTimeout(() => {
      if (cancelled || !el) return;
      if (p5Ref.current) { p5Ref.current.remove(); p5Ref.current = null; }

      p5Ref.current = new p5((p: p5) => {
        const W_C = 660;
        const H_C = 340;

        const inputX = 140;
        const outputX = 520;
        const inputYs = [100, 180, 260];
        const outputYs = [130, 230];
        const nodeR = 26;

        const weightColor = (w: number) => {
          const t = Math.max(-1, Math.min(1, w));
          if (t >= 0) {
            const g = Math.round(100 + t * 155);
            return p.color(60, g, 200, 200); // More vibrant blue/teal
          } else {
            const r = Math.round(100 + (-t) * 155);
            return p.color(r, 60, 80, 200); // More vibrant red
          }
        };

        p.setup = () => {
          p.createCanvas(W_C, H_C);
          p.textFont("Space Grotesk");
          p.noLoop();
        };

        p.draw = () => {
          p.background(10, 10, 10); // Standard dark background

          const cx = xRef.current;
          const cW = WRef.current;
          const cb = bRef.current;
          const outs = getOutputs(cx, cW, cb);

          // Draw weight connections
          for (let o = 0; o < 2; o++) {
            for (let i = 0; i < 3; i++) {
              const w = cW[o][i];
              const wt = Math.abs(w) * 6 + 0.8;
              p.strokeWeight(wt);
              p.stroke(weightColor(w));
              p.line(inputX + nodeR, inputYs[i], outputX - nodeR, outputYs[o]);
            }
          }

          // Input nodes
          for (let i = 0; i < 3; i++) {
            const val = cx[i];
            const bright = Math.min(255, Math.abs(val) * 150 + 70);
            p.fill(bright * 0.3, bright * 0.5, bright * 0.9);
            p.stroke(60, 100, 180);
            p.strokeWeight(2);
            p.circle(inputX, inputYs[i], nodeR * 2);

            p.fill(255);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(14);
            p.text(val.toFixed(1), inputX, inputYs[i]);

            p.fill(160);
            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(12);
            p.text(`x${i + 1}`, inputX - nodeR - 10, inputYs[i]);
          }

          // Output nodes
          for (let o = 0; o < 2; o++) {
            const val = outs[o];
            const clamped = Math.max(-2, Math.min(2, val));
            const bright = Math.abs(clamped) * 110 + 70;
            p.fill(bright * 0.4, bright * 0.9, bright * 0.5);
            p.stroke(60, 180, 100);
            p.strokeWeight(2);
            p.circle(outputX, outputYs[o], nodeR * 2);

            p.fill(255);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(13);
            p.text(val.toFixed(2), outputX, outputYs[o]);

            p.fill(160);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(12);
            p.text(`ŷ${o + 1}`, outputX + nodeR + 10, outputYs[o]);
          }

          // Layer labels
          p.fill(100);
          p.noStroke();
          p.textAlign(p.CENTER, p.BOTTOM);
          p.textSize(12);
          p.text("inputs  x", inputX, H_C - 15);
          p.text("outputs  ŷ = Wx + b", outputX, H_C - 15);

          // W matrix label - Moved to top center with a small background
          p.fill(20, 20, 20, 180);
          p.noStroke();
          const wLabelX = (inputX + outputX) / 2;
          const wLabelY = 40;
          p.rectMode(p.CENTER);
          p.rect(wLabelX, wLabelY, 100, 30, 6);
          
          p.fill(180);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(13);
          p.text("W (2×3)", wLabelX, wLabelY - 1);
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

  const redraw = () => setTimeout(() => p5Ref.current?.redraw(), 0);

  const setXi = (i: number, v: number) => {
    setX(prev => { const n = [...prev]; n[i] = v; xRef.current = n; redraw(); return n; });
  };
  const setWij = (o: number, i: number, v: number) => {
    setW(prev => {
      const n = prev.map(r => [...r]);
      n[o][i] = v;
      WRef.current = n;
      redraw();
      return n;
    });
  };
  const setBi = (i: number, v: number) => {
    setB(prev => { const n = [...prev]; n[i] = v; bRef.current = n; redraw(); return n; });
  };

  const outs = getOutputs(x, W, b);

  return (
    <div className="space-y-6">
      <div className="sketch-wrap">
        <div ref={containerRef} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="sketch-label tracking-[0.2em] opacity-60">inputs</div>
          <div className="space-y-5">
            {x.map((v, i) => (
              <div key={i} className="sketch-slider-row">
                <div className="sketch-slider-header">
                  <span className="sketch-label">x{i + 1}</span>
                  <span className="sketch-value">{v.toFixed(1)}</span>
                </div>
                <input type="range" min={-2} max={2} step={0.05} value={v}
                  onChange={e => setXi(i, parseFloat(e.target.value))}
                  className="sketch-range" />
              </div>
            ))}
          </div>
        </div>

        {/* Weights */}
        <div className="space-y-4">
          <div className="sketch-label tracking-[0.2em] opacity-60">weights W</div>
          <div className="grid grid-cols-1 gap-5">
            {W.map((row, o) =>
              row.map((v, i) => (
                <div key={`${o}-${i}`} className="sketch-slider-row">
                  <div className="sketch-slider-header">
                    <span className="sketch-label">w{o + 1}{i + 1}</span>
                    <span className="sketch-value">{v.toFixed(2)}</span>
                  </div>
                  <input type="range" min={-1.5} max={1.5} step={0.05} value={v}
                    onChange={e => setWij(o, i, parseFloat(e.target.value))}
                    className="sketch-range" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Biases + Outputs */}
        <div className="space-y-4">
          <div className="sketch-label tracking-[0.2em] opacity-60">biases & outputs</div>
          <div className="space-y-5">
            {b.map((v, i) => (
              <div key={i} className="sketch-slider-row">
                <div className="sketch-slider-header">
                  <span className="sketch-label">b{i + 1}</span>
                  <span className="sketch-value">{v.toFixed(2)}</span>
                </div>
                <input type="range" min={-2} max={2} step={0.05} value={v}
                  onChange={e => setBi(i, parseFloat(e.target.value))}
                  className="sketch-range" />
              </div>
            ))}
            <div className="pt-4 border-t border-white/5 space-y-3">
              {outs.map((v, i) => (
                <div key={i} className="flex items-center justify-between font-mono">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">ŷ{i + 1}</span>
                  <span className="text-sm font-semibold text-[#60a5fa]">{v.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
