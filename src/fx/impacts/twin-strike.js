// 연격 (용사 학원 무도가 mo_b — 빠른 2연타) — two quick fist blows land on the chest, each a white punch star with a shock ring, the second bigger.
// (0, 0) is the target's feet; the blows come from the left.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { HEAT, punchStar } from "./_monk.js";

export const meta = {
  name: "Twin strike",
  desc: "Two quick fist blows land on the chest one after the other, each a white punch star with an amber shock ring and sparks, the second one bigger with a puff of dust.",
  tags: ["impacts", "punch", "hit", "combo", "fist", "one-shot"],
  size: [112, 104], origin: [56, 90], duration: 0.75, loop: false, fps: 30, bg: "light",
  options: { palette: HEAT, seed: 5 },
};

export const HITS = [0.06, 0.2];
export const HIT = HITS[0];
const PTS = [[-3, -26], [2, -22]];

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5], C[4]] }), lights = new Lights();
  let t = 0, n = 0;
  return {
    update(dt) {
      t += dt;
      while (n < 2 && t >= HITS[n]) {
        const [x, y] = PTS[n], k = n ? 1.3 : 1; n++;
        lights.add(x, y, 26 * k, C[5], 0.7, 0.15);
        for (let i = 0; i < 12 * k; i++) { const a = R.range(-1.2, 1.2), s = R.range(80, 200) * k; ps.spawn(P.SPARK, x, y, Math.cos(a) * s, Math.sin(a) * s, R.range(0.1, 0.25)); }
        if (k > 1) for (let i = 0; i < 5; i++) ps.spawn(P.DUST, R.range(-6, 6), -1, R.sign() * R.range(15, 40), -R.range(3, 10), R.range(0.35, 0.55), C[3], R.range(2, 3.5));
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      HITS.forEach((h, i) => {
        const u = t - h, [x, y] = PTS[i], k = i ? 1.3 : 1;
        if (u < 0) return;
        if (u < 0.12) punchStar(p, x, y, 12 * k * ease.outBack(Math.min(1, u / 0.04)), C[5], 1 - u / 0.12, 8, i * 0.4);
        const v = u / 0.3;
        if (v < 1) { const r = 4 + 16 * k * ease.outCubic(v); for (let g = 0; g < TAU; g += 0.6 / r) p.dot(x + Math.cos(g) * r * 0.5, y + Math.sin(g) * r, v < 0.25 ? WHITE : C[4], 1 - v); }
        if (u < 0.08) for (let d = 0; d < 18; d += 0.6) p.dot(x - 6 - d, y, d < 4 ? WHITE : C[5], (1 - u / 0.08) * (1 - d / 18));   // the blow's streak from the left
      });
      ps.draw(p); lights.draw(p);
    },
  };
}
