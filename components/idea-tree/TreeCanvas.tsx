"use client";

import { useMemo } from "react";
import { QUESTIONS, ROOT, SETS, ideasInSet, setsForIdea } from "@/lib/idea-tree/data";
import { DIM, bridge, centerY, computeLayout, link } from "@/lib/idea-tree/layout";
import { useTweenedLayout } from "@/lib/idea-tree/useTween";
import type { ViewState } from "./Explorer";

const ROOT_H = 214;

interface Props {
  view: ViewState;
  toggleQ: (id: string) => void;
  pickSet: (id: string | null) => void;
  pickIdea: (id: string | null, scroll?: boolean) => void;
}

export default function TreeCanvas({ view, toggleQ, pickIdea }: Props) {
  const { open, activeSet, selected } = view;
  const target = useMemo(() => computeLayout(open, ROOT_H), [open]);
  const L = useTweenedLayout(target.boxes);
  const height = target.height;

  const set = activeSet ? SETS.find((s) => s.id === activeSet) ?? null : null;
  const hits = useMemo(() => new Set(set ? ideasInSet(set) : []), [set]);
  const hitQs = useMemo(() => new Set(QUESTIONS.filter((q) => q.ideas.some((i) => hits.has(i.id))).map((q) => q.id)), [hits]);
  const dimming = hits.size > 0;

  // bridges: link the set's leaves top to bottom, using the final positions so arcs land where leaves end up
  const bridgePaths = useMemo(() => {
    if (!set) return [];
    const ids = Array.from(hits).sort((a, b) => target.boxes[a].y - target.boxes[b].y);
    return ids.slice(1).map((id, i) => bridge(target.boxes[ids[i]], target.boxes[id]));
  }, [set, hits, target]);

  return (
    <div className="relative" style={{ width: DIM.width, height }}>
      <svg className="pointer-events-none absolute inset-0" width={DIM.width} height={height} aria-hidden>
        {QUESTIONS.map((q) => (
          <g key={q.id}>
            <path d={link(L.root, L[q.id])} fill="none" className="stroke-it-line" strokeWidth={1.5} opacity={dimming && !hitQs.has(q.id) ? 0.35 : 1} />
            {q.ideas.map((i) => (
              <path
                key={i.id}
                d={link(L[q.id], L[i.id])}
                fill="none"
                className={hits.has(i.id) ? "stroke-it-accent" : "stroke-it-line"}
                strokeWidth={hits.has(i.id) ? 2 : 1.5}
                opacity={L[i.id].o * (dimming && !hits.has(i.id) ? 0.35 : 1)}
              />
            ))}
          </g>
        ))}
        {bridgePaths.map((d, i) => (
          <path key={`${activeSet}-${i}`} d={d} pathLength={1} fill="none" className="it-bridge stroke-it-accent" strokeWidth={2.2} style={{ animationDelay: `${300 + i * 90}ms` }} />
        ))}
        {set &&
          Array.from(hits).map((id) => (
            <circle key={id} cx={DIM.leafX + DIM.leafW + 6} cy={centerY(target.boxes[id])} r={3.5} className="fill-it-accent" />
          ))}
      </svg>

      {/* root */}
      <div
        className="absolute rounded-xl border-[1.5px] border-it-fg/70 bg-it-surface px-4 py-3"
        style={{ transform: `translate(${L.root.x}px, ${L.root.y}px)`, width: L.root.w, height: L.root.h }}
      >
        <div className="text-[22px] font-bold leading-tight">{ROOT.title}</div>
        <p className="mt-1 text-[14px] leading-snug text-it-muted">{ROOT.text}</p>
      </div>

      {/* questions */}
      {QUESTIONS.map((q, n) => {
        const b = L[q.id];
        const isOpen = open.has(q.id);
        return (
          <button
            key={q.id}
            onClick={() => toggleQ(q.id)}
            aria-expanded={isOpen}
            className="absolute flex items-start gap-2.5 rounded-xl border border-it-line bg-it-surface px-3 py-2.5 text-left transition-[border-color,opacity] hover:border-it-muted"
            style={{ transform: `translate(${b.x}px, ${b.y}px)`, width: b.w, height: b.h, opacity: dimming && !hitQs.has(q.id) ? 0.4 : 1 }}
          >
            <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full font-mono text-xs text-it-surface bg-it-${q.unit}`}>{n + 1}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-bold leading-tight">{q.q}</span>
              <span className="mt-0.5 block font-mono text-[11px] text-it-muted">
                {q.ideas.length} ideas {isOpen ? "▾" : "▸"}
              </span>
            </span>
          </button>
        );
      })}

      {/* leaves */}
      {QUESTIONS.flatMap((q) =>
        q.ideas.map((i) => {
          const b = L[i.id];
          const hit = hits.has(i.id);
          const sel = selected === i.id;
          const nSets = setsForIdea(i.id).length;
          return (
            <button
              key={i.id}
              data-leaf={i.id}
              onClick={() => pickIdea(sel ? null : i.id)}
              tabIndex={open.has(q.id) ? 0 : -1}
              aria-hidden={!open.has(q.id)}
              className={[
                "absolute flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border px-3 text-left text-[13.5px] font-semibold transition-colors",
                i.soon ? "border-dashed" : "",
                sel ? "border-it-accent ring-2 ring-it-accent" : hit ? "border-it-accent bg-it-accentsoft" : "border-it-line bg-it-surface hover:border-it-muted",
              ].join(" ")}
              style={{
                transform: `translate(${b.x}px, ${b.y}px)`,
                width: b.w,
                height: b.h,
                opacity: b.o * (dimming && !hit && !sel ? 0.4 : 1),
                pointerEvents: b.o > 0.5 ? "auto" : "none",
              }}
            >
              <span className={`h-2 w-2 flex-none rounded-full bg-it-${q.unit}`} />
              <span className="min-w-0 flex-1 truncate">{i.title}</span>
              {nSets > 0 && (
                <span className="flex flex-none gap-0.5" title={`in ${nSets} same-idea set${nSets > 1 ? "s" : ""}`}>
                  {Array.from({ length: nSets }).map((_, k) => (
                    <span key={k} className={`h-1.5 w-1.5 rounded-full ${hit ? "bg-it-accent" : "bg-it-line"}`} />
                  ))}
                </span>
              )}
            </button>
          );
        })
      )}
    </div>
  );
}
