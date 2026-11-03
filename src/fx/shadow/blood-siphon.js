// 흡혈 의식 (용사 학원 암흑사제 dp_1) — crimson life torn out of the target, wound into an orb above its chest. (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, lerp, TAU, WHITE, sparkle, PAL } from "../../core/index.js";

export const meta = {
  name: "Blood siphon",
  desc: "Crimson threads are torn out of the target's body and spiral up, winding into a throbbing blood orb above its chest that then flies off; drops fall and the threads fray away.",
  tags: ["shadow", "blood", "drain", "lifesteal", "one-shot"],
  size: [80, 100], origin: [40, 88], duration: 1.0, loop: false, fps: 30, bg: "light",
  options: { palette: PAL.blood, seed: 6 },
};

const GATHER = 0.35, OY = -28, NT = 6;
export const LEAVE = GATHER;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[6], C[5], C[4]] }), lights = new Lights();
  const th = Array.from({ length: NT }, (_, i) => ({ a: (i / NT) * TAU, y0: R.range(-22, -4), r: R.range(7, 11), d: i * 0.03 }));
  let t = 0, left = false;
  function thread(p, q) {
    const u = clamp((t - q.d) / GATHER), f = 1 - smooth(GATHER + 0.05, GATHER + 0.35, t);
    if (u <= 0 || f <= 0) return;
    for (let j = 0; j < 18; j++) {
      const v = u - j * 0.03; if (v < 0) break;
      const ang = q.a + v * 7, r = q.r * (1 - v * 0.8), x = Math.cos(ang) * r, y = lerp(q.y0, OY, ease.inOutSine(v)) + Math.sin(ang) * r * 0.3;
      p.dot(x, y, j === 0 ? C[6] : j < 6 ? C[5] : C[3], f * (1 - j / 18));
    }
  }
  return {
    update(dt) {
      t += dt;
      if (t < GATHER && R.chance(dt * 40)) ps.spawn(P.MOTE, R.range(-8, 8), R.range(-24, -4), 0, -R.range(20, 40), R.range(0.25, 0.4), C[5]);
      if (!left && t >= GATHER) { left = true; lights.add(0, OY, 16, C[5], 0.6, 0.15); for (let i = 0; i < 10; i++) ps.spawn(P.SPARK, R.range(-3, 3), OY + R.range(-3, 3), R.range(-40, 40), R.range(-10, 40), R.range(0.25, 0.5)); }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      for (const q of th) thread(p, q);
      const r = t < GATHER ? 1 + 4 * ease.outCubic(t / GATHER) + Math.sin(t * 45) * 0.5 : 0;   // the orb, until it flies off (blood-orb carries it)
      if (r > 0.5) { p.glow(0, OY, r * 3, C[4], 0.45); p.disc(0, OY, r + 1, C[3], 1); p.disc(0, OY, r, C[5], 1); p.dot(-r * 0.4, OY - r * 0.4, C[6], 1); }
      const pulse = (t % 0.12) < 0.05 && t < GATHER;                     // the target's wound throbbing
      if (pulse) p.glow(0, -14, 10, C[5], 0.25);
      if (t >= GATHER && t < GATHER + 0.08) sparkle(p, 0, OY, 4, C[6], C[5], 0.5);
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
