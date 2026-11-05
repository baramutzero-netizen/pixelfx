// 무영객 시전 (용사 학원 무영객 — 기술마다 · 예전 ninjaRipple) — an ink drop falls at her feet: water-shadow rings spread on the floor,
// the drop splashes up a little crown and three droplets fall back. (0, 0) is her feet.
import { Particles, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, ripple } from "./_ninja.js";

export const meta = {
  name: "Ink ripple",
  desc: "An ink drop falls at the feet: rings of water-shadow spread over the floor, the drop splashes up a little crown and droplets fall back.",
  tags: ["shadow", "cast", "water", "ripple", "one-shot"],
  size: [104, 56], origin: [52, 40], duration: 0.75, loop: false, fps: 30, bg: "ground",
  options: { palette: TIDE, seed: 4 },
};

export const SPLASH = 0.12;
const SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6]] });
  let t = 0, done = false;
  return {
    update(dt) {
      t += dt;
      if (!done && t >= SPLASH) { done = true; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + R.range(-0.9, 0.9); ps.spawn(P.MOTE, 0, -1, Math.cos(a) * R.range(20, 40), Math.sin(a) * R.range(40, 70), R.range(0.3, 0.45), R.chance(0.5) ? C[6] : K[5], 1); } }
      ps.update(dt);
    },
    draw(p) {
      const fall = clamp(t / SPLASH);
      if (t < SPLASH) { p.disc(0, -30 * (1 - ease.inCubic(fall)), 1.8, K[4], 1); p.dot(0, -30 * (1 - ease.inCubic(fall)) - 1, C[6], 1); }
      for (let i = 0; i < 3; i++) {
        const v = (t - SPLASH - i * 0.08) / 0.4; if (v <= 0 || v >= 1) continue;
        const r = 4 + 34 * ease.outCubic(v), k = (1 - v);
        ripple(p, 0, 0, r, SY, i === 0 ? C[6] : C[5], k); ripple(p, 0, 0.6, r - 1.5, SY, K[4], k * 0.6);
      }
      const cv = (t - SPLASH) / 0.25;
      if (cv > 0 && cv < 1) for (let i = 0; i < 7; i++) { const a = (i / 7) * TAU, h = 6 * Math.sin(Math.PI * cv); p.line(Math.cos(a) * 3, Math.sin(a) * 1, Math.cos(a) * (3 + 2 * cv), -h + Math.sin(a), i % 2 ? C[5] : C[6], 1 - cv); }
      p.glow(0, -2, 10, C[4], 0.25 * (1 - smooth(0.2, 0.7, t)));
      ps.draw(p);
    },
  };
}
