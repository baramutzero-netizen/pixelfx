// 도발 — 외침 (용사 학원 검투사 sw_1 시전 쪽 — 예전 tauntCall 그림) — three red shout arcs roll out in front, hot specks fly off them.
// (0, 0) is the swordsman's chest; faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, WHITE } from "../../core/index.js";
import { RAGE } from "./_gladiator.js";

export const meta = {
  name: "Taunt roar",
  desc: "Three blood-red shout arcs burst out in front one after another, widening and thinning as they roll forward, orange specks fly off, a hot breath glows at the mouth.",
  tags: ["melee", "taunt", "shout", "cast", "one-shot"],
  size: [136, 116], origin: [28, 60], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: RAGE, seed: 9 },
};

const WAVES = [0, 0.08, 0.16], LIFE = 0.42, REACH = 92;
export const HIT = 0.25;                                          // when the shout reaches the one it calls out

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 999, sparks: [C[6], C[5], C[4]] }), lights = new Lights();
  let t = 0, w = 0;
  function wave(p, t0, i) {
    const u = (t - t0) / LIFE;
    if (u < 0 || u > 1) return;
    const r = 8 + REACH * ease.outCubic(u), f = 1 - smooth(0.45, 1, u), half = 0.42 + 0.35 * u, th = 3.2 * (1 - u) + 0.8;
    for (let a = -half; a <= half; a += 0.6 / r) {               // a ")" — thick in the middle, tapering to the tips
      const e = 1 - Math.abs(a) / half, w2 = th * Math.pow(e, 0.6);
      for (let d = -w2; d <= w2; d += 0.6) {
        const x = Math.cos(a) * (r + d), y = Math.sin(a) * (r + d) * 0.9, q = Math.abs(d) / Math.max(0.5, w2);
        p.dot(x, y, q < 0.35 && u < 0.4 ? C[6] : q < 0.7 ? C[4] : C[3], f * (0.4 + 0.6 * e) * (i === 0 ? 1 : 0.8));
      }
    }
  }
  return {
    update(dt) {
      t += dt;
      while (w < WAVES.length && t >= WAVES[w]) {
        lights.add(6, 0, 22, C[4], 0.5 - w * 0.12, 0.14); w++;
        for (let i = 0; i < 8; i++) { const a = R.range(-0.7, 0.7), sp = R.range(90, 220); ps.spawn(P.SPARK, 8, 0, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.15, 0.35)); }
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      if (t < 0.3) p.glow(6, 0, 12, C[4], 0.5 * (1 - t / 0.3));
      WAVES.forEach((t0, i) => wave(p, t0, i));
      ps.draw(p); lights.draw(p);
    },
  };
}
