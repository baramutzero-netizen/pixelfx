// 마력탄 — 맞는 순간 · 데포르메 (용사 학원 마법사 wz_b · mana-hit 의 굵은 판) — a big outlined star pops on the chest, one thick violet ring
// swells and thins, and three little stars fly out forward and shrink. (0, 0) is below the chest, as the original.
import { clamp, ease, WHITE } from "../../core/index.js";
import { ARC, band, star, blob, pop, shrink } from "./_chibi_wizard.js";

export const meta = {
  name: "Mana hit (chunky)",
  desc: "A big outlined star pops on the chest, one thick violet ring swells and thins away, and three little stars fly out forward and shrink.",
  tags: ["arcane", "impact", "chunky", "one-shot"],
  size: [80, 72], origin: [40, 54], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: {},
};

const CY = -19;

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const v = clamp(t / 0.4), w = 4 * (1 - v);
      if (w > 0.6) band(p, 0, CY, 6 + 15 * ease.outCubic(v), 1, w, ARC[4], ARC[5]);
      for (let i = 0; i < 3; i++) {
        const a = -0.7 + i * 0.7, u = clamp((t - 0.03) / 0.4), d = 6 + 22 * ease.outCubic(u), k = pop(t, 0.03, 0.08) * shrink(t, 0.25, 0.55);
        if (k > 0) star(p, Math.cos(a) * d, CY + Math.sin(a) * d, 3.5 * k, i === 1 ? WHITE : ARC[6]);
      }
      const s = pop(t, 0, 0.07) * shrink(t, 0.1, 0.3);
      if (s > 0) { blob(p, 0, CY, 5 * s, ARC[6], WHITE); star(p, 0, CY, 13 * s, ARC[6]); }
    },
  };
}
