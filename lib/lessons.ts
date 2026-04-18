import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface RelatedEntry {
  slug: string;
  note: string;
}

export interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  icon: string;
  accent: string;
  lessonType: "lesson" | "connection";
  related: RelatedEntry[];
}

const lessonsDirectory = path.join(process.cwd(), "lessons");

export function getAllLessons(): LessonMeta[] {
  const lessonDirs = fs
    .readdirSync(lessonsDirectory)
    .filter((dir) => fs.statSync(path.join(lessonsDirectory, dir)).isDirectory());

  return lessonDirs
    .map((slug) => {
      const filePath = path.join(lessonsDirectory, slug, "content.mdx");
      if (!fs.existsSync(filePath)) return null;

      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);

      if (data.draft) return null;

      return {
        slug,
        title: data.title as string,
        description: data.description as string,
        tags: data.tags as string[],
        color: data.color as string,
        icon: data.icon as string,
        accent: (data.accent as string) ?? "#7F77DD",
        lessonType: (data.type === "connection" ? "connection" : "lesson") as "lesson" | "connection",
        related: (data.related as RelatedEntry[] | undefined) ?? [],
      } as LessonMeta;
    })
    .filter((lesson): lesson is LessonMeta => lesson !== null);
}

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  const lessons = getAllLessons();
  return lessons.find((l) => l.slug === slug);
}

export function getLessonContent(slug: string): string | null {
  const filePath = path.join(lessonsDirectory, slug, "content.mdx");
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function getAllLessonSlugs(): string[] {
  return fs
    .readdirSync(lessonsDirectory)
    .filter((dir) => {
      if (!fs.statSync(path.join(lessonsDirectory, dir)).isDirectory()) return false;
      const filePath = path.join(lessonsDirectory, dir, "content.mdx");
      if (!fs.existsSync(filePath)) return false;
      const { data } = matter(fs.readFileSync(filePath, "utf-8"));
      return !data.draft;
    });
}
