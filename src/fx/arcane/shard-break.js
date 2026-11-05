// 시간 파편 — 깨지는 순간 (용사 학원 시마도사 tm_b) — where the shard strikes the chest: a ring of cracked time splits open round it
// (a broken clock rim, its pieces flung a little apart), glass splinters scatter, and a frozen after-image of the flash lingers a beat. (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS } from "./_chrono.js";

export const meta = {
  name: "Shard break",
  desc: "Where a time shard strikes the chest, a cracked clock rim splits open round it in drifting pieces, glass splinters scatter and a frozen echo of the flash lingers a beat.",
  tags: ["arcane", "impact", "time", "shatter", "one-shot"],
  size: [80, 88], origin: [40, 76], duration: 0.75, loop: false, fps: 30, bg: "dark",
  options: { palette: CHRONO, seed: 7 },
};

const CY = -26, NP = 8;

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], B[5]] }), lights = new Lights();
  const pieces = Array.from({ length: NP }, (_, i) => ({ a0: (i / NP) * TAU + R.range(0, 0.2), w: R.range(0.45, 0.65), spin: R.range(-2, 2) }));
  let t = 0, hit = false;
  return {
    update(dt) {
      t += dt;
      if (!hit) {
        hit = true; lights.add(0, CY, 30, C[5], 0.7, 0.25);
        for (let i = 0; i < 14; i++) { const a = R.range(0, TAU), s = R.range(40, 110); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.15, 0.35), R.chance(0.5) ? WHITE : C[6], 1); }
        for (let i = 0; i < 6; i++) ps.spawn(P.FLAKE, R.range(-6, 6), CY, R.range(-40, 40), R.range(-50, -10), R.range(0.35, 0.6), C[5], 1);
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const e = ease.outCubic(clamp(t / 0.35)), k = 1 - smooth(0.3, 0.7, t), r = 9 + 10 * e;
      for (const q of pieces) {                                            // the broken rim: arcs drifting apart
        const a0 = q.a0 + q.spin * t * 0.3, d = r + 4 * e;
        for (let g = a0; g < a0 + q.w; g += 0.04) { p.dot(Math.cos(g) * d, CY + Math.sin(g) * d, B[5], k); p.dot(Math.cos(g) * (d - 1.2), CY + Math.sin(g) * (d - 1.2), B[3], k * 0.7); }
        const tg = a0 + q.w / 2; for (let s = 0; s < 3; s += 0.5) p.dot(Math.cos(tg) * (d - 2 - s), CY + Math.sin(tg) * (d - 2 - s), B[6], k);
      }
      const fl = 1 - smooth(0, 0.18, t);
      if (fl > 0) { p.glow(0, CY, 18, C[5], 0.6 * fl); p.disc(0, CY, 5 * fl + 1, WHITE, fl); }
      const echo = smooth(0.12, 0.18, t) * (1 - smooth(0.32, 0.45, t));    // the frozen echo: a flat flash held still a beat
      if (echo > 0) for (let g = 0; g < TAU; g += 0.08) p.dot(Math.cos(g) * 6, CY + Math.sin(g) * 6, C[6], echo * 0.8);
      ps.draw(p); lights.draw(p);
    },
  };
}
