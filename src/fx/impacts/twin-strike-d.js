// 연격 — 데포르메 (용사 학원 무도가 mo_b · twin-strike 의 굵은 판) — two blows on the chest at 0.06 and 0.2 s, each an outlined
// white-hot star with a thick ring, the second bigger; three dust blobs puff at the feet. (0, 0) is the target's feet; blows from the left.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { HEAT } from "./_monk.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";

export const meta = {
  name: "Twin strike (chunky)",
  desc: "Two blows land on the chest, each an outlined white-hot star with a thick ring, the second bigger, and three dust blobs puff at the feet.",
  tags: ["impacts", "hit", "fist", "chunky", "one-shot"],
  size: [112, 104], origin: [56, 90], duration: 0.75, loop: false, fps: 30, bg: "light",
  options: { palette: HEAT },
};

export const HITS = [0.06, 0.2];
export const HIT = HITS[0];
const PTS = [[-3, -26], [2, -22]];

export function create(o) {
  const H = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      HITS.forEach((h, i) => {
        const [x, y] = PTS[i], sz = i ? 1.3 : 1, v = clamp((t - h) / 0.35), w = 4 * (1 - v);
        if (t >= h && w > 0.6) band(p, x, y, (6 + 14 * ease.outCubic(v)) * sz, 0.9, w, H[4], H[5]);
        const s = pop(t, h, 0.06) * shrink(t, h + 0.08, h + 0.24);
        if (s > 0) { blob(p, x, y, 3.5 * s * sz, H[6], WHITE); star(p, x, y, 10 * s * sz, H[5]); }
      });
      for (let i = 0; i < 3; i++) { const t0 = 0.22 + i * 0.04, u = clamp((t - t0) / 0.4), k = pop(t, t0, 0.08) * shrink(t, t0 + 0.2, t0 + 0.4); if (k > 0) blob(p, (i - 1) * 14 + (i - 1) * 8 * u, -2 - 5 * u, 3 * k, H[3], H[4]); }
    },
  };
}
