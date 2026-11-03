// 백열권 (용사 학원 무도가 필살기 mo_u — 연속 타격 후 자신을 회복) — fists of white heat hammer the target from the front, faster and faster,
// a blur of punch stars, then one last blow blasts it with a white-hot shockwave. (0, 0) is the target's feet; the blows come from the left.
import { Particles, Lights, P, PF, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { HEAT, punchStar } from "./_monk.js";

export const meta = {
  name: "Hundred fists",
  desc: "Fists of white heat hammer the target from the front faster and faster in a blur of punch stars and afterimages, then one last blow blasts it with a white-hot shockwave.",
  tags: ["impacts", "punch", "combo", "ultimate", "fist", "fire", "one-shot"],
  size: [232, 176], origin: [116, 140], duration: 3.0, loop: false, fps: 30, bg: "ground",
  options: { palette: HEAT, seed: 51 },
};

const P0 = 0.5, FINAL = 2.2, CY = -24, SY = 0.32;
// eight hits from 0.5 s to the last blow, each gap 0.8 of the one before — the host hits on each
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 7);
export const HITS = Array.from({ length: 8 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5], C[4]], haze: C[2] }), lights = new Lights();
  const marks = HITS.slice(0, -1).map((h) => ({ h, x: R.range(-8, 6), y: CY + R.range(-12, 10), rot: R.range(0, 1) }));
  const blurs = [];                                                     // the flurry of fists in between the counted hits
  for (let tt = P0 - 0.1; tt < FINAL - 0.05; tt += 0.035 + 0.06 * (1 - tt / FINAL)) blurs.push({ t: tt, x: R.range(-14, 8), y: CY + R.range(-18, 14) });
  let t = 0, j = 0, done = false;
  function fist(p, x, y, a) {                                           // a white-hot fist afterimage thrust in from the left
    for (let d = 0; d < 32; d += 0.6) { const w = 3.4 * (1 - d / 32) + 0.8; for (let o2 = -w; o2 <= w; o2 += 0.6) p.dot(x - 7 - d, y + o2, d < 3 ? WHITE : d < 10 ? C[6] : C[4], a * (1 - d / 32)); }
    p.disc(x - 5, y, 4.6, C[5], a); p.disc(x - 5, y, 3, C[6], a); p.disc(x - 5, y, 1.6, WHITE, a);
  }
  return {
    update(dt) {
      t += dt;
      while (j < HITS.length - 1 && t >= HITS[j]) { const q = marks[j++]; lights.add(q.x, q.y, 30, C[5], 0.6, 0.12); for (let i = 0; i < 8; i++) { const a = R.range(-1.3, 1.3), s = R.range(80, 200); ps.spawn(P.SPARK, q.x, q.y, Math.cos(a) * s, Math.sin(a) * s, R.range(0.1, 0.25)); } }
      if (!done && t >= FINAL) {
        done = true; lights.add(0, CY, 110, C[5], 1, 0.4); lights.add(0, CY, 40, WHITE, 0.9, 0.12);
        for (let i = 0; i < 30; i++) { const a = R.range(-1.4, 1.4), s = R.range(140, 340); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.15, 0.4)); }
        for (let i = 0; i < 12; i++) ps.spawn(P.SMOKE, R.range(0, 20), CY + R.range(-10, 10), R.range(30, 90), R.range(-30, 10), Math.min(R.range(0.5, 0.8), meta.duration - 0.1 - t), R.chance(0.5) ? C[2] : C[1], R.range(5, 9), 0, PF.BIG);
        for (let i = 0; i < 8; i++) ps.spawn(P.DUST, R.range(-10, 10), -1, R.range(20, 70), -R.range(4, 14), R.range(0.5, 0.8), C[3], R.range(3, 5));
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const heat = smooth(P0 - 0.2, FINAL, t) * (1 - smooth(FINAL + 0.1, FINAL + 0.5, t));
      if (heat > 0) p.glow(0, CY, 30 + 20 * heat, C[4], 0.25 * heat);
      for (const b of blurs) { const u = (t - b.t) / 0.09; if (u > 0 && u < 1) fist(p, b.x, b.y, (1 - u) * 0.8); }
      for (const q of marks) { const u = t - q.h; if (u >= 0 && u < 0.12) { punchStar(p, q.x, q.y, 17 * ease.outBack(Math.min(1, u / 0.04)), C[5], 1 - u / 0.12, 8, q.rot); fist(p, q.x, q.y, 1 - u / 0.12); } }
      const u = t - FINAL;
      if (u >= -0.08 && u < 0.05) fist(p, 0, CY, 1);
      if (u >= 0 && u < 0.5) {
        const v = clamp(u / 0.35);
        punchStar(p, 0, CY, 26 * ease.outBack(Math.min(1, u / 0.06)) * (1 - v * 0.3), C[6], 1 - smooth(0.1, 0.3, u), 12);
        const r = 10 + 60 * ease.outCubic(v), a = 1 - v;                // the shockwave: a cone of rings blown out to the right, and one on the floor
        for (let g = -1.2; g <= 1.2; g += 0.6 / r) p.dot(Math.cos(g) * r, CY + Math.sin(g) * r * 0.8, v < 0.25 ? WHITE : C[5], a);
        for (let g = 0; g < TAU; g += 0.02) p.dot(Math.cos(g) * r * 0.8, Math.sin(g) * r * 0.8 * SY, C[4], a);
      }
      if (u > 0 && u < 0.25) sparkle(p, 0, CY, 14 * (1 - u / 0.25), WHITE, C[6], 0.8);
      ps.draw(p); lights.draw(p);
    },
  };
}
