"use client";

import { useState, useEffect, useRef } from "react";
import p5 from "p5";

const ROW_COLORS = [
  { r: 93,  g: 202, b: 165 }, // teal  — row 1 / ŷ1
  { r: 240, g: 165, b:   0 }, // orange — row 2 / ŷ2
];

export default function WeightMatrixSketch() {
  const [x, setX] = useState([1.0, 0.5, -0.5]);
  const [W, setW] = useState([
    [ 0.8,  0.4, -0.3],
    [-0.2,  0.7,  0.6],
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
        const H_C = 270;

        const inputX  = 150;
        const outputX = 510;
        const inputYs  = [55, 135, 215];
        const outputYs = [95, 175];
        const nodeR = 26;

        p.setup = () => {
          p.createCanvas(W_C, H_C);
          p.textFont("Inter");
          p.noLoop();
        };

        p.draw = () => {
          p.background(13, 17, 23);

          const cx  = xRef.current;
          const cW  = WRef.current;
          const cb  = bRef.current;
          const outs = getOutputs(cx, cW, cb);

          // Connections: colored by output row, opacity by |weight|
          p.strokeWeight(1.5);
          for (let o = 0; o < 2; o++) {
            const { r, g, b: bc } = ROW_COLORS[o];
            for (let i = 0; i < 3; i++) {
              const w   = cW[o][i];
              const mag = Math.min(Math.abs(w) / 1.5, 1); // normalize to [0,1]
              const alpha = Math.round(30 + mag * 210);   // 30 (faint) – 240 (solid)
              p.stroke(r, g, bc, alpha);
              p.line(inputX + nodeR, inputYs[i], outputX - nodeR, outputYs[o]);
            }
          }

          // Input nodes — flat muted blue, fixed
          for (let i = 0; i < 3; i++) {
            p.fill(45, 65, 115);
            p.stroke(70, 100, 170);
            p.strokeWeight(1.5);
            p.circle(inputX, inputYs[i], nodeR * 2);

            p.fill(200);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(13);
            p.text(cx[i].toFixed(2), inputX, inputYs[i]);

            p.fill(70);
            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(11);
            p.text(`x${i + 1}`, inputX - nodeR - 8, inputYs[i]);
          }

          // Output nodes — colored by row
          for (let o = 0; o < 2; o++) {
            const { r, g, b: bc } = ROW_COLORS[o];
            p.fill(r * 0.25, g * 0.25, bc * 0.25);
            p.stroke(r * 0.6, g * 0.6, bc * 0.6);
            p.strokeWeight(1.5);
            p.circle(outputX, outputYs[o], nodeR * 2);

            p.fill(220);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(13);
            p.text(outs[o].toFixed(2), outputX, outputYs[o]);

            p.fill(r * 0.55, g * 0.55, bc * 0.55);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(11);
            p.text(`ŷ${o + 1}`, outputX + nodeR + 8, outputYs[o]);
          }
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

  // Row accent colors as CSS strings
  const rowCss = ["#5DCAA5", "#F0A500"];

  return (
    <div className="space-y-0">
      {/* Canvas */}
      <div className="sketch-wrap">
        <div ref={containerRef} />
      </div>

      {/* Live W matrix grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr 1fr 1fr",
          gap: "1px",
          background: "#1a1a1a",
          border: "1px solid #1a1a1a",
          borderRadius: 10,
          overflow: "hidden",
          fontSize: 12,
          fontFamily: "monospace",
          marginTop: 2,
        }}
      >
        {/* Header row */}
        <div style={{ background: "#0d1117", padding: "6px 14px", color: "#333", fontSize: 10, display: "flex", alignItems: "center" }}>W</div>
        {["x₁", "x₂", "x₃"].map(label => (
          <div key={label} style={{ background: "#0d1117", padding: "6px 0", color: "#444", fontSize: 10, textAlign: "center" }}>{label}</div>
        ))}

        {/* Weight rows */}
        {W.map((row, o) => (
          <>
            <div key={`row-${o}`} style={{ background: "#0d1117", padding: "8px 14px", color: rowCss[o], fontSize: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: rowCss[o], display: "inline-block", opacity: 0.7 }} />
              ŷ{o + 1}
            </div>
            {row.map((v, i) => {
              const mag = Math.min(Math.abs(v) / 1.5, 1);
              const opacity = 0.25 + mag * 0.75;
              return (
                <div key={`w${o}${i}`} style={{
                  background: "#0d1117",
                  padding: "8px 0",
                  textAlign: "center",
                  color: rowCss[o],
                  opacity,
                  fontWeight: 500,
                  transition: "opacity 0.15s, color 0.15s",
                }}>
                  {v >= 0 ? "+" : ""}{v.toFixed(2)}
                </div>
              );
            })}
          </>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginTop: 20 }}>
        {/* Inputs */}
        <div className="space-y-4">
          <div className="sketch-label tracking-[0.2em] opacity-60">inputs</div>
          <div className="space-y-5">
            {x.map((v, i) => (
              <div key={i} className="sketch-slider-row">
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
        </div>

        {/* Weights */}
        <div className="space-y-4">
          <div className="sketch-label tracking-[0.2em] opacity-60">weights W</div>
          <div className="space-y-5">
            {W.map((row, o) =>
              row.map((v, i) => (
                <div key={`${o}-${i}`} className="sketch-slider-row">
                  <div className="sketch-slider-header">
                    <span className="sketch-label" style={{ color: rowCss[o] }}>w{o + 1}{i + 1}</span>
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
                  <span className="sketch-label" style={{ color: rowCss[i] }}>b{i + 1}</span>
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
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: rowCss[i] }}>ŷ{i + 1}</span>
                  <span className="text-sm font-semibold" style={{ color: rowCss[i] }}>{v.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
