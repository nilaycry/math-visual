import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface NoteMeta {
  slug: string;
  title: string;
  description: string;
  week: number;
  visualLesson?: string;
}

function notesDir(course: string) {
  return path.join(process.cwd(), "notes", course);
}

export function getAllNotes(course = "abstract-linear-algebra"): NoteMeta[] {
  const dir = notesDir(course);
  if (!fs.existsSync(dir)) return [];

  const dirs = fs
    .readdirSync(dir)
    .filter((d) => fs.statSync(path.join(dir, d)).isDirectory());

  return dirs
    .map((slug) => {
      const filePath = path.join(dir, slug, "content.mdx");
      if (!fs.existsSync(filePath)) return null;

      const { data } = matter(fs.readFileSync(filePath, "utf-8"));

      return {
        slug,
        title: data.title as string,
        description: data.description as string,
        week: (data.week as number) ?? 1,
        visualLesson: (data.visualLesson as string | undefined) ?? undefined,
      } as NoteMeta;
    })
    .filter((note): note is NoteMeta => note !== null)
    .sort((a, b) => a.week - b.week);
}

export function getNoteBySlug(slug: string, course = "abstract-linear-algebra"): NoteMeta | undefined {
  return getAllNotes(course).find((n) => n.slug === slug);
}

export function getNoteContent(slug: string, course = "abstract-linear-algebra"): string | null {
  const filePath = path.join(notesDir(course), slug, "content.mdx");
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function getProblemsContent(slug: string, course = "abstract-linear-algebra"): string | null {
  const filePath = path.join(notesDir(course), slug, "problems.mdx");
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function hasProblems(slug: string, course = "abstract-linear-algebra"): boolean {
  return fs.existsSync(path.join(notesDir(course), slug, "problems.mdx"));
}

export function getAllNoteSlugs(course = "abstract-linear-algebra"): string[] {
  const dir = notesDir(course);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((d) => {
      if (!fs.statSync(path.join(dir, d)).isDirectory()) return false;
      return fs.existsSync(path.join(dir, d, "content.mdx"));
    });
}
