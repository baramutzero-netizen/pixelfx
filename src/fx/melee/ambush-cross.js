// 급습 (용사 학원 암살자 ro_b — 체력이 가장 적은 적에게 더 아프게) — two quick dagger cuts cross on the target's chest in an X, violet-edged, sparks fly.
// (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, sparkle, TAU, WHITE } from "../../core/index.js";
import { through, slash, shavings, star } from "./_lib.js";
import { SHADE } from "./_rogue.js";

export const meta = {
  name: "Ambush cross",
  desc: "Two fast dagger cuts slash across the target's chest one after the other in an X, white at the edge cooling to violet, a hit star at the crossing, sparks and shadow motes fly.",
  tags: ["melee", "slash", "dagger", "hit", "cross", "one-shot"],
  size: [112, 112], origin: [56, 92], duration: 0.75, loop: false, fps: 30, bg: "light",
  options: { palette: SHADE, seed: 7 },
};

export const HIT = 0.06;
const CY = -24, SECOND = 0.13;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5]] }), lights = new Lights();
  const A = { ...through(0, CY, 0.75, -1, 46, 1.2, 0.5), W: 8, t0: 0, sweep: HIT, hold: 0.04, trail: 0.2, ramp: C, lens: true };
  const B = { ...through(0, CY, 2.39, 1, 46, 1.2, 0.5), W: 8, t0: SECOND - HIT, sweep: HIT, hold: 0.04, trail: 0.2, ramp: C, lens: true };
  const spikes = Array.from({ length: 8 }, (_, i) => ({ a: (i / 8) * TAU + 0.39, len: i % 2 ? 7 : 13, w: i % 2 ? 1.2 : 2 }));
  let t = 0, n = 0;
  return {
    update(dt) {
      t += dt;
      for (const [at, S] of [[HIT, A], [SECOND, B]]) if (n < 2 && t >= at && ((at === HIT && n === 0) || (at === SECOND && n === 1))) {
        n++; lights.add(0, CY, 30, C[6], 0.7, 0.18);
        for (let i = 0; i < 12; i++) { const a = R.range(0, TAU), s = R.range(80, 220); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * s, Math.sin(a) * s * 0.7, R.range(0.1, 0.28)); }
        shavings(ps, R, S, 8, [C[5], C[6], WHITE]);
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      slash(p, A, t); slash(p, B, t);
      const u = t - SECOND;
      if (u >= 0 && u < 0.15) star(p, 0, CY, spikes, 0.5 + 0.5 * ease.outBack(Math.min(1, u / 0.05)), 1 - u / 0.15, WHITE, C[5], C[6], C[2]);
      if (u > 0 && u < 0.25) sparkle(p, 0, CY, 7 * (1 - u / 0.25), WHITE, C[6], 0.5);
      ps.draw(p); lights.draw(p);
    },
  };
}
