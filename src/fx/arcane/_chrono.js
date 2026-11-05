// Shared by the 용사 학원 시마도사(timemage) effects: the chrono ramp (the azure crystal on her staff), clock gold, a clock face and a gear.
// Files starting with _ are helpers, not effects.
import { TAU, WHITE } from "../../core/index.js";

/** Chrono azure, dark to bright: midnight navy, indigo, azure, sky, ice, white. */
export const CHRONO = ["#0a0c26", "#141c52", "#1c3a92", "#2a66d0", "#4a9cf4", "#8ad0ff", "#d4f2ff", "#ffffff"];
/** Clock brass, dark to bright: umber, bronze, brass, gold, pale gold, cream, white. */
export const BRASS = ["#1e140a", "#4a3010", "#7e5418", "#b88424", "#e8b840", "#ffe07a", "#fff6cc", "#ffffff"];

/**
 * A clock face at (x, y), radius r, on a plane squashed by sy (1 stands up, 0.32 lies on the floor): rim, twelve ticks
 * (long at the quarters), an hour and a minute hand at angles hA and mA (0 = twelve, clockwise), alpha k. rim, tick, hand colours.
 */
export function clockFace(p, x, y, r, sy, k, hA, mA, rim, tick, hand, back = null) {
  if (r < 1 || k <= 0) return;
  for (let g = 0; g < TAU; g += 0.5 / r) {
    const near = sy >= 0.99 || Math.sin(g) > 0, c = near || !back ? rim : back;
    p.dot(x + Math.cos(g) * r, y + Math.sin(g) * r * sy, c, k);
    p.dot(x + Math.cos(g) * (r - 1), y + Math.sin(g) * (r - 1) * sy, c, k * 0.6);
  }
  for (let i = 0; i < 12; i++) {
    const g = (i / 12) * TAU - Math.PI / 2, L = i % 3 ? r * 0.1 : r * 0.2, c = Math.cos(g), s = Math.sin(g);
    for (let d = r - 2 - L; d < r - 2; d += 0.5) p.dot(x + c * d, y + s * d * sy, tick, k);
  }
  const H = (a, L, w) => { const g = a - Math.PI / 2, c = Math.cos(g), s = Math.sin(g); for (let d = 0; d < L; d += 0.5) for (let o = -w; o <= w; o += 0.6) p.dot(x + c * d - s * o, y + (s * d + c * o) * sy, hand, k); };
  H(hA, r * 0.5, 0.9); H(mA, r * 0.78, 0.5);
  p.disc(x, y, Math.max(1, r * 0.06), hand, k);
}

/** A gear: n teeth round radius r at (x, y), turned rot, colour c, alpha k, with a hole. */
export function gear(p, x, y, r, n, rot, c, hole, k = 1) {
  if (r < 1 || k <= 0) return;
  for (let g = 0; g < TAU; g += 0.4 / r) {
    const tooth = Math.cos((g - rot) * n) > 0.3, R = r + (tooth ? 1.6 : 0);
    for (let d = r * 0.45; d < R; d += 0.6) p.dot(x + Math.cos(g) * d, y + Math.sin(g) * d, d > R - 0.8 ? WHITE : c, k * (d > R - 0.8 ? 0.6 : 1));
  }
  p.disc(x, y, r * 0.3, hole, k);
}
