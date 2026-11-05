// 가속 — 데포르메 (용사 학원 시마도사 tm_1 · haste-dial 의 굵은 판) — a thick outlined brass clock ring pops on the floor with two thick
// hands that race round from 0.3 s, three chunky azure chevrons dart ahead and two speed dashes whip past. (0, 0) is the ally's feet; faces right.
import { fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS } from "./_chrono.js";
import { band, blob, pop, shrink } from "../holy/_chibi.js";
import { capsule, chevronR } from "./_chibi_timemage.js";

export const meta = {
  name: "Haste dial (chunky)",
  desc: "A thick outlined brass clock ring pops on the floor and its two thick hands race round, three chunky azure chevrons dart ahead and two speed dashes whip past.",
  tags: ["arcane", "buff", "time", "haste", "chunky", "one-shot"],
  size: [132, 104], origin: [62, 92], duration: 1.2, loop: false, fps: 30, bg: "ground",
  options: { palette: CHRONO },
};

export const RUSH = 0.3;
const SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const k = pop(t, 0, 0.14) * shrink(t, 0.85, 1.1);
      if (k > 0) {
        band(p, 0, 0, 28 * k, SY, 5, B[4], B[6]);
        const spin = t < RUSH ? t * 3 : RUSH * 3 + (t - RUSH) * 30 * (1 - smooth(0.6, 1, t));
        for (const [L, a] of [[13, spin / 12], [20, spin]]) { const g = a - Math.PI / 2; capsule(p, 0, 0, Math.cos(g) * L * k, Math.sin(g) * L * SY * k, 1.2, C[3]); }
        blob(p, 0, 0, 2, B[5]);
      }
      for (let i = 0; i < 3; i++) {
        const t0 = RUSH + 0.06 + i * 0.07, a = t - t0; if (a < 0) continue;
        const kk = pop(t, t0, 0.08) * shrink(t, t0 + 0.2, t0 + 0.36);
        if (kk > 0) chevronR(p, 14 + a * 80 + i * 8, -26, 9 * kk, 4 * kk, C[5]);
      }
      for (let i = 0; i < 2; i++) {
        const t0 = RUSH + i * 0.12, a = t - t0; if (a < 0 || a > 0.3) continue;
        const x = -30 + a * 260, kk = shrink(t, t0 + 0.15, t0 + 0.3);
        capsule(p, x - 22, -14 - i * 22, x, -14 - i * 22, 2.4 * kk, C[6], true);
      }
    },
  };
}
