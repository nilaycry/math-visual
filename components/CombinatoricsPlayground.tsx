import Link from "next/link";
import { RotateCcw, Shuffle } from "lucide-react";

const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];

function factorial(n: number): number {
  let total = 1;
  for (let k = 2; k <= n; k += 1) total *= k;
  return total;
}

function choose(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  const small = Math.min(r, n - r);
  let numerator = 1;
  let denominator = 1;
  for (let k = 1; k <= small; k += 1) {
    numerator *= n - small + k;
    denominator *= k;
  }
  return numerator / denominator;
}

function permutationsCount(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  return factorial(n) / factorial(n - r);
}

function combinations<T>(items: T[], size: number): T[][] {
  if (size === 0) return [[]];
  if (size > items.length) return [];

  const result: T[][] = [];

  function visit(start: number, chosen: T[]) {
    if (chosen.length === size) {
      result.push([...chosen]);
      return;
    }

    for (let index = start; index <= items.length - (size - chosen.length); index += 1) {
      chosen.push(items[index]);
      visit(index + 1, chosen);
      chosen.pop();
    }
  }

  visit(0, []);
  return result;
}

function arrangements<T>(items: T[]): T[][] {
  if (items.length === 0) return [[]];

  const result: T[][] = [];
  const used = new Array(items.length).fill(false);

  function visit(chosen: T[]) {
    if (chosen.length === items.length) {
      result.push([...chosen]);
      return;
    }

    for (let index = 0; index < items.length; index += 1) {
      if (used[index]) continue;
      used[index] = true;
      chosen.push(items[index]);
      visit(chosen);
      chosen.pop();
      used[index] = false;
    }
  }

  visit([]);
  return result;
}

function sameSubset(a: string[], b: string[]) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

function playgroundHref(n: number, r: number, pick = 0) {
  return `/combinatorics/playground?n=${n}&r=${r}&pick=${pick}`;
}

export default function CombinatoricsPlayground({
  n,
  r,
  pick,
}: {
  n: number;
  r: number;
  pick: number;
}) {
  const source = LETTERS.slice(0, n);
  const subsets = combinations(source, r);
  const selectedIndex = subsets.length === 0 ? 0 : Math.min(Math.max(pick, 0), subsets.length - 1);
  const selected = subsets[selectedIndex] ?? [];
  const orderedDescriptions = arrangements(selected);
  const subsetCount = choose(n, r);
  const orderedCount = permutationsCount(n, r);
  const labelsPerSubset = factorial(r);
  const nextPick = subsets.length === 0 ? 0 : (selectedIndex + 1) % subsets.length;

  return (
    <div className="combo-playground">
      <section className="combo-hero">
        <div>
          <p className="combo-kicker">combinatorics playground</p>
          <h1>watch order appear and disappear</h1>
          <p>
            choose a small set, pick a subset size, then click any subset to see all
            the ordered lists hiding behind it.
          </p>
        </div>

        <div className="combo-equation" aria-label="count identity">
          <span>P({n},{r})</span>
          <strong>=</strong>
          <span>C({n},{r})</span>
          <strong>x</strong>
          <span>{r}!</span>
        </div>
      </section>

      <section className="combo-controls" aria-label="playground controls">
        <div>
          <div className="control-heading">
            <span>available symbols</span>
            <strong>{n}</strong>
          </div>
          <div className="choice-row">
            {[3, 4, 5, 6, 7, 8].map((value) => (
              <Link
                key={value}
                href={playgroundHref(value, Math.min(r, value), 0)}
                className={value === n ? "choice-pill is-active" : "choice-pill"}
              >
                {value}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="control-heading">
            <span>subset size</span>
            <strong>{r}</strong>
          </div>
          <div className="choice-row">
            {Array.from({ length: n + 1 }, (_, value) => (
              <Link
                key={value}
                href={playgroundHref(n, value, 0)}
                className={value === r ? "choice-pill is-active" : "choice-pill"}
              >
                {value}
              </Link>
            ))}
          </div>
        </div>

        <div className="combo-tool-row">
          <Link href={playgroundHref(n, r, nextPick)} title="Advance to another subset">
            <Shuffle size={16} aria-hidden="true" />
            next
          </Link>
          <Link href="/combinatorics/playground" title="Reset the playground">
            <RotateCcw size={16} aria-hidden="true" />
            reset
          </Link>
        </div>
      </section>

      <section className="combo-source" aria-label="source set">
        <span>S =</span>
        <div>
          {source.map((letter) => (
            <b key={letter} className={selected.includes(letter) ? "is-selected" : ""}>
              {letter}
            </b>
          ))}
        </div>
      </section>

      <section className="combo-stats" aria-label="count readout">
        <div>
          <span>subsets</span>
          <strong>{subsetCount}</strong>
          <small>C({n},{r})</small>
        </div>
        <div>
          <span>orders per subset</span>
          <strong>{labelsPerSubset}</strong>
          <small>{r}!</small>
        </div>
        <div>
          <span>ordered lists</span>
          <strong>{orderedCount}</strong>
          <small>P({n},{r})</small>
        </div>
      </section>

      <div className="combo-grid">
        <section className="combo-panel" aria-label="subsets">
          <div className="combo-panel-heading">
            <p>subsets</p>
            <span>{subsetCount} total</span>
          </div>
          <div className="subset-cloud">
            {subsets.map((subset, index) => (
              <Link
                key={subset.join("") || "empty"}
                href={playgroundHref(n, r, index)}
                className={sameSubset(subset, selected) ? "is-active" : ""}
              >
                {"{"}{subset.join(", ") || " "}<span>{"}"}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="combo-panel combo-stage" aria-label="ordered descriptions">
          <div className="combo-panel-heading">
            <p>ordered descriptions</p>
            <span>{labelsPerSubset} for this subset</span>
          </div>

          <div className="selected-subset">
            <span>{"{"}</span>
            {selected.length === 0 ? (
              <b>empty</b>
            ) : (
              selected.map((letter) => <b key={letter}>{letter}</b>)
            )}
            <span>{"}"}</span>
          </div>

          <div className="order-cloud">
            {orderedDescriptions.map((order) => (
              <span key={order.join("") || "empty"}>
                {order.join("") || "empty list"}
              </span>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .combo-playground {
          min-height: 100vh;
          background:
            linear-gradient(135deg, rgba(184, 92, 26, 0.08), transparent 34%),
            linear-gradient(225deg, rgba(47, 107, 111, 0.1), transparent 42%),
            #f7f4ef;
          color: #1c1917;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 72px 48px 104px;
        }

        .combo-hero,
        .combo-controls,
        .combo-source,
        .combo-stats,
        .combo-grid {
          max-width: 1120px;
          margin-left: auto;
          margin-right: auto;
        }

        .combo-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 40px;
          align-items: end;
          padding-bottom: 34px;
          border-bottom: 1px solid #dfd8cd;
        }

        .combo-kicker {
          margin: 0 0 14px;
          color: #b85c1a;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h1 {
          max-width: 660px;
          margin: 0;
          font-family: "Source Serif 4", Georgia, serif;
          font-size: clamp(42px, 6vw, 82px);
          font-weight: 500;
          line-height: 0.98;
          letter-spacing: 0;
        }

        .combo-hero p:not(.combo-kicker) {
          max-width: 540px;
          margin: 24px 0 0;
          color: #57534e;
          font-family: "Source Serif 4", Georgia, serif;
          font-size: 18px;
          line-height: 1.7;
        }

        .combo-equation {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border: 1px solid #ded7ca;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.38);
          color: #44403c;
          font-family: "JetBrains Mono", monospace;
          white-space: nowrap;
        }

        .combo-equation span {
          color: #1c1917;
          font-size: 14px;
        }

        .combo-equation strong {
          color: #b85c1a;
          font-weight: 600;
        }

        .combo-controls {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) minmax(220px, 1fr) auto;
          gap: 18px;
          align-items: end;
          padding: 30px 0;
        }

        .control-heading {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 10px;
        }

        .control-heading span,
        .combo-panel-heading span,
        .combo-stats span {
          color: #78716c;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .control-heading strong {
          color: #1c1917;
          font-family: "JetBrains Mono", monospace;
          font-size: 18px;
          font-weight: 600;
        }

        .choice-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .choice-pill,
        .combo-tool-row a,
        .subset-cloud a {
          text-decoration: none;
        }

        .choice-pill {
          display: inline-grid;
          place-items: center;
          min-width: 36px;
          min-height: 34px;
          border: 1px solid #d8d0c2;
          border-radius: 8px;
          background: #fffaf2;
          color: #44403c;
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        }

        .choice-pill:hover,
        .choice-pill.is-active {
          transform: translateY(-1px);
          border-color: rgba(184, 92, 26, 0.46);
          background: rgba(184, 92, 26, 0.1);
          color: #8f4211;
        }

        .combo-tool-row {
          display: flex;
          gap: 10px;
        }

        .combo-tool-row a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          border: 1px solid #d6cec2;
          border-radius: 8px;
          background: #fffaf2;
          color: #44403c;
          padding: 0 13px;
          font-size: 13px;
          transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        }

        .combo-tool-row a:hover {
          transform: translateY(-1px);
          border-color: #c9bbaa;
          background: #ffffff;
        }

        .combo-source {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 18px 0 8px;
          font-family: "JetBrains Mono", monospace;
          color: #57534e;
        }

        .combo-source div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .combo-source b,
        .selected-subset b {
          display: inline-grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border: 1px solid #d8d0c2;
          border-radius: 8px;
          background: #fffaf2;
          color: #44403c;
          font-weight: 600;
        }

        .combo-source b.is-selected {
          border-color: rgba(47, 107, 111, 0.42);
          background: rgba(47, 107, 111, 0.1);
          color: #1f5458;
        }

        .combo-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          padding: 22px 0 26px;
        }

        .combo-stats div {
          border-top: 2px solid #b85c1a;
          background: rgba(255, 255, 255, 0.34);
          padding: 16px;
        }

        .combo-stats strong {
          display: block;
          margin-top: 8px;
          color: #1c1917;
          font-family: "JetBrains Mono", monospace;
          font-size: 34px;
          line-height: 1;
        }

        .combo-stats small {
          display: block;
          margin-top: 8px;
          color: #78716c;
          font-family: "JetBrains Mono", monospace;
          font-size: 12px;
        }

        .combo-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
          gap: 18px;
          align-items: start;
        }

        .combo-panel {
          min-width: 0;
          border: 1px solid #dfd8cd;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.36);
          padding: 18px;
        }

        .combo-panel-heading {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: baseline;
          margin-bottom: 16px;
        }

        .combo-panel-heading p {
          margin: 0;
          color: #1c1917;
          font-family: "Source Serif 4", Georgia, serif;
          font-size: 24px;
        }

        .subset-cloud,
        .order-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-content: flex-start;
        }

        .subset-cloud {
          max-height: 420px;
          overflow: auto;
          padding-right: 4px;
        }

        .subset-cloud a,
        .order-cloud span {
          min-height: 34px;
          border: 1px solid #d8d0c2;
          border-radius: 8px;
          background: #fffaf2;
          color: #44403c;
          padding: 7px 10px;
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        }

        .subset-cloud a:hover,
        .subset-cloud a.is-active {
          transform: translateY(-1px);
          border-color: rgba(184, 92, 26, 0.46);
          background: rgba(184, 92, 26, 0.1);
          color: #8f4211;
        }

        .subset-cloud a span {
          color: #78716c;
        }

        .combo-stage {
          position: sticky;
          top: 88px;
        }

        .selected-subset {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          align-items: center;
          margin: 8px 0 18px;
          color: #78716c;
          font-family: "JetBrains Mono", monospace;
        }

        .selected-subset b {
          border-color: rgba(47, 107, 111, 0.42);
          background: rgba(47, 107, 111, 0.1);
          color: #1f5458;
        }

        .order-cloud span {
          border-color: rgba(47, 107, 111, 0.24);
          background: rgba(47, 107, 111, 0.08);
          color: #1f5458;
        }

        @media (max-width: 900px) {
          .combo-playground {
            padding: 54px 22px 80px;
          }

          .combo-hero,
          .combo-controls,
          .combo-stats,
          .combo-grid {
            grid-template-columns: 1fr;
          }

          .combo-equation {
            width: fit-content;
          }

          .combo-stage {
            position: static;
          }
        }

        @media (max-width: 540px) {
          h1 {
            font-size: 42px;
          }

          .combo-equation {
            flex-wrap: wrap;
            white-space: normal;
          }

          .combo-tool-row {
            flex-wrap: wrap;
          }

          .combo-stats strong {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}
