import type { Metadata } from "next";
import Link from "next/link";
import Explorer from "@/components/idea-tree/Explorer";
import "@/components/idea-tree/idea-tree.css";

export const metadata: Metadata = {
  title: "the course as a tree · math 416",
  description: "math 416 as one sentence, five questions, and the places where the branches turn out to be the same idea.",
};

const pill =
  "inline-flex items-center rounded-[20px] border border-black/[0.06] px-3.5 py-[5px] text-xs font-medium tracking-[0.06em] text-[#a8a29e] no-underline transition-all hover:border-black/15 hover:bg-black/[0.02] hover:text-[#1c1917]";

export default function IdeaTreePage() {
  return (
    <div className="it-root min-h-screen" style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div className="sticky top-0 z-50 border-b border-black/[0.06] bg-[rgba(247,244,239,0.85)] backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1340px] items-center justify-between px-5 py-5 md:px-12">
          <Link href="/abstract-linear-algebra" className={`${pill} group`}>
            <span className="mr-1 inline-block transition-transform duration-200 group-hover:-translate-x-1">←</span> notes
          </Link>
          <a href="https://github.com/nilaycry" target="_blank" rel="noopener noreferrer" className={pill}>
            github
          </a>
        </nav>
      </div>
      <Explorer />
    </div>
  );
}
