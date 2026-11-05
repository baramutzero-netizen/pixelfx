// 무도가 기세 — 데포르메 (용사 학원 무도가 · monk-pressure 의 굵은 판) — two chi blobs swirl into the fist, it snaps in an outlined star
// and a thick ring of pressure pops out in front, two pressure dashes fly ahead. (0, 0) is the monk's chest; faces right.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { CHI } from "./_monk.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";
import { capsule } from "./_chibi_monk.js";

export const meta = {
  name: "Monk pressure (chunky)",
  desc: "Two chi blobs swirl into the fist, it snaps in an outlined star and a thick ring of pressure pops out in front as two dashes fly ahead.",
  tags: ["impacts", "cast", "chi", "fist", "chunky", "one-shot"],
  size: [124, 96], origin: [36, 50], duration: 0.75, loop: false, fps: 30, bg: "dark",
  options: { palette: CHI },
};

export const HIT = 0.16;
const CX = 10;

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      if (t < HIT) for (let i = 0; i < 2; i++) { const u = t / HIT, a = i * Math.PI + u * 5, r = 16 * (1 - u); blob(p, CX + Math.cos(a) * r, Math.sin(a) * r, 2.4, C[5], C[6]); }
      const v = clamp((t - HIT) / 0.4), w = 4.5 * (1 - v);
      if (t >= HIT && w > 0.6) band(p, CX + 8 + 16 * ease.outCubic(v), 0, 5 + 6 * ease.outCubic(v), 1.8, w * 0.8, C[5], C[6]);
      for (let i = 0; i < 2; i++) { const t0 = HIT + 0.04, u = clamp((t - t0) / 0.35), k = pop(t, t0, 0.06) * shrink(t, t0 + 0.2, t0 + 0.35); if (k <= 0) continue; const x = CX + 16 + 50 * ease.outCubic(u), y = (i ? 10 : -10); capsule(p, x - 10 * k, y, x, y, 1.6 * k, C[6], true); }
      const s = pop(t, HIT, 0.07) * shrink(t, HIT + 0.1, HIT + 0.28);
      if (s > 0) { blob(p, CX, 0, 4 * s, C[6], WHITE); star(p, CX, 0, 11 * s, WHITE); }
    },
  };
}
