import { notFound } from "next/navigation";
import { getAllNotes, getAllNoteSlugs, getNoteBySlug, getNoteContent, hasProblems, type NoteMeta } from "@/lib/notes";
import type { Metadata } from "next";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ArrowLeft, ArrowRight, ExternalLink, ListChecks } from "lucide-react";

const COURSE = "combinatorics";

const BG = "#f7f4ef";
const FG = "#1c1917";
const MUTED = "#78716c";
const FAINT = "#a8a29e";
const BORDER = "#e8e5df";
const ACCENT = "#b85c1a";

export async function generateStaticParams() {
  const slugs = getAllNoteSlugs(COURSE);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const note = getNoteBySlug(params.slug, COURSE);
  if (!note) return { title: "Not Found" };
  return {
    title: `${note.title} — Math 413`,
    description: note.description,
  };
}

export default async function NotePage({
  params,
}: {
  params: { slug: string };
}) {
  const note = getNoteBySlug(params.slug, COURSE);
  if (!note) notFound();

  const noteHasProblems = hasProblems(params.slug, COURSE);
  const mdxSource = getNoteContent(params.slug, COURSE);
  if (!mdxSource) notFound();

  const { content } = await compileMDX({
    source: mdxSource,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    },
  });

  const allNotes = getAllNotes(COURSE).filter((n): n is NoteMeta => n !== undefined);
  const currentIndex = allNotes.findIndex((n) => n.slug === params.slug);
  const prevNote = currentIndex > 0 ? allNotes[currentIndex - 1] : null;
  const nextNote = currentIndex < allNotes.length - 1 ? allNotes[currentIndex + 1] : null;

  return (
    <div
      className="note-accent-combinatorics"
      style={{
        minHeight: "100vh",
        backgroundColor: BG,
        color: FG,
      }}
    >
      {/* ── NAVBAR ── */}
      <nav
        className="co-note-shell-nav"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 48px",
          maxWidth: 860,
          margin: "0 auto",
        }}
      >
        <Link
          href="/combinatorics"
          className="co-note-button"
        >
          <ArrowLeft size={15} strokeWidth={1.9} />
          notes
        </Link>
        <a
          href="https://github.com/nilaycry"
          target="_blank"
          rel="noopener noreferrer"
          className="co-note-button"
        >
          <ExternalLink size={15} strokeWidth={1.9} />
          github
        </a>
      </nav>

      {/* ── HEADER ── */}
      <header
        className="co-note-header"
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "48px 48px 40px",
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 400,
              color: ACCENT,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            math 413 · week {note.week}
          </span>
        </div>
        <h1
          style={{
            fontSize: 34,
            fontWeight: 500,
            lineHeight: 1.2,
            color: FG,
            marginBottom: 14,
            letterSpacing: "-0.01em",
          }}
        >
          {note.title}
        </h1>
        <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.6, margin: "0 0 20px 0" }}>
          {note.description}
        </p>
        <hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, marginTop: 0 }} />
      </header>

      {/* ── CONTENT ── */}
      <main
        className="co-note-main"
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "0 48px 48px",
        }}
      >
        <article
          className="notes-prose"
          style={{
            maxWidth: "none",
          }}
        >
          {content}
        </article>

        {noteHasProblems && (
          <div style={{ marginTop: 48 }}>
            <Link
              href={`/combinatorics/${params.slug}/problems`}
              className="co-note-action"
            >
              <ListChecks size={16} strokeWidth={1.9} />
              problems
              <ArrowRight size={15} strokeWidth={1.9} />
            </Link>
          </div>
        )}
      </main>

      {/* ── NAVIGATION ── */}
      <footer
        className="co-note-footer"
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "32px 48px 80px",
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {prevNote ? (
          <Link
            href={`/combinatorics/${prevNote.slug}`}
            className="co-note-nav-card"
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: FAINT, marginBottom: 5, lineHeight: 1.2 }}>
              <ArrowLeft size={13} strokeWidth={1.9} />
              previous
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: MUTED, lineHeight: 1.35 }}>
              {prevNote.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {nextNote ? (
          <Link
            href={`/combinatorics/${nextNote.slug}`}
            className="co-note-nav-card"
            style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: FAINT, marginBottom: 5, lineHeight: 1.2 }}>
              next
              <ArrowRight size={13} strokeWidth={1.9} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 500, color: MUTED, lineHeight: 1.35 }}>
              {nextNote.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </footer>
    </div>
  );
}
