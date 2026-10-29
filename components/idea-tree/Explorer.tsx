"use client";

import { useCallback, useState } from "react";
import { PARENT, QUESTIONS, SETS, ideasInSet } from "@/lib/idea-tree/data";
import TreeCanvas from "./TreeCanvas";
import Outline from "./Outline";
import Panel from "./Panel";

export interface ViewState {
  open: ReadonlySet<string>;
  activeSet: string | null;
  selected: string | null;
}

export default function Explorer() {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const [activeSet, setActiveSet] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const toggleQ = useCallback((id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const pickSet = useCallback((id: string | null) => {
    setSelected(null);
    setActiveSet(id);
    if (!id) return;
    const s = SETS.find((x) => x.id === id)!;
    setOpen((prev) => new Set([...Array.from(prev), ...ideasInSet(s).map((i) => PARENT[i])]));
  }, []);

  const pickIdea = useCallback((id: string | null, scroll = false) => {
    setSelected(id);
    if (!id) return;
    setOpen((prev) => (prev.has(PARENT[id]) ? prev : new Set([...Array.from(prev), PARENT[id]])));
    if (scroll) {
      // wait for the branch to finish unfolding, then bring the leaf into view
      window.setTimeout(() => {
        const els = Array.from(document.querySelectorAll<HTMLElement>(`[data-leaf="${id}"]`));
        els.find((e) => e.offsetParent !== null)?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 380);
    }
  }, []);

  const openAll = () => setOpen(new Set(QUESTIONS.map((q) => q.id)));
  const foldAll = () => {
    setOpen(new Set());
    setActiveSet(null);
    setSelected(null);
  };

  const view: ViewState = { open, activeSet, selected };
  const handlers = { toggleQ, pickSet, pickIdea };

  return (
    <main className="mx-auto max-w-[1340px] px-5 pb-24 pt-10 md:px-12">
      <header className="mb-8 grid gap-3">
        <p className="text-[11px] uppercase tracking-[0.14em] text-it-accent">abstract linear algebra · math 416 · lectures 1 to 25</p>
        <h1 className="m-0 text-balance text-[32px] font-medium leading-tight tracking-[-0.01em] md:text-[38px]">the course as a tree</h1>
        <p className="max-w-[62ch] text-[15px] leading-[1.8] text-it-muted">
          one sentence, five questions, and everything else hangs off those. open a branch only when you want more. then pick a
          set below: those are statements from different branches that turn out to be the same fact, and you get to watch the
          branches touch.
        </p>
      </header>

      <nav className="mb-5 flex flex-wrap items-center gap-2" aria-label="same idea sets">
        <span className="mr-1 font-mono text-xs uppercase tracking-[0.06em] text-it-muted">same idea</span>
        {SETS.map((s) => (
          <button
            key={s.id}
            onClick={() => pickSet(activeSet === s.id ? null : s.id)}
            aria-pressed={activeSet === s.id}
            className="rounded-full border border-it-line bg-it-surface px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-it-accent aria-pressed:border-it-accent aria-pressed:bg-it-accent aria-pressed:text-it-surface"
          >
            {s.name}
          </button>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-it-line sm:block" />
        <button onClick={openAll} className="rounded-full px-2.5 py-1.5 text-[13px] text-it-muted hover:text-it-accent">
          open everything
        </button>
        <button onClick={foldAll} className="rounded-full px-2.5 py-1.5 text-[13px] text-it-muted hover:text-it-accent">
          fold it back up
        </button>
      </nav>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* desktop: the drawn tree */}
        <div className="it-paper hidden min-w-0 overflow-x-auto rounded-xl border border-it-line lg:block">
          <TreeCanvas view={view} {...handlers} />
        </div>
        {/* phones and tablets: indented outline */}
        <div className="order-2 min-w-0 lg:hidden">
          <Outline view={view} {...handlers} />
        </div>
        <aside className="order-1 min-w-0 lg:sticky lg:top-24 lg:order-none">
          <Panel view={view} {...handlers} />
        </aside>
      </div>
    </main>
  );
}
