// 기공파 — 날아가는 기 · 데포르메 (용사 학원 무도가 mo_1 · chi-orb 의 굵은 판) — a round outlined ball of cyan chi with a white shine,
// a little blob orbiting it and two shrinking blobs trailing. Loops; (0, 0) is its middle, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { CHI } from "./_monk.js";
import { blob } from "../holy/_chibi.js";

export const meta = {
  name: "Chi orb (chunky)",
  desc: "A round outlined ball of cyan chi with a white shine, a little blob orbiting it and two shrinking blobs trailing behind.",
  tags: ["impacts", "projectile", "chi", "chunky", "loop"],
  size: [52, 32], origin: [36, 16], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: CHI },
};

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU;
      blob(p, -22, Math.sin(ph) * 0.8, 2, C[4]); blob(p, -14, -Math.sin(ph) * 0.8, 3, C[5], C[6]);
      const ox = Math.cos(ph) * 9, oy = Math.sin(ph) * 4, back = Math.sin(ph) < 0;
      if (back) blob(p, ox, oy, 1.8, C[6]);
      blob(p, 0, 0, 6.5, C[5], WHITE); blob(p, 0, 0, 3.2, C[6], WHITE);
      if (!back) blob(p, ox, oy, 1.8, C[6]);
    },
  };
}
