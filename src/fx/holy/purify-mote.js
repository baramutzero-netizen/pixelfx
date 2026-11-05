// 신성 파동 — 날아가는 정화의 빛 (용사 학원 신성 사제 pr_b) — a mote of purifying light in flight: a white core in a sapphire halo,
// a turning four-point glint and a short trail of gold. Loops; (0, 0) is its middle, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE, glint } from "./_priest.js";

export const meta = {
  name: "Purify mote",
  desc: "A mote of purifying light in flight: a white core inside a soft sapphire halo, a slowly turning four-point glint and a short tapering trail of gold sparks.",
  tags: ["holy", "projectile", "light", "loop"],
  size: [52, 32], origin: [36, 16], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: SAPPHIRE },
};

export function create(o) {
  const C = fit(o.palette, 8), G = fit(GOLD, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU;
      for (let d = 0; d < 26; d++) { const w = 3.5 * (1 - d / 26); for (let o2 = -w; o2 <= w; o2 += 1) p.dot(-3 - d, o2 + Math.sin(d * 0.7 + ph) * 0.6, d < 5 ? C[6] : d % 3 ? C[4] : G[5], 0.75 * (1 - d / 26) * (1 - Math.abs(o2) / (w + 1))); }
      for (let i = 0; i < 4; i++) { const d = 8 + ((i * 6 + t * 90) % 18); p.dot(-d, Math.sin(i * 2.1 + ph) * 3, i % 2 ? G[6] : WHITE, 1 - d / 28); }
      p.glow(0, 0, 9, C[5], 0.55);
      p.disc(0, 0, 4, C[5], 0.9); p.disc(0, 0, 2.5, C[6], 1); p.disc(0, 0, 1.2, WHITE, 1);
      glint(p, 0, 0, 7 + Math.sin(ph) * 1.5, C[6], 0.9, ph / 4);
    },
  };
}
