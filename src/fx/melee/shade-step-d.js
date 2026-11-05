// 그림자 걸음 — 데포르메 (용사 학원 암살자 ro_2 · shade-step 의 굵은 판) — three chunky violet smoke puffs pop round the feet as the rogue
// steps, three thick outlined speed bars streak past behind, and two shadow wisps hop off and shrink. (0, 0) is the rogue's feet, facing right.
import { fit, clamp, ease, WHITE } from "../../core/index.js";
import { SHADE } from "./_rogue.js";
import { blob, star, pop, shrink } from "../holy/_chibi.js";
import { bar } from "./_chibi_rogue.js";

export const meta = {
  name: "Shade step (chunky)",
  desc: "Three chunky violet smoke puffs pop round the feet as the rogue steps, three thick outlined speed bars streak past behind, and two shadow wisps hop off and shrink.",
  tags: ["melee", "buff", "shadow", "step", "evade", "chunky", "one-shot"],
  size: [128, 104], origin: [76, 92], duration: 1.3, loop: false, fps: 30, bg: "light",
  options: { palette: SHADE },
};

export const STEP = 0.2;

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      [[-14, -2, 7], [0, 1, 8], [14, -1, 6]].forEach(([x, y, r], i) => { const k = pop(t, 0.02 + i * 0.04, 0.12) * shrink(t, 0.7 + i * 0.08, 1.05 + i * 0.06); if (k > 0) blob(p, x, y - 3 * k, r * k, C[3], C[4]); });
      for (let i = 0; i < 3; i++) {                                             // speed bars streaking past behind
        const t0 = STEP + i * 0.06, a = t - t0; if (a < 0) continue;
        const k = shrink(t, t0 + 0.2, t0 + 0.4); if (k <= 0) continue;
        const x = -20 - a * 140, y = -10 - i * 13, L = 22 * k;
        bar(p, x, y, x + L, y, 3.4 * k + 0.6, C[4], C[6]);
      }
      for (let i = 0; i < 2; i++) { const t0 = STEP + 0.1 + i * 0.2, a = t - t0, k = pop(t, t0, 0.1) * shrink(t, t0 + 0.25, t0 + 0.45); if (k > 0) star(p, -30 - a * 40, -30 - i * 16 - a * 20, 4 * k, C[5]); }
    },
  };
}
