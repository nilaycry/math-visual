import { notFound } from "next/navigation";
import { getLessonBySlug, lessons } from "@/lib/lessons";
import type { Metadata } from "next";
import Link from "next/link";

// Import lesson content components
import FourierLesson from "./content/fourier-series";
import GradientLesson from "./content/gradient-descent";
import EigenLesson from "./content/eigen";

const lessonComponents: Record<string, React.ComponentType> = {
  "fourier-series": FourierLesson,
  "gradient-descent": GradientLesson,
  eigen: EigenLesson,
};

export async function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
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

export default function LessonPage({
  params,
}: {
  params: { slug: string };
}) {
  const lesson = getLessonBySlug(params.slug);
  if (!lesson) notFound();

  const LessonContent = lessonComponents[params.slug];
  if (!LessonContent) notFound();

  // Find prev/next
  const currentIndex = lessons.findIndex((l) => l.slug === params.slug);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

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

      {/* Lesson Content */}
      <article className="prose">
        <LessonContent />
      </article>

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
