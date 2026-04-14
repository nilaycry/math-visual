"use client";

import Link from "next/link";
import { type LessonMeta } from "@/lib/lessons";

interface LessonCardProps {
  lesson: LessonMeta;
  index: number;
}

export default function LessonCard({ lesson, index }: LessonCardProps) {
  return (
    <Link href={`/lessons/${lesson.slug}`} className="group block">
      <div
        className="relative overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Gradient header / thumbnail area */}
        <div
          className={`relative h-44 bg-gradient-to-br ${lesson.color} p-6 flex items-end overflow-hidden`}
        >
          {/* Decorative shapes */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white/40 rounded-full" />
            <div className="absolute top-12 right-12 w-12 h-12 border-2 border-white/30 rounded-full" />
            <div className="absolute bottom-8 left-6 w-16 h-16 border-2 border-white/20 rounded-lg rotate-45" />
            <svg
              className="absolute bottom-0 left-0 right-0"
              viewBox="0 0 400 80"
              fill="none"
            >
              <path
                d="M0 60 Q100 0 200 40 T400 30 V80 H0Z"
                fill="white"
                fillOpacity="0.1"
              />
            </svg>
          </div>

          {/* Icon */}
          <div className="relative z-10 text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
            {lesson.icon}
          </div>

          {/* Hover shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {lesson.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {lesson.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {lesson.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className={`h-1 bg-gradient-to-r ${lesson.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
      </div>
    </Link>
  );
}
