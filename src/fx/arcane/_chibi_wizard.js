// More chunky shapes for the 용사 학원 데포르메(-d) effects of 마법사 · 팔라딘 · 암흑사제 (with ../holy/_chibi.js): outlined ellipse rings
// with both radii, thick tapering arcs, outlined polygons, outlined columns and drops. Same rules: 1 px LINE outline, flat fills, solid pixels.
// Files starting with _ are helpers, not effects.
import { hex, TAU } from "../../core/index.js";
import { LINE } from "../holy/_chibi.js";
export { LINE, pop, shrink, blob, star, band, petal, chevron, plus } from "../holy/_chibi.js";

const O = 1.15;
/** Violet arcane, dark to bright. */
export const ARC = ["#1a0f3a", "#34186e", "#5a2cb0", "#8250e0", "#ae84f8", "#d6bcff", "#f2e8ff", "#ffffff"].map(hex);
/** Mana cyan, dark to bright. */
export const CYAN = ["#0a2438", "#12507a", "#1e86b8", "#40b8e0", "#86e0f4", "#d4f8ff"].map(hex);
/** Flame, dark to bright. */
export const FLAME = ["#4a1712", "#a8241c", "#e8501c", "#ff8a2a", "#ffc23d", "#ffe680", "#fff6c8", "#ffffff"].map(hex);
/** Ice, dark to bright. */
export const ICE = ["#0e2a4a", "#1c5486", "#3486c4", "#62b6e6", "#a4dcf6", "#e2f6ff"].map(hex);
/** Smoke greys, dark to light. */
export const SMOKE = ["#3e3848", "#625a6e", "#8c8498", "#b8b2c4"].map(hex);

/** An ellipse ring with radii rx, ry and band w: fill, a lighter inner edge, outline. keep(angle) picks the part (angle 0 = right, π/2 = near). */
export function ringXY(p, x, y, rx, ry, w, fill, inner, keep = null, line = LINE) {
  if (rx < 1 || ry < 0.5) return;
  p.shade(x - rx - w - 2, y - ry - w - 2, x + rx + w + 2, y + ry + w + 2, (px, py) => {
    const dx = (px - x) / rx, dy = (py - y) / ry, n = Math.hypot(dx, dy); if (n < 1e-6) return;
    const g = Math.hypot(dx / rx, dy / ry) / n, e = (n - 1) / g;          // distance to the ellipse in px (first order)
    if (keep && !keep(Math.atan2(dy, dx))) return;
    if (Math.abs(e) <= w / 2) return e < -w / 6 ? inner : fill;
    if (Math.abs(e) <= w / 2 + O) return line;
  });
}

/** A thick arc of radius r from angle a0 to a1 (radians, a0 < a1), widest (w) in the middle and tapering to points: fill, inner edge, outline. */
export function arc(p, x, y, r, w, a0, a1, fill, inner, line = LINE) {
  if (a1 <= a0 || w < 0.5) return;
  p.shade(x - r - w - 2, y - r - w - 2, x + r + w + 2, y + r + w + 2, (px, py) => {
    const dx = px - x, dy = py - y, d = Math.hypot(dx, dy);
    let a = Math.atan2(dy, dx); while (a < a0 - 0.3) a += TAU; while (a > a1 + 0.3) a -= TAU;
    const u = (a - a0) / (a1 - a0); if (u < -0.08 || u > 1.08) return;
    const half = (w / 2) * Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, u)))), 0.6), e = d - r;
    if (u >= 0 && u <= 1 && Math.abs(e) <= half) return e > half * 0.25 ? inner : fill;
    if (Math.abs(e) <= half + O && u > -0.06 && u < 1.06) return line;
  });
}

function segDist(px, py, ax, ay, bx, by) { const vx = bx - ax, vy = by - ay, l = vx * vx + vy * vy || 1, u = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / l)); return Math.hypot(px - ax - vx * u, py - ay - vy * u); }
/** An outlined polygon: pts [[x, y]…], fill; hi(px, py) may return a highlight colour for a pixel. */
export function polyO(p, pts, fill, hi = null, line = LINE) {
  if (pts.length < 3) return;
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  p.shade(Math.min(...xs) - 2, Math.min(...ys) - 2, Math.max(...xs) + 2, Math.max(...ys) + 2, (px, py) => {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside; }
    if (inside) return (hi && hi(px, py)) || fill;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) if (segDist(px, py, pts[j][0], pts[j][1], pts[i][0], pts[i][1]) <= O) return line;
  });
}

/** A vertical outlined column from y0 (top) to y1, half-width w: fill with a lighter middle stripe. */
export function column(p, x, y0, y1, w, fill, inner, line = LINE) {
  if (w < 0.5 || y1 <= y0) return;
  p.shade(x - w - 2, y0 - 2, x + w + 2, y1 + 2, (px, py) => {
    const dx = Math.abs(px - x);
    if (py >= y0 && py <= y1 && dx <= w) return dx < w * 0.4 ? inner : fill;
    if (py >= y0 - O && py <= y1 + O && dx <= w + O) return line;
  });
}

/** A drop: a round bottom of radius r at (x, y) with a point r * 1.8 above (or below when down). */
export function drop(p, x, y, r, fill, hi, down = false) {
  const s = down ? 1 : -1, tip = [x, y + s * r * 1.9];
  polyO(p, [tip, [x - r * 0.95, y - s * r * 0.15], [x - r, y + s * 0.2], [x - r * 0.7, y - s * r * 0.75], [x, y - s * r], [x + r * 0.7, y - s * r * 0.75], [x + r, y + s * 0.2], [x + r * 0.95, y - s * r * 0.15]], fill, (px, py) => (Math.hypot(px - x + r * 0.35, py - y + r * 0.3) < r * 0.3 ? hi : 0));
}
