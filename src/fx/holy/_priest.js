// Shared by the 용사 학원 신성 사제(priest) effects: the sapphire ramp (the gem on her sun staff), the dawn ramp, a four-point glint and a halo ring.
// Files starting with _ are helpers, not effects.
import { TAU, WHITE } from "../../core/index.js";

/** Sapphire, dark to bright: night blue, deep sapphire, cornflower, sky, ice, white. */
export const SAPPHIRE = ["#0c1030", "#16245e", "#22409a", "#3a6ad0", "#6a9cf0", "#a8ccff", "#e2f0ff", "#ffffff"];
/** Dawn, dark to bright: dusk violet, rose, peach, pale gold, cream, white. */
export const DAWN = ["#2a1a3a", "#5a3060", "#a2506a", "#e08a6a", "#f8c07a", "#ffe6a6", "#fff8e2", "#ffffff"];

/** A four-point glint at (x, y): long vertical and horizontal arms of length L (vertical a little longer), a white core. */
export function glint(p, x, y, L, C, k = 1, rot = 0) {
  if (L < 1 || k <= 0) return;
  for (let i = 0; i < 4; i++) {
    const a = rot + (i * Math.PI) / 2, l = L * (i % 2 ? 0.75 : 1), c = Math.cos(a), s = Math.sin(a);
    for (let d = 0; d < l; d += 0.5) { const w = (1 - d / l) * 1.6; for (let o = -w; o <= w; o += 0.6) p.dot(x + c * d - s * o, y + s * d + c * o, d < l * 0.4 ? WHITE : C, k * (1 - 0.5 * d / l)); }
  }
  p.glow(x, y, L * 0.9, C, 0.4 * k);
  p.disc(x, y, Math.max(1, L * 0.14), WHITE, k);
}

/** A halo: a thin ring on a tilted plane (sy), front half bright, back half dim; ticks of light round it when ticks > 0. */
export function halo(p, x, y, r, sy, front, back, k = 1, ticks = 0, spin = 0) {
  if (r < 0.5 || k <= 0) return;
  for (let g = 0; g < TAU; g += 0.6 / Math.max(4, r)) {
    const near = Math.sin(g) > 0;
    p.dot(x + Math.cos(g) * r, y + Math.sin(g) * r * sy, near ? front : back, k * (near ? 1 : 0.55));
  }
  for (let i = 0; i < ticks; i++) {
    const g = spin + (i / ticks) * TAU, near = Math.sin(g) > 0;
    p.dot(x + Math.cos(g) * r, y + Math.sin(g) * r * sy - 1, WHITE, k * (near ? 1 : 0.5));
    p.dot(x + Math.cos(g) * r, y + Math.sin(g) * r * sy + 1, WHITE, k * (near ? 0.8 : 0.4));
  }
}
