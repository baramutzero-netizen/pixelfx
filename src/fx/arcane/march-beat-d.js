// march-beat 의 데포르메 판 (용사 학원 음유시인 bd_1) — chunky: a thick gold drum ring at the feet bounces on three beats (0.3 · 0.6 · 0.9 s),
// each beat swells one ripple band, pushes one thick forward chevron through her and pops one note up.
// part: back (ring and ripple far halves — under the unit) | front (near halves · chevron · note) | all. (0, 0) is her feet, facing right.
import { fit, clamp, ease } from "../../core/index.js";
import { LINE, pop, shrink, band, solid, noteC, HARP, WINE } from "./_chibi_bard.js";
import { BEATS } from "./march-beat.js";

export const meta = {
  name: "March beat (chibi)",
  desc: "Chunky: a thick gold drum ring at the feet bounces on three beats, each swelling a ripple, pushing a forward chevron through the body and popping a note up.",
  tags: ["arcane", "buff", "haste", "music", "bard", "chibi", "one-shot"],
  size: [132, 112], origin: [62, 92], duration: 1.2, loop: false, fps: 30, bg: "ground",
  options: { palette: HARP, part: "all" },
};

const SY = 0.32;
const segD = (px, py, x0, y0, x1, y1) => { const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy || 1, u = clamp(((px - x0) * dx + (py - y0) * dy) / L); return Math.hypot(px - x0 - dx * u, py - y0 - dy * u); };

/** A thick forward chevron (>) with its tip at (x, y), arm q, thickness r. */
function chevR(p, x, y, q, r, fill, hi) {
  solid(p, x - q - r, y - q - r, x + r, y + q + r, (px, py) => {
    const a = segD(px, py, x - q, y - q, x, y), b = segD(px, py, x, y, x - q, y + q);
    if (Math.min(a, b) > r) return 0;
    return a <= r * 0.45 && py < y ? hi : fill;
  });
}

export function create(o) {
  const G = fit(o.palette, 8), W = fit(WINE, 8), BACK = o.part !== "front", FRONT = o.part !== "back";
  const keep = BACK && FRONT ? null : BACK ? (a) => Math.sin(a) <= 0 : (a) => Math.sin(a) > 0;
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const end = shrink(t, 0.98, 1.17), s = pop(t, 0, 0.16) * end;
      const bounce = BEATS.reduce((a, b) => Math.max(a, t >= b ? 1 - clamp((t - b) / 0.14) : 0), 0);
      if (s > 0.03) band(p, 0, 0, (20 + 3 * bounce) * s, SY, 3.4, bounce > 0.4 ? G[6] : G[5], W[5], keep);
      BEATS.forEach((b, i) => {
        const v = clamp((t - b) / 0.35), k = pop(t, b, 0.08) * shrink(t, b + 0.1, b + 0.35) * end;
        if (k > 0.03) band(p, 0, 0, 24 + 16 * ease.outCubic(v), SY, 2.2 * k, G[5], G[6], keep);
        if (!FRONT) return;
        const c = clamp((t - b) / 0.4), ck = pop(t, b, 0.1) * shrink(t, b + 0.2, b + 0.4) * end;
        if (ck > 0.05) chevR(p, 6 + 22 * ease.outCubic(c), -22 - (i % 2) * 6, 5 * ck, 1.6, G[5], G[6]);
        const n = clamp((t - b) / 0.5), nk = pop(t, b + 0.03, 0.12) * shrink(t, b + 0.32, b + 0.5) * end;
        if (nk > 0.05) noteC(p, 8 + 10 * n, -14 - 40 * ease.outCubic(n), 2.2 * nk, i === 1 ? G[5] : W[5], W[6], i === 1 ? 2 : 1, 1);
      });
    },
  };
}
