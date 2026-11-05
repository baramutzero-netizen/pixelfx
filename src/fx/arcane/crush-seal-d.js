// 파쇄격 — 데포르메 (crush-seal 의 굵은 판) — a thick outlined crimson ring pops over the head, drops onto the target at 0.3 s and
// squashes flat, a big star pops at the feet, three chunky rocks hop out and a thick ring swells on the floor. (0, 0) is the target's feet.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { FORCE, STAR, blob, star, band, pop, shrink } from "./_chibi_forcemage.js";

export const meta = {
  name: "Crush seal (chunky)",
  desc: "A thick crimson ring pops over the head, drops onto the target and squashes flat, a star pops, three rocks hop out and a thick ring swells.",
  tags: ["arcane", "impact", "force", "crush", "chunky", "one-shot"],
  size: [116, 156], origin: [58, 112], duration: 0.9, loop: false, fps: 30, bg: "ground",
  options: { palette: FORCE },
};

export const HIT = 0.3;
const TOP = -66, SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), S = fit(STAR, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const k = pop(t, 0, 0.14);
      if (t < HIT) { const u = clamp((t - 0.14) / (HIT - 0.14)), y = TOP * (1 - ease.inCubic(u)); band(p, 0, y, 20 * k, 0.45 - 0.13 * u, 4.5, C[4], C[6]); }
      else {
        const sq = 1 + 0.4 * Math.sin(clamp((t - HIT) / 0.15) * Math.PI) * (1 - clamp((t - HIT) / 0.3)), f = shrink(t, 0.6, 0.85);
        if (f > 0) band(p, 0, 0, 20 * sq * f, SY / sq, 4.5, C[4], C[6]);
        const v = clamp((t - HIT) / 0.35), w = 4 * (1 - v); if (w > 0.6) band(p, 0, 0, 24 + 26 * ease.outCubic(v), SY, w, S[5], WHITE);
        for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i - 1) * 0.9, u = clamp((t - HIT) / 0.4), kk = pop(t, HIT + 0.02, 0.08) * shrink(t, HIT + 0.3, HIT + 0.45); if (kk > 0) blob(p, Math.cos(a) * 26 * u, -8 - 30 * u + 36 * u * u, 3 * kk, C[2], C[3]); }
        const s = pop(t, HIT, 0.08) * shrink(t, HIT + 0.1, HIT + 0.3); if (s > 0) star(p, 0, -2, 9 * s, WHITE);
      }
    },
  };
}
