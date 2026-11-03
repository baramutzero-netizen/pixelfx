// 관통 화살 (용사 학원 궁수 ar_1 — 적 전체를 꿰뚫는다) — one glowing arrow tears straight through the whole enemy line from the archer's side,
// a tunnel of green wind spirals in its wake and bursts ring out as it passes. The canvas is the 5-slot formation's floor; faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { WIND } from "./_archer.js";

export const meta = {
  name: "Pierce shot",
  desc: "One glowing arrow tears straight through the whole line from the left, a tunnel of green wind spirals in its wake, rings burst out along it as it passes, and the gale fades.",
  tags: ["projectiles", "arrow", "pierce", "wind", "aoe", "line", "one-shot"],
  size: [344, 128], origin: [172, 104], duration: 1.3, loop: false, fps: 30, bg: "ground",
  options: { palette: WIND, reach: 130, seed: 6 },
};

const CY = -24, GO = 0.08, ACROSS = 0.32, SY = 0.32;
export const HIT = GO;

export function create(o) {
  const C = fit(o.palette, 8), RX = o.reach, R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5]] }), lights = new Lights();
  const X0 = -RX - 30, X1 = RX + 40, rings = [-90, -45, 0, 45, 90].map((x) => ({ x, done: false }));
  let t = 0;
  const head = () => X0 + (X1 - X0) * clamp((t - GO) / ACROSS);
  return {
    update(dt) {
      t += dt;
      const h = head();
      for (const q of rings) if (!q.done && h >= q.x) {
        q.done = true; q.t0 = t; lights.add(q.x, CY, 26, C[6], 0.6, 0.15);
        for (let i = 0; i < 8; i++) { const a = R.range(-0.7, 0.7) + (R.chance(0.5) ? 0 : Math.PI), s = R.range(60, 160); ps.spawn(P.SPARK, q.x, CY, Math.cos(a) * s * 0.6 + 60, Math.sin(a) * s, R.range(0.1, 0.25)); }
      }
      if (t > GO && t < GO + ACROSS && R.chance(dt * 60)) ps.spawn(P.MOTE, h - R.range(0, 20), CY + R.range(-6, 6), R.range(20, 80), R.range(-10, 10), R.range(0.3, 0.6), R.chance(0.5) ? C[6] : C[7], 0.7);
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const h = head(), f = 1 - smooth(0.7, meta.duration - 0.05, t);
      if (t < GO) p.glow(X0 + 10, CY, 14, C[5], 0.6 * t / GO);
      if (t > GO) {
        const tail = Math.max(X0, h - 340);
        for (let x = tail; x < Math.min(h, X1); x += 0.5) {                        // the bright trail and the spiral of wind round it
          const age = (h - x) / 340, k = f * (1 - age);
          p.dot(x, CY, age < 0.05 ? WHITE : C[6], k);
          const a = x * 0.18 - t * 30, r = 6 * (1 - age * 0.5) + 2, y = CY + Math.sin(a) * r, front = Math.cos(a) > 0;
          p.dot(x, y, front ? C[6] : C[4], k * (front ? 0.9 : 0.5));
          if ((x | 0) % 3 === 0) p.dot(x, Math.sin(a) * r * SY * 0.5, C[3], k * 0.4);   // its shadow on the floor
        }
        if (h < X1) { p.tri(h, CY - 3, h, CY + 3, h + 7, CY, WHITE); p.glow(h, CY, 12, C[6], 0.6); }
      }
      for (const q of rings) if (q.done) { const v = (t - q.t0) / 0.35; if (v < 1) { const r = 4 + 16 * ease.outCubic(v); for (let g = 0; g < TAU; g += 0.6 / r) p.dot(q.x + Math.cos(g) * r * 0.45, CY + Math.sin(g) * r, v < 0.3 ? WHITE : C[5], 1 - v); } }
      ps.draw(p); lights.draw(p);
    },
  };
}
