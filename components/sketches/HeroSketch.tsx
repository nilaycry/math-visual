"use client";

import { useRef, useEffect } from "react";
import p5 from "p5";

export default function HeroSketch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (p5Ref.current) {
      p5Ref.current.remove();
    }

    p5Ref.current = new p5((p: p5) => {
      const W = 480;
      const H = 400;
      let time = 0;
      const trail: { x: number; y: number }[] = [];
      const maxTrail = 300;

      const circles = [
        { radius: 80, speed: 1, r: 127, g: 119, b: 221 },     // #7F77DD purple
        { radius: 45, speed: 2.3, r: 93, g: 202, b: 165 },    // #5DCAA5 teal
        { radius: 22, speed: 5.1, r: 216, g: 90, b: 48 },     // #D85A30 coral
      ];

      p.setup = () => {
        p.createCanvas(W, H);
        p.frameRate(60);
      };

      p.draw = () => {
        p.clear();

        let cx = W / 2;
        let cy = H / 2;

        for (const c of circles) {
          // Orbit circle
          p.noFill();
          p.stroke(c.r, c.g, c.b, 50);
          p.strokeWeight(1);
          p.ellipse(cx, cy, c.radius * 2);

          // Next position
          const nx = cx + c.radius * p.cos(time * c.speed);
          const ny = cy + c.radius * p.sin(time * c.speed);

          // Radius line
          p.stroke(c.r, c.g, c.b, 90);
          p.strokeWeight(1);
          p.line(cx, cy, nx, ny);

          cx = nx;
          cy = ny;
        }

        // Trail
        trail.push({ x: cx, y: cy });
        if (trail.length > maxTrail) trail.shift();

        p.noFill();
        p.strokeWeight(1.5);
        for (let i = 1; i < trail.length; i++) {
          const alpha = p.map(i, 0, trail.length, 0, 200);
          const r = p.map(i, 0, trail.length, 93, 127);
          const g = p.map(i, 0, trail.length, 202, 119);
          const b = p.map(i, 0, trail.length, 165, 221);
          p.stroke(r, g, b, alpha);
          p.line(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y);
        }

        // Tip dot
        p.noStroke();
        p.fill(255, 255, 255, 180);
        p.ellipse(cx, cy, 4);

        time += 0.015;
      };
    }, containerRef.current);

    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: 480,
        height: 400,
        borderRadius: 12,
        overflow: "hidden",
      }}
    />
  );
}
