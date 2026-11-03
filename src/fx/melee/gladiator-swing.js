// 검투사 휘두름 (용사 학원 검투사 시전 모션 — 예전 swordSwing 그림) — a broad steel crescent cut out in front, with a thinner echo inside it.
// (0, 0) is the swordsman's chest; faces right.
import { Particles, Lights, P, Rng, fit, clamp, ease, sparkle, WHITE } from "../../core/index.js";
import { swing, slash, slashEnd, shavings } from "./_lib.js";
import { STEEL } from "./_gladiator.js";

export const meta = {
  name: "Gladiator swing",
  desc: "A broad steel-blue crescent whips from over the shoulder down and out in front in two frames, a thin echo a beat behind, the tip glints and throws white sparks.",
  tags: ["melee", "slash", "sword", "cast", "swing", "one-shot"],
  size: [124, 128], origin: [40, 62], duration: 0.7, loop: false, fps: 30, bg: "dark",
  options: { palette: STEEL, seed: 3 },
};

export const HIT = 0.07;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 999, sparks: [WHITE, C[6], C[5], C[4]] }), lights = new Lights();
  const A = { ...swing({ cx: 8, cy: -4, R: 40, sy: 0.6, rot: -0.4, a0: -2.6, dir: 1 }), span: 3.5, W: 13, t0: 0, sweep: HIT, hold: 0.05, trail: 0.26, ramp: C };
  const Ech = { ...A, R: 31, W: 4.5, a0: -2.35, span: 3.0, t0: 0.02, hold: 0.03, trail: 0.2, ramp: C.slice(0, 7) };
  const tip = slashEnd(A);
  let t = 0, landed = false;
  return {
    update(dt) {
      t += dt;
      if (!landed && t >= HIT) {
        landed = true;
        lights.add(tip.x, tip.y, 22, C[5], 0.6, 0.16);
        for (let i = 0; i < 12; i++) { const a = Math.atan2(tip.dy, tip.dx) + R.range(-0.6, 0.6), sp = R.range(140, 360); ps.spawn(P.SPARK, tip.x, tip.y, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.1, 0.3)); }
        shavings(ps, R, A, 14, [C[5], C[6], WHITE]);
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      slash(p, Ech, t); slash(p, A, t);
      const g = t - HIT * 0.6;
      if (g > 0 && g < 0.22) sparkle(p, tip.x, tip.y, 9 * ease.outBack(Math.min(1, g / 0.05)) * (1 - g / 0.22), WHITE, C[5], 0.6);
      ps.draw(p); lights.draw(p);
    },
  };
}
