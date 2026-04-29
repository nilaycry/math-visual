import { notFound } from "next/navigation";
import { getAllNoteSlugs, getNoteBySlug, getProblemsContent, hasProblems } from "@/lib/notes";
import type { Metadata } from "next";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Solution from "@/components/Solution";

const COURSE = "math-314";

const BG = "#f7f4ef";
const FG = "#1c1917";
const FAINT = "#a8a29e";
const BORDER = "#e8e5df";
const ACCENT = "#2f6b6f";

export async function generateStaticParams() {
  return getAllNoteSlugs(COURSE)
    .filter((slug) => hasProblems(slug, COURSE))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const note = getNoteBySlug(params.slug, COURSE);
  if (!note) return { title: "Not Found" };
  return {
    title: `${note.title} - problems - Math 314`,
    description: `Practice problems for ${note.title}`,
  };
}

export default async function ProblemsPage({
  params,
}: {
  params: { slug: string };
}) {
  const note = getNoteBySlug(params.slug, COURSE);
  if (!note) notFound();

  const mdxSource = getProblemsContent(params.slug, COURSE);
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
    components: { Solution },
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: BG,
        color: FG,
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <nav
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
          href={`/math-314/${params.slug}`}
          style={{ color: FAINT, textDecoration: "none", fontSize: 14 }}
        >
          ← {note.title}
        </Link>
        <Link href="/math-314" style={{ color: FAINT, textDecoration: "none", fontSize: 14 }}>
          notes
        </Link>
      </nav>

      <header
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
            math 314 · week {note.week} · problems
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
        <hr style={{ border: "none", borderTop: `1px solid ${BORDER}`, marginTop: 32 }} />
      </header>

      <main
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "0 48px 80px",
        }}
      >
        <article
          className="notes-prose"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            maxWidth: "none",
          }}
        >
          {content}
        </article>
      </main>
    </div>
  );
}
