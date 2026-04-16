import { notFound } from "next/navigation";
import { getLessonBySlug, getAllLessonSlugs, getLessonContent, type LessonMeta } from "@/lib/lessons";
import type { Metadata } from "next";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import dynamic from "next/dynamic";

// Import sketch components for MDX (dynamic import with ssr: false)
const FourierSketch = dynamic(() => import("@/components/sketches/FourierSketch"), { ssr: false });
const GradientSketch = dynamic(() => import("@/components/sketches/GradientSketch"), { ssr: false });
const EigenSketch = dynamic(() => import("@/components/sketches/EigenSketch"), { ssr: false });
const NonConvexSketch = dynamic(() => import("@/components/sketches/NonConvexSketch"), { ssr: false });
const SVDSketch = dynamic(() => import("@/components/sketches/SVDSketch"), { ssr: false });
const BackpropSketch = dynamic(() => import("@/components/sketches/BackpropSketch"), { ssr: false });

const components = {
  FourierSketch,
  GradientSketch,
  EigenSketch,
  NonConvexSketch,
  SVDSketch,
  BackpropSketch,
};

export async function generateStaticParams() {
  const slugs = getAllLessonSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) return { title: "Not Found" };
  return {
    title: `${lesson.title} — MathVisual`,
    description: lesson.description,
  };
}

export default async function LessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) notFound();

  const mdxSource = getLessonContent(params.slug);
  if (!mdxSource) notFound();

  const { content } = await compileMDX({
    source: mdxSource,
    options: { parseFrontmatter: true },
    components,
  });

  // Find prev/next — only within the same type (lessons don't link to connections and vice versa)
  const allLessons = getAllLessonSlugs()
    .map((s) => getLessonBySlug(s))
    .filter((l): l is LessonMeta => l !== undefined && l.lessonType === lesson.lessonType);
  const currentIndex = allLessons.findIndex((l) => l.slug === params.slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-12" style={{ color: "#555" }}>
        <Link href="/" style={{ color: "#555", textDecoration: "none" }}
          className="hover:text-foreground transition-colors">
          ← lessons
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-wrap gap-2 mb-5">
          {lesson.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                fontWeight: 400,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 500,
            lineHeight: 1.2,
            color: "#e8e8e8",
            marginBottom: 16,
            letterSpacing: "-0.01em",
          }}
        >
          {lesson.title}
        </h1>
        <p style={{ fontSize: 16, color: "#888", lineHeight: 1.6, margin: 0 }}>
          {lesson.description}
        </p>
        <hr style={{ border: "none", borderTop: "1px solid #1e1e1e", marginTop: 32 }} />
      </header>

      {/* MDX Content */}
      <article className="prose">{content}</article>

      {/* Navigation */}
      <nav
        className="flex justify-between mt-16 pt-8"
        style={{ borderTop: "1px solid #1e1e1e" }}
      >
        {prevLesson ? (
          <Link
            href={`/lessons/${prevLesson.slug}`}
            className="group flex flex-col items-start"
            style={{ textDecoration: "none" }}
          >
            <span style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>← previous</span>
            <span
              style={{ fontSize: 14, fontWeight: 500, color: "#888" }}
              className="group-hover:text-foreground transition-colors"
            >
              {prevLesson.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className="group flex flex-col items-end"
            style={{ textDecoration: "none" }}
          >
            <span style={{ fontSize: 11, color: "#555", marginBottom: 4 }}>next →</span>
            <span
              style={{ fontSize: 14, fontWeight: 500, color: "#888" }}
              className="group-hover:text-foreground transition-colors"
            >
              {nextLesson.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
