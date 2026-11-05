// 전쟁법사 시전 (용사 학원 전쟁법사 — 기술마다 · 예전 staffThrust) — the gold star on her staff gathers crimson force, flares at 0.16 s,
// throws a crimson shock ring forward and a spray of sparks. (0, 0) is the star; it faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { FORCE, STAR } from "./_forcemage.js";

export const meta = {
  name: "Force spark",
  desc: "Crimson force gathers on a gold star, flares, and throws a squashed shock ring forward with a spray of sparks.",
  tags: ["arcane", "cast", "staff", "force", "one-shot"],
  size: [64, 60], origin: [26, 30], duration: 0.6, loop: false, fps: 30, bg: "dark",
  options: { palette: FORCE, seed: 5 },
};

export const FLARE = 0.16;

export function create(o) {
  const C = fit(o.palette, 8), S = fit(STAR, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 99, sparks: [WHITE, C[6], S[5]] }), lights = new Lights();
  let t = 0, fl = false;
  const fade = () => 1 - smooth(0.4, meta.duration - 0.02, t);
  return {
    update(dt) {
      t += dt;
      if (!fl && t >= FLARE) {
        fl = true; lights.add(0, 0, 22, C[5], 0.6, 0.25);
        for (let i = 0; i < 9; i++) { const a = R.range(-0.9, 0.9), s = R.range(60, 130); ps.spawn(P.SPARK, 0, 0, Math.cos(a) * s, Math.sin(a) * s, R.range(0.12, 0.25), R.chance(0.5) ? WHITE : C[5], 1); }
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade(), pre = smooth(0, FLARE, t);
      for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + t * 5, r = 14 * (1 - pre); if (t < FLARE) p.dot(Math.cos(a) * r, Math.sin(a) * r, C[5], 0.9); }
      p.glow(0, 0, 6 + 6 * pre, C[4], 0.4 * f);
      const v = (t - FLARE) / 0.3;
      if (v > 0 && v < 1) {
        const r = 4 + 18 * ease.outCubic(v), k = 1 - v;
        for (let g = -1.3; g <= 1.3; g += 0.04) { p.dot(Math.cos(g) * r, Math.sin(g) * r * 1.4, v < 0.25 ? WHITE : C[5], k); p.dot(Math.cos(g) * (r - 2), Math.sin(g) * (r - 2) * 1.4, C[3], k * 0.6); }
      }
      const s = t < FLARE ? 3 + 3 * pre : 6 * (1 - smooth(FLARE, 0.45, t)) + 2;
      if (f > 0.15) sparkle(p, 0, 0, s * f, S[5], WHITE, 0.5 * f);
      ps.draw(p); lights.draw(p);
    },
  };
}
