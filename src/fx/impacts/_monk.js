// Shared by the 용사 학원 무도가(몽크) effects: the chi, white-heat and impact ramps, and a punch star.
// Files starting with _ are helpers, not effects.
import { TAU, WHITE } from "../../core/index.js";
/** Chi, dark to bright: deep teal, sea blue, cyan, pale cyan, white. */
export const CHI = ["#081420", "#0e2c48", "#16507a", "#2486b0", "#40bcd8", "#88e4f0", "#d4fcff", "#ffffff"];
/** Inner gold, dark to bright. */
export const INNER = ["#1e1206", "#4a2c08", "#86520c", "#c48412", "#f0b424", "#ffe066", "#fff6c4", "#ffffff"];
/** White heat, dark to bright: ember red, orange, amber, cream, white. */
export const HEAT = ["#2a0a06", "#6a1a0c", "#b03a12", "#e8701e", "#ffa840", "#ffd88a", "#fff4dc", "#ffffff"];
/** A punch star: n rays of length L around (x, y) — long and short alternating, a white core. k fades it. */
export function punchStar(p, x, y, L, C, k, n = 8, rot = 0) {
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * TAU, l = L * (i % 2 ? 0.55 : 1), c = Math.cos(a), s = Math.sin(a);
    for (let d = 0; d < l; d += 0.5) { const w = (1 - d / l) * (i % 2 ? 1 : 1.8); for (let o = -w; o <= w; o += 0.6) p.dot(x + c * d - s * o, y + s * d + c * o, d < l * 0.35 ? WHITE : C, k); }
  }
  p.disc(x, y, L * 0.22, WHITE, k);
}
