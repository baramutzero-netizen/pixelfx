// 암살자 시전 — 데포르메 (용사 학원 암살자 · rogue-sign 의 굵은 판) — a thick outlined steel arc flicks round the hand, a chunky white star
// glints at the tip on the flick, and two violet smoke puffs curl off and shrink away. (0, 0) is the hand, facing right.
import { fit, clamp, ease, WHITE } from "../../core/index.js";
import { SHADE, EDGE } from "./_rogue.js";
import { blob, star, pop, shrink } from "../holy/_chibi.js";
import { crescent } from "./_chibi_rogue.js";

export const meta = {
  name: "Rogue sign (chunky)",
  desc: "A thick outlined steel arc flicks round the hand, a chunky white star glints at the tip on the flick, and two violet smoke puffs curl off and shrink away.",
  tags: ["melee", "cast", "dagger", "rogue", "chunky", "one-shot"],
  size: [88, 100], origin: [30, 52], duration: 0.75, loop: false, fps: 30, bg: "dark",
  options: { palette: SHADE, edge: EDGE },
};

const CX = 10, CY = 2, FLICK = 0.14;
export const HIT = FLICK;

export function create(o) {
  const C = fit(o.palette, 8), Ed = fit(o.edge, 6);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const k = ease.outCubic(clamp(t / FLICK)), w = 6 * shrink(t, 0.22, 0.4);
      if (w > 0.6) crescent(p, CX, CY, 15, -2.4, 0.2, w, Ed[3], WHITE, k, 1);
      const s = pop(t, FLICK, 0.07) * shrink(t, FLICK + 0.08, FLICK + 0.24);
      if (s > 0) star(p, CX + Math.cos(0.2) * 15, CY + Math.sin(0.2) * 15, 8 * s, WHITE);
      for (let i = 0; i < 2; i++) { const t0 = FLICK + 0.04 + i * 0.1, a = t - t0, k2 = pop(t, t0, 0.1) * shrink(t, t0 + 0.2, t0 + 0.4); if (k2 > 0) blob(p, CX + 10 + a * 30, CY - 6 - a * 40 - i * 6, (3.4 - i) * k2, C[4], C[5]); }
    },
  };
}
