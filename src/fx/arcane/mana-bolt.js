// 마력탄 (용사 학원 마법사 wz_b) — the bolt in flight: a violet-white orb with a crackling tail. Faces right; the host moves it.
import { PAL, fit, cycle, WHITE, TAU } from "../../core/index.js";

export const meta = {
  name: "Mana bolt",
  desc: "A small violet orb in flight: white-hot core, a pulsing rim, a tail of motes peeling off behind it.",
  tags: ["arcane", "projectile", "bolt", "loop"],
  size: [56, 24], origin: [44, 12], duration: 0.4, loop: true, fps: 30, bg: "dark",
  options: { palette: PAL.arcane, seed: 2 },
};

export function draw(p, t, o) {
  const C = fit(o.palette, 8), ph = t / meta.duration, pulse = Math.sin(ph * TAU * 2);
  cycle(t, meta.duration, 16, o.seed, 0.3, (age, life, r) => {   // the tail: motes shed at the orb, drifting back and fading
    const k = age / life, x = -3 - k * r.range(18, 34), y = r.range(-3, 3) * (0.4 + k);
    p.px(x, y, k < 0.3 ? C[6] : k < 0.65 ? C[5] : C[4]);
    if (k < 0.5) p.light(x, y, C[5], 0.3 * (1 - k));
  });
  for (let i = 0; i < 12; i++) { const u = i / 12; p.dot(-2 - u * 14, 0, u < 0.3 ? C[6] : C[4], 1 - u); }   // the streak behind
  p.circle(0, 0, 4.2 + pulse * 0.4, C[3]);
  p.circle(-0.4, -0.3, 3.2, C[5]);
  p.circle(0.3, -0.2, 1.8, WHITE);
  p.glow(0, 0, 14, C[5], 0.55);
  p.glow(0, 0, 5, WHITE, 0.35);
}
