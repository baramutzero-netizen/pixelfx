// 조준 사격 — 맞는 쪽 · 데포르메 (용사 학원 궁수 ar_b · arrow-impact 의 굵은 판) — the arrow lands on the chest in an outlined white star,
// one thick mint ring swells away and three wooden splinters fly back and shrink. (0, 0) is the target's feet; the arrow came from the left.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { WIND, SHAFT } from "./_archer.js";
import { band, star, pop, shrink } from "../holy/_chibi.js";
import { capsule } from "./_chibi_archer.js";

export const meta = {
  name: "Arrow impact (chunky)",
  desc: "The arrow lands on the chest in an outlined white star, one thick mint ring swells away and three wooden splinters fly back and shrink.",
  tags: ["projectiles", "impact", "arrow", "chunky", "one-shot"],
  size: [96, 80], origin: [48, 70], duration: 0.7, loop: false, fps: 30, bg: "light",
  options: { palette: WIND },
};

export const HIT = 0.0;
const CY = -24;

export function create(o) {
  const C = fit(o.palette, 8), S = fit(SHAFT, 5);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const v = clamp(t / 0.4), w = 4 * (1 - v);
      if (w > 0.6) band(p, 0, CY, 6 + 16 * ease.outCubic(v), 0.85, w, C[5], C[6]);
      for (let i = 0; i < 3; i++) {
        const a = Math.PI + (i - 1) * 0.6, u = clamp(t / 0.45), d = 4 + 24 * ease.outCubic(u), k = shrink(t, 0.2, 0.45); if (k <= 0) continue;
        const x = Math.cos(a) * d, y = CY + Math.sin(a) * d + 12 * u * u;
        capsule(p, x, y, x + Math.cos(a + 1) * 4 * k, y + Math.sin(a + 1) * 4 * k, 1.1 * k, S[3]);
      }
      const s = pop(t, 0, 0.07) * shrink(t, 0.12, 0.3);
      if (s > 0) star(p, 0, CY, 12 * s, WHITE);
    },
  };
}
