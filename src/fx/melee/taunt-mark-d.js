// 도발 — 표식 · 데포르메 (용사 학원 검투사 sw_1 · taunt-mark 의 굵은 판) — a chunky red anger vein mark pops over the target's head with a
// bounce and throbs three times, a thick red ring pops out on the floor at its feet, then the mark shrinks away. (0, 0) is the target's feet.
import { fit, clamp, ease, WHITE } from "../../core/index.js";
import { RAGE } from "./_gladiator.js";
import { band, pop, shrink } from "../holy/_chibi.js";
import { bar } from "./_chibi_sword.js";

export const meta = {
  name: "Taunt mark (chunky)",
  desc: "A chunky red anger vein mark pops over the target's head with a bounce and throbs three times, a thick red ring pops out on the floor, then the mark shrinks away.",
  tags: ["melee", "debuff", "taunt", "mark", "chunky", "one-shot"],
  size: [104, 120], origin: [52, 104], duration: 1.4, loop: false, fps: 30, bg: "light",
  options: { palette: RAGE },
};

export const POP = 0.1;
const MX = 13, MY = -60, SY = 0.32, OUT = 1.0;

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  function vein(p, x, y, s) {                                              // four bent strokes round a gap — the cartoon anger mark
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + i * Math.PI / 2, c = Math.cos(a), sn = Math.sin(a), px = -sn, py = c, r0 = 3 * s, r1 = 9 * s;
      const ax = x + c * r0 + px * 3.4 * s, ay = y + sn * r0 + py * 3.4 * s, bx = x + c * r1, by = y + sn * r1, cx = x + c * r0 - px * 3.4 * s, cy = y + sn * r0 - py * 3.4 * s;
      bar(p, ax, ay, bx, by, 3 * s, C[3], C[5]); bar(p, bx, by, cx, cy, 3 * s, C[3], C[5]);
    }
  }
  return {
    update(dt) { t += dt; },
    draw(p) {
      const rv = clamp((t - POP) / 0.4), rk = shrink(t, POP + 0.25, POP + 0.45);
      if (t > POP && rk > 0) band(p, 0, 0, 10 + 14 * ease.outCubic(rv), SY, 4 * rk, C[3], C[4]);
      const throb = 1 + 0.18 * Math.max(0, Math.sin(Math.max(0, t - POP - 0.15) * Math.PI * 2 / 0.25)) * (t < POP + 0.9 ? 1 : 0);
      const s = pop(t, POP, 0.16) * shrink(t, OUT, OUT + 0.25) * throb;
      if (s > 0.1) vein(p, MX, MY, s);
    },
  };
}
