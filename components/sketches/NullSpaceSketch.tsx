"use client";

import { useRef, useState, useEffect } from "react";
import p5 from "p5";

export default function NullSpaceSketch() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(1);

  const aRef = useRef(a); aRef.current = a;
  const bRef = useRef(b); bRef.current = b;
  const cRef = useRef(c); cRef.current = c;
  const dRef = useRef(d); dRef.current = d;

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
        const W = 660, H = 440;
        const SCALE = 60;
        const LCX = 168, LCY = 205;
        const RCX = 492, RCY = 205;

        p.setup = () => {
          p.createCanvas(W, H);
          p.noLoop();
          p.textFont("Space Grotesk");
        };

        const drawAxes = (cx: number, cy: number) => {
          p.stroke(28); p.strokeWeight(1);
          p.line(cx - 145, cy, cx + 145, cy);
          p.line(cx, cy - 175, cx, cy + 175);
        };

        p.draw = () => {
          const ma = aRef.current, mb = bRef.current;
          const mc = cRef.current, md = dRef.current;
          const det = ma * md - mb * mc;
          const absDet = Math.abs(det);

          p.background(13, 17, 23);

          // divider
          p.stroke(22); p.strokeWeight(1);
          p.line(W / 2, 12, W / 2, H - 48);

          // panel labels
          p.noStroke(); p.fill(48); p.textSize(10);
          p.textAlign(p.CENTER);
          p.text("INPUT", LCX, 26);
          p.text("OUTPUT", RCX, 26);
          p.textAlign(p.LEFT);

          drawAxes(LCX, LCY);
          drawAxes(RCX, RCY);

          // unit circle
          p.noFill(); p.stroke(42); p.strokeWeight(1);
          p.ellipse(LCX, LCY, 2 * SCALE, 2 * SCALE);

          // frobenius norm for rough scale of output
          const fNorm = Math.sqrt(ma*ma + mb*mb + mc*mc + md*md);
          const outScale = Math.max(fNorm * 0.7, 0.4);

          // sample points on unit circle, color by output magnitude
          const N = 360;
          for (let i = 0; i < N; i++) {
            const theta = (i / N) * Math.PI * 2;
            const vx = Math.cos(theta), vy = Math.sin(theta);

            const ox = ma * vx + mb * vy;
            const oy = mc * vx + md * vy;
            const mag = Math.sqrt(ox * ox + oy * oy);

            // t=0: near null (orange), t=1: far from null (teal)
            const t = Math.min(mag / outScale, 1);
            const r = p.lerp(240, 93, t);
            const g = p.lerp(100, 202, t);
            const bl = p.lerp(30, 165, t);

            p.stroke(r, g, bl, 210); p.strokeWeight(2.5);
            p.point(LCX + vx * SCALE, LCY - vy * SCALE);

            const sx = RCX + ox * SCALE;
            const sy = RCY - oy * SCALE;
            if (sx > W / 2 + 3 && sx < W - 3 && sy > 3 && sy < H - 52) {
              p.stroke(r, g, bl, 210); p.strokeWeight(2.5);
              p.point(sx, sy);
            }
          }

          // null space line: fades in as matrix approaches singular
          // null direction: perpendicular to row [a,b], i.e. [-b, a] normalized
          let nx = -mb, ny = ma;
          const nm = Math.sqrt(nx * nx + ny * ny);
          if (nm > 0.001) { nx /= nm; ny /= nm; } else { nx = 1; ny = 0; }

          const fadeThreshold = 0.9;
          const nullAlpha = absDet < fadeThreshold
            ? Math.round(p.map(absDet, 0, fadeThreshold, 230, 0))
            : 0;

          if (nullAlpha > 8) {
            // null space line on left
            p.stroke(240, 165, 0, nullAlpha); p.strokeWeight(1.5);
            p.line(LCX + nx * 155, LCY - ny * 155, LCX - nx * 155, LCY + ny * 155);

            if (nullAlpha > 90) {
              p.noStroke(); p.fill(240, 165, 0, nullAlpha); p.textSize(11);
              const lx = LCX + nx * 98 + (nx > 0 ? 6 : -70);
              const ly = LCY - ny * 98 + (ny > 0 ? -6 : 14);
              p.text("null space", lx, ly);
            }

            // glow at origin on right — where null space maps to
            p.noStroke();
            for (let r2 = 10; r2 > 0; r2--) {
              p.fill(240, 165, 0, (nullAlpha / 10) * (10 - r2 + 1) * 0.8);
              p.ellipse(RCX, RCY, r2 * 2.2, r2 * 2.2);
            }
            p.fill(240, 165, 0, nullAlpha);
            p.ellipse(RCX, RCY, 5, 5);

            if (nullAlpha > 90) {
              p.fill(240, 165, 0, nullAlpha); p.textSize(11);
              p.text("→ 0", RCX + 9, RCY - 9);
            }
          }

          // bottom info bar
          p.noStroke();

          // matrix display
          p.fill(52); p.textSize(11);
          p.text(`[ ${ma.toFixed(2)}  ${mb.toFixed(2)} ]`, 14, H - 30);
          p.text(`[ ${mc.toFixed(2)}  ${md.toFixed(2)} ]`, 14, H - 14);

          // det — orange when near zero
          const detCol = absDet < 0.08 ? p.color(240, 165, 0)
            : absDet < 0.5 ? p.color(180, 135, 50)
            : p.color(52);
          p.fill(detCol);
          p.text(`det = ${det.toFixed(3)}`, 128, H - 22);

          // nullity
          const nullity = absDet < 0.08 ? 1 : 0;
          p.fill(absDet < 0.08 ? p.color(240, 165, 0) : p.color(52));
          p.text(`nullity = ${nullity}`, 220, H - 22);

          // rank
          const rank = 2 - nullity;
          p.fill(52);
          p.text(`rank = ${rank}`, 308, H - 22);
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

  const applyPreset = (vals: [number, number, number, number]) => {
    setA(vals[0]); setB(vals[1]); setC(vals[2]); setD(vals[3]);
    setTimeout(() => p5Ref.current?.redraw(), 0);
  };

  const sliders = [
    { label: "a", val: a, set: setA },
    { label: "b", val: b, set: setB },
    { label: "c", val: c, set: setC },
    { label: "d", val: d, set: setD },
  ];

  const presets: { label: string; vals: [number, number, number, number] }[] = [
    { label: "identity", vals: [1, 0, 0, 1] },
    { label: "singular", vals: [1, 2, 0.5, 1] },
    { label: "projection", vals: [1, 0, 0, 0] },
    { label: "rotation", vals: [0, -1, 1, 0] },
    { label: "stretch", vals: [2, 0, 0, 0.5] },
  ];

  return (
    <div className="space-y-5">
      <div className="sketch-wrap">
        <div ref={containerRef} />
      </div>

      <div className="sketch-controls" style={{ flexWrap: "wrap", maxWidth: 600, margin: "0 auto" }}>
        {sliders.map(({ label, val, set }) => (
          <div key={label} className="sketch-slider-row" style={{ flex: 1, minWidth: 120 }}>
            <div className="sketch-slider-header">
              <span className="sketch-label">{label}</span>
              <span className="sketch-value">{val.toFixed(2)}</span>
            </div>
            <input
              type="range" min={-2} max={2} step={0.01}
              value={val}
              onChange={handleChange(set)}
              className="sketch-range"
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {presets.map(({ label, vals }) => (
          <button
            key={label}
            onClick={() => applyPreset(vals)}
            style={{
              fontSize: 12, color: "#555", background: "none",
              border: "0.5px solid #252525", borderRadius: 6,
              padding: "5px 14px", cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
