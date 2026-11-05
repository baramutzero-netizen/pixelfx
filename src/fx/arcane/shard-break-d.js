// 시간 파편 — 깨지는 순간 · 데포르메 (용사 학원 시마도사 tm_b · shard-break 의 굵은 판) — an outlined star pops on the chest, a thick
// brass clock rim breaks into four arcs that fly apart and shrink, and two small azure diamonds tumble away. (0, 0) is the target's feet.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS } from "./_chrono.js";
import { band, star, pop, shrink } from "../holy/_chibi.js";
import { shape } from "./_chibi_timemage.js";

export const meta = {
  name: "Shard break (chunky)",
  desc: "An outlined star pops on the chest, a thick brass clock rim breaks into four arcs that fly apart and shrink, and two small azure diamonds tumble away.",
  tags: ["arcane", "impact", "time", "shatter", "chunky", "one-shot"],
  size: [80, 84], origin: [40, 72], duration: 0.75, loop: false, fps: 30, bg: "dark",
  options: { palette: CHRONO },
};

const CY = -26;

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const e = ease.outCubic(clamp(t / 0.4)), k = pop(t, 0.02, 0.1) * shrink(t, 0.3, 0.55);
      if (k > 0) for (let i = 0; i < 4; i++) {
        const a0 = (i / 4) * TAU + 0.3, mid = a0 + 0.6, d = 6 * e;
        band(p, Math.cos(mid) * d, CY + Math.sin(mid) * d, 12 * k + 3 * e, 1, 3.2 * k, B[5], B[6], (a) => { const v = ((a - a0) % TAU + TAU) % TAU; return v < 1.2; });
      }
      for (let i = 0; i < 2; i++) {
        const a = i ? -0.6 : Math.PI + 0.5, u = clamp((t - 0.04) / 0.45), d = 10 + 20 * ease.outCubic(u), s = pop(t, 0.04, 0.08) * shrink(t, 0.3, 0.5); if (s <= 0) continue;
        const x = Math.cos(a) * d, y = CY + Math.sin(a) * d + 14 * u * u, r = t * 9;
        shape(p, [[4, 0], [0, 2.5], [-4, 0], [0, -2.5]].map(([q, w]) => [x + (q * Math.cos(r) - w * Math.sin(r)) * s * 1.3, y + (q * Math.sin(r) + w * Math.cos(r)) * s * 1.3]), C[5]);
      }
      const s = pop(t, 0, 0.07) * shrink(t, 0.12, 0.3);
      if (s > 0) star(p, 0, CY, 12 * s, C[6]);
    },
  };
}
