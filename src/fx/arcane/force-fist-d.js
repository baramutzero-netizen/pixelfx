// 마력 강타 — 데포르메 (force-fist 의 굵은 판) — a chunky outlined crimson fist rushes in and lands on the chest at 0.1 s, a big star
// pops, one thick squashed ring swells and three little stars fly back. (0, 0) is the target's feet; it faces right.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { FORCE, STAR, blob, star, band, fistD, pop, shrink } from "./_chibi_forcemage.js";

export const meta = {
  name: "Force fist (chunky)",
  desc: "A chunky outlined crimson fist rushes in and lands on the chest, a big star pops, one thick ring swells and three little stars fly back.",
  tags: ["arcane", "impact", "force", "fist", "chunky", "one-shot"],
  size: [112, 88], origin: [64, 78], duration: 0.6, loop: false, fps: 30, bg: "dark",
  options: { palette: FORCE },
};

export const HIT = 0.1;
const CY = -26;

export function create(o) {
  const C = fit(o.palette, 8), S = fit(STAR, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const v = clamp((t - HIT) / 0.35), w = 4 * (1 - v);
      if (t >= HIT && w > 0.6) band(p, 4, CY, 6 + 14 * ease.outCubic(v), 1.25, w, C[4], C[6]);
      for (let i = 0; i < 3; i++) { const a = Math.PI + (i - 1) * 0.7, k = pop(t, HIT + 0.02, 0.08) * shrink(t, HIT + 0.15, HIT + 0.35), d = 6 + 18 * clamp((t - HIT) / 0.3); if (k > 0) star(p, Math.cos(a) * d, CY + Math.sin(a) * d, 3.4 * k, i === 1 ? S[5] : C[6]); }
      if (t < HIT + 0.14) { const u = clamp(t / HIT), x = -30 + 24 * ease.inCubic(u), s = t < HIT ? 1 : 1 - (t - HIT) / 0.14 * 0.6; fistD(p, x, CY, 1.35 * s, C[4], C[6]); }
      const s = pop(t, HIT, 0.08) * shrink(t, HIT + 0.1, HIT + 0.28);
      if (s > 0) { blob(p, 4, CY, 4 * s, C[6], WHITE); star(p, 4, CY, 13 * s, WHITE); }
    },
  };
}
