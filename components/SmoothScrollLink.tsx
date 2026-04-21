"use client";

import type { CSSProperties, ReactNode } from "react";

export default function SmoothScrollLink({
  targetId,
  style,
  className,
  children,
}: {
  targetId: string;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`#${targetId}`}
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }}
      style={style}
      className={className}
    >
      {children}
    </a>
  );
}
