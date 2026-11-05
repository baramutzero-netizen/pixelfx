// 신성 파동 — 날아가는 빛 · 데포르메 (용사 학원 신성 사제 pr_b · purify-mote 의 굵은 판) — a round outlined orb of light with a white
// shine and a little turning star on it, three shrinking blobs trailing. Loops; (0, 0) is its middle, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE } from "./_priest.js";
import { blob, star } from "./_chibi.js";

export const meta = {
  name: "Purify mote (chunky)",
  desc: "A round outlined orb of light with a white shine and a little turning star on it, three shrinking blobs of light trailing behind.",
  tags: ["holy", "projectile", "light", "chunky", "loop"],
  size: [44, 28], origin: [30, 14], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: SAPPHIRE },
};

export function create(o) {
  const C = fit(o.palette, 8), G = fit(GOLD, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU;
      blob(p, -19, Math.sin(ph) * 0.8, 1.6, G[5]); blob(p, -13, -Math.sin(ph) * 0.8, 2.4, C[5]); blob(p, -7, 0, 3.2, C[5], C[6]);
      blob(p, 0, 0, 5.5, C[6], WHITE);
      star(p, 1, -1, 5 + Math.sin(ph) * 1, WHITE, ph / 4);
    },
  };
}
