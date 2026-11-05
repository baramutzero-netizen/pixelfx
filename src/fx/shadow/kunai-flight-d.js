// 쿠나이 — 날아가는 쿠나이 · 데포르메 (kunai-flight 의 굵은 판) — a chunky outlined kunai with a crimson ring, three shrinking water blobs behind.
// Loops; (0, 0) is its tip, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, CRIM, kunaiC, blob } from "./_chibi_ninja.js";

export const meta = {
  name: "Kunai flight (chunky)",
  desc: "A chunky outlined kunai with a crimson ring flies right, three shrinking blobs of water trailing behind it.",
  tags: ["shadow", "projectile", "kunai", "ninja", "chunky", "loop"],
  size: [52, 20], origin: [46, 10], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: TIDE },
};

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), R = fit(CRIM, 6);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU;
      blob(p, -36, Math.sin(ph) * 0.8, 1.4, C[5]); blob(p, -30, -Math.sin(ph) * 0.8, 2, C[5]); blob(p, -23, 0, 2.6, C[6], WHITE);
      kunaiC(p, 0, 0, 0, 18, K[4], R[3]);
    },
  };
}
