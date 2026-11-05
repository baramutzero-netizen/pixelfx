// 신성 사제 시전 (용사 학원 신성 사제 — 기술마다 · 예전 holyEssence) — the sapphire gem on her sun staff draws in light, flares,
// and a gold sun-ring of rays turns round it while motes of light drift up. (0, 0) is the gem.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE, glint } from "./_priest.js";

export const meta = {
  name: "Priest prayer",
  desc: "Light is drawn into a sapphire gem from all round, the gem flares in a four-point glint, and a gold ring of sun rays turns about it as motes of light drift upward.",
  tags: ["holy", "cast", "staff", "light", "one-shot"],
  size: [72, 72], origin: [36, 38], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: SAPPHIRE, seed: 3 },
};

export const FLARE = 0.22;

export function create(o) {
  const C = fit(o.palette, 8), G = fit(GOLD, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 99, sparks: [WHITE, C[6], G[5]] }), lights = new Lights();
  const pull = Array.from({ length: 14 }, (_, i) => ({ a: (i / 14) * TAU + R.range(-0.2, 0.2), r: R.range(20, 30), t0: R.range(0, 0.08) }));
  let t = 0, flared = false;
  const fade = () => 1 - smooth(0.5, meta.duration - 0.02, t);
  return {
    update(dt) {
      t += dt;
      if (!flared && t >= FLARE) {
        flared = true; lights.add(0, 0, 26, C[5], 0.6, 0.3);
        for (let i = 0; i < 10; i++) { const a = R.range(0, TAU), s = R.range(20, 55); ps.spawn(P.STAR, 0, 0, Math.cos(a) * s, Math.sin(a) * s - 10, R.range(0.25, 0.45), R.chance(0.5) ? WHITE : G[5], 1); }
      }
      if (t > FLARE && t < 0.5 && R.chance(dt * 22)) ps.spawn(P.MOTE, R.range(-10, 10), R.range(-4, 6), R.range(-4, 4), -R.range(18, 34), R.range(0.2, 0.3), R.chance(0.5) ? C[6] : G[5], 1);
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      for (const q of pull) {                                              // light drawn in to the gem
        const u = clamp((t - q.t0) / (FLARE - q.t0));
        if (u <= 0 || u >= 1) continue;
        const e = ease.inCubic(u), r = q.r * (1 - e);
        for (let d = 0; d < 5; d++) p.dot(Math.cos(q.a) * (r + d), Math.sin(q.a) * (r + d), d ? C[5] : WHITE, (1 - d / 5) * (0.4 + 0.6 * u));
      }
      const pre = smooth(0, FLARE, t);
      p.glow(0, 0, 6 + 6 * pre, C[5], 0.35 * pre * fade());
      p.disc(0, 0, 2.5, t < FLARE ? C[5] : C[6], fade());
      const v = (t - FLARE) / 0.5;
      if (v > 0) {
        const f = fade(), r = 9 + 7 * ease.outCubic(clamp(v)), spin = t * 2.4;
        for (let i = 0; i < 8; i++) {                                     // the sun ring: eight rays, long and short, turning
          const a = spin + (i / 8) * TAU, L = i % 2 ? 4 : 7, c = Math.cos(a), s = Math.sin(a);
          for (let d = 0; d < L; d += 0.5) p.dot(c * (r + d), s * (r + d), d < 1.5 ? G[6] : G[4], f * (1 - d / (L + 1)));
        }
        for (let g = 0; g < TAU; g += 0.08) p.dot(Math.cos(g) * r, Math.sin(g) * r, G[5], f * 0.6);
        if (v < 0.6) glint(p, 0, 0, 13 * (1 - v / 0.6) + 3, C[6], 1 - v / 0.6);
      }
      ps.draw(p); lights.draw(p);
    },
  };
}
