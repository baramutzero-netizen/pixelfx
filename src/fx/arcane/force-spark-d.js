// 전쟁법사 시전 — 데포르메 (force-spark 의 굵은 판) — four dots hop into the gold star, a big outlined star pops at 0.16 s, a thick
// crimson arc kicks forward and two little stars hop off. (0, 0) is the star; it faces right.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { FORCE, STAR, blob, star, band, pop, shrink } from "./_chibi_forcemage.js";

export const meta = {
  name: "Force spark (chunky)",
  desc: "Chunky dots hop into a gold star, an outlined star pops out, a thick crimson arc kicks forward and two little stars hop off.",
  tags: ["arcane", "cast", "staff", "force", "chunky", "one-shot"],
  size: [64, 60], origin: [26, 30], duration: 0.6, loop: false, fps: 30, bg: "dark",
  options: { palette: FORCE },
};

export const FLARE = 0.16;

export function create(o) {
  const C = fit(o.palette, 8), S = fit(STAR, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      for (let i = 0; i < 4; i++) { const u = clamp(t / FLARE); if (u >= 1) break; const a = (i / 4) * TAU + 0.6, r = 15 * (1 - ease.inCubic(u)); blob(p, Math.cos(a) * r, Math.sin(a) * r, 1.8, C[5], WHITE); }
      const ak = pop(t, FLARE, 0.1) * shrink(t, 0.3, 0.45), u = clamp((t - FLARE) / 0.3);
      if (ak > 0) band(p, 0, 0, 8 + 10 * u, 1.4, 3.5 * ak, C[4], C[6], (a) => Math.abs(a) < 1.1);
      const s = pop(t, FLARE, 0.1) * shrink(t, 0.3, 0.5);
      if (s > 0) star(p, 0, 0, 9 * s, S[5]); else if (t < FLARE) blob(p, 0, 0, 2.5, S[5], WHITE);
      for (let i = 0; i < 2; i++) { const k = pop(t, FLARE + 0.03, 0.08) * shrink(t, 0.35, 0.55), v = clamp((t - FLARE) / 0.35); if (k > 0) star(p, 10 + 12 * v, (i ? 1 : -1) * (6 + 6 * v), 3.2 * k, i ? WHITE : C[6]); }
    },
  };
}
