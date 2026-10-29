"use client";

import { IDEA, PARENT, QUESTION, QUESTIONS, SETS, ideasInSet, setsForIdea } from "@/lib/idea-tree/data";
import type { ViewState } from "./Explorer";

interface Props {
  view: ViewState;
  toggleQ: (id: string) => void;
  pickSet: (id: string | null) => void;
  pickIdea: (id: string | null, scroll?: boolean) => void;
}

const card = "rounded-xl border border-it-line bg-it-surface p-5";
const tag = "font-mono text-[11.5px] uppercase tracking-[0.07em] text-it-accent";
const h2 = "mt-1 mb-2 text-balance text-[25px] font-bold leading-tight";

export default function Panel({ view, pickSet, pickIdea }: Props) {
  const { activeSet, selected } = view;
  const set = activeSet ? SETS.find((s) => s.id === activeSet) ?? null : null;

  const setOrIntro = set ? (
    <div className={card}>
      <p className={tag}>same idea, {set.members.length} outfits</p>
      <h2 className={h2}>{set.name}</h2>
      <p className="mb-2 text-sm text-it-muted">{set.ctx}</p>
      <ul>
        {set.members.map((m, k) => (
          <li key={k} className="grid grid-cols-[26px_minmax(0,1fr)] gap-x-1.5 border-t border-it-line py-2.5">
            <span className="pt-px font-mono text-it-accent" title={m.kind === "iff" ? "equivalent" : "implies (one direction)"}>
              {m.kind === "iff" ? "≡" : "⇒"}
            </span>
            <span className="text-[15px]">{m.text}</span>
            <button onClick={() => pickIdea(m.idea, true)} className="col-start-2 text-left font-mono text-[12px] text-it-muted hover:text-it-accent hover:underline">
              in {IDEA[m.idea].title} ↗
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13.5px] text-it-muted">
        {(() => {
          const qs = Array.from(new Set(ideasInSet(set).map((i) => QUESTIONS.findIndex((q) => q.id === PARENT[i]) + 1))).sort();
          return `these live under question${qs.length > 1 ? "s" : ""} ${qs.join(", ")}. different branches, one fact.`;
        })()}
      </p>
      <button onClick={() => pickSet(null)} className="mt-3 font-mono text-[13px] text-it-muted hover:text-it-accent">
        ← all sets
      </button>
    </div>
  ) : (
    <div className={card}>
      <p className={tag}>where the branches touch</p>
      <h2 className={h2}>same idea, many outfits</h2>
      <p className="mb-3">
        a tree keeps ideas apart, which is half true. these sets are statements from different branches that are all equivalent.
        pick one and arcs connect its leaves across the tree.
      </p>
      <div className="grid gap-2">
        {SETS.map((s) => (
          <button key={s.id} onClick={() => pickSet(s.id)} className="grid gap-px rounded-lg border border-it-line bg-it-bg px-3 py-2 text-left hover:border-it-accent">
            <b className="font-semibold">{s.name}</b>
            <small className="text-[13.5px] text-it-muted">{s.blurb}</small>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[13.5px] text-it-muted">try &ldquo;T is invertible&rdquo; and then &ldquo;λ is an eigenvalue&rdquo;. same list, with T − λI plugged in.</p>
    </div>
  );

  if (!selected) return setOrIntro;

  const idea = IDEA[selected];
  const q = QUESTION[PARENT[selected]];
  const sets = setsForIdea(selected);
  return (
    <>
      {/* on desktop the panel shows the picked leaf; on phones the leaf opens inline in the outline instead */}
      <div className={`${card} hidden lg:block`}>
        <p className="font-mono text-[11.5px] uppercase tracking-[0.07em]">
          <span className={`text-it-${q.unit}`}>{q.q}</span>
        </p>
        <h2 className={h2}>{idea.title}</h2>
        <p className="mb-3 text-[16px]">{idea.says}</p>
        <p className="mb-3 text-it-muted">
          <b className="font-semibold text-it-fg">why it matters.</b> {idea.why}
        </p>
        <p className="font-mono text-[12.5px] text-it-muted">{idea.ref}</p>
        {sets.length > 0 && (
          <div className="mt-4 border-t border-it-line pt-3">
            <p className="mb-2 text-sm text-it-muted">also shows up as the same idea in:</p>
            <div className="flex flex-wrap gap-1.5">
              {sets.map((s) => (
                <button key={s.id} onClick={() => pickSet(s.id)} className="rounded-full bg-it-accentsoft px-2.5 py-0.5 font-mono text-[12px] text-it-accent hover:underline">
                  ≡ {s.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => pickIdea(null)} className="mt-4 font-mono text-[13px] text-it-muted hover:text-it-accent">
          ← back{set ? ` to ${set.name}` : ""}
        </button>
      </div>
      <div className="lg:hidden">{setOrIntro}</div>
    </>
  );
}
