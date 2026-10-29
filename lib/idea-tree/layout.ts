import { QUESTIONS } from "./data";

// left-to-right tree: root | questions | ideas | room for bridge arcs
export const DIM = {
  rootX: 0,
  rootW: 190,
  qX: 222,
  qW: 218,
  qH: 78,
  leafX: 470,
  leafW: 286,
  leafH: 36,
  slot: 44,
  groupGap: 22,
  padY: 20,
  width: 904,
};

export interface Box {
  x: number;
  y: number; // top
  w: number;
  h: number;
  o: number; // opacity, 0 when collapsed into its parent
}

export type Layout = Record<string, Box>;

export function computeLayout(open: ReadonlySet<string>, rootH: number): { boxes: Layout; height: number } {
  const boxes: Layout = {};
  let y = DIM.padY;
  const centers: number[] = [];

  for (const q of QUESTIONS) {
    const isOpen = open.has(q.id);
    const groupH = isOpen ? Math.max(DIM.qH, q.ideas.length * DIM.slot - (DIM.slot - DIM.leafH)) : DIM.qH;
    const qc = y + groupH / 2;
    centers.push(qc);
    boxes[q.id] = { x: DIM.qX, y: qc - DIM.qH / 2, w: DIM.qW, h: DIM.qH, o: 1 };

    q.ideas.forEach((idea, i) => {
      boxes[idea.id] = isOpen
        ? { x: DIM.leafX, y: y + i * DIM.slot, w: DIM.leafW, h: DIM.leafH, o: 1 }
        : { x: DIM.qX + DIM.qW - DIM.leafW * 0.6, y: qc - DIM.leafH / 2, w: DIM.leafW * 0.6, h: DIM.leafH, o: 0 };
    });
    y += groupH + DIM.groupGap;
  }

  const rc = (centers[0] + centers[centers.length - 1]) / 2;
  boxes.root = { x: DIM.rootX, y: Math.max(DIM.padY, rc - rootH / 2), w: DIM.rootW, h: rootH, o: 1 };
  const height = Math.max(y - DIM.groupGap + DIM.padY, boxes.root.y + rootH + DIM.padY);
  return { boxes, height };
}

export const centerY = (b: Box) => b.y + b.h / 2;

// horizontal s-curve between the right edge of a and the left edge of b
export function link(a: Box, b: Box) {
  const sx = a.x + a.w;
  const sy = centerY(a);
  const ex = b.x;
  const ey = centerY(b);
  const d = (ex - sx) * 0.5;
  return `M${sx},${sy} C${sx + d},${sy} ${ex - d},${ey} ${ex},${ey}`;
}

// arc on the right side of the idea column, linking two leaves
export function bridge(a: Box, b: Box) {
  const x = DIM.leafX + DIM.leafW + 6;
  const y1 = centerY(a);
  const y2 = centerY(b);
  const d = Math.min(132, 30 + Math.abs(y2 - y1) * 0.2);
  return `M${x},${y1} C${x + d},${y1} ${x + d},${y2} ${x},${y2}`;
}
