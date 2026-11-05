// 시마도사 시전 (용사 학원 시마도사 — 기술마다 · 예전 tmGears) — round the azure crystal on her staff a small brass clock face winds in,
// its hand sweeps once round, two gears turn and catch, and the crystal flares on the stroke. (0, 0) is the crystal.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS, clockFace, gear, } from "./_chrono.js";

export const meta = {
  name: "Chrono gears",
  desc: "A small brass clock face winds in round an azure crystal, its hand sweeps once round as two gears turn and catch, and the crystal flares on the stroke.",
  tags: ["arcane", "cast", "time", "clock", "staff", "one-shot"],
  size: [72, 72], origin: [36, 36], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: CHRONO, seed: 4 },
};

export const STROKE = 0.24;

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 99, sparks: [WHITE, C[6], B[5]] }), lights = new Lights();
  let t = 0, struck = false;
  const fade = () => 1 - smooth(0.5, meta.duration - 0.02, t);
  return {
    update(dt) {
      t += dt;
      if (!struck && t >= STROKE) {
        struck = true; lights.add(0, 0, 24, C[5], 0.6, 0.3);
        for (let i = 0; i < 10; i++) { const a = R.range(0, TAU), s = R.range(25, 60); ps.spawn(P.STAR, 0, 0, Math.cos(a) * s, Math.sin(a) * s, R.range(0.2, 0.35), R.chance(0.5) ? WHITE : C[6], 1); }
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade(), u = ease.outBack(clamp(t / 0.2)), r = 15 * u;
      const sweep = clamp(t / STROKE) * TAU;
      gear(p, -14 * u, 13 * u, 5, 8, t * 6, B[4], B[1], f * u);
      gear(p, 15 * u, -12 * u, 4, 7, -t * 7.5, B[3], B[1], f * u);
      p.glow(0, 0, r + 4, C[4], 0.25 * f * u);
      clockFace(p, 0, 0, r, 1, f * u, sweep / 12 + 0.6, sweep, B[5], B[6], C[6]);
      const pre = smooth(0, STROKE, t);
      p.disc(0, 0, 2 + pre, C[5], f); p.dot(0, -1, WHITE, f);
      const v = (t - STROKE) / 0.35;
      if (v > 0 && v < 1) { const k = 1 - v; for (let g = 0; g < TAU; g += 0.05) p.dot(Math.cos(g) * (r + 6 * v + 2), Math.sin(g) * (r + 6 * v + 2), v < 0.3 ? WHITE : C[5], k); }
      ps.draw(p); lights.draw(p);
    },
  };
}
