// 베기 (용사 학원 검투사 sw_b — 1103 스물셋째 다시 · 사용자 '베는 방향을 바꾸고 크기는 작게') — one slanted cut from high behind down and forward through the target,
// a hit star on the chest (the old vertical-cleave cut straight down).
// (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, sparkle, TAU, WHITE } from "../../core/index.js";
import { through, slash, shavings, star } from "./_lib.js";
import { STEEL } from "./_gladiator.js";

export const meta = {
  name: "Slant cleave",
  desc: "A steel crescent cuts on a slant from high behind the target down and forward through it, a white star bursts on the chest, a thin cut line lingers along the slant, sparks spray.",
  tags: ["melee", "slash", "sword", "hit", "diagonal", "one-shot"],
  size: [140, 136], origin: [68, 110], duration: 0.85, loop: false, fps: 30, bg: "light",
  options: { palette: STEEL, seed: 7 },
};

export const HIT = 0.08;
const CY = -24;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5], C[4]] }), lights = new Lights();
  // a big circle so the cut is nearly straight: heads down (+y) through the chest, bowed a little forward
  const A = { ...through(0, CY, 0.82, -1, 60, 1.5, 0.5), W: 15, t0: 0, sweep: HIT, hold: 0.06, trail: 0.24, ramp: C, lens: true };
  const spikes = Array.from({ length: 8 }, (_, i) => ({ a: (i / 8) * TAU + (i % 2 ? 0.2 : 0), len: i % 2 ? 8 : 15, w: i % 2 ? 1.4 : 2.4 }));
  let t = 0, hit = false;
  return {
    update(dt) {
      t += dt;
      if (!hit && t >= HIT) {
        hit = true;
        lights.add(0, CY, 40, C[5], 0.9, 0.25); lights.add(0, CY, 14, WHITE, 0.8, 0.08);
        for (let i = 0; i < 22; i++) { const a = R.range(-0.9, 0.9) + (R.chance(0.5) ? 0 : Math.PI), sp = R.range(120, 320); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * sp, Math.sin(a) * sp * 0.6 - 30, R.range(0.12, 0.35)); }
        for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + R.range(-1.1, 1.1), sp = R.range(30, 90); ps.spawn(P.GRIT, R.range(-4, 4), -1, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.3, 0.6), R.pick([C[3], C[2], C[4]]), 1); }
        for (let i = 0; i < 4; i++) ps.spawn(P.DUST, R.range(-6, 6), -1, R.sign() * R.range(10, 30), -R.range(3, 10), R.range(0.4, 0.6), C[3], R.range(2, 3.5));
        shavings(ps, R, A, 12, [C[5], C[6], WHITE]);
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      slash(p, A, t);
      const u = t - HIT;
      if (u >= 0 && u < 0.3) {                                   // the cut line: a white hairline down the body, fading from the ends
        const f = 1 - u / 0.3;
        const ca = Math.cos(0.82), sa = Math.sin(0.82);
        for (let d = -32; d <= 32; d += 0.5) { const e = 1 - Math.abs(d) / 32; p.dot(ca * d, CY + sa * d, e > 0.6 && f > 0.5 ? WHITE : C[6], f * Math.min(1, e * 2)); }   // along the slant
      }
      if (u >= 0 && u < 0.16) { const k = 1 - u / 0.16; star(p, 0, CY, spikes, 0.6 + 0.6 * ease.outBack(Math.min(1, u / 0.05)), k, WHITE, C[5], C[6], C[2]); }
      if (u > 0 && u < 0.3) sparkle(p, Math.cos(0.82) * 30, CY + Math.sin(0.82) * 30, 6 * (1 - u / 0.3), WHITE, C[5], 0.5);
      ps.draw(p); lights.draw(p);
    },
  };
}
