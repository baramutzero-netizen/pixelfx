// 쿠나이 — 꽂히는 순간 (용사 학원 무영객 nj_b) — the kunai strikes the chest: an X of water splash, a crimson nick, a burst of ink, the kunai
// hangs a beat, then droplets fall and it all sinks away. (0, 0) is the target's feet.
import { Particles, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, CRIM, kunai } from "./_ninja.js";

export const meta = {
  name: "Kunai strike",
  desc: "A kunai strikes the chest: an X of water splash, a crimson nick and a burst of ink; the kunai hangs a beat, then droplets fall and it sinks away.",
  tags: ["shadow", "impact", "kunai", "water", "one-shot"],
  size: [80, 84], origin: [40, 74], duration: 0.7, loop: false, fps: 30, bg: "dark",
  options: { palette: TIDE, seed: 6 },
};

const CY = -26;

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), R = fit(CRIM, 6), G = new Rng(o.seed);
  const ps = new Particles({ rng: G, ground: () => 0, sparks: [WHITE, C[6]] });
  let t = 0, hit = false;
  return {
    update(dt) {
      t += dt;
      if (!hit) { hit = true; for (let i = 0; i < 10; i++) { const a = G.range(0, TAU), s = G.range(30, 80); ps.spawn(P.MOTE, 0, CY, Math.cos(a) * s, Math.sin(a) * s - 20, G.range(0.3, 0.5), G.chance(0.5) ? C[6] : K[5], 1); } }
      ps.update(dt);
    },
    draw(p) {
      const v = clamp(t / 0.3), k = 1 - smooth(0.25, 0.5, t);
      for (const a of [Math.PI / 4, -Math.PI / 4]) {                       // the X of water
        const L = 8 + 14 * ease.outCubic(v);
        for (let d = -L; d <= L; d += 0.5) { const w = 1.6 * (1 - Math.abs(d) / L); for (let q = -w; q <= w; q += 0.6) p.dot(Math.cos(a) * d - Math.sin(a) * q, CY + Math.sin(a) * d + Math.cos(a) * q, Math.abs(d) < L * 0.3 ? WHITE : C[5], k); }
      }
      if (t < 0.12) p.disc(0, CY, 6 * (1 - t / 0.12) + 2, WHITE, 1);
      const ink = clamp((t - 0.02) / 0.3);
      if (ink > 0 && ink < 1) for (let i = 0; i < 9; i++) { const a = (i / 9) * TAU + 0.3, r = 5 + 12 * ease.outCubic(ink); p.disc(Math.cos(a) * r, CY + Math.sin(a) * r * 0.8, 2.2 * (1 - ink), i % 3 ? K[3] : R[3], 1 - ink); }
      const kk = 1 - smooth(0.35, 0.55, t);                                   // the kunai, stuck a beat
      if (kk > 0) kunai(p, 2, CY - 1, Math.PI * 0.08, 14, K[3], K[6], R[3], kk);
      ps.draw(p);
    },
  };
}
