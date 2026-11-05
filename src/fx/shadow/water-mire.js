// 수둔·수렁 (용사 학원 무영객 nj_1 — 적 전체 속도 하락) — under the enemy line dark water spreads into a mire, rings ripple over it, bubbles
// rise, and six tendrils of water curl up from it and grip the ankles. (0, 0) is the middle of the enemy line's floor.
import { Particles, P, Rng, fit, clamp, smooth, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, ripple } from "./_ninja.js";

export const meta = {
  name: "Water mire",
  desc: "Dark water spreads into a mire under a line of enemies, rings ripple over it, bubbles rise and six tendrils of water curl up to grip their ankles.",
  tags: ["shadow", "debuff", "slow", "water", "aoe", "one-shot"],
  size: [304, 140], origin: [152, 96], duration: 2.0, loop: false, fps: 30, bg: "ground",
  options: { palette: TIDE, seed: 11, reach: 120 },
};

export const GRIP = 0.4;
const SY = 0.32, NT = 6;

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), RX = o.reach, R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6]] });
  const tend = Array.from({ length: NT }, (_, i) => ({ x: lerp(-RX * 0.82, RX * 0.82, i / (NT - 1)) + R.range(-6, 6), y: R.range(-4, 6), h: R.range(16, 24), dir: i % 2 ? 1 : -1, t0: GRIP - 0.12 + R.range(0, 0.08) }));
  let t = 0;
  const fade = () => 1 - smooth(1.55, meta.duration - 0.03, t);
  return {
    update(dt) {
      t += dt;
      if (t > 0.2 && t < 1.4 && R.chance(dt * 10)) { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX * 0.9; ps.spawn(P.MOTE, Math.cos(a) * d, Math.sin(a) * d * SY, 0, -R.range(10, 20), R.range(0.3, 0.5), C[6], 1); }
      ps.update(dt);
    },
    draw(p) {
      const f = fade(), u = ease.outCubic(clamp(t / 0.35)) * f;
      if (u > 0) {
        const rx = RX * u, ry = rx * SY;                                     // the mire: a dark pool, lighter rim
        p.shade(-rx - 2, -ry - 2, rx + 2, ry + 2, (x, y, out) => {
          const d = Math.hypot(x / rx, y / ry); if (d > 1) return;
          out.a = f * (d > 0.9 ? 0.75 : 0.5); return d > 0.9 ? C[4] : d > 0.6 ? C[2] : K[2];
        });
        for (let i = 0; i < 3; i++) { const v = ((t * 0.9 + i / 3) % 1); ripple(p, (i - 1) * RX * 0.3, 0, 6 + 30 * v, SY, C[5], (1 - v) * 0.8 * f); }
      }
      for (const q of tend) {                                               // tendrils curling up to grip
        const a = t - q.t0; if (a < 0) continue;
        const up = ease.outBack(clamp(a / 0.25)), k = f;
        for (let s = 0; s < q.h * up; s += 0.5) {
          const v = s / q.h, x = q.x + q.dir * Math.sin(v * 3.2) * 5 * v, y = q.y - s, w = 2.4 * (1 - v * 0.7);
          for (let o = -w; o <= w; o += 0.7) p.dot(x + o, y, o < -w * 0.4 ? C[6] : o > w * 0.4 ? C[3] : C[4], k);
        }
        if (up > 0.9) p.dot(q.x + q.dir * Math.sin(3.2) * 5, q.y - q.h, WHITE, k);
      }
      ps.draw(p);
    },
  };
}
