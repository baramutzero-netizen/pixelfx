// 신성 파동 — 터지는 빛 · 데포르메 (용사 학원 신성 사제 pr_b · purify-wave 의 굵은 판) — a big outlined star pops on the chest, one thick
// sapphire ring swells and thins away, and four little stars fly out on the diagonals and shrink. (0, 0) is the target's feet.
import { fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE } from "./_priest.js";
import { star, band, blob, pop, shrink } from "./_chibi.js";

export const meta = {
  name: "Purify wave (chunky)",
  desc: "A big outlined star pops on the chest, one thick sapphire ring swells and thins away, and four little stars fly out on the diagonals and shrink.",
  tags: ["holy", "impact", "light", "chunky", "one-shot"],
  size: [72, 80], origin: [36, 70], duration: 0.6, loop: false, fps: 30, bg: "dark",
  options: { palette: SAPPHIRE },
};

const CY = -26;

export function create(o) {
  const C = fit(o.palette, 8), G = fit(GOLD, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const v = clamp(t / 0.4), w = 4 * (1 - v);
      if (w > 0.6) band(p, 0, CY, 7 + 17 * ease.outCubic(v), 0.85, w, C[5], C[6]);
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + (i / 4) * TAU, u = clamp((t - 0.03) / 0.35), d = 6 + 20 * ease.outCubic(u), k = pop(t, 0.03, 0.08) * shrink(t, 0.2, 0.45);
        if (k > 0) star(p, Math.cos(a) * d, CY + Math.sin(a) * d, 3.5 * k, i % 2 ? G[6] : C[6]);
      }
      const s = pop(t, 0, 0.08) * shrink(t, 0.12, 0.32);
      if (s > 0) { blob(p, 0, CY, 5 * s, C[6], WHITE); star(p, 0, CY, 13 * s, C[6]); }
    },
  };
}
