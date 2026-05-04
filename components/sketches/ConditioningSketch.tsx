"use client";

import { useEffect, useRef, useState } from "react";
import p5 from "p5";

export default function ConditioningSketch() {
  const [aProb, setAProb] = useState(0.45);
  const [bGivenA, setBGivenA] = useState(0.75);
  const [bGivenNotA, setBGivenNotA] = useState(0.2);

  const aRef = useRef(aProb);
  const bARef = useRef(bGivenA);
  const bNotARef = useRef(bGivenNotA);
  aRef.current = aProb;
  bARef.current = bGivenA;
  bNotARef.current = bGivenNotA;

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
        const boxX = 80;
        const boxY = 70;
        const boxW = 500;
        const boxH = 280;

        p.setup = () => {
          p.createCanvas(W, H);
          p.textFont("Space Grotesk");
          p.noLoop();
        };

        p.draw = () => {
          const pa = aRef.current;
          const pbGivenA = bARef.current;
          const pbGivenNotA = bNotARef.current;
          const pAB = pa * pbGivenA;
          const pANotB = pa * (1 - pbGivenA);
          const pNotAB = (1 - pa) * pbGivenNotA;
          const pNotANotB = (1 - pa) * (1 - pbGivenNotA);
          const pB = pAB + pNotAB;
          const pAGivenB = pB > 0 ? pAB / pB : 0;

          const splitX = boxX + boxW * pa;
          const aBHeight = boxH * pbGivenA;
          const notABHeight = boxH * pbGivenNotA;

          p.background(13, 17, 23);
          p.noStroke();

          p.fill(155, 127, 221, 135);
          p.rect(boxX, boxY, splitX - boxX, aBHeight);
          p.fill(155, 127, 221, 45);
          p.rect(boxX, boxY + aBHeight, splitX - boxX, boxH - aBHeight);

          p.fill(93, 202, 165, 135);
          p.rect(splitX, boxY, boxX + boxW - splitX, notABHeight);
          p.fill(93, 202, 165, 45);
          p.rect(splitX, boxY + notABHeight, boxX + boxW - splitX, boxH - notABHeight);

          p.stroke(210);
          p.strokeWeight(1.5);
          p.noFill();
          p.rect(boxX, boxY, boxW, boxH);
          p.line(splitX, boxY, splitX, boxY + boxH);
          p.line(boxX, boxY + aBHeight, splitX, boxY + aBHeight);
          p.line(splitX, boxY + notABHeight, boxX + boxW, boxY + notABHeight);

          p.noStroke();
          p.fill(220);
          p.textAlign(p.LEFT, p.TOP);
          p.text("A", boxX + 10, boxY - 28);
          p.text("A^c", splitX + 10, boxY - 28);
          p.text("B", boxX - 26, boxY + 8);
          p.text("B^c", boxX - 38, boxY + boxH - 30);

          p.textAlign(p.CENTER, p.CENTER);
          p.fill(242);
          p.text(`P(A ∩ B)\n${pAB.toFixed(2)}`, (boxX + splitX) / 2, boxY + aBHeight / 2);
          p.text(
            `P(A ∩ B^c)\n${pANotB.toFixed(2)}`,
            (boxX + splitX) / 2,
            boxY + aBHeight + (boxH - aBHeight) / 2
          );
          p.text(
            `P(A^c ∩ B)\n${pNotAB.toFixed(2)}`,
            splitX + (boxX + boxW - splitX) / 2,
            boxY + notABHeight / 2
          );
          p.text(
            `P(A^c ∩ B^c)\n${pNotANotB.toFixed(2)}`,
            splitX + (boxX + boxW - splitX) / 2,
            boxY + notABHeight + (boxH - notABHeight) / 2
          );

          p.textAlign(p.LEFT, p.TOP);
          p.fill(180);
          p.text("conditioning means the rectangle for B becomes the whole visible world", 18, 18);
          p.fill(130);
          p.text(
            `P(B) = ${pB.toFixed(2)}   and   P(A | B) = ${pAGivenB.toFixed(2)}`,
            18,
            38
          );

          const barX = 80;
          const barY = 382;
          const barW = 500;
          const barH = 18;
          p.fill(50);
          p.rect(barX, barY, barW, barH, 999);
          p.fill(155, 127, 221);
          p.rect(barX, barY, barW * pAGivenB, barH, 999);
          p.fill(220);
          p.textAlign(p.LEFT, p.BOTTOM);
          p.text("inside B only", barX, barY - 8);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("A within B", barX + (barW * pAGivenB) / 2, barY + barH / 2);
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
  const pB = aProb * bGivenA + (1 - aProb) * bGivenNotA;
  const pAGivenB = pB > 0 ? (aProb * bGivenA) / pB : 0;

  return (
    <div>
      <div className="sketch-wrap">
        <div ref={containerRef} />
      </div>

      <div className="sketch-controls" style={{ alignItems: "flex-start" }}>
        <div className="sketch-slider-row" style={{ minWidth: 170 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">P(A)</span>
            <span className="sketch-value">{aProb.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.01}
            value={aProb}
            onChange={(e) => {
              setAProb(parseFloat(e.target.value));
              redraw();
            }}
            className="sketch-range"
          />
        </div>

        <div className="sketch-slider-row" style={{ minWidth: 170 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">P(B | A)</span>
            <span className="sketch-value">{bGivenA.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.01}
            value={bGivenA}
            onChange={(e) => {
              setBGivenA(parseFloat(e.target.value));
              redraw();
            }}
            className="sketch-range"
          />
        </div>

        <div className="sketch-slider-row" style={{ minWidth: 170 }}>
          <div className="sketch-slider-header">
            <span className="sketch-label">P(B | A^c)</span>
            <span className="sketch-value">{bGivenNotA.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.01}
            value={bGivenNotA}
            onChange={(e) => {
              setBGivenNotA(parseFloat(e.target.value));
              redraw();
            }}
            className="sketch-range"
          />
        </div>

        <span className="sketch-note" style={{ marginLeft: 0 }}>
          P(A | B) = {pAGivenB.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
