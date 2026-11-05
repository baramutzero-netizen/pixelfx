// note-burst 의 데포르메 판 (용사 학원 음유시인 bd_b) — chunky: a big star pops on the chest, two thick arcs of sound swell out to each side,
// and three chunky notes tumble away and shrink. (0, 0) is the target's feet.
import { Rng, fit, clamp, ease } from "../../core/index.js";
import { pop, shrink, star, band, noteC, HARP, WINE } from "./_chibi_bard.js";

export const meta = {
  name: "Note burst (chibi)",
  desc: "Chunky: a big star pops on the chest, thick arcs of sound swell out to both sides and three notes tumble away and shrink.",
  tags: ["arcane", "impact", "music", "bard", "chibi", "one-shot"],
  size: [88, 88], origin: [44, 76], duration: 0.75, loop: false, fps: 30, bg: "dark",
  options: { palette: WINE, seed: 11 },
};

const CY = -26;

export function create(o) {
  const W = fit(o.palette, 8), G = fit(HARP, 8), R = new Rng(o.seed);
  const bits = [-1, 0, 1].map((i) => { const a = -Math.PI / 2 + i * 0.85 + R.range(-0.1, 0.1); return { vx: Math.cos(a) * 55, vy: Math.sin(a) * 70, kind: i === 0 ? 2 : 1, c: i === 0 ? G[5] : W[5] }; });
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      for (let i = 0; i < 2; i++) {
        const v = clamp((t - i * 0.08) / 0.4), k = pop(t, i * 0.08, 0.1) * shrink(t, 0.2 + i * 0.08, 0.45 + i * 0.08); if (k <= 0.02) continue;
        const r = 8 + 18 * ease.outCubic(v);
        band(p, 0, CY, r, 1, 3 * k, i ? W[5] : G[5], i ? W[6] : G[6], (a) => Math.abs(a) < 0.75 || Math.abs(Math.abs(a) - Math.PI) < 0.75);
      }
      const s = pop(t, 0, 0.08) * shrink(t, 0.08, 0.3);
      if (s > 0.02) star(p, 0, CY, 13 * s, G[6], 0.4);
      for (const b of bits) {
        const tt = clamp((t - 0.04) / 0.68) * 0.68, k = pop(t, 0.04, 0.12) * shrink(t, 0.5, 0.72), x = b.vx * tt, y = Math.min(-6, CY + b.vy * tt + 110 * tt * tt);
        if (k > 0.05) noteC(p, x, y, 2.2 * k, b.c, W[6], b.kind, Math.sin(tt * 10) * 1.5);
      }
    },
  };
}
