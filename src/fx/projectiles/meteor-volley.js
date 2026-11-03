// 유성 화살 (용사 학원 궁수 필살기 ar_u — 확정 치명의 일격) — the sky over the target burns, seven fire arrows rain down on it faster and faster,
// then one great meteor arrow crashes into it in a fireball. (0, 0) is the target's feet; the arrows come down from the upper left.
import { Particles, Lights, P, PF, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { EMBER } from "./_archer.js";

export const meta = {
  name: "Meteor volley",
  desc: "The sky over the target burns, seven fire arrows rain down on it faster and faster bursting in flame, then one great meteor arrow crashes into it in a fireball.",
  tags: ["projectiles", "arrow", "fire", "meteor", "ultimate", "one-shot"],
  size: [280, 256], origin: [140, 216], duration: 3.1, loop: false, fps: 30, bg: "ground",
  options: { palette: EMBER, seed: 41 },
};

const P0 = 0.5, FINAL = 2.2, FALL = 0.12, CY = -22, SY = 0.32;
// seven arrows from 0.5 s to the meteor, each gap 0.8 of the one before — the host hits on each
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 7);
export const HITS = Array.from({ length: 8 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5], C[4]], haze: C[2] }), lights = new Lights(), scorch = [];
  const arrows = HITS.slice(0, -1).map((h) => ({ h, sx: R.range(-110, -60), sy: R.range(-180, -150), ex: R.range(-8, 8), ey: CY + R.range(-8, 10), done: false }));
  let t = 0, boom = false;
  const burst = (x, y, k) => {
    lights.add(x, y, 30 * k, C[5], 0.7, 0.2);
    for (let i = 0; i < 14 * k; i++) { const a = R.range(0, TAU), s = R.range(50, 160) * k; ps.spawn(P.SPARK, x, y, Math.cos(a) * s, Math.sin(a) * s * 0.8 - 20, R.range(0.15, 0.35)); }
    for (let i = 0; i < 4 * k; i++) ps.spawn(P.SMOKE, x + R.range(-4, 4), y + R.range(-4, 4), R.range(-15, 15), -R.range(15, 35), Math.min(R.range(0.4, 0.7), meta.duration - 0.1 - t), C[1], R.range(3, 5) * k);
    for (let i = 0; i < 3 * k; i++) ps.spawn(P.EMBER, x, y, R.range(-30, 30), -R.range(20, 60), Math.min(R.range(0.4, 0.8), meta.duration - 0.1 - t), C[5], 1);
    scorch.push({ x: x + R.range(-4, 4), t0: t, w: 6 * k });
  };
  function arrow(p, q, big) {
    const u = (t - (q.h - FALL * (big ? 1.6 : 1))) / (FALL * (big ? 1.6 : 1));
    if (u < 0 || u > 1) return;
    const x = q.sx + (q.ex - q.sx) * ease.inQuad(u), y = q.sy + (q.ey - q.sy) * ease.inQuad(u), dx = q.ex - q.sx, dy = q.ey - q.sy, L = Math.hypot(dx, dy), nx = dx / L, ny = dy / L;
    const tail = big ? 60 : 30, w = big ? 4 : 1.4;
    for (let d = 0; d < tail; d += 0.5) { const v = d / tail, ww = w * (1 - v); for (let o2 = -ww; o2 <= ww; o2 += 0.6) p.dot(x - nx * d - ny * o2, y - ny * d + nx * o2, v < 0.15 ? WHITE : v < 0.4 ? C[6] : v < 0.7 ? C[5] : C[3], 1 - v * 0.6); }
    p.glow(x, y, big ? 26 : 10, C[5], big ? 0.8 : 0.5);
  }
  return {
    update(dt) {
      t += dt;
      for (const q of arrows) if (!q.done && t >= q.h) { q.done = true; burst(q.ex, q.ey, 0.9); }
      if (!boom && t >= FINAL) {
        boom = true; lights.add(0, CY, 120, C[5], 1, 0.5); lights.add(0, CY, 50, WHITE, 0.8, 0.12); burst(0, CY, 2.6);
        for (let i = 0; i < 16; i++) ps.spawn(P.SMOKE, R.range(-30, 30), CY + R.range(-10, 10), R.range(-40, 40), -R.range(20, 60), Math.min(R.range(0.6, 0.9), meta.duration - 0.1 - t), R.chance(0.5) ? C[1] : C[2], R.range(6, 10), 0, PF.BIG);
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const sky = smooth(0, 0.4, t) * (1 - smooth(FINAL + 0.3, FINAL + 0.8, t));          // the burning sky up and to the left
      if (sky > 0) { p.glow(-80, -168, 60, C[4], 0.35 * sky); p.glow(-80, -168, 26, C[6], 0.25 * sky); }
      for (const s of scorch) { const a = (1 - smooth(0.4, 1.2, t - s.t0)) * (1 - smooth(FINAL + 0.5, meta.duration - 0.05, t)); for (let x = -s.w; x <= s.w; x++) p.dot(s.x + x, 0, t - s.t0 < 0.15 ? C[6] : C[1], a * (1 - Math.abs(x) / (s.w + 1))); }
      for (const q of arrows) arrow(p, q, false);
      arrow(p, { h: FINAL, sx: -118, sy: -196, ex: 0, ey: CY }, true);
      const u = t - FINAL;
      if (u >= 0 && u < 0.5) {                                          // the fireball and its ring on the floor
        const r = 8 + 34 * ease.outCubic(clamp(u / 0.25)), a = 1 - smooth(0.15, 0.5, u);
        p.disc(0, CY, r * 0.7, C[5], a * 0.8); p.disc(0, CY, r * 0.45, C[6], a); p.disc(0, CY, r * 0.2, WHITE, a);
        for (let g = 0; g < TAU; g += 0.02) p.dot(Math.cos(g) * r * 1.4, Math.sin(g) * r * 1.4 * SY, C[5], a);
      }
      if (u > 0 && u < 0.25) sparkle(p, 0, CY, 14 * (1 - u / 0.25), WHITE, C[6], 0.8);
      ps.draw(p); lights.draw(p);
    },
  };
}
