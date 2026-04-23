"use client";

import { useState, useEffect, useRef } from "react";
import p5 from "p5";

export default function NetworkAnatomySketch() {
  const [x, setX] = useState([0.8, -0.5]);
  const xRef = useRef(x);
  xRef.current = x;

  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  // Fixed weights so the sketch is deterministic and illustrative
  // W1: 3×2, b1: 3  (hidden layer)
  // W2: 2×3, b2: 2  (output layer)
  const W1 = [
    [ 0.9, -0.4],
    [-0.6,  0.8],
    [ 0.3,  0.7],
  ];
  const b1 = [0.1, -0.2, 0.3];
  const W2 = [
    [ 0.7, -0.5,  0.6],
    [-0.3,  0.8, -0.4],
  ];
  const b2 = [0.0, 0.1];

  const tanh = (z: number) => Math.tanh(z);

  const forward = (cx: number[]) => {
    const z1 = W1.map((row, i) => row[0] * cx[0] + row[1] * cx[1] + b1[i]);
    const h1 = z1.map(tanh);
    const z2 = W2.map((row, i) => row[0] * h1[0] + row[1] * h1[1] + row[2] * h1[2] + b2[i]);
    const h2 = z2.map(tanh);
    return { z1, h1, z2, h2 };
  };

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
        const H_C = 380;
        const nodeR = 24;

        // Layer x positions
        const layerX = [110, 280, 450, 570];
        // Node y positions per layer
        const layerY = [
          [130, 250],           // inputs: 2 nodes
          [90, 190, 290],       // hidden: 3 nodes
          [130, 250],           // output: 2 nodes
        ];

        // Which node the user is hovering (for highlight)
        let hovered: [number, number] | null = null;

        const nodeColor = (val: number): p5.Color => {
          const t = Math.max(-1, Math.min(1, val));
          if (t >= 0) {
            const v = Math.round(40 + t * 180);
            return p.color(40, v * 0.8, v);
          } else {
            const v = Math.round(40 + (-t) * 180);
            return p.color(v, 40, 40);
          }
        };

        const edgeColor = (w: number): p5.Color => {
          const t = Math.max(-1.5, Math.min(1.5, w));
          if (t >= 0) {
            return p.color(60, 100, 200, 180);
          } else {
            return p.color(200, 60, 60, 180);
          }
        };

        p.setup = () => {
          p.createCanvas(W_C, H_C);
          p.textFont("Inter");
          p.noLoop();
        };

        p.mouseMoved = () => {
          // Check if hovering an input node to show cursor feedback
          hovered = null;
          for (let i = 0; i < 2; i++) {
            const nx = layerX[0];
            const ny = layerY[0][i];
            if (p.dist(p.mouseX, p.mouseY, nx, ny) < nodeR) {
              hovered = [0, i];
            }
          }
          p.redraw();
        };

        p.mousePressed = () => {
          // Clicking input nodes cycles value
          for (let i = 0; i < 2; i++) {
            const nx = layerX[0];
            const ny = layerY[0][i];
            if (p.dist(p.mouseX, p.mouseY, nx, ny) < nodeR) {
              const cur = xRef.current[i];
              const next = cur > 0.4 ? -0.8 : cur < -0.4 ? 0.0 : 0.8;
              setX(prev => {
                const n = [...prev];
                n[i] = next;
                xRef.current = n;
                return n;
              });
              setTimeout(() => p5Ref.current?.redraw(), 0);
            }
          }
        };

        p.draw = () => {
          p.background(13, 17, 23);

          const cx = xRef.current;
          const { h1, h2 } = forward(cx);

          // Draw edges: inputs → hidden
          for (let o = 0; o < 3; o++) {
            for (let i = 0; i < 2; i++) {
              const w = W1[o][i];
              p.stroke(edgeColor(w));
              p.strokeWeight(Math.abs(w) * 3 + 0.5);
              p.line(layerX[0] + nodeR, layerY[0][i], layerX[1] - nodeR, layerY[1][o]);
            }
          }

          // Draw edges: hidden → output
          for (let o = 0; o < 2; o++) {
            for (let i = 0; i < 3; i++) {
              const w = W2[o][i];
              p.stroke(edgeColor(w));
              p.strokeWeight(Math.abs(w) * 3 + 0.5);
              p.line(layerX[1] + nodeR, layerY[1][i], layerX[2] - nodeR, layerY[2][o]);
            }
          }

          // Draw nodes: inputs
          for (let i = 0; i < 2; i++) {
            const nx = layerX[0];
            const ny = layerY[0][i];
            const isHov = hovered?.[0] === 0 && hovered?.[1] === i;
            p.fill(nodeColor(cx[i]));
            p.stroke(isHov ? p.color(200, 200, 100) : p.color(40, 60, 100));
            p.strokeWeight(isHov ? 2.5 : 1.5);
            p.circle(nx, ny, nodeR * 2);

            p.fill(200);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(11);
            p.text(cx[i].toFixed(1), nx, ny);

            p.fill(80);
            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(10);
            p.text(`x${i + 1}`, nx - nodeR - 5, ny);

            if (isHov) {
              p.fill(140, 140, 60);
              p.textAlign(p.CENTER, p.TOP);
              p.textSize(9);
              p.text("click", nx, ny + nodeR + 3);
            }
          }

          // Draw nodes: hidden
          for (let i = 0; i < 3; i++) {
            const nx = layerX[1];
            const ny = layerY[1][i];
            p.fill(nodeColor(h1[i]));
            p.stroke(40, 60, 100);
            p.strokeWeight(1.5);
            p.circle(nx, ny, nodeR * 2);

            p.fill(200);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(11);
            p.text(h1[i].toFixed(2), nx, ny);
          }

          // Draw nodes: output
          for (let i = 0; i < 2; i++) {
            const nx = layerX[2];
            const ny = layerY[2][i];
            p.fill(nodeColor(h2[i]));
            p.stroke(40, 100, 60);
            p.strokeWeight(1.5);
            p.circle(nx, ny, nodeR * 2);

            p.fill(200);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(11);
            p.text(h2[i].toFixed(2), nx, ny);

            p.fill(80);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(10);
            p.text(`ŷ${i + 1}`, nx + nodeR + 5, ny);
          }

          // Layer labels
          const labelY = H_C - 18;
          p.fill(55);
          p.noStroke();
          p.textAlign(p.CENTER, p.BOTTOM);
          p.textSize(10);
          p.text("input", layerX[0], labelY);
          p.text("hidden layer", layerX[1], labelY);
          p.text("output", layerX[2], labelY);

          // Equation labels
          p.fill(40);
          p.textAlign(p.CENTER, p.TOP);
          p.textSize(9);
          p.text("h = tanh(W₁x + b₁)", (layerX[0] + layerX[1]) / 2 + 20, 12);
          p.text("ŷ = tanh(W₂h + b₂)", (layerX[1] + layerX[2]) / 2 + 20, 12);
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

  const { h1, h2 } = forward(x);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl overflow-hidden border border-[#1a1a1a] bg-[#0d1117] flex justify-center">
        <div ref={containerRef} />
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs font-mono text-[#555]">
        <div className="rounded-xl border border-[#1a1a1a] bg-[#0d1117] p-3">
          <div className="text-[#333] uppercase tracking-widest text-[10px] mb-2">inputs</div>
          {x.map((v, i) => (
            <div key={i} className="flex justify-between py-0.5">
              <span>x{i + 1}</span>
              <span className="text-[#888]">{v.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[#1a1a1a] bg-[#0d1117] p-3">
          <div className="text-[#333] uppercase tracking-widest text-[10px] mb-2">hidden  tanh(W₁x+b₁)</div>
          {h1.map((v, i) => (
            <div key={i} className="flex justify-between py-0.5">
              <span>h{i + 1}</span>
              <span className="text-[#888]">{v.toFixed(3)}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[#1a1a1a] bg-[#0d1117] p-3">
          <div className="text-[#333] uppercase tracking-widest text-[10px] mb-2">outputs  tanh(W₂h+b₂)</div>
          {h2.map((v, i) => (
            <div key={i} className="flex justify-between py-0.5">
              <span>ŷ{i + 1}</span>
              <span className="text-[#5DCAA5]">{v.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
