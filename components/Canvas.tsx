"use client";

import { useRef, useEffect } from "react";
import p5 from "p5";

interface CanvasProps {
  sketch: (p: p5) => void;
  className?: string;
}

export default function Canvas({ sketch, className = "" }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any existing instance
    if (p5Ref.current) {
      p5Ref.current.remove();
      p5Ref.current = null;
    }

    // Clear any orphaned canvas elements before mounting (fixes double-render in Strict Mode)
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Create new p5 instance
    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
    };
  }, [sketch]);

  return (
    <div
      ref={containerRef}
      className={`canvas-container flex items-center justify-center ${className}`}
    />
  );
}
