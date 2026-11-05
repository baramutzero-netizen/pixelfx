// 드루이드 시전 — 데포르메 (용사 학원 드루이드 · druid-glyph 의 굵은 판) — three chunky leaves hop in to the hand, a thick outlined ring of
// living green pops open edge-on there with two leaves turning inside, then it folds shut into a little star. (0, 0) is the hand, facing right.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { FOREST } from "./_druid.js";
import { blob, star, band, pop, shrink } from "../holy/_chibi.js";

export const meta = {
  name: "Druid glyph (chunky)",
  desc: "Three chunky leaves hop in to the hand, a thick outlined ring of living green pops open edge-on there with two leaves turning inside, then folds shut into a little star.",
  tags: ["nature", "cast", "druid", "glyph", "chunky", "one-shot"],
  size: [104, 104], origin: [36, 56], duration: 0.95, loop: false, fps: 30, bg: "dark",
  options: { palette: FOREST },
};

const CX = 14, CY = -4, OPEN = 0.18, SHUT = 0.65, RX = 5, RY = 12;
export const HIT = OPEN;

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      for (let i = 0; i < 3; i++) {                                            // leaves hopping in
        const a = (i / 3) * TAU + 0.5, u = clamp(t / OPEN); if (u >= 1) break;
        const r = 26 * (1 - ease.inCubic(u)); blob(p, CX + Math.cos(a) * r, CY + Math.sin(a) * r, 2.4, C[5], C[6]);
      }
      const k = pop(t, OPEN, 0.14) * shrink(t, SHUT, SHUT + 0.12);
      if (k > 0) {
        band(p, CX, CY, RX * k + 1, RY / RX, 3, C[4], C[6]);
        for (let i = 0; i < 2; i++) { const ph = t * 7 + i * Math.PI; blob(p, CX + Math.cos(ph) * 2 * k, CY + Math.sin(ph) * RY * 0.55 * k, 2.6 * k, C[5], C[7]); }
      }
      const s = pop(t, SHUT + 0.06, 0.08) * shrink(t, SHUT + 0.14, 0.9);
      if (s > 0) star(p, CX, CY, 7 * s, C[6]);
    },
  };
}
