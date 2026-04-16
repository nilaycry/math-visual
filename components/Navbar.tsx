"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // These pages have their own built-in navbars
  if (pathname === "/" || pathname === "/linear-algebra" || pathname === "/machine-learning") return null;

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 48px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#555",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 400,
        }}
      >
        ← lessons
      </Link>

      <div style={{ display: "flex", gap: 32 }}>
        <a
          href="https://github.com/nilaycry"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#555",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 400,
          }}
        >
          github
        </a>
      </div>
    </nav>
  );
}
