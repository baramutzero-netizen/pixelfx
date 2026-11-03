// 암살자 시전 신호 (용사 학원 암살자 시전 모션 — 예전 rogueSignal 그림) — a dagger flicks and glints in the hand, violet smoke curls off it.
// (0, 0) is the rogue's chest; faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { SHADE, EDGE } from "./_rogue.js";

export const meta = {
  name: "Rogue sign",
  desc: "A dagger flicks round in the hand with a thin steel arc, glints white at the tip, and violet smoke curls off the blade and drifts away.",
  tags: ["melee", "cast", "dagger", "shadow", "smoke", "one-shot"],
  size: [88, 100], origin: [30, 52], duration: 0.75, loop: false, fps: 30, bg: "dark",
  options: { palette: SHADE, edge: EDGE, seed: 5 },
};

const CX = 10, CY = 2, FLICK = 0.14;
export const HIT = FLICK;

export function create(o) {
  const C = fit(o.palette, 8), Ed = fit(o.edge, 6), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 999, sparks: [WHITE, Ed[4], C[6]] }), lights = new Lights();
  let t = 0, done = false;
  const ang = () => -2.2 + 3.4 * ease.outExpo(clamp(t / FLICK));       // the blade's angle as it flicks round
  function blade(p, a, f) {
    const nx = -Math.sin(a), ny = Math.cos(a);
    for (let d = -3; d < 13; d += 0.5) { const x = CX + Math.cos(a) * d, y = CY + Math.sin(a) * d, blade = d > 1; p.dot(x, y, d < 1 ? C[3] : d > 10 ? Ed[5] : Ed[4], f); if (blade && d < 9) { p.dot(x + nx, y + ny, Ed[2], f); p.dot(x - nx * 0.6, y - ny * 0.6, Ed[5], f); } }
    p.line(CX + nx * 2.5, CY + ny * 2.5, CX - nx * 2.5, CY - ny * 2.5, C[4], f);   // the cross-guard
  }
  return {
    update(dt) {
      t += dt;
      if (!done && t >= FLICK) { done = true; const a = ang(); lights.add(CX + Math.cos(a) * 11, CY + Math.sin(a) * 11, 16, Ed[4], 0.6, 0.12); for (let i = 0; i < 6; i++) { const q = a + R.range(-0.5, 0.5), s = R.range(80, 180); ps.spawn(P.SPARK, CX + Math.cos(a) * 11, CY + Math.sin(a) * 11, Math.cos(q) * s, Math.sin(q) * s, R.range(0.1, 0.25)); } }
      if (t < 0.32 && R.chance(dt * 40)) { const a = ang(), d = R.range(2, 10); ps.spawn(P.SMOKE, CX + Math.cos(a) * d, CY + Math.sin(a) * d, R.range(-10, 10), -R.range(8, 25), Math.min(R.range(0.3, 0.45), meta.duration - 0.05 - t), C[R.int(2, 4)], R.range(2, 3.5)); }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = 1 - smooth(0.45, 0.7, t), a = ang();
      for (let g = -2.2; g < a; g += 0.04) { const k = (g + 2.2) / (a + 2.2 + 1e-3); p.dot(CX + Math.cos(g) * 12, CY + Math.sin(g) * 12, k > 0.85 ? WHITE : Ed[3], f * k * (1 - smooth(FLICK, FLICK + 0.25, t))); }
      blade(p, a, f);
      const g = t - FLICK;
      if (g > 0 && g < 0.2) sparkle(p, CX + Math.cos(a) * 11, CY + Math.sin(a) * 11, 7 * (1 - g / 0.2), WHITE, C[6], 0.6);
      ps.draw(p); lights.draw(p);
    },
  };
}
