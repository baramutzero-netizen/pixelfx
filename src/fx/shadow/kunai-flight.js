// 쿠나이 — 날아가는 쿠나이 (용사 학원 무영객 nj_b) — a dark steel kunai in flight, its crimson ribbon whipping, a thin trail of water mist.
// Loops; (0, 0) is its tip, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, CRIM, kunai } from "./_ninja.js";

export const meta = {
  name: "Kunai flight",
  desc: "A dark steel kunai in flight, its crimson ribbon whipping behind, a thin trail of water mist and a glint on the edge.",
  tags: ["shadow", "projectile", "kunai", "ninja", "loop"],
  size: [60, 16], origin: [52, 8], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: TIDE },
};

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), R = fit(CRIM, 6);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU;
      for (let d = 0; d < 30; d++) p.dot(-16 - d, Math.sin(d * 0.5 + ph * 2) * 0.7, d < 5 ? WHITE : C[5], 0.6 * (1 - d / 30));
      kunai(p, 0, 0, 0, 18, K[3], K[6], R[3]);
      p.dot(-4, -1, WHITE, 0.8 + 0.2 * Math.sin(ph));
    },
  };
}
