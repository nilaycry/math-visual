import "katex/dist/katex.min.css";
import type { ReactNode } from "react";

export default function RealAnalysisLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ backgroundColor: "#f7f4ef", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
