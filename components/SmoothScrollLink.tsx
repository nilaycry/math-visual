"use client";

import type { CSSProperties, ReactNode } from "react";

export default function SmoothScrollLink({
  targetId,
  style,
  children,
}: {
  targetId: string;
  style?: CSSProperties;
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
    >
      {children}
    </a>
  );
}
