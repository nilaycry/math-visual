import Link from "next/link";
import CombinatoricsPlayground from "@/components/CombinatoricsPlayground";

const NAV_LINK_STYLE = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  border: "1px solid rgba(0, 0, 0, 0.08)",
  borderRadius: 20,
  background: "rgba(255, 255, 255, 0.28)",
  color: "#78716c",
  textDecoration: "none",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.06em",
  lineHeight: 1.2,
  padding: "6px 13px",
} as const;

export default function CombinatoricsPlaygroundPage({
  searchParams,
}: {
  searchParams?: { n?: string; r?: string; pick?: string };
}) {
  const rawN = Number(searchParams?.n ?? 5);
  const n = Number.isInteger(rawN) ? Math.min(8, Math.max(3, rawN)) : 5;
  const rawR = Number(searchParams?.r ?? 3);
  const r = Number.isInteger(rawR) ? Math.min(n, Math.max(0, rawR)) : 3;
  const rawPick = Number(searchParams?.pick ?? 0);
  const pick = Number.isInteger(rawPick) ? Math.max(0, rawPick) : 0;

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: "rgba(247, 244, 239, 0.85)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 1120,
            margin: "0 auto",
            padding: "18px 48px",
          }}
        >
          <Link href="/combinatorics" style={NAV_LINK_STYLE}>
            <span aria-hidden="true">{"<-"}</span> combinatorics
          </Link>
          <Link href="/combinatorics/combinations-as-subsets" style={NAV_LINK_STYLE}>
            note
          </Link>
        </nav>
      </div>
      <CombinatoricsPlayground n={n} r={r} pick={pick} />
    </>
  );
}
