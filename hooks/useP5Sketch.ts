import { useEffect, useRef } from "react";
import p5 from "p5";

/**
 * Manages the full p5.js lifecycle for a sketch component.
 *
 * Usage:
 *   const containerRef = useP5Sketch(buildSketch);
 *   return <div ref={containerRef} />;
 *
 * `buildSketch` receives the container element and returns a p5 instance.
 * It is called once on mount. All mutable state accessed inside the sketch
 * must go through refs (not React state) to stay live inside the p5 closure.
 *
 * The hook handles:
 *   - Clearing stale children before mounting
 *   - Deferring instantiation one tick (avoids SSR/hydration issues)
 *   - Proper cleanup on unmount
 */
export function useP5Sketch(buildSketch: (el: HTMLElement) => p5) {
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
      p5Ref.current = buildSketch(el);
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (p5Ref.current) { p5Ref.current.remove(); p5Ref.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}
