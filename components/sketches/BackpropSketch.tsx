"use client";

import { useState, useEffect, useRef } from "react";
import p5 from "p5";

// tanh and its derivative
const tanh = (x: number) => Math.tanh(x);
const dtanh = (z: number) => { const t = Math.tanh(z); return 1 - t * t; };

export default function BackpropSketch() {
  const [xVal, setXVal] = useState(0.5);
  const [wVal, setWVal] = useState(1.0);
  const [bVal, setBVal] = useState(0.0);
  const [vVal, setVVal] = useState(1.0);
  const [cVal, setCVal] = useState(0.0);
  const [target, setTarget] = useState(1.0);

  const xRef = useRef(xVal); const wRef = useRef(wVal); const bRef = useRef(bVal);
  const vRef = useRef(vVal); const cRef = useRef(cVal); const tRef = useRef(target);
  xRef.current = xVal; wRef.current = wVal; bRef.current = bVal;
  vRef.current = vVal; cRef.current = cVal; tRef.current = target;

  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    while (el.firstChild) el.removeChild(el.firstChild);

    const timer = setTimeout(() => {
      if (cancelled || !el) return;
      if (p5Ref.current) { p5Ref.current.remove(); p5Ref.current = null; }

      p5Ref.current = new p5((p: p5) => {
        const W = 660;
        const H = 580;

        // ---- layout ----
        // Main chain nodes (left to right)
        const mainY = 215;
        const paramY = 80;

        // Spread nodes more: 5 main nodes across 660px
        const mainXs: Record<string, number> = {
          x: 60,
          z: 195,
          h: 340,
          y: 480,
          L: 605,
        };

        // Parameter nodes sit above their target
        const paramXs: Record<string, number> = {
          w: 130, // between x and z, slightly toward z
          b: 195, // directly above z
          v: 410, // between h and y
          c: 480, // directly above y
        };

        const nodePos: Record<string, { x: number; y: number }> = {
          x:  { x: mainXs.x, y: mainY },
          z:  { x: mainXs.z, y: mainY },
          h:  { x: mainXs.h, y: mainY },
          y:  { x: mainXs.y, y: mainY },
          L:  { x: mainXs.L, y: mainY },
          w:  { x: paramXs.w, y: paramY },
          b:  { x: paramXs.b, y: paramY },
          v:  { x: paramXs.v, y: paramY },
          c:  { x: paramXs.c, y: paramY },
        };

        // Node label (top of node) — short symbol only
        const nodeLabels: Record<string, string> = {
          x: "x",
          z: "z",
          h: "h",
          y: "y",
          L: "L",
          w: "w",
          b: "b",
          v: "v",
          c: "c",
        };

        // Node sublabel (formula, shown small under the symbol for main nodes)
        const nodeSublabels: Record<string, string> = {
          x: "input",
          z: "wx + b",
          h: "tanh(z)",
          y: "vh + c",
          L: "(y−t)²",
        };

        const isParam = (id: string) => ["w", "b", "v", "c"].includes(id);

        // Node dimensions — main nodes are wider and taller to fit symbol + formula + value
        const nodeW = (id: string) => isParam(id) ? 56 : 110;
        const nodeH = (id: string) => isParam(id) ? 44 : 64;

        // Compute forward + backward pass
        const computeGraph = () => {
          const x = xRef.current, w = wRef.current, b = bRef.current;
          const v = vRef.current, c = cRef.current, t = tRef.current;

          // Forward
          const z = w * x + b;
          const h = tanh(z);
          const y = v * h + c;
          const L = (y - t) ** 2;

          // Backward
          const dL_dy = 2 * (y - t);
          const dy_dh = v;
          const dh_dz = dtanh(z);
          const dL_dh = dL_dy * dy_dh;
          const dL_dz = dL_dh * dh_dz;
          const dL_dw = dL_dz * x;
          const dL_db = dL_dz * 1;
          const dL_dx = dL_dz * w;
          const dL_dv = dL_dy * h;
          const dL_dc = dL_dy * 1;

          const vals: Record<string, number> = { x, z, h, y, L, w, b, v, c };
          const grads: Record<string, number> = {
            x: dL_dx, z: dL_dz, h: dL_dh, y: dL_dy, L: 1,
            w: dL_dw, b: dL_db, v: dL_dv, c: dL_dc,
          };

          // Normalize gradients for visualization (0-1)
          const maxAbsGrad = Math.max(1e-6, ...Object.values(grads).map(Math.abs));
          const normGrad: Record<string, number> = {};
          for (const k of Object.keys(grads)) {
            normGrad[k] = Math.abs(grads[k]) / maxAbsGrad;
          }

          return { vals, grads, normGrad, maxAbsGrad, z, h, y, L, dL_dw, dL_dv, dL_db, dL_dc, dL_dx };
        };

        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Inter");
          p.noLoop();
        };

        p.mousePressed = () => {
          p.redraw();
        };

        p.draw = () => {
          p.background(13, 17, 23);
          const result = computeGraph();
          const { vals, normGrad } = result;

          // ---- draw edges ----
          const edges: { from: string; to: string; label: string; gradKey: string }[] = [
            // Main chain
            { from: "x", to: "z", label: "×w", gradKey: "z" },
            { from: "z", to: "h", label: "h'(z)", gradKey: "h" },
            { from: "h", to: "y", label: "×v", gradKey: "y" },
            { from: "y", to: "L", label: "2(y−t)", gradKey: "L" },
            // Parameter edges
            { from: "w", to: "z", label: "", gradKey: "w" },
            { from: "b", to: "z", label: "", gradKey: "b" },
            { from: "v", to: "y", label: "", gradKey: "v" },
            { from: "c", to: "y", label: "", gradKey: "c" },
          ];

          for (const edge of edges) {
            const fromPos = nodePos[edge.from];
            const toPos = nodePos[edge.to];

            // Start and end points at node borders
            const fx = fromPos.x;
            const fy = fromPos.y;
            const tx = toPos.x;
            const ty = toPos.y;

            // Clamp start/end to node edges
            const fromW = nodeW(edge.from) / 2;
            const toW = nodeW(edge.to) / 2;
            const fromH2 = nodeH(edge.from) / 2;
            const toH2 = nodeH(edge.to) / 2;

            // Compute direction
            const dx = tx - fx;
            const dy = ty - fy;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 1) continue;
            const ux = dx / len;
            const uy = dy / len;

            // Offset start from edge of from-node, end to edge of to-node
            let startX = fx, startY = fy, endX = tx, endY = ty;
            if (Math.abs(ux) > Math.abs(uy)) {
              // Mostly horizontal
              startX = fx + fromW * Math.sign(ux);
              startY = fy + (fromW * Math.sign(ux)) * (uy / ux);
              endX = tx - toW * Math.sign(ux);
              endY = ty - (toW * Math.sign(ux)) * (uy / ux);
            } else {
              // Mostly vertical
              startY = fy + fromH2 * Math.sign(uy);
              startX = fx + (fromH2 * Math.sign(uy)) * (ux / uy);
              endY = ty - toH2 * Math.sign(uy);
              endX = tx - (toH2 * Math.sign(uy)) * (ux / uy);
            }

            const intensity = normGrad[edge.gradKey] ?? 0;
            const alpha = 50 + 180 * intensity;
            const weight = 1.2 + 2.5 * intensity;

            p.stroke(255, 80, 100, alpha);
            p.strokeWeight(weight);
            p.line(startX, startY, endX, endY);

            // Arrow head
            const adx = endX - startX, ady = endY - startY;
            const alen = Math.sqrt(adx * adx + ady * ady);
            if (alen > 10) {
              const anx = adx / alen, any2 = ady / alen;
              const arrowX = endX - anx * 2, arrowY = endY - any2 * 2;
              p.fill(255, 80, 100, alpha);
              p.noStroke();
              p.push();
              p.translate(arrowX, arrowY);
              p.rotate(p.atan2(any2, anx));
              p.triangle(0, 0, -9, -4, -9, 4);
              p.pop();
            }

          }

          // ---- draw nodes ----
          const allNodeIds = ["x", "z", "h", "y", "L", "w", "b", "v", "c"];
          for (const id of allNodeIds) {
            const pos = nodePos[id];
            const nw = nodeW(id);
            const nh = nodeH(id);
            const intensity = normGrad[id] ?? 0;
            const label = nodeLabels[id];
            const sublabel = nodeSublabels[id];

            // Node background
            const bgR = 20 + 35 * intensity;
            const bgG = 20 + 10 * intensity;
            const bgB = 25 + 15 * intensity;
            p.fill(bgR, bgG, bgB, 230);

            const borderR = 80 + 175 * intensity;
            const borderG = 50 + 30 * intensity;
            const borderB = 60 + 60 * intensity;
            p.stroke(borderR, borderG, borderB, Math.min(255, 80 + 175 * intensity));
            p.strokeWeight(1 + 1.5 * intensity);
            p.rectMode(p.CENTER);
            p.rect(pos.x, pos.y, nw, nh, 8);

            // Gradient glow
            if (intensity > 0.3) {
              p.noFill();
              p.stroke(255, 80, 100, 30 * intensity);
              p.strokeWeight(4);
              p.rect(pos.x, pos.y, nw + 6, nh + 6, 10);
            }

            p.noStroke();
            const valStr = vals[id] !== undefined ? vals[id].toFixed(2) : "";

            if (isParam(id)) {
              // Param nodes: centered symbol on top, value below
              p.fill(225, 225, 240, 220 + 35 * intensity);
              p.textFont("JetBrains Mono, monospace");
              p.textAlign(p.CENTER, p.CENTER);
              p.textSize(13);
              p.text(label, pos.x, pos.y - 9);

              p.fill(160, 160, 180);
              p.textFont("Inter");
              p.textSize(10);
              p.text(valStr, pos.x, pos.y + 10);
            } else {
              // Main nodes: symbol / formula / value, evenly stacked
              const topY = pos.y - nh / 2;

              // Symbol (row 1)
              p.fill(230, 230, 245, 230 + 25 * intensity);
              p.textFont("JetBrains Mono, monospace");
              p.textAlign(p.CENTER, p.CENTER);
              p.textSize(13);
              p.text(label, pos.x, topY + 14);

              // Formula (row 2)
              if (sublabel) {
                p.fill(145, 145, 170, 220);
                p.textFont("JetBrains Mono, monospace");
                p.textSize(9);
                p.text(sublabel, pos.x, topY + 32);
              }

              // Value (row 3)
              p.fill(200, 200, 215);
              p.textFont("Inter");
              p.textSize(10);
              p.text(valStr, pos.x, topY + 50);
            }
          }

          // ---- edge labels (drawn after nodes so they sit on top, placed in empty band above the main-node row) ----
          const labelY = mainY - 52; // main nodes top ≈ mainY - 32; label sits in clear space above
          for (const edge of edges) {
            if (!edge.label) continue;
            const fromPos = nodePos[edge.from];
            const toPos = nodePos[edge.to];
            // Only label mostly-horizontal (main-chain) edges
            if (Math.abs(toPos.x - fromPos.x) < Math.abs(toPos.y - fromPos.y)) continue;

            const mx = (fromPos.x + toPos.x) / 2;
            const intensity = normGrad[edge.gradKey] ?? 0;

            p.textSize(10);
            p.textFont("JetBrains Mono, monospace");
            const padX = 6;
            const labelW = p.textWidth(edge.label) + padX * 2;
            const labelH = 17;

            // Dark pill so the label reads against the canvas cleanly
            p.rectMode(p.CENTER);
            p.noStroke();
            p.fill(18, 22, 30, 240);
            p.rect(mx, labelY, labelW, labelH, 5);

            // Thin accent border hints at gradient intensity on that edge
            p.noFill();
            p.stroke(255, 100, 130, 60 + 140 * intensity);
            p.strokeWeight(1);
            p.rect(mx, labelY, labelW, labelH, 5);

            // Label text
            p.noStroke();
            p.fill(200, 200, 220, 240);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(edge.label, mx, labelY);
            p.textFont("Inter");
          }

          // ---- forward / backward labels ----
          p.noStroke();
          p.textSize(10);
          p.textFont("Inter");
          p.fill(110, 140, 180, 200);
          p.textAlign(p.LEFT, p.CENTER);
          p.text("forward →", 50, mainY + 55);
          p.fill(255, 80, 100, 180);
          p.textAlign(p.RIGHT, p.CENTER);
          p.text("← backward", W - 50, mainY + 55);

          // ---- bottom gradient panel ----
          const panelY = 310;
          const panelH = 250;

          // Panel background
          p.fill(16, 20, 28);
          p.stroke(35, 35, 45);
          p.strokeWeight(1);
          p.rectMode(p.CORNER);
          p.rect(20, panelY, W - 40, panelH, 10);

          // Panel title
          p.fill(180);
          p.noStroke();
          p.textSize(12);
          p.textFont("Inter");
          p.textAlign(p.LEFT, p.TOP);
          p.text("gradients  ∂L/∂·", 40, panelY + 16);

          // Loss display
          p.fill(200);
          p.textSize(12);
          p.textAlign(p.RIGHT, p.TOP);
          p.text(`loss: ${result.L.toFixed(4)}`, W - 40, panelY + 16);

          // Gradient bars
          const gradDisplay = [
            { label: "w", val: result.dL_dw },
            { label: "v", val: result.dL_dv },
            { label: "b", val: result.dL_db },
            { label: "c", val: result.dL_dc },
            { label: "x", val: result.dL_dx },
          ];

          const barMaxW = 90;
          const barH = 12;
          const cols = 3;
          const colW = (W - 80) / cols;
          const rowH = 70;
          const firstRowY = panelY + 46;

          gradDisplay.forEach((g, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const bx = 40 + col * colW;
            const by = firstRowY + row * rowH;

            // Label
            p.fill(140, 140, 160);
            p.noStroke();
            p.textSize(11);
            p.textFont("JetBrains Mono, monospace");
            p.textAlign(p.LEFT, p.TOP);
            p.text(`∂L/∂${g.label}`, bx, by);

            // Bar background
            p.fill(28, 28, 38);
            p.noStroke();
            p.rect(bx, by + 18, barMaxW, barH, 4);

            // Bar fill
            const maxAbs = result.maxAbsGrad;
            const frac = Math.min(1, Math.abs(g.val) / maxAbs);
            const bw = barMaxW * frac;

            const barColor = p.lerpColor(
              p.color(255, 100, 140),
              p.color(255, 220, 80),
              frac
            );
            p.fill(barColor);
            p.rect(bx, by + 18, Math.max(2, bw), barH, 4);

            // Value
            p.fill(170, 170, 185);
            p.textSize(10);
            p.textFont("Inter");
            p.textAlign(p.LEFT, p.TOP);
            p.text(g.val.toFixed(4), bx, by + 34);
          });
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

  const handleChange = (setter: (v: number) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(parseFloat(e.target.value));
      setTimeout(() => p5Ref.current?.redraw(), 0);
    };

  const presets = [
    {
      label: "learning",
      x: 0.5, w: 1.5, b: 0, v: 1.0, c: 0, t: 1.0,
    },
    {
      label: "saturated +",
      x: 3.0, w: 2.0, b: 0, v: 1.0, c: 0, t: 1.0,
    },
    {
      label: "saturated −",
      x: -3.0, w: 2.0, b: 0, v: 1.0, c: 0, t: 1.0,
    },
    {
      label: "wrong target",
      x: 0.5, w: 1.0, b: 0, v: 1.0, c: 0, t: -1.0,
    },
  ];

  const applyPreset = (pr: typeof presets[0]) => {
    setXVal(pr.x); setWVal(pr.w); setBVal(pr.b);
    setVVal(pr.v); setCVal(pr.c); setTarget(pr.t);
    setTimeout(() => p5Ref.current?.redraw(), 0);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex justify-center">
        <div ref={containerRef} />
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "input x", value: xVal, setter: setXVal, id: "bp-x" },
          { label: "weight w", value: wVal, setter: setWVal, id: "bp-w" },
          { label: "bias b", value: bVal, setter: setBVal, id: "bp-b" },
          { label: "weight v", value: vVal, setter: setVVal, id: "bp-v" },
          { label: "bias c", value: cVal, setter: setCVal, id: "bp-c" },
          { label: "target t", value: target, setter: setTarget, id: "bp-t" },
        ].map(({ label, value, setter, id }) => (
          <div key={id} className="rounded-xl bg-secondary/50 border border-border/50 p-4">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              {label}
            </label>
            <input
              id={`${id}-slider`}
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={value}
              onChange={handleChange(setter)}
              className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer"
            />
            <div className="text-center mt-1">
              <span className="text-sm font-mono font-semibold text-primary">
                {value.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div className="rounded-xl bg-secondary/50 border border-border/50 p-4 flex flex-col justify-between">
        <label className="block text-sm font-medium text-foreground mb-2">
          Presets
        </label>
        <div className="flex gap-2">
          {presets.map(({ label }) => {
            const pr = presets.find(p => p.label === label)!;
            return (
              <button
                key={label}
                onClick={() => applyPreset(pr)}
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary border border-border/50 transition-all"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
