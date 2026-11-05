// 지연 — 데포르메 (용사 학원 시마도사 tm_2 · delay-hourglass 의 굵은 판) — a chunky hourglass pops round the target: thick brass caps,
// outlined glass sides (open, so the body shows), a sand pile that runs back up, a little round clock on top turning backward, and two
// grey blobs sinking. (0, 0) is the target's feet.
import { fit, hex, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS } from "./_chrono.js";
import { blob, band, pop, shrink } from "../holy/_chibi.js";
import { capsule } from "./_chibi_timemage.js";

export const meta = {
  name: "Delay hourglass (chunky)",
  desc: "A chunky hourglass pops round the target with thick brass caps and open glass sides, its sand runs back up, a little clock on top turns backward.",
  tags: ["arcane", "debuff", "time", "slow", "hourglass", "chunky", "one-shot"],
  size: [80, 108], origin: [40, 96], duration: 1.4, loop: false, fps: 30, bg: "ground",
  options: { palette: CHRONO },
};

export const SET = 0.3;
const TOP = -58, W = 17, GREY = ["#6a7084", "#a4aabc"].map(hex);

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const k = pop(t, 0, 0.18) * shrink(t, 1.1, 1.38); if (k <= 0) return;
      const top = TOP * k, w = W * k, mid = top / 2;
      for (const s of [-1, 1]) { capsule(p, s * w, top + 2, s * 8 * k, mid, 1.3, C[5]); capsule(p, s * 8 * k, mid, s * w, -2, 1.3, C[5]); }   // the neck stays wide — the body shows through
      const s = smooth(SET, 1.1, t);                                         // sand: the bottom pile empties, the top one fills
      if (1 - s > 0.08) blob(p, 0, -3 - 3 * (1 - s), 7 * (1 - s) * k + 1, B[5], B[6]);
      if (s > 0.08) blob(p, 0, top + 4 + 3 * s, 6 * s * k + 1, B[5], B[6]);
      capsule(p, -w - 3, top, w + 3, top, 2.2, B[4]); capsule(p, -w - 3, 0, w + 3, 0, 2.2, B[4]);
      const cy = top - 9 * k; blob(p, 0, cy, 6 * k, B[6], WHITE); band(p, 0, cy, 6 * k, 1, 1.6, B[4], B[5]);
      const g = -smooth(0, 1.2, t) * TAU * 1.5 - Math.PI / 2; capsule(p, 0, cy, Math.cos(g) * 4 * k, cy + Math.sin(g) * 4 * k, 0.8, C[3]);
      for (let i = 0; i < 2; i++) { const t0 = SET + 0.1 + i * 0.3, v = clamp((t - t0) / 0.5), kk = pop(t, t0, 0.1) * shrink(t, t0 + 0.3, t0 + 0.5); if (kk > 0) blob(p, (i ? 1 : -1) * (w + 7), mid - 10 + 26 * v, 2.6 * kk, GREY[0], GREY[1]); }
    },
  };
}
