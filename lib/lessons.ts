import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface RelatedEntry {
  slug: string;
  note: string;
}

export interface LessonMeta {
  slug: string;
  subject: string;
  title: string;
  description: string;
  tags: string[];
  displayTag: string;
  color: string;
  icon: string;
  accent: string;
  date: string;
  lessonType: "lesson" | "connection";
  related: RelatedEntry[];
  rigorousNote?: string;
}

const lessonsDirectory = path.join(process.cwd(), "lessons");

function getSubjectDirs(): string[] {
  return fs
    .readdirSync(lessonsDirectory)
    .filter((d) => fs.statSync(path.join(lessonsDirectory, d)).isDirectory());
}

export function getAllLessons(): LessonMeta[] {
  const results: LessonMeta[] = [];

  for (const subject of getSubjectDirs()) {
    const subjectPath = path.join(lessonsDirectory, subject);
    const slugDirs = fs
      .readdirSync(subjectPath)
      .filter((d) => fs.statSync(path.join(subjectPath, d)).isDirectory());

    for (const slug of slugDirs) {
      const filePath = path.join(subjectPath, slug, "content.mdx");
      if (!fs.existsSync(filePath)) continue;

      const { data } = matter(fs.readFileSync(filePath, "utf-8"));
      if (data.draft) continue;

      const tags = (data.tags as string[]) ?? [];

      results.push({
        slug,
        subject,
        title: data.title as string,
        description: data.description as string,
        tags,
        displayTag: (data.displayTag as string) ?? tags[0] ?? "",
        color: data.color as string,
        icon: data.icon as string,
        accent: (data.accent as string) ?? "#7F77DD",
        date: (data.date as string) ?? "",
        lessonType: (data.type === "connection" ? "connection" : "lesson") as "lesson" | "connection",
        related: (data.related as RelatedEntry[] | undefined) ?? [],
        rigorousNote: (data.rigorousNote as string | undefined) ?? undefined,
      });
    }
  }

  return results.sort((a, b) => a.date.localeCompare(b.date));
}

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return getAllLessons().find((l) => l.slug === slug);
}

export function getLessonContent(slug: string): string | null {
  for (const subject of getSubjectDirs()) {
    const filePath = path.join(lessonsDirectory, subject, slug, "content.mdx");
    if (fs.existsSync(filePath)) return fs.readFileSync(filePath, "utf-8");
  }
  return null;
}

export function getAllLessonSlugs(): string[] {
  return getAllLessons().map((l) => l.slug);
}
