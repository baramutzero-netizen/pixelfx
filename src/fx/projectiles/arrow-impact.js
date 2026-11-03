// 조준 사격 — 맞는 쪽 (용사 학원 궁수 ar_b — 후열을 노린 한 발) — the arrow strikes the chest: a white star, a ring of wind, splinters and sparks fly back.
// (0, 0) is the target's feet; the arrow came from the left.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { WIND, SHAFT } from "./_archer.js";

export const meta = {
  name: "Arrow impact",
  desc: "An arrow strikes the chest: a white four-point star, a ring of green wind bursts out, wood splinters and sparks spray back the way it came, and a shock line streaks through.",
  tags: ["projectiles", "arrow", "hit", "impact", "one-shot"],
  size: [112, 96], origin: [56, 84], duration: 0.7, loop: false, fps: 30, bg: "light",
  options: { palette: WIND, wood: SHAFT, seed: 4 },
};

export const HIT = 0.0;
const CY = -24;

export function create(o) {
  const C = fit(o.palette, 8), Wd = fit(o.wood, 5), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5]] }), lights = new Lights();
  let t = 0, hit = false;
  return {
    update(dt) {
      t += dt;
      if (!hit) {
        hit = true; lights.add(0, CY, 30, C[6], 0.8, 0.2);
        for (let i = 0; i < 14; i++) { const a = Math.PI + R.range(-0.8, 0.8), s = R.range(80, 220); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.1, 0.3)); }
        for (let i = 0; i < 6; i++) { const a = Math.PI + R.range(-1, 1), s = R.range(40, 110); ps.spawn(P.GRIT, 0, CY, Math.cos(a) * s, Math.sin(a) * s - 30, R.range(0.3, 0.55), Wd[R.int(1, 3)], 1); }
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const u = t / 0.3;
      if (u < 1) {
        const r = 4 + 18 * ease.outCubic(u), a = 1 - u;
        for (let g = 0; g < TAU; g += 0.6 / r) p.dot(Math.cos(g) * r * 0.5, CY + Math.sin(g) * r, u < 0.3 ? WHITE : C[5], a);
        for (let d = 0; d < 40 * (1 - u); d += 0.6) p.dot(-d - 4, CY, d < 6 ? WHITE : C[6], a * (1 - d / 40));
      }
      if (t < 0.16) { const k = 1 - t / 0.16; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) for (let d = 0; d < 12 * k + 2; d += 0.5) p.dot(dx * d, CY + dy * d, d < 3 ? WHITE : C[6], k); p.disc(0, CY, 3 * k, WHITE, k); }
      if (t > 0.02 && t < 0.25) sparkle(p, 0, CY, 7 * (1 - t / 0.25), WHITE, C[6], 0.5);
      ps.draw(p); lights.draw(p);
    },
  };
}
