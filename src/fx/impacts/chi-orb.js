// 기공파 — 날아가는 기 (용사 학원 무도가 mo_1) — a ball of condensed chi in flight, cyan rings spinning round a white core, a trail of light. Loops; (0, 0) is its middle, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { CHI } from "./_monk.js";

export const meta = {
  name: "Chi orb",
  desc: "A ball of condensed chi in flight, a white core inside cyan rings that spin round it, a streaming trail of light and loose motes behind.",
  tags: ["impacts", "projectile", "chi", "energy", "loop"],
  size: [56, 32], origin: [40, 16], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: CHI },
};

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU;
      for (let d = 0; d < 30; d++) { const w = 5 * (1 - d / 30); for (let o2 = -w; o2 <= w; o2 += 1) p.dot(-4 - d, o2 + Math.sin(d * 0.6 + ph * 2) * 0.8, d < 6 ? C[6] : C[4], 0.7 * (1 - d / 30) * (1 - Math.abs(o2) / (w + 1))); }
      p.glow(0, 0, 14, C[4], 0.6);
      p.disc(0, 0, 6, C[5], 1); p.disc(0, 0, 3.5, C[6], 1); p.disc(-1, -1, 1.8, WHITE, 1);
      for (let g = 0; g < TAU; g += 0.15) { const x = Math.cos(g) * 8, y = Math.sin(g) * 3, a = g + ph; p.dot(Math.cos(a) * 8 * 0.4, Math.sin(a) * 8, Math.cos(a) > 0 ? C[6] : C[3], 0.8); }
    },
  };
}
