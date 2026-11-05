// 마력 강타 (용사 학원 전쟁법사 fm_b — 마력을 두른 주먹을 꽂는다) — a translucent crimson fist of force rushes in from her side and
// slams the chest at 0.1 s: a white starburst, a squashed shock ring, sparks, and the fist breaks into motes. (0, 0) is the target's feet; it faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { FORCE, STAR } from "./_forcemage.js";

export const meta = {
  name: "Force fist",
  desc: "A translucent crimson fist of force rushes in and slams the chest: a white starburst, a squashed shock ring and sparks, then it breaks into motes.",
  tags: ["arcane", "impact", "force", "fist", "one-shot"],
  size: [120, 92], origin: [70, 80], duration: 0.7, loop: false, fps: 30, bg: "dark",
  options: { palette: FORCE, seed: 8 },
};

export const HIT = 0.1;
const CY = -26;

export function create(o) {
  const C = fit(o.palette, 8), S = fit(STAR, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], S[5]] }), lights = new Lights();
  let t = 0, hit = false;
  function fist(p, x, y, k) {                                               // a rounded fist, knuckles to the right, outlined in light
    for (let yy = -11; yy <= 11; yy++) for (let xx = -15; xx <= 10; xx++) {
      const nx = xx / (xx > 0 ? 10 : 15), ny = yy / 11, d = nx * nx * nx * nx + ny * ny * ny * ny;
      if (d > 1) continue;
      const rim = d > 0.6, knuckle = xx > 4 && Math.abs(((yy + 11) % 5.5) - 2.75) < 0.6;
      p.blend(x + xx, y + yy, rim || knuckle ? C[6] : d < 0.2 && yy < 0 ? C[5] : C[4], k * (rim ? 1 : 0.75));
    }
    p.glow(x, y, 18, C[4], 0.35 * k);
  }
  return {
    update(dt) {
      t += dt;
      if (!hit && t >= HIT) {
        hit = true; lights.add(0, CY, 34, C[5], 0.7, 0.25);
        for (let i = 0; i < 12; i++) { const a = R.range(-1.3, 1.3), s = R.range(50, 120); ps.spawn(P.SPARK, 2, CY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.15, 0.3), R.chance(0.4) ? WHITE : C[5], 1); }
        for (let i = 0; i < 6; i++) ps.spawn(P.MOTE, R.range(-16, -4), CY + R.range(-6, 6), R.range(-20, 10), -R.range(10, 30), R.range(0.25, 0.4), C[5], 1);
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      if (t < HIT + 0.12) { const u = clamp(t / HIT), x = -36 + 26 * ease.inCubic(u), k = t < HIT ? 0.5 + 0.5 * u : 1 - (t - HIT) / 0.12; for (let i = 1; i < 3; i++) fist(p, x - i * 7, CY, k * 0.25); fist(p, x, CY, k); }
      const v = (t - HIT) / 0.4;
      if (v > 0 && v < 1) {
        const r = 6 + 22 * ease.outCubic(v), k = 1 - v;
        for (let g = 0; g < TAU; g += 0.5 / r) { p.dot(2 + Math.cos(g) * r * 0.55, CY + Math.sin(g) * r, v < 0.2 ? WHITE : C[5], k); }
      }
      const s = 1 - smooth(HIT, HIT + 0.25, t);
      if (t >= HIT && s > 0) { sparkle(p, 2, CY, 4 + 10 * s, C[6], WHITE, 0.7 * s); p.glow(2, CY, 20, C[4], 0.4 * s); }
      ps.draw(p); lights.draw(p);
    },
  };
}
