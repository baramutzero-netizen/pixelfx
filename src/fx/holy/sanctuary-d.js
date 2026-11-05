// 성역 선포 — 데포르메 (용사 학원 팔라딘 필살기 pa_u · sanctuary 의 굵은 판) — a thick outlined gold ring pops under the ally line, six chunky
// pillars of light rise round its rim, and on each of five blessings (faster and faster) the pillars flash white and a ring pops out from
// the middle; the last pops a big star, then all shrinks away. (0, 0) is the middle of the ally line's floor.
import { clamp, ease, TAU, WHITE } from "../../core/index.js";
import { PGOLD, band, column, star, pop, shrink } from "./_chibi_paladin.js";

export const meta = {
  name: "Sanctuary (chunky)",
  desc: "A thick gold ring pops under the line, chunky pillars rise round its rim, and on each of five blessings they flash and a ring pops out; the last pops a big star.",
  tags: ["holy", "sanctuary", "heal", "ultimate", "aoe", "chunky", "one-shot"],
  size: [304, 288], origin: [152, 232], duration: 2.4, loop: false, fps: 30, bg: "ground",
  options: { reach: 120 },
};

const OPEN = 0.45, FINAL = 1.28, P0 = 0.55, SY = 0.32, NP = 6;
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 4);
export const PULSES = Array.from({ length: 5 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

export function create(o) {
  const RX = o.reach;
  const pil = Array.from({ length: NP }, (_, i) => ({ g: (i / NP) * TAU + 0.3, t0: OPEN * 0.6 + (i % 3) * 0.06, h: 34 + (i % 2) * 12 })).sort((a, b) => Math.sin(a.g) - Math.sin(b.g));
  let t = 0;
  const flash = () => PULSES.some((h) => t >= h && t < h + 0.08);
  return {
    update(dt) { t += dt; },
    draw(p) {
      const end = shrink(t, FINAL + 0.4, 2.3), rk = pop(t, 0, OPEN) * end;
      if (rk > 0) { band(p, 0, 0, RX * rk, SY, 4.5, PGOLD[4], PGOLD[5]); band(p, 0, 0, RX * 0.45 * rk, SY, 3, PGOLD[3], PGOLD[5]); }
      const fl = flash();
      for (const q of pil) {
        const k = pop(t, q.t0, 0.18) * end; if (k <= 0) continue;
        const x = Math.cos(q.g) * (RX - 4), y = Math.sin(q.g) * (RX - 4) * SY;
        column(p, x, y - q.h * k, y, 2.8 * k, fl ? WHITE : PGOLD[5], WHITE);
      }
      PULSES.forEach((h, i) => {
        const v = clamp((t - h) / 0.35); if (v <= 0 || v >= 1) return;
        const w = 4.5 * (1 - v); if (w > 0.6) band(p, 0, 0, 10 + (RX - 10) * ease.outCubic(v), SY, w, i === PULSES.length - 1 ? WHITE : PGOLD[5], WHITE);
      });
      const s = pop(t, FINAL, 0.1) * shrink(t, FINAL + 0.15, FINAL + 0.5); if (s > 0) star(p, 0, -40, 34 * s, PGOLD[6]);
    },
  };
}
