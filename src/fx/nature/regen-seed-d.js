// 재생의 씨앗 — 데포르메 (용사 학원 드루이드 dr_1 · regen-seed 의 굵은 판) — a chunky glowing seed drops onto the ally's feet and pops into a
// little outlined sapling with two leaves, two thick green rings of life climb the body one after the other, and two motes hop up.
// (0, 0) is the ally's feet.
import { fit, clamp, ease, smooth, WHITE } from "../../core/index.js";
import { FOREST } from "./_druid.js";
import { blob, star, band, petal, pop, shrink } from "../holy/_chibi.js";
import { bar } from "../melee/_chibi_sword.js";

export const meta = {
  name: "Regen seed (chunky)",
  desc: "A chunky glowing seed drops onto the ally's feet and pops into an outlined sapling with two leaves, two thick green rings of life climb the body and motes hop up.",
  tags: ["nature", "heal", "regen", "seed", "chunky", "one-shot"],
  size: [96, 120], origin: [48, 104], duration: 1.7, loop: false, fps: 30, bg: "light",
  options: { palette: FOREST },
};

export const LAND = 0.3;
const SX = 6, SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  const end = () => shrink(t, 1.2, 1.6);
  return {
    update(dt) { t += dt; },
    draw(p) {
      if (t < LAND) { const u = ease.inCubic(clamp(t / LAND)); blob(p, SX, -70 + 70 * u, 3.5, C[5], C[7]); }
      const s = pop(t, LAND, 0.08) * shrink(t, LAND + 0.1, LAND + 0.28);
      if (s > 0) star(p, SX, -2, 9 * s, C[7]);
      const g = pop(t, LAND + 0.05, 0.18) * end();
      if (g > 0) { bar(p, SX, 0, SX, -12 * g, 2.6, C[3], C[5]); petal(p, SX, -10 * g, 9 * g, 3.2 * g, -6 * g, C[5], C[7]); petal(p, SX, -10 * g, 9 * g, 3.2 * g, 6 * g, C[4], C[6]); }
      for (let i = 0; i < 2; i++) {                                            // rings of life climbing the body
        const t0 = 0.45 + i * 0.18, v = clamp((t - t0) / 0.5); if (v <= 0 || v >= 1) continue;
        const k = 1 - v * v; band(p, 0, -48 * ease.outCubic(v), 16 + 4 * k, SY, 3 * k + 0.8, C[4], C[6]);
      }
      for (let i = 0; i < 2; i++) { const t0 = 0.6 + i * 0.2, a = t - t0, k = pop(t, t0, 0.08) * shrink(t, t0 + 0.3, t0 + 0.45); if (k > 0) blob(p, i ? 12 : -12, -14 - a * 50, 2.2 * k, C[6], WHITE); }
    },
  };
}
