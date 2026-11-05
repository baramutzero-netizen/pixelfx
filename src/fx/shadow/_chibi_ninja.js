// Shared by the 용사 학원 무영객 데포르메(-d) effects: the holy/_chibi.js shapes plus a chunky kunai and a chunky fuma shuriken, outlined.
// Files starting with _ are helpers, not effects.
import { TAU, WHITE } from "../../core/index.js";
export { LINE, pop, shrink, blob, star, band, petal, chevron, plus } from "../holy/_chibi.js";
export { INK, TIDE, CRIM } from "./_ninja.js";
import { LINE } from "../holy/_chibi.js";

/** A chunky kunai, tip at (x, y) pointing along a, length L: outlined dark steel, white edge, crimson ring. */
export function kunaiC(p, x, y, a, L, steel, ring) {
  const c = Math.cos(a), s = Math.sin(a);
  p.shade(x - L - 4, y - L - 4, x + L + 4, y + L + 4, (px, py) => {
    const dx = px - x, dy = py - y, u = -(dx * c + dy * s), v = -dx * s + dy * c;   // u along the blade back from the tip, v across
    if (u < -1.2 || u > L + 1.2) return;
    const w = u < L * 0.55 ? 3 * (u / (L * 0.55)) : u < L * 0.85 ? 1 : 0, ring2 = Math.hypot(u - L * 0.93, v);
    if (ring2 <= 2.2) return ring2 > 1.1 ? ring : 0;
    if (Math.abs(v) <= w) return v < -w * 0.2 && u < L * 0.5 ? WHITE : steel;
    if (Math.abs(v) <= w + 1.15 || (ring2 <= 3.3 && ring2 > 2.2)) return LINE;
  });
}

/** A chunky fuma shuriken at (x, y), radius R, turned rot, squashed by sy: four hooked blades, outlined, a crimson hub. */
export function fumaC(p, x, y, R, rot, sy, blade, edge, hub) {
  const inside = (px, py) => {
    const dx = px - x, dy = (py - y) / sy, d = Math.hypot(dx, dy); if (d > R) return 0;
    if (d < R * 0.26) return d < R * 0.12 ? 3 : 2;
    const a = Math.atan2(dy, dx) - rot - (d / R) * 0.7, m = ((a % (TAU / 4)) + TAU / 4) % (TAU / 4), w = 0.85 * (1 - d / R * 0.55);
    return m < w ? (m < w * 0.35 ? 4 : 1) : 0;
  };
  p.shade(x - R - 2, y - R - 2, x + R + 2, y + R + 2, (px, py) => {
    const k = inside(px, py);
    if (k === 1) return blade; if (k === 4) return edge; if (k === 2) return hub; if (k === 3) return WHITE;
    if (inside(px + 1, py) || inside(px - 1, py) || inside(px, py + 1) || inside(px, py - 1)) return LINE;
  });
}
