// 내공 순환 (용사 학원 무도가 mo_2 — 공격 · 방어 · 피흡 상승) — golden chi wells up from the floor and circulates round the body in two looping streams,
// gathers at the navel, and flares out in an aura. (0, 0) is the monk's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { INNER } from "./_monk.js";

export const meta = {
  name: "Inner flow",
  desc: "Golden chi wells up from a ring on the floor and circulates round the body in two looping streams, gathers glowing at the navel, then flares out in a shimmering aura.",
  tags: ["impacts", "buff", "chi", "aura", "inner", "one-shot"],
  size: [112, 120], origin: [56, 106], duration: 1.6, loop: false, fps: 30, bg: "light",
  options: { palette: INNER, seed: 9 },
};

export const GATHER = 0.3;
const FLARE = 0.75, NAVEL = -20, SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5]] }), lights = new Lights();
  let t = 0, flared = false;
  const f = () => 1 - smooth(1.25, meta.duration - 0.05, t);
  function stream(p, ph) {                                              // a loop of chi wound round the body: up the back, over, down the front
    const u = smooth(0.05, 0.45, t) * (1 - smooth(FLARE, FLARE + 0.15, t));
    if (u <= 0) return;
    for (let i = 0; i < 70; i++) {
      const v = i / 70, a = v * TAU * 1.5 + ph + t * 6, h = -2 - 46 * v, r = 14 - 4 * Math.sin(v * Math.PI), x = Math.cos(a) * r, z = Math.sin(a);
      const head = ((v * 3 - t * 2.5) % 1 + 1) % 1 < 0.15;
      p.dot(x, h + z * r * SY, head ? WHITE : z > 0 ? C[5] : C[3], u * (z > 0 ? 1 : 0.5) * (0.4 + 0.6 * v));
    }
  }
  return {
    update(dt) {
      t += dt;
      if (!flared && t >= FLARE) { flared = true; lights.add(0, NAVEL, 50, C[5], 0.7, 0.4); for (let i = 0; i < 18; i++) { const a = R.range(0, TAU), s = R.range(40, 120); ps.spawn(P.STAR, 0, NAVEL, Math.cos(a) * s, Math.sin(a) * s, R.range(0.25, 0.5), C[6], 1); } }
      if (t > FLARE && t < 1.3 && R.chance(dt * 26)) ps.spawn(P.EMBER, R.range(-16, 16), -R.range(0, 44), R.range(-5, 5), -R.range(20, 40), R.range(0.4, 0.7), C[R.int(4, 6)], 1);
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const ring = smooth(0, 0.2, t) * f();
      for (let g = 0; g < TAU; g += 0.025) p.dot(Math.cos(g) * 20, Math.sin(g) * 20 * SY, Math.sin(g) > 0 ? C[5] : C[3], ring * 0.8);
      stream(p, 0); stream(p, Math.PI);
      const gk = smooth(GATHER, FLARE, t) * (1 - smooth(FLARE, FLARE + 0.2, t));
      if (gk > 0) { p.glow(0, NAVEL, 10 + 8 * gk, C[5], 0.5 * gk); p.disc(0, NAVEL, 2 + 2 * gk, C[6], gk); }
      const v = (t - FLARE) / 0.6;
      if (v > 0 && v < 1) {                                              // the aura: an egg of gold flaring out round the body
        const s = 1 + 0.3 * ease.outCubic(v), a = (1 - v) * f();
        for (let g = 0; g < TAU; g += 0.02) { const x = Math.cos(g) * 18 * s, y = -24 + Math.sin(g) * 30 * s; p.dot(x, y, v < 0.25 ? WHITE : C[5], a); p.dot(x * 0.92, y * 0.95 - 1, C[4], a * 0.5); }
      }
      if (v > 0 && v < 0.25) sparkle(p, 0, NAVEL, 10 * (1 - v / 0.25), WHITE, C[6], 0.7);
      ps.draw(p); lights.draw(p);
    },
  };
}
