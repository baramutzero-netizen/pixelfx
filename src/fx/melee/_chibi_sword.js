// More chunky shapes for the 용사 학원 데포르메(-d) effects of the 검투사 · 암살자 · 드루이드 (with holy/_chibi.js): any outlined polygon,
// a tapered crescent cut, a round-capped bar, a faceted rock, a tapered spike and a flat floor puddle. Solid fills, a 1 px LINE outline.
// Files starting with _ are helpers, not effects.
import { WHITE, TAU } from "../../core/index.js";
import { LINE } from "../holy/_chibi.js";

const O = 1.15;
const segD = (px, py, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1, u = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)); return Math.hypot(px - ax - u * dx, py - ay - u * dy); };

/** An outlined polygon. shade(px, py, edgeDist) may return a colour for an inside pixel (a highlight) — else fill. */
export function polyFill(p, pts, fill, shade = null, line = LINE) {
  if (pts.length < 3) return;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  p.shade(x0 - 2, y0 - 2, x1 + 2, y1 + 2, (px, py) => {
    let inside = false, d = Infinity;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
      d = Math.min(d, segD(px, py, xi, yi, xj, yj));
    }
    if (inside) return (shade && shade(px, py, d)) || fill;
    if (d <= O) return line;
  });
}

/**
 * A crescent cut round (cx, cy): the outer edge on radius r from angle a0 to a1 (radians, swept either way), its belly w px thick in the
 * middle tapering to points; the outer edge is white (edge), the rest fill. k (0..1) grows the sweep from a0.
 */
export function crescent(p, cx, cy, r, a0, a1, w, fill, edge = WHITE, k = 1, sy = 1) {
  if (k <= 0 || w < 0.5) return;
  const n = 18, outer = [], inner = [], b = a0 + (a1 - a0) * k;
  for (let i = 0; i <= n; i++) { const u = i / n, a = a0 + (b - a0) * u, th = w * Math.sin(Math.PI * u); outer.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * sy]); inner.push([cx + Math.cos(a) * (r - th), cy + Math.sin(a) * (r - th) * sy]); }
  polyFill(p, outer.concat(inner.reverse()), fill, (px, py) => { const d = Math.hypot(px - cx, (py - cy) / sy); return d > r - 1.6 ? edge : 0; });
}

/** A round-capped bar from (x0, y0) to (x1, y1), w px thick: fill, outline, a lighter top stripe when hi. */
export function bar(p, x0, y0, x1, y1, w, fill, hi = 0, line = LINE) {
  const r = w / 2, L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
  p.shade(Math.min(x0, x1) - r - 2, Math.min(y0, y1) - r - 2, Math.max(x0, x1) + r + 2, Math.max(y0, y1) + r + 2, (px, py) => {
    const d = segD(px, py, x0, y0, x1, y1);
    if (d <= r) return hi && ((px - x0) * nx + (py - y0) * ny) < -r * 0.25 ? hi : fill;
    if (d <= r + O) return line;
  });
}

/** A faceted rock centred (x, y), radius r: a lit top-left face (hi), body (fill), a dark lower-right face (lo). seed varies the outline. */
export function rock(p, x, y, r, fill, hi, lo, seed = 0, rot = 0) {
  if (r < 1) return;
  const pts = []; for (let i = 0; i < 7; i++) { const a = rot + (i / 7) * TAU, q = 0.78 + 0.22 * Math.sin(seed * 12.9898 + i * 78.233); pts.push([x + Math.cos(a) * r * q, y + Math.sin(a) * r * q * 0.9]); }
  polyFill(p, pts, fill, (px, py) => { const u = (px - x) + (py - y); return u < -r * 0.45 ? hi : u > r * 0.55 ? lo : 0; });
}

/** A tapered spike standing on (x, y): base w wide, h tall, tip leaning lean px: fill with a lit left side (hi). */
export function spike(p, x, y, h, w, lean, fill, hi = 0) {
  if (h < 1.5) return;
  polyFill(p, [[x - w / 2, y], [x + lean, y - h], [x + w / 2, y]], fill, hi ? (px, py) => { const u = (y - py) / h, cx = x + lean * u; return px < cx - 0.5 && px > cx - (w / 2) * (1 - u) * 0.8 ? hi : 0; } : null);
}

/** A flat puddle on the floor: an ellipse rx by rx·sy, fill, outline, a light streak (hi). */
export function puddle(p, x, y, rx, sy, fill, hi = 0, line = LINE) {
  if (rx < 1) return;
  const ry = Math.max(1, rx * sy);
  p.shade(x - rx - 2, y - ry - 2, x + rx + 2, y + ry + 2, (px, py) => {
    const d = Math.hypot((px - x) / rx, (py - y) / ry);
    if (d <= 1) return hi && py < y - ry * 0.2 && px < x ? hi : fill;
    if (d <= 1 + O / Math.min(rx, ry)) return line;
  });
}

/** The arc through A and B bowed out by bow px (to the left of A→B): {cx, cy, r, a0, a1} for crescent(). */
export function arcThrough(A, B, bow) {
  const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), h = L / 2, r = (h * h + bow * bow) / (2 * bow), nx = dy / L, ny = -dx / L, cx = mx + nx * (r - bow), cy = my + ny * (r - bow);
  let a0 = Math.atan2(A[1] - cy, A[0] - cx), a1 = Math.atan2(B[1] - cy, B[0] - cx);
  if (a1 > a0 + Math.PI) a1 -= 2 * Math.PI; if (a1 < a0 - Math.PI) a1 += 2 * Math.PI;
  return { cx, cy, r, a0, a1 };
}
