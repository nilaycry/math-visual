"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import p5 from "p5";
import { useP5Sketch } from "@/hooks/useP5Sketch";

type GNode = {
  id: string;
  slug: string;
  title: string;   // full title for info strip
  line1: string;   // label line 1 (on circle)
  line2: string;   // label line 2 (on circle)
  desc: string;
  kind: "lesson" | "connection";
  planned: boolean;
  accent: [number, number, number];
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type GEdge = { from: string; to: string; label: string };

const NODES_INIT = [
  // ── live lessons ──
  {
    id: "eigen", slug: "eigen",
    title: "the directions a matrix can't change",
    line1: "the directions a", line2: "matrix can't change",
    desc: "what a matrix actually does to space",
    kind: "lesson" as const, planned: false,
    accent: [216, 90, 48] as [number, number, number], ix: 210, iy: 180,
  },
  {
    id: "svd", slug: "svd",
    title: "rotate, stretch, rotate",
    line1: "rotate,", line2: "stretch, rotate",
    desc: "the three hidden steps inside every matrix",
    kind: "lesson" as const, planned: false,
    accent: [91, 141, 217] as [number, number, number], ix: 115, iy: 315,
  },
  {
    id: "null-space", slug: "null-space",
    title: "the directions a matrix destroys",
    line1: "directions a", line2: "matrix destroys",
    desc: "what the null space is and why it matters",
    kind: "lesson" as const, planned: false,
    accent: [224, 90, 122] as [number, number, number], ix: 350, iy: 300,
  },
  {
    id: "dot-product", slug: "dot-product-and-matrix-multiplication",
    title: "dot product is matrix multiplication",
    line1: "dot product is", line2: "matrix mult.",
    desc: "or is it the other way round",
    kind: "connection" as const, planned: false,
    accent: [127, 119, 221] as [number, number, number], ix: 255, iy: 130,
  },
  {
    id: "gradient", slug: "gradient-descent",
    title: "which way is downhill",
    line1: "which way", line2: "is downhill",
    desc: "the geometry behind how machines learn",
    kind: "lesson" as const, planned: false,
    accent: [93, 202, 165] as [number, number, number], ix: 650, iy: 165,
  },
  {
    id: "backprop", slug: "backpropagation",
    title: "the chain rule on a graph",
    line1: "chain rule", line2: "on a graph",
    desc: "how neural networks actually compute gradients",
    kind: "lesson" as const, planned: false,
    accent: [255, 100, 160] as [number, number, number], ix: 695, iy: 320,
  },

  // ── planned ──
  {
    id: "vectors-cols", slug: "vectors-columns-rows",
    title: "a vector, a column, a row",
    line1: "a vector,", line2: "a column, a row",
    desc: "what's the same object and what isn't",
    kind: "connection" as const, planned: true,
    accent: [127, 119, 221] as [number, number, number], ix: 100, iy: 185,
  },
  {
    id: "row-vectors", slug: "row-vectors-are-functions",
    title: "row vectors are linear functions",
    line1: "row vectors are", line2: "linear functions",
    desc: "not vectors written sideways. something else entirely.",
    kind: "connection" as const, planned: true,
    accent: [127, 119, 221] as [number, number, number], ix: 390, iy: 145,
  },
  {
    id: "eight-ways", slug: "eight-ways-to-say-invertible",
    title: "eight ways to say invertible",
    line1: "eight ways to say", line2: "invertible",
    desc: "the invertible matrix theorem, all at once",
    kind: "connection" as const, planned: true,
    accent: [127, 119, 221] as [number, number, number], ix: 155, iy: 415,
  },
  {
    id: "orthogonality", slug: "orthogonality-and-projections",
    title: "orthogonality and projections",
    line1: "orthogonality", line2: "and projections",
    desc: "when vectors, subspaces, and projections align",
    kind: "lesson" as const, planned: true,
    accent: [93, 202, 165] as [number, number, number], ix: 450, iy: 395,
  },
];

const EDGES: GEdge[] = [
  // live
  { from: "eigen",       to: "svd",          label: "generalizes" },
  { from: "eigen",       to: "null-space",   label: "zero eigenvalue" },
  { from: "svd",         to: "null-space",   label: "null from V" },
  { from: "gradient",    to: "backprop",     label: "computes gradients" },
  { from: "dot-product", to: "eigen",        label: "Ax as dot products" },
  { from: "dot-product", to: "null-space",   label: "row vectors as functions" },
  // planned
  { from: "row-vectors",   to: "dot-product",   label: "dot product as evaluation" },
  { from: "row-vectors",   to: "null-space",    label: "kernel: vectors evaluating to 0" },
  { from: "vectors-cols",  to: "dot-product",   label: "notation" },
  { from: "vectors-cols",  to: "eigen",         label: "column picture of Ax" },
  { from: "eight-ways",    to: "eigen",         label: "non-zero eigenvalues" },
  { from: "eight-ways",    to: "null-space",    label: "trivial null space" },
  { from: "orthogonality", to: "null-space",    label: "null(Aᵀ) perpendicular to col(A)" },
  { from: "orthogonality", to: "dot-product",   label: "orthogonality via dot product" },
];

export default function ConceptGraphSketch() {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const buildSketch = (el: HTMLElement) => {
    return new p5((p: p5) => {
      const W = 860;
      const INFO_H = 56;        // info strip height
      const PHYS_H = 484;       // physics / drawing area
      const H = PHYS_H + INFO_H;

      const R = 29;             // node radius
      const REST = 195;         // spring rest length
      const K_REP = 5500;       // repulsion constant
      const K_SPR = 0.016;      // spring stiffness
      const DAMP = 0.84;        // velocity damping

      const nodes: GNode[] = NODES_INIT.map(t => ({
        id: t.id, slug: t.slug, title: t.title,
        line1: t.line1, line2: t.line2, desc: t.desc,
        kind: t.kind, planned: t.planned, accent: t.accent,
        x: t.ix, y: t.iy, vx: 0, vy: 0,
      }));

      let hov: GNode | null = null;
      let drag: GNode | null = null;
      let pressPos: { x: number; y: number } | null = null;

      const findNode = (mx: number, my: number): GNode | null => {
        if (my > PHYS_H) return null; // ignore info strip area
        for (const n of nodes) {
          const dx = n.x - mx, dy = n.y - my;
          if (dx * dx + dy * dy < (R + 6) * (R + 6)) return n;
        }
        return null;
      };

      const isPlannedEdge = (e: GEdge): boolean => {
        const f = nodes.find(n => n.id === e.from);
        const t = nodes.find(n => n.id === e.to);
        return !!(f?.planned || t?.planned);
      };

      p.setup = () => {
        p.createCanvas(W, H);
        p.textFont("Space Grotesk, sans-serif");
        p.frameRate(30);
      };

      p.draw = () => {
        // ── physics (constrained to PHYS_H area) ──
        for (const ni of nodes) {
          if (ni === drag) continue;
          let fx = 0, fy = 0;

          for (const nj of nodes) {
            if (ni === nj) continue;
            const dx = ni.x - nj.x, dy = ni.y - nj.y;
            const d = Math.sqrt(dx * dx + dy * dy) || 1;
            const dc = Math.max(d, 55);
            const f = K_REP / (dc * dc);
            fx += (dx / d) * f;
            fy += (dy / d) * f;
          }

          for (const e of EDGES) {
            const oid = e.from === ni.id ? e.to : e.to === ni.id ? e.from : null;
            if (!oid) continue;
            const nj = nodes.find(n => n.id === oid)!;
            const dx = nj.x - ni.x, dy = nj.y - ni.y;
            const d = Math.sqrt(dx * dx + dy * dy) || 1;
            const f = K_SPR * (d - REST);
            fx += (dx / d) * f;
            fy += (dy / d) * f;
          }

          fx += (W / 2 - ni.x) * 0.0006;
          fy += (PHYS_H / 2 - ni.y) * 0.0006;

          ni.vx = (ni.vx + fx) * DAMP;
          ni.vy = (ni.vy + fy) * DAMP;
          ni.x = p.constrain(ni.x + ni.vx, R + 10, W - R - 10);
          ni.y = p.constrain(ni.y + ni.vy, R + 10, PHYS_H - R - 10);
        }

        hov = findNode(p.mouseX, p.mouseY);
        p.cursor(hov && !hov.planned ? 'pointer' : 'default');

        // ── render ──
        p.background(13, 17, 23);

        // Edges
        for (const e of EDGES) {
          const f = nodes.find(n => n.id === e.from)!;
          const t = nodes.find(n => n.id === e.to)!;
          const planned = isPlannedEdge(e);
          const lit = hov !== null && (hov === f || hov === t);

          p.strokeWeight(lit ? 1.5 : 1);
          if (planned) {
            (p.drawingContext as CanvasRenderingContext2D).setLineDash([4, 5]);
            p.stroke(45, 48, 62, lit ? 140 : 35);
          } else {
            p.stroke(55, 58, 75, lit ? 200 : 52);
          }
          p.line(f.x, f.y, t.x, t.y);
          (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

          if (lit) {
            const cx = (f.x + t.x) / 2;
            const cy = (f.y + t.y) / 2;
            p.noStroke();
            p.fill(planned ? 65 : 90, planned ? 65 : 90, planned ? 80 : 110);
            p.textSize(9);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(e.label, cx, cy - 10);
          }
        }

        // Nodes
        for (const n of nodes) {
          const [nr, ng, nb] = n.accent;
          const lit = n === hov;
          const baseAlpha = n.planned ? 0.28 : 1.0;

          if (lit) {
            p.noStroke();
            p.fill(nr, ng, nb, n.planned ? 12 : 20);
            p.circle(n.x, n.y, (R + 20) * 2);
          }

          p.fill(nr, ng, nb, (lit ? 32 : 14) * baseAlpha);
          p.stroke(nr, ng, nb, (lit ? 230 : 90) * baseAlpha);
          p.strokeWeight(1.5);

          if (n.kind === "connection") {
            (p.drawingContext as CanvasRenderingContext2D).setLineDash([5, 5]);
          }
          p.circle(n.x, n.y, R * 2);
          (p.drawingContext as CanvasRenderingContext2D).setLineDash([]);

          // Label below circle
          p.noStroke();
          p.textAlign(p.CENTER, p.TOP);
          p.textSize(10);
          const labelAlpha = n.planned ? (lit ? 120 : 60) : (lit ? 210 : 132);
          p.fill(labelAlpha, labelAlpha, labelAlpha + 15);
          p.text(n.line1, n.x, n.y + R + 8);
          p.text(n.line2, n.x, n.y + R + 20);
        }

        // ── info strip ──
        p.noStroke();
        p.fill(15, 19, 27);
        p.rect(0, PHYS_H, W, INFO_H);

        p.stroke(28, 33, 44);
        p.strokeWeight(1);
        p.line(0, PHYS_H, W, PHYS_H);

        p.noStroke();
        p.textAlign(p.LEFT, p.CENTER);

        if (hov) {
          const [nr, ng, nb] = hov.accent;
          const titleAlpha = hov.planned ? 140 : 195;
          p.fill(nr, ng, nb, titleAlpha);
          p.textSize(11);
          p.text(hov.title, 20, PHYS_H + INFO_H * 0.38);

          p.fill(hov.planned ? 68 : 100, hov.planned ? 68 : 100, hov.planned ? 82 : 118);
          p.textSize(11);
          const suffix = hov.planned ? "  ·  coming soon" : "";
          p.text(hov.desc + suffix, 20, PHYS_H + INFO_H * 0.72);
        } else {
          p.fill(48, 52, 66);
          p.textSize(11);
          p.textAlign(p.CENTER, p.CENTER);
          p.text("hover to explore  ·  click to open", W / 2, PHYS_H + INFO_H / 2);
        }
      };

      p.mousePressed = () => {
        const n = findNode(p.mouseX, p.mouseY);
        if (n) {
          drag = n;
          pressPos = { x: p.mouseX, y: p.mouseY };
        }
      };

      p.mouseDragged = () => {
        if (drag) {
          drag.x = p.constrain(p.mouseX, R + 10, W - R - 10);
          drag.y = p.constrain(p.mouseY, R + 10, PHYS_H - R - 10);
          drag.vx = 0;
          drag.vy = 0;
        }
      };

      p.mouseReleased = () => {
        if (drag && pressPos) {
          const dx = p.mouseX - pressPos.x;
          const dy = p.mouseY - pressPos.y;
          if (dx * dx + dy * dy < 25 && !drag.planned) {
            routerRef.current.push(`/lessons/${drag.slug}`);
          }
        }
        drag = null;
        pressPos = null;
      };

    }, el);
  };

  const containerRef = useP5Sketch(buildSketch);
  return <div ref={containerRef} />;
}
