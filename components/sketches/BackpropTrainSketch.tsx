"use client";

import { useState, useRef } from "react";
import p5 from "p5";
import { useP5Sketch } from "@/hooks/useP5Sketch";

// Same tiny network as BackpropSketch, but running SGD on a small dataset.
// This sketch is Type A (simulation) — it runs the training loop live.

const tanh = (x: number) => Math.tanh(x);
const dtanh = (z: number) => { const t = Math.tanh(z); return 1 - t * t; };

// A small target function the network should learn: y = tanh(1.5 x + 0.3) + 0.2
// With 6 sample points across x ∈ [-1.5, 1.5].
const TARGET_FN = (x: number) => Math.tanh(1.5 * x + 0.3) + 0.2;
const DATA: { x: number; t: number }[] = [
  -1.4, -0.9, -0.3, 0.2, 0.8, 1.3,
].map(x => ({ x, t: TARGET_FN(x) }));

type Params = { w: number; b: number; v: number; c: number };

const forward = (p: Params, x: number) => {
  const z = p.w * x + p.b;
  const h = tanh(z);
  const y = p.v * h + p.c;
  return { z, h, y };
};

const lossFor = (p: Params) => {
  let L = 0;
  for (const d of DATA) {
    const { y } = forward(p, d.x);
    L += (y - d.t) ** 2;
  }
  return L / DATA.length;
};

// Full-batch gradient step (averaged across DATA).
const gradStep = (p: Params, lr: number): Params => {
  let gw = 0, gb = 0, gv = 0, gc = 0;
  for (const d of DATA) {
    const { z, h, y } = forward(p, d.x);
    const dL_dy = 2 * (y - d.t);
    const dL_dh = dL_dy * p.v;
    const dL_dz = dL_dh * dtanh(z);
    gw += dL_dz * d.x;
    gb += dL_dz;
    gv += dL_dy * h;
    gc += dL_dy;
  }
  const n = DATA.length;
  return {
    w: p.w - lr * (gw / n),
    b: p.b - lr * (gb / n),
    v: p.v - lr * (gv / n),
    c: p.c - lr * (gc / n),
  };
};

type PresetKey = "good" | "saturated" | "high-lr" | "low-lr";

const PRESETS: Record<PresetKey, { label: string; init: Params; lr: number; note: string }> = {
  "good":       { label: "good init",      init: { w: 0.5, b: 0, v: 0.5, c: 0 }, lr: 0.5,  note: "reasonable start, moderate step" },
  "saturated":  { label: "saturated init", init: { w: 3.0, b: 0, v: 0.5, c: 0 }, lr: 0.5,  note: "large w saturates tanh early" },
  "high-lr":    { label: "lr too high",    init: { w: 0.5, b: 0, v: 0.5, c: 0 }, lr: 4.0,  note: "steps overshoot, loss oscillates" },
  "low-lr":     { label: "lr too low",     init: { w: 0.5, b: 0, v: 0.5, c: 0 }, lr: 0.02, note: "stalls, barely moves" },
};

export default function BackpropTrainSketch() {
  const [presetKey, setPresetKey] = useState<PresetKey>("good");
  const [running, setRunning] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [currentLoss, setCurrentLoss] = useState(lossFor(PRESETS["good"].init));

  const presetRef = useRef(presetKey);
  presetRef.current = presetKey;
  const runningRef = useRef(running);
  runningRef.current = running;

  // Live training state held in refs so the p5 loop sees updates
  const paramsRef = useRef<Params>({ ...PRESETS["good"].init });
  const lrRef = useRef<number>(PRESETS["good"].lr);
  const stepsRef = useRef<number>(0);
  const lossHistRef = useRef<number[]>([lossFor(PRESETS["good"].init)]);

  const reset = (key: PresetKey) => {
    const pr = PRESETS[key];
    paramsRef.current = { ...pr.init };
    lrRef.current = pr.lr;
    stepsRef.current = 0;
    lossHistRef.current = [lossFor(pr.init)];
    setStepCount(0);
    setCurrentLoss(lossFor(pr.init));
  };

  const handlePreset = (key: PresetKey) => {
    setPresetKey(key);
    setRunning(false);
    reset(key);
  };

  const handleToggle = () => setRunning(r => !r);
  const handleReset = () => { setRunning(false); reset(presetKey); };

  const buildSketch = (el: HTMLElement) => {
    return new p5((p: p5) => {
      const W = 660;
      const H = 420;

      // Two panels side by side: function fit (left), loss curve (right)
      const leftX = 20, leftY = 20, leftW = 320, leftH = 360;
      const rightX = 360, rightY = 20, rightW = 280, rightH = 360;

      // Function panel math coord mapping
      const xMin = -2, xMax = 2;
      const yMin = -2, yMax = 2;
      const toPX = (mx: number) => leftX + ((mx - xMin) / (xMax - xMin)) * leftW;
      const toPY = (my: number) => leftY + leftH - ((my - yMin) / (yMax - yMin)) * leftH;

      p.setup = () => {
        p.createCanvas(W, H);
        p.textFont("Inter");
        p.frameRate(30);
      };

      p.draw = () => {
        // One training step per frame (batch GD) if running
        if (runningRef.current) {
          paramsRef.current = gradStep(paramsRef.current, lrRef.current);
          stepsRef.current += 1;
          const L = lossFor(paramsRef.current);
          lossHistRef.current.push(L);
          if (lossHistRef.current.length > 400) lossHistRef.current.shift();

          // Push back to React state periodically so the UI chips update
          if (stepsRef.current % 3 === 0) {
            setStepCount(stepsRef.current);
            setCurrentLoss(L);
          }
        }

        p.background(13, 17, 23);

        // ---------- left panel: function fit ----------
        p.noFill();
        p.stroke(35, 35, 45);
        p.strokeWeight(1);
        p.rect(leftX, leftY, leftW, leftH, 8);

        // Axes
        p.stroke(45, 45, 55);
        p.strokeWeight(1);
        const x0 = toPX(0), y0 = toPY(0);
        p.line(leftX, y0, leftX + leftW, y0);
        p.line(x0, leftY, x0, leftY + leftH);

        // Target function (teal, dashed-ish)
        p.noFill();
        p.stroke(93, 202, 165, 110);
        p.strokeWeight(1.5);
        p.beginShape();
        for (let mx = xMin; mx <= xMax; mx += 0.05) {
          p.vertex(toPX(mx), toPY(TARGET_FN(mx)));
        }
        p.endShape();

        // Network's current function (pink)
        p.noFill();
        p.stroke(255, 100, 160, 230);
        p.strokeWeight(2);
        p.beginShape();
        for (let mx = xMin; mx <= xMax; mx += 0.05) {
          const { y } = forward(paramsRef.current, mx);
          p.vertex(toPX(mx), toPY(y));
        }
        p.endShape();

        // Data points
        p.noStroke();
        for (const d of DATA) {
          p.fill(93, 202, 165, 220);
          p.circle(toPX(d.x), toPY(d.t), 7);
        }

        // Panel labels
        p.fill(140, 140, 165);
        p.textSize(11);
        p.textFont("Inter");
        p.textAlign(p.LEFT, p.TOP);
        p.text("fit: f(x) = v·tanh(wx+b) + c", leftX + 10, leftY + 10);

        // Legend
        p.textSize(10);
        p.fill(93, 202, 165, 220);
        p.text("— target", leftX + 10, leftY + leftH - 32);
        p.fill(255, 100, 160, 230);
        p.text("— network", leftX + 10, leftY + leftH - 18);

        // ---------- right panel: loss curve ----------
        p.noFill();
        p.stroke(35, 35, 45);
        p.strokeWeight(1);
        p.rect(rightX, rightY, rightW, rightH, 8);

        // Reserve header band (top) and footer band (bottom) so the curve never
        // crosses the text. Curve only draws between plotTop and plotBottom.
        const headerH = 48;            // space for title row + param row (stacked)
        const footerH = 36;            // space for step / loss readouts
        const plotTop = rightY + headerH;
        const plotBottom = rightY + rightH - footerH;
        const plotH = plotBottom - plotTop;
        const plotLeft = rightX + 12;
        const plotRight = rightX + rightW - 12;
        const plotW = plotRight - plotLeft;

        // Faint divider lines between bands
        p.stroke(35, 35, 45);
        p.strokeWeight(1);
        p.line(rightX + 8, plotTop, rightX + rightW - 8, plotTop);
        p.line(rightX + 8, plotBottom, rightX + rightW - 8, plotBottom);

        const hist = lossHistRef.current;
        const maxL = Math.max(1e-4, ...hist);
        const nHist = hist.length;

        // sqrt compression keeps small losses visible without flattening to 0
        const compress = (L: number) => Math.sqrt(Math.max(0, L) / maxL);

        // Loss curve, clipped to the plot band
        if (nHist >= 2) {
          p.noFill();
          p.stroke(255, 170, 80, 220);
          p.strokeWeight(1.8);
          p.beginShape();
          for (let i = 0; i < nHist; i++) {
            const fx = plotLeft + (i / Math.max(1, nHist - 1)) * plotW;
            const fy = plotBottom - compress(hist[i]) * plotH;
            p.vertex(fx, fy);
          }
          p.endShape();
        }

        // ---- header band: title on row 1, param readout on row 2 ----
        p.noStroke();
        p.textFont("Inter");
        p.textSize(11);
        p.fill(140, 140, 165);
        p.textAlign(p.LEFT, p.TOP);
        p.text("loss over steps", rightX + 10, rightY + 8);

        // Param readout on its own row so it never collides with the title
        const pr = paramsRef.current;
        p.textFont("JetBrains Mono, monospace");
        p.textSize(10);
        p.fill(150, 150, 170);
        p.textAlign(p.LEFT, p.TOP);
        p.text(
          `w=${pr.w.toFixed(2)}  b=${pr.b.toFixed(2)}  v=${pr.v.toFixed(2)}  c=${pr.c.toFixed(2)}`,
          rightX + 10,
          rightY + 26
        );

        // ---- footer band: step and loss readouts ----
        p.noStroke();
        p.textFont("JetBrains Mono, monospace");
        p.textAlign(p.LEFT, p.BOTTOM);
        p.textSize(11);
        p.fill(200, 200, 215);
        p.text(`step  ${stepsRef.current}`, rightX + 12, rightY + rightH - 12);

        p.fill(255, 170, 80, 230);
        p.textAlign(p.RIGHT, p.BOTTOM);
        p.text(
          `loss  ${lossFor(paramsRef.current).toFixed(4)}`,
          rightX + rightW - 12,
          rightY + rightH - 12
        );
      };
    }, el);
  };

  const containerRef = useP5Sketch(buildSketch);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex justify-center">
        <div ref={containerRef} />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleToggle}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all"
        >
          {running ? "pause" : stepCount === 0 ? "start training" : "resume"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground border border-border/50 hover:bg-secondary/80 transition-all"
        >
          reset
        </button>
        <div className="ml-auto text-xs text-muted-foreground self-center">
          {PRESETS[presetKey].note}
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(PRESETS) as PresetKey[]).map((key) => (
          <button
            key={key}
            onClick={() => handlePreset(key)}
            className={`py-2 rounded-lg text-xs font-medium border transition-all ${
              presetKey === key
                ? "bg-primary/15 text-primary border-primary/40"
                : "bg-secondary text-secondary-foreground border-border/50 hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {PRESETS[key].label}
          </button>
        ))}
      </div>
    </div>
  );
}
