export interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  icon: string;
}

export const lessons: LessonMeta[] = [
  {
    slug: "fourier-series",
    title: "Fourier Series",
    description:
      "Watch how simple sine waves combine to build any shape — from smooth curves to sharp square waves.",
    tags: ["Signal Processing", "Trigonometry", "Series"],
    color: "from-purple-500 to-blue-500",
    icon: "〰️",
  },
  {
    slug: "gradient-descent",
    title: "Gradient Descent",
    description:
      "Place a ball on a surface and watch it roll downhill to find the minimum — the heart of machine learning.",
    tags: ["Optimization", "Machine Learning", "Calculus"],
    color: "from-emerald-500 to-cyan-500",
    icon: "⛰️",
  },
  {
    slug: "eigen",
    title: "the directions a matrix can't change",
    description: "what a matrix actually does to space",
    tags: ["linear algebra"],
    color: "from-orange-500 to-rose-500",
    icon: "🔄",
  },
];

export function getLessonBySlug(slug: string): LessonMeta | undefined {
  return lessons.find((l) => l.slug === slug);
}
