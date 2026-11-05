// 조준 사격 — 날아가는 화살 · 데포르메 (용사 학원 궁수 ar_b · aimed-arrow 의 굵은 판) — a chunky outlined arrow: wooden shaft, a white
// steel head, two mint fletches, two short white dashes of wake. Loops; (0, 0) is its head, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { SHAFT, WIND } from "./_archer.js";
import { capsule, shape } from "./_chibi_archer.js";

export const meta = {
  name: "Aimed arrow (chunky)",
  desc: "A chunky outlined arrow in flight: a wooden shaft, a white steel head, two mint fletches and two short white dashes of wake behind it.",
  tags: ["projectiles", "arrow", "chunky", "loop"],
  size: [64, 16], origin: [56, 8], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: WIND },
};

export function create(o) {
  const C = fit(o.palette, 8), S = fit(SHAFT, 5);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU, w = Math.sin(ph) * 0.6;
      capsule(p, -50, w - 1, -44, w - 1, 0.6, WHITE); capsule(p, -52, w + 2, -47, w + 2, 0.6, WHITE);
      shape(p, [[-40, 0], [-34, 0], [-37, -4.5]], C[5]); shape(p, [[-40, 0], [-34, 0], [-37, 4.5]], C[4]);
      capsule(p, -38, 0, -6, 0, 1.1, S[3]);
      shape(p, [[1, 0], [-8, -4], [-6, 0], [-8, 4]], WHITE);
    },
  };
}
