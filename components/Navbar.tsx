"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // These pages have their own built-in navbars
  if (pathname === "/" || pathname === "/linear-algebra" || pathname === "/machine-learning" || pathname === "/graph" || pathname.startsWith("/abstract-linear-algebra") || pathname.startsWith("/combinatorics")) return null;

  const isNote = false;

  return (
    <>
      <style>{`
        .nav-pill:hover {
          color: #ccc !important;
          border-color: rgba(255,255,255,0.2) !important;
        }
      `}</style>
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
          href={isNote ? "/abstract-linear-algebra" : "/"}
          className="nav-pill group"
          style={{
            color: "#888",
            textDecoration: "none",
            fontSize: 12,
            fontWeight: 400,
            letterSpacing: "0.06em",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "5px 14px",
            transition: "all 0.2s",
            display: "inline-flex",
            alignItems: "center"
          }}
        >
          <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1" style={{ marginRight: 4 }}>←</span> {isNote ? "notes" : "lessons"}
        </Link>

        <div style={{ display: "flex", gap: 32 }}>
          <a
            href="https://github.com/nilaycry"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-pill"
            style={{
              color: "#888",
              textDecoration: "none",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "0.06em",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "5px 14px",
              transition: "all 0.2s"
            }}
          >
            github
          </a>
        </div>
      </nav>
    </>
  );
}
