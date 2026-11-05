// 급습 — 데포르메 (용사 학원 암살자 ro_b · ambush-cross 의 굵은 판) — two thick outlined violet-steel cuts slash across the chest one after
// the other in an X, white along the edge, a chunky star pops at the crossing and two shadow stars hop off. (0, 0) is the target's feet.
import { fit, clamp, ease, WHITE } from "../../core/index.js";
import { SHADE } from "./_rogue.js";
import { star, blob, pop, shrink } from "../holy/_chibi.js";
import { crescent, arcThrough } from "./_chibi_rogue.js";

export const meta = {
  name: "Ambush cross (chunky)",
  desc: "Two thick outlined violet cuts slash across the chest one after the other in an X, white along the edge, a chunky star pops at the crossing and two shadow stars hop off.",
  tags: ["melee", "impact", "dagger", "rogue", "cross", "chunky", "one-shot"],
  size: [112, 112], origin: [56, 92], duration: 0.75, loop: false, fps: 30, bg: "light",
  options: { palette: SHADE },
};

export const HIT = 0.06;
const CY = -24, SECOND = 0.13, L = 22;
const ARCS = { 1: arcThrough([-L, CY - L], [L, CY + L], 9), [-1]: arcThrough([L, CY - L], [-L, CY + L], 9) };

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  function cut(p, t0, dir) {
    const k = ease.outCubic(clamp((t - t0 + 0.05) / 0.07)), w = 8 * shrink(t, t0 + 0.14, t0 + 0.34); if (k <= 0 || w < 0.6) return;
    const A = ARCS[dir]; crescent(p, A.cx, A.cy, A.r, A.a0, A.a1, w, C[5], WHITE, k, 1);
  }
  return {
    update(dt) { t += dt; },
    draw(p) {
      cut(p, HIT, 1); cut(p, SECOND, -1);
      const s = pop(t, SECOND, 0.08) * shrink(t, SECOND + 0.12, SECOND + 0.3);
      if (s > 0) { blob(p, 0, CY, 4 * s, C[6], WHITE); star(p, 0, CY, 12 * s, C[6], Math.PI / 4); }
      for (let i = 0; i < 2; i++) { const v = clamp((t - SECOND) / 0.35), k = pop(t, SECOND + 0.03, 0.06) * shrink(t, SECOND + 0.2, SECOND + 0.4); if (k > 0) star(p, (i ? 1 : -1) * (8 + 20 * v), CY - 4 - 10 * v + 26 * v * v, 3.5 * k, C[4]); }
    },
  };
}
