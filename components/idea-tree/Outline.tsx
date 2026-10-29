"use client";

import { QUESTIONS, ROOT, SETS, ideasInSet, setsForIdea } from "@/lib/idea-tree/data";
import type { ViewState } from "./Explorer";

interface Props {
  view: ViewState;
  toggleQ: (id: string) => void;
  pickSet: (id: string | null) => void;
  pickIdea: (id: string | null, scroll?: boolean) => void;
}

// the same tree as an indented outline, for narrow screens
export default function Outline({ view, toggleQ, pickSet, pickIdea }: Props) {
  const { open, activeSet, selected } = view;
  const set = activeSet ? SETS.find((s) => s.id === activeSet) ?? null : null;
  const hits = new Set(set ? ideasInSet(set) : []);

  return (
    <div>
      <div className="rounded-xl border-[1.5px] border-it-fg/70 bg-it-surface px-4 py-3">
        <div className="text-[22px] font-bold leading-tight">{ROOT.title}</div>
        <p className="mt-1 text-[15px] text-it-muted">{ROOT.text}</p>
      </div>
      <ul className="it-branch mt-2 grid gap-2 pl-3">
        {QUESTIONS.map((q, n) => {
          const isOpen = open.has(q.id);
          return (
            <li key={q.id} className="it-twig">
              <button
                onClick={() => toggleQ(q.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-2.5 rounded-xl border border-it-line bg-it-surface px-3 py-2.5 text-left"
              >
                <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full font-mono text-xs text-it-surface bg-it-${q.unit}`}>{n + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[18px] font-bold leading-tight">{q.q}</span>
                  <span className="mt-0.5 block text-[14px] text-it-muted">{q.a}</span>
                </span>
                <span className="font-mono text-xs text-it-muted">{isOpen ? "▾" : "▸"}</span>
              </button>
              {isOpen && (
                <ul className="it-branch mt-2 grid gap-2 pl-3">
                  {q.ideas.map((i) => {
                    const sel = selected === i.id;
                    const hit = hits.has(i.id);
                    const sets = setsForIdea(i.id);
                    return (
                      <li key={i.id} className="it-twig">
                        <button
                          data-leaf={i.id}
                          onClick={() => pickIdea(sel ? null : i.id)}
                          aria-expanded={sel}
                          className={[
                            "w-full rounded-lg border px-3 py-2 text-left",
                            i.soon ? "border-dashed" : "",
                            sel ? "border-it-accent ring-2 ring-it-accent" : hit ? "border-it-accent bg-it-accentsoft" : "border-it-line bg-it-surface",
                          ].join(" ")}
                        >
                          <span className="flex items-center gap-2 text-[15px] font-semibold">
                            <span className={`h-2 w-2 flex-none rounded-full bg-it-${q.unit}`} />
                            {i.title}
                          </span>
                          {sel && (
                            <span className="mt-2 grid gap-1.5 text-[15px] font-normal">
                              <span>{i.says}</span>
                              <span className="text-it-muted">
                                <b className="font-semibold text-it-fg">why it matters.</b> {i.why}
                              </span>
                              <span className="font-mono text-[12px] text-it-muted">{i.ref}</span>
                            </span>
                          )}
                        </button>
                        {sel && sets.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1.5 pl-1">
                            {sets.map((s) => (
                              <button key={s.id} onClick={() => pickSet(s.id)} className="rounded-full bg-it-accentsoft px-2.5 py-0.5 font-mono text-[12px] text-it-accent">
                                ≡ {s.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
