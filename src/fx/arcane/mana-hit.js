// 마력탄이 맞는 곳 (용사 학원 마법사 wz_b) — a quick violet pop on the target's chest.
import { Particles, Lights, P, Rng, fit, sparkle, ease, TAU, WHITE, PAL } from "../../core/index.js";

export const meta = {
  name: "Mana hit",
  desc: "A violet bolt pops on the chest: a white star, a snapping ring, motes and sparks thrown back, a short glow.",
  tags: ["arcane", "impact", "hit", "one-shot"],
  size: [80, 72], origin: [40, 54], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: PAL.arcane, seed: 6 },
};

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed), CY = -19;
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[7], C[6], C[5], C[4]] }), lights = new Lights();
  lights.add(0, CY, 30, C[5], 0.7, 0.3);
  lights.add(0, CY, 10, WHITE, 0.8, 0.07);
  for (let i = 0; i < 22; i++) { const a = R.range(-1.3, 1.3), sp = R.range(80, 200); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * sp, Math.sin(a) * sp - 30, R.range(0.1, 0.3)); }   // thrown on, away from the caster
  for (let i = 0; i < 12; i++) { const a = R.range(0, TAU), sp = R.range(15, 60); ps.spawn(P.MOTE, 0, CY, Math.cos(a) * sp, Math.sin(a) * sp - 10, R.range(0.3, 0.6), C[5]); }
  let t = 0;
  return {
    update(dt) { t += dt; ps.update(dt); lights.update(dt); },
    draw(p) {
      if (t < 0.067) { p.circle(0, CY, 6, C[6]); p.circle(0, CY, 4, WHITE); }
      if (t < 0.16) sparkle(p, 0, CY, 12 * (1 - t / 0.16) + 2, WHITE, C[5], 0.8);
      const g = t / 0.22;
      if (g < 1) p.ring(0, CY, 5 + 13 * ease.outCubic(g), 1, g < 0.5 ? C[6] : C[4]);
      ps.draw(p, "front");
      lights.draw(p);
    },
  };
}
