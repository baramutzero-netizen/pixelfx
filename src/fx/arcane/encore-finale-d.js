// encore-finale 의 데포르메 판 (용사 학원 음유시인 bd_u) — chunky: a thick gold stage ring round the ally line, two flat spotlights and a big
// chunky harp popping up behind the line. Four beats (0.4 · 0.8 · 1.2 · 1.6 s) light the strings white, bounce the ring, swell a ripple and pop
// two notes up behind the line; at 2.05 s a big star, five thick gold rays, a white ripple and a little fountain of four notes.
// part: back (ring far half · spotlights · harp · notes behind — under the units) | front (near halves · two confetti notes) | all.
// (0, 0) is the middle of the line's feet; the line is 240 px wide.
import { fit, clamp, ease } from "../../core/index.js";
import { pop, shrink, star, band, capsule, noteC, harpC, HARP, WINE } from "./_chibi_bard.js";
import { BEATS, FINALE } from "./encore-finale.js";

export const meta = {
  name: "Encore finale (chibi)",
  desc: "Chunky: a thick stage ring, flat spotlights and a big harp behind the ally line; four beats light the strings and pop notes up, then a star, gold rays and a fountain of notes.",
  tags: ["arcane", "buff", "area", "ultimate", "music", "bard", "chibi", "one-shot"],
  size: [304, 180], origin: [152, 130], duration: 2.8, loop: false, fps: 30, bg: "ground",
  options: { palette: HARP, part: "all" },
};

const SY = 0.26, RS = 126, LH = 56, HY = -LH * 0.55;

export function create(o) {
  const G = fit(o.palette, 8), W = fit(WINE, 8), BACK = o.part !== "front", FRONT = o.part !== "back";
  const keep = BACK && FRONT ? null : BACK ? (a) => Math.sin(a) <= 0 : (a) => Math.sin(a) > 0;
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const s = pop(t, 0, 0.2) * shrink(t, 2.5, 2.78);
      const beat = BEATS.reduce((a, b) => Math.max(a, t >= b ? 1 - clamp((t - b) / 0.15) : 0), 0), fin = t >= FINALE ? 1 - clamp((t - FINALE) / 0.25) : 0;
      if (s > 0.03) { band(p, 0, 0, (RS + 4 * beat) * s, SY, 4, beat > 0.4 || fin > 0.3 ? G[6] : G[5], W[5], keep); }
      [...BEATS, FINALE].forEach((b, i) => {
        const v = clamp((t - b) / 0.4), k = pop(t, b, 0.08) * shrink(t, b + 0.12, b + 0.4);
        if (k > 0.03) band(p, 0, 0, RS + 6 + 14 * ease.outCubic(v), SY, (i === 4 ? 3.4 : 2.4) * k, i === 4 ? G[7] : G[5], G[6], keep);
      });
      if (BACK) {
        const sw = ease.outCubic(clamp((t - 0.05) / 0.4)), sk = (0.14 + 0.06 * beat + 0.1 * fin) * s;
        for (const sd of [-1, 1]) {
          const tx = sd * 136, ty = -120, bx = sd * (80 - 60 * sw);
          for (let u = 0.25; u <= 1; u += 0.006) { const cx = tx + (bx - tx) * u, hw = 4 + 44 * u, y = ty + (0 - ty) * u; for (let d = -hw; d <= hw; d += 1) p.blend(cx + d, y, G[6], sk); }
        }
        const h = LH * pop(t, 0.1, 0.25) * shrink(t, 2.5, 2.78);
        const lit = (i) => Math.max(...BEATS.map((b) => (t >= b + i * 0.03 ? 1 - clamp((t - b - i * 0.03) / 0.2) : 0)), fin);
        if (h > 6) harpC(p, -4, -2, h, G[5], G[3], G[6], 5, lit);
        BEATS.forEach((b, i) => [0, 1].forEach((j) => {
          const u = clamp((t - b - j * 0.06) / 0.7), k = pop(t, b + j * 0.06, 0.14) * shrink(t, b + j * 0.06 + 0.45, b + j * 0.06 + 0.7);
          const x = (j ? 1 : -1) * (46 + (i % 2) * 34);
          if (k > 0.05) noteC(p, x + Math.sin(u * 5 + i) * 3, -20 - 42 * ease.outCubic(u), 3 * k, j ? W[5] : G[5], W[6], (i + j) % 3 === 0 ? 2 : 1, Math.sin(u * 5) * 1.5);
        }));
        const fr = clamp((t - FINALE) / 0.45), rk = pop(t, FINALE, 0.1) * shrink(t, FINALE + 0.2, FINALE + 0.45);
        if (rk > 0.05) for (let i = 0; i < 5; i++) { const a = Math.PI + ((i + 0.5) / 5) * Math.PI, L = 24 + 46 * ease.outCubic(fr); capsule(p, Math.cos(a) * 14, HY + Math.sin(a) * 12, Math.cos(a) * L, HY + Math.sin(a) * L * 0.7, 2 * rk, i % 2 ? G[5] : G[6], true); }
        const st = pop(t, FINALE, 0.1) * shrink(t, FINALE + 0.1, FINALE + 0.35);
        if (st > 0.03) star(p, 0, HY, 22 * st, G[6], 0.4);
        [-1, -0.35, 0.35, 1].forEach((d, i) => {
          const tt = clamp((t - FINALE) / 0.7) * 0.7, k = pop(t, FINALE + 0.02, 0.12) * shrink(t, FINALE + 0.45, FINALE + 0.7);
          const x = d * 90 * tt, y = HY - 80 * tt * (1 - Math.abs(d) * 0.3) + 150 * tt * tt;
          if (k > 0.05 && y < -8) noteC(p, x, y, 3 * k, i % 2 ? W[5] : G[6], W[6], i === 1 ? 2 : 1, Math.sin(tt * 10) * 1.5);
        });
      }
      if (FRONT) [-60, 56].forEach((x, i) => {
        const u = clamp((t - FINALE - i * 0.08) / 0.6), k = pop(t, FINALE + i * 0.08, 0.14) * shrink(t, FINALE + i * 0.08 + 0.4, FINALE + i * 0.08 + 0.6);
        if (k > 0.05) noteC(p, x + Math.sin(u * 7) * 3, -12 + 8 * u, 2 * k, i ? W[5] : G[6], W[6], 1, Math.sin(u * 7) * 1.2);
      });
    },
  };
}
