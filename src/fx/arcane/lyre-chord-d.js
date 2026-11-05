// lyre-chord 의 데포르메 판 (용사 학원 음유시인 — 기술마다) — chunky: three thick gold strings tremble, at 0.22 s a thick gold ring and a star pop,
// and two chunky rose notes float up and shrink away. (0, 0) is the harp.
import { fit, clamp, ease } from "../../core/index.js";
import { LINE, pop, shrink, star, band, capsule, noteC, HARP, WINE } from "./_chibi_bard.js";
import { RING } from "./lyre-chord.js";

export const meta = {
  name: "Lyre chord (chibi)",
  desc: "Chunky: three thick gold strings tremble, a thick ring and a star pop as the chord rings, and two rose notes float up and shrink away.",
  tags: ["arcane", "cast", "music", "bard", "chibi", "one-shot"],
  size: [72, 72], origin: [32, 44], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: HARP },
};

export function create(o) {
  const G = fit(o.palette, 8), W = fit(WINE, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const s0 = pop(t, 0, 0.12) * shrink(t, 0.45, 0.62);
      for (let i = 0; i < 3; i++) { const x = -3 + i * 3 + Math.sin(t * 60 + i * 2) * 0.8 * clamp(t / RING) * shrink(t, RING, 0.5); if (s0 > 0.05) capsule(p, x, -5 * s0, x, 4 * s0, 0.9, i === 1 ? G[6] : G[5]); }
      const r = pop(t, RING, 0.14) * shrink(t, 0.4, 0.6);
      if (r > 0.02) band(p, 0, 0, 5 + 5 * ease.outCubic(clamp((t - RING) / 0.3)), 1, 2 * r, G[5], G[6]);
      const st = pop(t, RING, 0.1) * shrink(t, RING + 0.06, RING + 0.24);
      if (st > 0.02) star(p, 0, 0, 8 * st, G[6], 0.4);
      [[-8, 0, 1, W[5]], [9, 0.07, 2, G[5]]].forEach(([dx, d, kind, c]) => {
        const k = pop(t, RING + d, 0.14) * shrink(t, 0.6, 0.78), u = clamp((t - RING - d) / 0.5);
        if (k > 0.05) noteC(p, dx + Math.sin(u * 6) * 2, -8 - 20 * ease.outCubic(u), 2 * k, c, kind === 2 ? G[6] : W[6], kind, Math.sin(u * 6) * 1.2);
      });
    },
  };
}
