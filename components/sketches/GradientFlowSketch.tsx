"use client";
import { useRef, useEffect, useState } from "react";
import p5 from "p5";

type Activation = "tanh" | "relu";

const W = 660;
const H = 380;

export default function GradientFlowSketch() {
  const [depth, setDepth] = useState(5);
  const [activation, setActivation] = useState<Activation>("tanh");
  const [saturation, setSaturation] = useState(1.8);

  const depthRef = useRef(depth);
  const activationRef = useRef(activation);
  const saturationRef = useRef(saturation);
  depthRef.current = depth;
  activationRef.current = activation;
  saturationRef.current = saturation;

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
        p.setup = () => {
          p.createCanvas(W, H);
          p.noLoop();
          p.textFont("Inter");
        };

        p.draw = () => {
          p.background(13, 17, 23);

          const n = depthRef.current;
          const act = activationRef.current;
          const z = saturationRef.current;

          // Local derivative per layer
          let dz: number;
          if (act === "tanh") {
            const t = Math.tanh(z);
            dz = 1 - t * t;
          } else {
            dz = 1.0;
          }

          // Gradient at display position i (0 = input/left, n-1 = output/right)
          // = dz^(n-1-i), since the output layer has gradient 1 and each layer
          // back multiplies by dz once more
          const grads: number[] = [];
          for (let i = 0; i < n; i++) {
            grads.push(Math.pow(dz, n - 1 - i));
          }

          // Layout
          const marginX = 72;
          const nodeY = 110;
          const nodeR = 20;
          const xs: number[] = [];
          for (let i = 0; i < n; i++) {
            xs.push(n === 1 ? W / 2 : marginX + (i * (W - 2 * marginX)) / (n - 1));
          }

          const BAR_TOP = 162;
          const BAR_MAX_H = 140;
          const BAR_W = 20;

          const TEAL = [93, 202, 165];
          const DARK = [28, 34, 52];

          function lerp(a: number[], b: number[], t: number): number[] {
            return a.map((v, i) => v * t + b[i] * (1 - t));
          }

          // Info line
          p.noStroke();
          p.textSize(10);
          p.textAlign(p.CENTER, p.TOP);
          if (act === "tanh") {
            p.fill(65);
            p.text(
              `tanh: \u03c3'(z = ${z.toFixed(1)}) = ${dz.toFixed(3)} per layer`,
              W / 2, 18
            );
          } else {
            p.fill(65);
            p.text("relu: \u03c3'(z) = 1 for z > 0  \u00b7  gradient passes through unchanged", W / 2, 18);
          }

          // Forward arrows
          for (let i = 0; i < n - 1; i++) {
            const x1 = xs[i] + nodeR + 4;
            const x2 = xs[i + 1] - nodeR - 4;
            p.stroke(42);
            p.strokeWeight(1);
            p.line(x1, nodeY, x2, nodeY);
            p.noStroke();
            p.fill(42);
            p.triangle(x2 + 6, nodeY, x2, nodeY - 4, x2, nodeY + 4);
          }

          // Nodes
          for (let i = 0; i < n; i++) {
            const g = grads[i];
            const col = lerp(TEAL, DARK, g);

            if (g > 0.15) {
              p.noStroke();
              p.fill(col[0], col[1], col[2], Math.round(g * 22));
              p.ellipse(xs[i], nodeY, nodeR * 4.5, nodeR * 4.5);
            }

            p.strokeWeight(1.5);
            p.stroke(col[0], col[1], col[2], Math.round(70 + g * 140));
            p.fill(15, 19, 27);
            p.ellipse(xs[i], nodeY, nodeR * 2, nodeR * 2);
          }

          // Node labels (above)
          p.noStroke();
          p.textSize(9);
          p.textAlign(p.CENTER, p.BOTTOM);
          p.fill(55);
          p.text("input", xs[0], nodeY - nodeR - 5);
          p.fill(55);
          p.text("output", xs[n - 1], nodeY - nodeR - 5);
          for (let i = 1; i < n - 1; i++) {
            p.fill(40);
            p.text(`L${i + 1}`, xs[i], nodeY - nodeR - 5);
          }

          // Gradient bars
          for (let i = 0; i < n; i++) {
            const g = grads[i];
            const col = lerp(TEAL, DARK, g);
            const h = Math.max(1.5, g * BAR_MAX_H);

            p.noStroke();
            p.fill(18, 22, 34);
            p.rect(xs[i] - BAR_W / 2, BAR_TOP, BAR_W, BAR_MAX_H, 3);

            p.fill(col[0], col[1], col[2], 200);
            p.rect(xs[i] - BAR_W / 2, BAR_TOP + BAR_MAX_H - h, BAR_W, h, 3);
          }

          // Gradient values below bars
          p.textSize(9);
          p.textAlign(p.CENTER, p.TOP);
          for (let i = 0; i < n; i++) {
            const g = grads[i];
            const col = lerp(TEAL, DARK, Math.sqrt(g));
            p.noStroke();
            p.fill(col[0], col[1], col[2]);

            let label: string;
            if (g >= 0.01) label = g.toFixed(3);
            else if (g >= 0.0001) label = g.toExponential(1);
            else label = "\u2248 0";

            p.text(label, xs[i], BAR_TOP + BAR_MAX_H + 5);
          }

          // "← gradient" label
          p.noStroke();
          p.fill(45);
          p.textSize(9);
          p.textAlign(p.LEFT, p.TOP);
          p.text("\u2190 gradient", marginX, BAR_TOP - 16);
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

  const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepth(parseInt(e.target.value));
    setTimeout(() => p5Ref.current?.redraw(), 0);
  };

  const handleActivation = (act: Activation) => {
    setActivation(act);
    setTimeout(() => p5Ref.current?.redraw(), 0);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl overflow-hidden border border-border/50 bg-card flex justify-center">
        <div ref={containerRef} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "0 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#555", width: 96 }}>activation</span>
          <div style={{ display: "flex", gap: 8 }}>
            {(["tanh", "relu"] as Activation[]).map((act) => (
              <button
                key={act}
                onClick={() => handleActivation(act)}
                style={{
                  padding: "4px 14px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: activation === act ? "#5DCAA5" : "#222",
                  background: activation === act ? "rgba(93,202,165,0.08)" : "transparent",
                  color: activation === act ? "#5DCAA5" : "#444",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {act}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#555", width: 96 }}>depth</span>
          <input
            type="range" min={2} max={8} step={1} value={depth}
            onChange={handleDepthChange}
            style={{ width: 160 }}
          />
          <span style={{ fontSize: 12, color: "#444", minWidth: 60 }}>{depth} layers</span>
        </div>
        {activation === "tanh" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#555", width: 96 }}>saturation</span>
            <input
              type="range" min={0} max={3} step={0.1} value={saturation}
              onChange={handleChange(setSaturation)}
              style={{ width: 160 }}
            />
            <span style={{ fontSize: 12, color: "#444", minWidth: 60 }}>z = {saturation.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
