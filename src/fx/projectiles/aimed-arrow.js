// 조준 사격 — 날아가는 화살 (용사 학원 궁수 ar_b) — a steel-tipped arrow in flight, fletching fluttering, a thin white wake behind. Loops; (0, 0) is its head, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { SHAFT, WIND } from "./_archer.js";

export const meta = {
  name: "Aimed arrow",
  desc: "A steel-tipped arrow in flight, its fletching fluttering, with a thin white wake and a faint green shimmer of wind behind it.",
  tags: ["projectiles", "arrow", "bow", "flight", "loop"],
  size: [64, 16], origin: [56, 8], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: SHAFT, wind: WIND },
};

export function create(o) {
  const S = fit(o.palette, 5), W = fit(o.wind, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const fl = Math.sin((t / meta.duration) * TAU * 2);
      for (let d = 0; d < 30; d++) p.dot(-26 - d, Math.sin(d * 0.5 + t * 40) * 0.6, d < 6 ? WHITE : W[5], 0.6 * (1 - d / 30));
      p.line(-24, 0, -2, 0, S[2]); p.line(-24, -1, -3, -1, S[3], 0.5);   // the shaft
      p.tri(-1, -2.5, -1, 2.5, 4, 0, W[7]); p.dot(0, 0, S[4]);           // the head
      p.tri(-24, 0, -30, -3 - fl, -27, 0, W[5]); p.tri(-24, 0, -30, 3 + fl, -27, 0, W[4]);   // fletching
    },
  };
}
