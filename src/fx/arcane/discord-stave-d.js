// discord-stave 의 데포르메 판 (용사 학원 음유시인 bd_2) — chunky: three thick violet staff lines run in just over the enemy heads,
// wobble, and at 0.45 s snap into pieces that tip and drop away; one thick acid ripple swells over the floor and three chunky flats
// bob over the heads. Drawn under the units. (0, 0) is the middle of the line's feet; the line is 240 px wide.
import { Rng, fit, clamp, ease } from "../../core/index.js";
import { pop, shrink, band, capsule, flatC, SOUR } from "./_chibi_bard.js";
import { SET } from "./discord-stave.js";

export const meta = {
  name: "Discord stave (chibi)",
  desc: "Chunky: three thick sour staff lines run across the enemy line, wobble and snap into dropping pieces; an acid ripple swells and three flats bob over the heads.",
  tags: ["arcane", "debuff", "area", "music", "bard", "chibi", "one-shot"],
  size: [304, 170], origin: [152, 124], duration: 1.6, loop: false, fps: 30, bg: "ground",
  options: { palette: SOUR, seed: 21 },
};

const SY = 0.3, HW = 120, Y0 = -72, GAP = 8, SEGS = 9;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const breaks = [0, 1, 2].map(() => [3, 6].map((b) => b + (R.chance(0.5) ? 1 : 0)));
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const run = ease.outCubic(clamp(t / SET)), snap = clamp((t - SET) / 0.55), k = shrink(t, SET + 0.35, SET + 0.6);
      for (let l = 0; l < 3; l++) {
        const y0 = Y0 - l * GAP, bk = breaks[l];
        for (let s = 0; s < SEGS; s++) {
          const piece = s < bk[0] ? 0 : s < bk[1] ? 1 : 2, x0 = -HW + (2 * HW * s) / SEGS, x1 = -HW + (2 * HW * (s + 1)) / SEGS;
          if (x0 > -HW + 2 * HW * run) break;
          const ph = t * 10 + s * 0.9 + l, wob = (Math.sin(ph) * 1.5 + (t > SET - 0.12 ? ((s + l) % 2 ? 2.5 : -2.5) : 0)) * (1 - snap);
          const drop = 80 * snap * snap * (1 + piece * 0.25), tilt = (piece - 1) * 0.3 * snap, pm = -HW + (2 * HW * (piece === 0 ? bk[0] / 2 : piece === 1 ? (bk[0] + bk[1]) / 2 : (bk[1] + SEGS) / 2)) / SEGS;
          const ya = Math.min(-2, y0 + wob + drop + (x0 - pm) * tilt), yb = Math.min(-2, y0 + Math.sin(ph + 0.9) * 1.5 * (1 - snap) + drop + (x1 - pm) * tilt);
          const gap = snap > 0 && (s + 1 === bk[0] || s + 1 === bk[1]) ? 3 : 0;
          if (k > 0.05) capsule(p, x0 + 1, ya, Math.min(-HW + 2 * HW * run, x1) - gap, yb, 1.5 * k, l === 1 ? C[5] : C[4]);
        }
      }
      const v = clamp((t - SET) / 0.6), rk = pop(t, SET, 0.1) * shrink(t, SET + 0.3, SET + 0.6);
      if (rk > 0.03) band(p, 0, 0, 40 + 90 * ease.outCubic(v), SY, 3 * rk, C[5], C[6]);
      [-80, 0, 80].forEach((x, i) => {
        const g = pop(t, SET + i * 0.05, 0.14) * shrink(t, 1.2, 1.45);
        if (g > 0.05) flatC(p, x + Math.sin(t * 9 + i) * 2, -102 + Math.sin(t * 12 + i * 2) * 1.5, 5 * g, C[i === 1 ? 6 : 5]);
      });
    },
  };
}
