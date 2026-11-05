// 성스러운 일격 — 데포르메 (용사 학원 팔라딘 pa_b · judgment-strike 의 굵은 판) — a thick outlined column of gold light drops from above
// onto the target in 0.08 s, a big star pops at its foot with a gold ring on the floor, the column thins away and three stars hop out.
// (0, 0) is the target's feet.
import { clamp, ease, lerp, WHITE } from "../../core/index.js";
import { PGOLD, column, band, star, pop, shrink } from "./_chibi_paladin.js";

export const meta = {
  name: "Judgment strike (chunky)",
  desc: "A thick outlined column of gold light drops onto the target, a big star pops at its foot with a gold ring on the floor, the column thins away and stars hop out.",
  tags: ["holy", "impact", "pillar", "chunky", "one-shot"],
  size: [120, 136], origin: [60, 112], duration: 1.1, loop: false, fps: 30, bg: "ground",
  options: {},
};

const DROP = 0.08, CY = -14, TOP = -108, SY = 0.32;
export const BANG = DROP;

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const y1 = lerp(TOP + 10, 0, clamp(t / DROP)), w = 7 * shrink(t, DROP + 0.05, 0.4);
      if (w > 0.6) column(p, 0, TOP, y1, w, PGOLD[4], PGOLD[6]);
      const rk = pop(t, DROP, 0.12) * shrink(t, 0.5, 0.8);
      if (rk > 0) band(p, 0, 0, 22 * rk, SY, 4, PGOLD[4], PGOLD[5]);
      const s = pop(t, DROP, 0.08) * shrink(t, DROP + 0.1, DROP + 0.3);
      if (s > 0) star(p, 0, CY, 18 * s, PGOLD[6]);
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i - 1) * 1.0, u = clamp((t - DROP) / 0.45), k = pop(t, DROP + 0.03, 0.08) * shrink(t, DROP + 0.3, DROP + 0.55);
        if (k > 0) star(p, Math.cos(a) * 26 * ease.outCubic(u), CY + Math.sin(a) * 22 * ease.outCubic(u), 4 * k, i === 1 ? WHITE : PGOLD[5]);
      }
    },
  };
}
