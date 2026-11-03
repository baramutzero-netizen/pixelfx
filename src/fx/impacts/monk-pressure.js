// 무도가 기세 (용사 학원 무도가 시전 모션 — 예전 monkPressure 그림) — the fist draws back and a ring of pressure snaps out in front, chi wisps whirl round the hand.
// (0, 0) is the monk's chest; faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { CHI } from "./_monk.js";

export const meta = {
  name: "Monk pressure",
  desc: "Chi wisps whirl in round the fist, it clenches with a flash and a ring of pressure snaps out in front of it, air lines streak forward and fade.",
  tags: ["impacts", "cast", "chi", "pressure", "fist", "one-shot"],
  size: [112, 96], origin: [36, 50], duration: 0.75, loop: false, fps: 30, bg: "dark",
  options: { palette: CHI, seed: 3 },
};

export const HIT = 0.16;
const CX = 10;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 999, sparks: [WHITE, C[6], C[5]] }), lights = new Lights();
  const wisps = Array.from({ length: 5 }, (_, i) => ({ a: (i / 5) * TAU, r: R.range(14, 20) }));
  let t = 0, snap = false;
  return {
    update(dt) {
      t += dt;
      if (!snap && t >= HIT) { snap = true; lights.add(CX, 0, 24, C[5], 0.7, 0.15); for (let i = 0; i < 10; i++) { const a = R.range(-0.8, 0.8), s = R.range(100, 220); ps.spawn(P.SPARK, CX + 4, 0, Math.cos(a) * s, Math.sin(a) * s, R.range(0.1, 0.25)); } }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      for (const q of wisps) {                                           // wisps spiralling in to the fist
        const u = clamp(t / HIT);
        if (u >= 1) continue;
        const r = q.r * (1 - ease.inQuad(u)), g = q.a + u * 4;
        for (let d = 0; d < 6; d++) { const gg = g - d * 0.12, rr = r + d * 1.2; p.dot(CX + Math.cos(gg) * rr, Math.sin(gg) * rr * 0.8, d < 2 ? C[6] : C[4], 1 - d / 6); }
      }
      if (t < HIT) p.glow(CX, 0, 10, C[4], 0.5 * t / HIT);
      const v = (t - HIT) / 0.35;
      if (v > 0 && v < 1) {                                              // the pressure ring snapping out, seen edge-on, and air lines ahead
        const r = 6 + 22 * ease.outCubic(v), a = 1 - v;
        for (let g = 0; g < TAU; g += 0.6 / r) p.dot(CX + 8 + Math.cos(g) * r * 0.35, Math.sin(g) * r, v < 0.3 ? WHITE : C[5], a);
        for (let i = 0; i < 5; i++) { const y = (i - 2) * 5, x0 = CX + 12 + 50 * ease.outCubic(v); for (let d = 0; d < 14; d += 0.6) p.dot(x0 - d, y, d < 3 ? WHITE : C[5], a * (1 - d / 14)); }
      }
      if (v > 0 && v < 0.4) sparkle(p, CX + 4, 0, 7 * (1 - v / 0.4), WHITE, C[6], 0.6);
      ps.draw(p); lights.draw(p);
    },
  };
}
