// 시마도사 시전 — 데포르메 (용사 학원 시마도사 · chrono-gears 의 굵은 판) — a round outlined cream clock face pops round the azure
// crystal, a thick hand sweeps once round, two chunky gears turn beside it, and an outlined star pops on the stroke at 0.24 s. (0, 0) is the crystal.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS } from "./_chrono.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";
import { capsule } from "./_chibi_timemage.js";
import { gearD } from "./_chibi_timemage_gear.js";

export const meta = {
  name: "Chrono gears (chunky)",
  desc: "A round outlined clock face pops round an azure crystal, a thick hand sweeps once round, two chunky gears turn beside it and a star pops on the stroke.",
  tags: ["arcane", "cast", "time", "clock", "chunky", "one-shot"],
  size: [64, 64], origin: [32, 32], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: CHRONO },
};

export const STROKE = 0.24;

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const k = pop(t, 0, 0.14) * shrink(t, 0.5, 0.75); if (k <= 0) return;
      gearD(p, -13 * k, 12 * k, 4.5 * k, 6, t * 6, B[4]); gearD(p, 13 * k, -12 * k, 3.6 * k, 5, -t * 7, B[3]);
      blob(p, 0, 0, 10 * k, B[6], WHITE); band(p, 0, 0, 10 * k, 1, 2, B[4], B[5]);
      const a = clamp(t / STROKE) * TAU - Math.PI / 2;
      capsule(p, 0, 0, Math.cos(a) * 7 * k, Math.sin(a) * 7 * k, 1.1, C[3]);
      blob(p, 0, 0, 2.4 * k, C[5], C[6]);
      const s = pop(t, STROKE, 0.08) * shrink(t, STROKE + 0.12, STROKE + 0.3);
      if (s > 0) star(p, 0, 0, 13 * s, C[6]);
    },
  };
}
