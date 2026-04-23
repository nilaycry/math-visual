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

        const inputX = 130;
        const outputX = 530;
        const inputYs = [90, 170, 250];
        const outputYs = [120, 220];
        const nodeR = 22;

        const weightColor = (w: number) => {
          const t = Math.max(-1, Math.min(1, w));
          if (t >= 0) {
            const g = Math.round(80 + t * 140);
            return p.color(80, g, 160, 200);
          } else {
            const r = Math.round(80 + (-t) * 160);
            return p.color(r, 80, 80, 200);
          }
        };

        p.setup = () => {
          p.createCanvas(W_C, H_C);
          p.textFont("Inter");
          p.noLoop();
        };

        p.draw = () => {
          p.background(13, 17, 23);

          const cx = xRef.current;
          const cW = WRef.current;
          const cb = bRef.current;
          const outs = getOutputs(cx, cW, cb);

          // Draw weight connections
          for (let o = 0; o < 2; o++) {
            for (let i = 0; i < 3; i++) {
              const w = cW[o][i];
              const wt = Math.abs(w) * 5 + 0.5;
              p.strokeWeight(wt);
              p.stroke(weightColor(w));
              p.line(inputX + nodeR, inputYs[i], outputX - nodeR, outputYs[o]);
            }
          }

          // Input nodes
          for (let i = 0; i < 3; i++) {
            const val = cx[i];
            const bright = Math.min(255, Math.abs(val) * 140 + 60);
            p.fill(bright * 0.4, bright * 0.6, bright);
            p.stroke(40, 80, 140);
            p.strokeWeight(1.5);
            p.circle(inputX, inputYs[i], nodeR * 2);

            p.fill(220);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(12);
            p.text(val.toFixed(1), inputX, inputYs[i]);

            p.fill(120);
            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(11);
            p.text(`x${i + 1}`, inputX - nodeR - 6, inputYs[i]);
          }

          // Output nodes
          for (let o = 0; o < 2; o++) {
            const val = outs[o];
            const clamped = Math.max(-2, Math.min(2, val));
            const bright = Math.abs(clamped) * 100 + 60;
            p.fill(bright * 0.5, bright, bright * 0.6);
            p.stroke(40, 120, 80);
            p.strokeWeight(1.5);
            p.circle(outputX, outputYs[o], nodeR * 2);

            p.fill(220);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(11);
            p.text(val.toFixed(2), outputX, outputYs[o]);

            p.fill(120);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(11);
            p.text(`ŷ${o + 1}`, outputX + nodeR + 6, outputYs[o]);
          }

          // Layer labels
          p.fill(80);
          p.noStroke();
          p.textAlign(p.CENTER, p.BOTTOM);
          p.textSize(10);
          p.text("inputs  x", inputX, H_C - 10);
          p.text("outputs  ŷ = Wx + b", outputX, H_C - 10);

          // W matrix label in the middle
          p.fill(60);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(10);
          p.text("W  (2×3)", (inputX + outputX) / 2, H_C / 2 + 60);
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
    <div className="space-y-4">
      <div className="sketch-wrap border border-[#1a1a1a] flex justify-center">
        <div ref={containerRef} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        {/* Inputs */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col gap-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center mb-1">inputs</div>
          {x.map((v, i) => (
            <div key={i} className="sketch-slider-row" style={{ padding: 0 }}>
              <div className="sketch-slider-header">
                <span className="sketch-label">x{i + 1}</span>
                <span className="sketch-value">{v.toFixed(2)}</span>
              </div>
              <input type="range" min={-2} max={2} step={0.05} value={v}
                onChange={e => setXi(i, parseFloat(e.target.value))}
                className="sketch-range" />
            </div>
          ))}
        </div>

        {/* Weights */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col gap-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center mb-1">weights W</div>
          {W.map((row, o) =>
            row.map((v, i) => (
              <div key={`${o}-${i}`} className="sketch-slider-row" style={{ padding: 0 }}>
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

        {/* Biases + Outputs */}
        <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col gap-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center mb-1">biases</div>
          {b.map((v, i) => (
            <div key={i} className="sketch-slider-row" style={{ padding: 0 }}>
              <div className="sketch-slider-header">
                <span className="sketch-label">b{i + 1}</span>
                <span className="sketch-value">{v.toFixed(2)}</span>
              </div>
              <input type="range" min={-2} max={2} step={0.05} value={v}
                onChange={e => setBi(i, parseFloat(e.target.value))}
                className="sketch-range" />
            </div>
          ))}
          <div className="border-t border-border/50 pt-3 mt-1 flex flex-col gap-2">
            {outs.map((v, i) => (
              <div key={i} className="flex items-center justify-between px-1">
                <span className="text-xs text-muted-foreground font-mono">ŷ{i + 1}</span>
                <span className="text-sm font-mono font-semibold text-primary">{v.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
