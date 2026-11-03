// 궁수 시전 바람 (용사 학원 궁수 시전 모션 — 예전 archerWind 그림) — the bowstring snaps with a flash, a spiral of green wind curls forward off the bow.
// (0, 0) is the archer's chest; faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { WIND } from "./_archer.js";

export const meta = {
  name: "Archer wind",
  desc: "The bowstring snaps with a white flash at the hand, a spiral of green wind curls forward off the bow and unwinds, pale streaks and motes blow away ahead.",
  tags: ["projectiles", "cast", "bow", "wind", "archer", "one-shot"],
  size: [120, 88], origin: [28, 46], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: WIND, seed: 2 },
};

export const HIT = 0.08;
const CX = 10;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 999, sparks: [WHITE, C[6], C[5]] }), lights = new Lights();
  const streaks = Array.from({ length: 6 }, () => ({ y: R.range(-10, 10), d: R.range(0.05, 0.2), len: R.range(10, 22) }));
  let t = 0, snapped = false;
  return {
    update(dt) {
      t += dt;
      if (!snapped && t >= HIT) { snapped = true; lights.add(CX, 0, 22, C[6], 0.7, 0.14); for (let i = 0; i < 8; i++) { const a = R.range(-0.5, 0.5), s = R.range(120, 260); ps.spawn(P.SPARK, CX, 0, Math.cos(a) * s, Math.sin(a) * s, R.range(0.1, 0.22)); } }
      if (t > HIT && t < 0.5 && R.chance(dt * 30)) ps.spawn(P.MOTE, CX + R.range(0, 30), R.range(-8, 8), R.range(60, 120), R.range(-10, 10), R.range(0.3, 0.5), R.chance(0.5) ? C[6] : C[7], 0.7);
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const u = (t - HIT) / 0.55;
      if (u > 0 && u < 1) {                                            // the spiral: a ribbon wound round the flight line, unwinding as it goes
        const L = 80 * ease.outCubic(u), f = 1 - smooth(0.5, 1, u);
        for (let d = 0; d < L; d += 0.4) {
          const v = d / 80, r = 9 * (1 - v * 0.6), a = d * 0.28 - t * 22, x = CX + d, y = Math.sin(a) * r, front = Math.cos(a) > 0;
          p.dot(x, y, front ? (v < 0.3 ? C[7] : C[6]) : C[4], f * (front ? 1 : 0.55) * (1 - v * 0.7));
        }
      }
      for (const q of streaks) { const v = (t - HIT - q.d) / 0.3; if (v < 0 || v > 1) continue; const x0 = CX + 20 + 70 * v; for (let d = 0; d < q.len; d += 0.6) p.dot(x0 - d, q.y, d < 3 ? WHITE : C[5], (1 - v) * (1 - d / q.len)); }
      const g = t - HIT;
      if (g > 0 && g < 0.15) sparkle(p, CX, 0, 7 * (1 - g / 0.15), WHITE, C[6], 0.6);
      if (t < HIT) p.glow(CX, 0, 8, C[5], 0.4 * t / HIT);
      ps.draw(p); lights.draw(p);
    },
  };
}
