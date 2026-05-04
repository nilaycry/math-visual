import { notFound } from "next/navigation";
import { getLessonBySlug, getAllLessonSlugs, getLessonContent, type LessonMeta, type RelatedEntry } from "@/lib/lessons";
import { getNoteBySlug } from "@/lib/notes";
import type { Metadata } from "next";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import dynamic from "next/dynamic";
import MatrixVectorVisual from "@/components/MatrixVectorVisual";

// Import sketch components for MDX (dynamic import with ssr: false)
const FourierSketch = dynamic(() => import("@/components/sketches/FourierSketch"), { ssr: false });
const GradientSketch = dynamic(() => import("@/components/sketches/GradientSketch"), { ssr: false });
const EigenSketch = dynamic(() => import("@/components/sketches/EigenSketch"), { ssr: false });
const NonConvexSketch = dynamic(() => import("@/components/sketches/NonConvexSketch"), { ssr: false });
const SVDSketch = dynamic(() => import("@/components/sketches/SVDSketch"), { ssr: false });
const BackpropSketch = dynamic(() => import("@/components/sketches/BackpropSketch"), { ssr: false });
const BackpropTrainSketch = dynamic(() => import("@/components/sketches/BackpropTrainSketch"), { ssr: false });
const NullSpaceSketch = dynamic(() => import("@/components/sketches/NullSpaceSketch"), { ssr: false });
const GradientFlowSketch = dynamic(() => import("@/components/sketches/GradientFlowSketch"), { ssr: false });
const LinearModelSketch = dynamic(() => import("@/components/sketches/LinearModelSketch"), { ssr: false });
const NonLinearSketch = dynamic(() => import("@/components/sketches/NonLinearSketch"), { ssr: false });
const ResNetSketch = dynamic(() => import("@/components/sketches/ResNetSketch"), { ssr: false });
const PrefaceSketch = dynamic(() => import("@/components/sketches/PrefaceSketch"), { ssr: false });
const WeightMatrixSketch = dynamic(() => import("@/components/sketches/WeightMatrixSketch"), { ssr: false });
const NetworkAnatomySketch = dynamic(() => import("@/components/sketches/NetworkAnatomySketch"), { ssr: false });
const ExpectationSketch = dynamic(() => import("@/components/sketches/ExpectationSketch"), { ssr: false });
const ConditioningSketch = dynamic(() => import("@/components/sketches/ConditioningSketch"), { ssr: false });
const SamplingSketch = dynamic(() => import("@/components/sketches/SamplingSketch"), { ssr: false });
const CLTSketch = dynamic(() => import("@/components/sketches/CLTSketch"), { ssr: false });
const ConfidenceIntervalSketch = dynamic(() => import("@/components/sketches/ConfidenceIntervalSketch"), { ssr: false });
const MatrixActionSketch = dynamic(() => import("@/components/sketches/MatrixActionSketch"), { ssr: false });
const ProjectionSketch = dynamic(() => import("@/components/sketches/ProjectionSketch"), { ssr: false });
const ReachabilitySketch = dynamic(() => import("@/components/sketches/ReachabilitySketch"), { ssr: false });

const components = {
  FourierSketch,
  GradientSketch,
  EigenSketch,
  NonConvexSketch,
  SVDSketch,
  BackpropSketch,
  BackpropTrainSketch,
  NullSpaceSketch,
  GradientFlowSketch,
  LinearModelSketch,
  NonLinearSketch,
  ResNetSketch,
  PrefaceSketch,
  WeightMatrixSketch,
  NetworkAnatomySketch,
  ExpectationSketch,
  ConditioningSketch,
  SamplingSketch,
  CLTSketch,
  ConfidenceIntervalSketch,
  MatrixActionSketch,
  ProjectionSketch,
  ReachabilitySketch,
  NetworkAnatomy: NetworkAnatomySketch,
  MatrixVectorVisual,
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

  const rigorousNote = lesson.rigorousNote ? getNoteBySlug(lesson.rigorousNote) : null;

  const resolvedRelated: (RelatedEntry & { meta: LessonMeta })[] = (lesson.related ?? [])
    .map((r) => ({ ...r, meta: getLessonBySlug(r.slug) }))
    .filter((r): r is RelatedEntry & { meta: LessonMeta } => r.meta !== undefined);

  const allLessons = getAllLessonSlugs()
    .map((s) => getLessonBySlug(s))
    .filter((l): l is LessonMeta => l !== undefined && l.lessonType === lesson.lessonType && l.subject === lesson.subject);
  const currentIndex = allLessons.findIndex((l) => l.slug === params.slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const isProbabilityLesson = lesson.subject === "probability";

  // subject directory name maps directly to URL (e.g. "linear-algebra" -> "/linear-algebra")
  const backHref = lesson.subject ? `/${lesson.subject}` : "/";
  const backLabel = lesson.subject ? lesson.subject.replace(/-/g, " ") : "lessons";

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .lesson-layout { flex-direction: column !important; }
          .lesson-sidebar { display: none !important; }
          .lesson-main { padding: 32px 20px 64px !important; }
        }
        .back-link:hover {
          color: #E8A020 !important;
        }
        .nav-link-group:hover .nav-link-title {
          color: #E8A020 !important;
        }
        .conn-link {
          transition: all 0.2s ease;
        }
        .conn-link:hover {
          transform: translateX(4px);
        }
        .conn-link:hover .conn-title {
          color: #E8A020 !important;
        }
        .rigorous-link:hover .rigorous-title {
          color: #9B7FDD !important;
        }
        .rigorous-link:hover .rigorous-border {
          border-left-color: #9B7FDD !important;
        }
        .prob-lesson-shell::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 14% 18%, rgba(232,160,32,0.05) 0%, rgba(232,160,32,0) 22%),
            radial-gradient(circle at 84% 30%, rgba(93,202,165,0.04) 0%, rgba(93,202,165,0) 20%),
            radial-gradient(circle at 55% 75%, rgba(96,165,250,0.03) 0%, rgba(96,165,250,0) 24%);
          z-index: 0;
        }
        .prob-lesson-shell::after {
          content: "";
          position: fixed;
          inset: 0;
          opacity: 0.14;
          pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.15) 0.7px, transparent 0.7px);
          background-size: 26px 26px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.26), rgba(0,0,0,0.08) 28%, rgba(0,0,0,0.18) 72%, rgba(0,0,0,0.3));
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.26), rgba(0,0,0,0.08) 28%, rgba(0,0,0,0.18) 72%, rgba(0,0,0,0.3));
          z-index: 0;
        }
        .prob-tag {
          color: #d0a158 !important;
        }
        .prob-divider {
          position: relative;
        }
        .prob-divider::after {
          content: "";
          position: absolute;
          left: 0;
          width: 124px;
          bottom: -1px;
          height: 1px;
          background: repeating-linear-gradient(90deg, rgba(232,160,32,0.45) 0 2px, rgba(232,160,32,0) 2px 13px);
        }
        .prob-prose .math-highlight {
          background: linear-gradient(135deg, #1d1624 0%, #141016 100%);
          border: 1px solid rgba(232,160,32,0.18);
          border-left: 3px solid #e8a020;
          color: #f4dfbf;
          box-shadow: 0 18px 40px -34px rgba(232,160,32,0.34);
        }
        .prob-prose h3 {
          color: #f4efe3;
        }
        .prob-prose p {
          color: #b5b0a6;
        }
      `}</style>

      <div
        className={isProbabilityLesson ? "prob-lesson-shell" : undefined}
        style={{
          minHeight: "100vh",
          background: isProbabilityLesson
            ? "radial-gradient(circle at top, rgba(26, 22, 15, 0.52) 0%, rgba(10,10,10,1) 38%), #0a0a0a"
            : "#0a0a0a",
          color: "#e8e8e8",
          position: "relative",
        }}
      >
        {/* ── TWO-COLUMN LAYOUT ── */}
        <div
          className="lesson-layout"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 48px",
            display: "flex",
            gap: 80,
            alignItems: "flex-start",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ── MAIN PROSE COLUMN ── */}
          <main
            className="lesson-main"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "48px 0 96px",
            }}
          >
            {/* Header */}
            <header style={{ marginBottom: 48 }}>
              <div style={{ marginBottom: 20 }}>
                {lesson.tags.map((tag) => (
                  <span
                    key={tag}
                    className={isProbabilityLesson ? "prob-tag" : undefined}
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: "#555",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginRight: 16,
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
                  marginTop: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {lesson.title}
              </h1>
              <p style={{ fontSize: 16, color: "#888", lineHeight: 1.6, margin: 0 }}>
                {lesson.description}
              </p>
              <hr
                className={isProbabilityLesson ? "prob-divider" : undefined}
                style={{ border: "none", borderTop: "1px solid #1e1e1e", marginTop: 32 }}
              />
            </header>

            {/* MDX Content */}
            <article className={`prose${isProbabilityLesson ? " prob-prose" : ""}`}>{content}</article>

            {/* Prev / Next navigation */}
            <nav
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 64,
                paddingTop: 32,
                borderTop: isProbabilityLesson ? "1px solid rgba(232,160,32,0.12)" : "1px solid #1a1a1a",
              }}
            >
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.slug}`} className="nav-link-group" style={{ textDecoration: "none" }}>
                  <span style={{ fontSize: 10, color: "#444", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>← previous</span>
                  <span className="nav-link-title" style={{ fontSize: 14, fontWeight: 500, color: "#888", transition: "color 0.2s" }}>{prevLesson.title}</span>
                </Link>
              ) : <div />}
              {nextLesson ? (
                <Link href={`/lessons/${nextLesson.slug}`} className="nav-link-group" style={{ textDecoration: "none", textAlign: "right" }}>
                  <span style={{ fontSize: 10, color: "#444", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>next →</span>
                  <span className="nav-link-title" style={{ fontSize: 14, fontWeight: 500, color: "#888", transition: "color 0.2s" }}>{nextLesson.title}</span>
                </Link>
              ) : <div />}
            </nav>
          </main>

          {/* ── STICKY SIDEBAR ── */}
          <aside
            className="lesson-sidebar"
            style={{
              width: 200,
              flexShrink: 0,
              position: "sticky",
              top: 72,
              paddingTop: 52,
              paddingBottom: 48,
              display: "flex",
              flexDirection: "column",
              gap: 40,
            }}
          >
            {/* Back link */}
            <Link
              href={backHref}
              className="back-link group"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#666",
                textDecoration: "none",
                letterSpacing: "0.06em",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
            >
              <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span> {backLabel}
            </Link>

            {/* Lesson type badge */}
            {lesson.lessonType && (
              <div>
                <span style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 6 }}>
                  type
                </span>
                <span style={{ fontSize: 12, color: isProbabilityLesson ? "#d6c3a2" : "#888", letterSpacing: "0.04em", fontWeight: 500, background: isProbabilityLesson ? "rgba(232,160,32,0.06)" : "rgba(255,255,255,0.03)", padding: "4px 10px", borderRadius: 6, border: isProbabilityLesson ? "1px solid rgba(232,160,32,0.14)" : "1px solid rgba(255,255,255,0.05)" }}>
                  {lesson.lessonType}
                </span>
              </div>
            )}

            {/* Rigorous treatment */}
            {rigorousNote && (
              <div>
                <span style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 12 }}>
                  rigorous treatment
                </span>
                <Link
                  href={`/abstract-linear-algebra/${lesson.rigorousNote}`}
                  className="rigorous-link"
                  style={{ textDecoration: "none", color: "inherit", display: "block" }}
                >
                  <div className="rigorous-border" style={{ borderLeft: "2px solid rgba(155, 127, 221, 0.2)", paddingLeft: 12, transition: "border-color 0.2s" }}>
                    <span className="rigorous-title" style={{ fontSize: 13, fontWeight: 500, color: "#aaa", display: "block", marginBottom: 4, lineHeight: 1.4, transition: "color 0.2s" }}>
                      {rigorousNote.title}
                    </span>
                    <span style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      week {rigorousNote.week}
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* Related lessons */}
            {resolvedRelated.length > 0 && (
              <div>
                <span style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 12 }}>
                  connected
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {resolvedRelated.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/lessons/${r.slug}`}
                      className="conn-link"
                      style={{ textDecoration: "none", color: "inherit", display: "block" }}
                    >
                      <span className="conn-title" style={{ fontSize: 13, fontWeight: 500, color: "#888", lineHeight: 1.4, display: "block", transition: "color 0.2s" }}>
                        {r.meta.title}
                      </span>
                      {r.note && (
                        <span style={{ fontSize: 11, color: "#444", display: "block", marginTop: 3 }}>
                          {r.note}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
