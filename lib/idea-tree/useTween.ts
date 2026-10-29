"use client";

import { useEffect, useRef, useState } from "react";
import type { Box, Layout } from "./layout";

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// glides every box from where it is now to its new target, so nodes and the curves between them move together
export function useTweenedLayout(target: Layout, duration = 340): Layout {
  const [cur, setCur] = useState<Layout>(target);
  const curRef = useRef<Layout>(target);

  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = curRef.current;
    if (reduce) {
      curRef.current = target;
      setCur(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = ease(Math.min(1, (now - start) / duration));
      const next: Layout = {};
      for (const k in target) {
        const a: Box = from[k] ?? target[k];
        const b = target[k];
        next[k] = { x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t), o: mix(a.o, b.o, t) };
      }
      curRef.current = next;
      setCur(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return cur;
}
