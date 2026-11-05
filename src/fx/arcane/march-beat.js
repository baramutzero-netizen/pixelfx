// 진군가 (용사 학원 음유시인 bd_1 — 가속) — a marching drum beats at an ally's feet: a gold drum-skin ring on the floor thumps three times
// (0.3 · 0.6 · 0.9 s), each beat rolls a ripple out, sends a rose note marching up and forward and pushes forward chevrons and speed lines through her.
// part: back (floor ring's far half · ripples' far half · speed lines — under the unit) | front (near halves · chevrons · notes) | all. (0, 0) is her feet, facing right.
import { fit, clamp, smooth, ease, WHITE } from "../../core/index.js";
import { HARP, WINE, note, floorRing } from "./_bard.js";

export const meta = {
  name: "March beat",
  desc: "A gold drum-skin ring at the feet thumps three beats; each rolls a ripple out, sends a note marching up and forward and pushes chevrons and speed lines forward through the body.",
  tags: ["arcane", "buff", "haste", "music", "bard", "one-shot"],
  size: [132, 112], origin: [62, 92], duration: 1.2, loop: false, fps: 30, bg: "ground",
  options: { palette: HARP, part: "all" },
};

export const BEATS = [0.3, 0.6, 0.9];
const SY = 0.32;

export function create(o) {
  const G = fit(o.palette, 8), W = fit(WINE, 8), BACK = o.part !== "front", FRONT = o.part !== "back";
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const inn = ease.outCubic(clamp(t / 0.25)), out = 1 - smooth(0.95, 1.17, t);
      const thump = BEATS.reduce((a, b) => Math.max(a, t >= b ? 1 - clamp((t - b) / 0.12) : 0), 0);
      const r = 20 * inn + 2 * thump, half = BACK && FRONT ? null : BACK ? "back" : "front";
      floorRing(p, 0, 0, r, SY, thump > 0.3 ? G[6] : G[5], out, half, 1.4);
      floorRing(p, 0, 0, r - 3, SY, W[4], 0.7 * out, half);
      if (BACK) p.glow(0, 0, 16, G[4], (0.15 + 0.35 * thump) * out);
      BEATS.forEach((b, i) => {
        const v = clamp((t - b) / 0.4);
        if (v > 0 && v < 1) floorRing(p, 0, 0, r + 22 * ease.outCubic(v), SY, G[5], (1 - v) * out, half);
        if (BACK && v > 0 && v < 1) for (let s = 0; s < 4; s++) { const y = -8 - s * 9 - (i % 2) * 4, x = -20 + 46 * ease.outCubic(v) - s * 4; p.line(x, y, x + 10 + 6 * (1 - v), y, s % 2 ? W[5] : G[5], (1 - v) * 0.8 * out); }
        if (!FRONT) return;
        const c = clamp((t - b) / 0.45);
        if (c > 0 && c < 1) for (let s = 0; s < 3; s++) {                  // chevrons pushing forward
          const x = 4 + s * 7 + 18 * ease.outCubic(c), y = -20 - i * 4, k = (1 - c) * (s === 2 ? 1 : 0.7) * out, q = 4;
          p.line(x - q, y - q, x, y, s === 2 ? G[6] : G[5], k); p.line(x, y, x - q, y + q, s === 2 ? G[6] : G[5], k);
          p.line(x - q - 1, y - q, x - 1, y, G[3], k * 0.6); p.line(x - 1, y, x - q - 1, y + q, G[3], k * 0.6);
        }
        const n = clamp((t - b) / 0.55);
        if (n > 0 && n < 1) note(p, 6 + i * 3 + 16 * n, -10 - 46 * ease.outCubic(n), 1.6, i === 1 ? G[5] : W[5], WHITE, (n < 0.15 ? n / 0.15 : 1 - smooth(0.6, 1, n)) * out, i === 1 ? 2 : 1, 1.5);
      });
      if (FRONT && thump > 0.6) p.disc(0, 0, 2, WHITE, thump);
    },
  };
}
