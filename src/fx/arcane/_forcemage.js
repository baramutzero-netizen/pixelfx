// Shared by the 용사 학원 전쟁법사(forcemage) effects: the force ramp (crimson-magenta battle magic, like her robe), the star gold of her staff,
// a rune ring and a crack line. Files starting with _ are helpers, not effects.
import { TAU, WHITE } from "../../core/index.js";

/** Force crimson, dark to bright: wine, crimson, rose red, pink, pale pink, white. */
export const FORCE = ["#1a0614", "#4a0c2a", "#8a1440", "#cc2a5a", "#f05a7a", "#ff9ab0", "#ffd8e2", "#ffffff"];
/** Star gold, dark to bright. */
export const STAR = ["#2a1606", "#6a3a0a", "#b06a10", "#e89a1e", "#ffc640", "#ffe48a", "#fff6d0", "#ffffff"];

/** A rune ring standing up (sy 1) or lying (sy < 1): rim, inner rim and n tick runes turned rot, alpha k. */
export function runeRing(p, x, y, r, sy, k, rot, rim, inner, rune, n = 8) {
  if (r < 1 || k <= 0) return;
  for (let g = 0; g < TAU; g += 0.5 / r) {
    p.dot(x + Math.cos(g) * r, y + Math.sin(g) * r * sy, rim, k);
    p.dot(x + Math.cos(g) * (r - 1), y + Math.sin(g) * (r - 1) * sy, rim, k);
    p.dot(x + Math.cos(g) * (r - 3), y + Math.sin(g) * (r - 3) * sy, inner, k * 0.8);
  }
  for (let i = 0; i < n; i++) {
    const g = rot + (i / n) * TAU, c = Math.cos(g), s = Math.sin(g), m = r - 1.5;
    for (let d = -1.5; d <= 1.5; d += 0.5) p.dot(x + c * m - s * d, y + (s * m + c * d) * sy, rune, k);
  }
}

/** A jagged crack from (x, y) out along angle a, length L, seeded by s. */
export function crack(p, x, y, a, L, c, k, s = 1) {
  let px = x, py = y;
  for (let d = 0; d < L; d += 1) {
    const j = Math.sin(d * 0.9 + s * 3.1) * 0.8;
    px = x + Math.cos(a) * d - Math.sin(a) * j; py = y + Math.sin(a) * d * 0.4 + Math.cos(a) * j * 0.4;
    p.dot(px, py, d < 2 ? WHITE : c, k * (1 - d / (L + 2)));
  }
}
