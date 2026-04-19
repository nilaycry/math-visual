import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface NoteMeta {
  slug: string;
  title: string;
  description: string;
  week: number;
}

const notesDirectory = path.join(process.cwd(), "notes", "abstract-linear-algebra");

export function getAllNotes(): NoteMeta[] {
  if (!fs.existsSync(notesDirectory)) return [];

  const dirs = fs
    .readdirSync(notesDirectory)
    .filter((dir) => fs.statSync(path.join(notesDirectory, dir)).isDirectory());

  return dirs
    .map((slug) => {
      const filePath = path.join(notesDirectory, slug, "content.mdx");
      if (!fs.existsSync(filePath)) return null;

      const { data } = matter(fs.readFileSync(filePath, "utf-8"));

      return {
        slug,
        title: data.title as string,
        description: data.description as string,
        week: (data.week as number) ?? 1,
      } as NoteMeta;
    })
    .filter((note): note is NoteMeta => note !== null)
    .sort((a, b) => a.week - b.week);
}

export function getNoteBySlug(slug: string): NoteMeta | undefined {
  return getAllNotes().find((n) => n.slug === slug);
}

export function getNoteContent(slug: string): string | null {
  const filePath = path.join(notesDirectory, slug, "content.mdx");
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function getProblemsContent(slug: string): string | null {
  const filePath = path.join(notesDirectory, slug, "problems.mdx");
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function hasProblems(slug: string): boolean {
  return fs.existsSync(path.join(notesDirectory, slug, "problems.mdx"));
}

export function getAllNoteSlugs(): string[] {
  if (!fs.existsSync(notesDirectory)) return [];
  return fs
    .readdirSync(notesDirectory)
    .filter((dir) => {
      if (!fs.statSync(path.join(notesDirectory, dir)).isDirectory()) return false;
      return fs.existsSync(path.join(notesDirectory, dir, "content.mdx"));
    });
}
