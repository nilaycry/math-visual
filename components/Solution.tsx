"use client";
import { useState } from "react";

export default function Solution({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginTop: 8, marginBottom: 24 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 13,
          color: "#6d4fc2",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          letterSpacing: "0.01em",
        }}
      >
        {open ? "hide ↑" : "solution ↓"}
      </button>
      {open && (
        <div
          style={{
            marginTop: 14,
            paddingLeft: 20,
            borderLeft: "3px solid #9b7fdd",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
