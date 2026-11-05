// 치유의 빛 — 데포르메 (용사 학원 팔라딘 pa_2 · healing-light 의 굵은 판) — a thick outlined column of light comes down onto the ally and
// lands at 0.28 s with a green ring popping on the floor, three chunky green crosses float up, then the column thins away. (0, 0) is the ally's feet.
import { clamp, ease, lerp, WHITE } from "../../core/index.js";
import { PGOLD, PGREEN, column, band, plus, pop, shrink } from "./_chibi_paladin.js";

export const meta = {
  name: "Healing light (chunky)",
  desc: "A thick outlined column of light comes down onto the ally and lands with a green ring on the floor, three chunky green crosses float up, then the column thins away.",
  tags: ["holy", "heal", "pillar", "chunky", "one-shot"],
  size: [64, 156], origin: [32, 144], duration: 1.75, loop: false, fps: 30, bg: "ground",
  options: {},
};

const DOWN = 0.28, HOLDT = 0.95, GONE = 1.35, TOP = -140, W = 6.5, SY = 0.32;
export const LAND = DOWN;

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const y1 = lerp(TOP + 8, 0, ease.inCubic(clamp(t / DOWN))), w = W * shrink(t, HOLDT, GONE) * clamp(t / 0.06);
      if (w > 0.6) column(p, 0, TOP, y1, w, PGOLD[5], WHITE);
      const rk = pop(t, DOWN, 0.12) * shrink(t, HOLDT + 0.1, GONE + 0.1); if (rk > 0) band(p, 0, 0, 18 * rk, SY, 4, PGREEN[3], PGREEN[4]);
      for (let i = 0; i < 3; i++) {
        const t0 = DOWN + 0.08 + i * 0.2, a = t - t0; if (a < 0) continue;
        const k = pop(t, t0, 0.1) * shrink(t, t0 + 0.35, t0 + 0.55); if (k > 0) plus(p, (i - 1) * 14, -18 - a * 45, 5 * k, 1.8 * k, PGREEN[3], PGREEN[5]);
      }
    },
  };
}
