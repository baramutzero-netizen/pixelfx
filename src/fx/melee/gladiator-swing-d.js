// 검투사 시전 — 데포르메 (용사 학원 검투사 · gladiator-swing 의 굵은 판) — one thick outlined steel crescent whips from over the shoulder
// down and out in front by the hit, white along its edge, holds a beat and shrinks away; a chunky star glints at the tip and two sparks hop off.
// (0, 0) is the swing's centre at the chest, facing right.
import { fit, clamp, ease, WHITE } from "../../core/index.js";
import { STEEL } from "./_gladiator.js";
import { star, pop, shrink } from "../holy/_chibi.js";
import { crescent } from "./_chibi_sword.js";

export const meta = {
  name: "Gladiator swing (chunky)",
  desc: "One thick outlined steel crescent whips from over the shoulder down and out in front, white along its edge, a chunky star glints at the tip and two sparks hop off.",
  tags: ["melee", "cast", "sword", "swing", "chunky", "one-shot"],
  size: [124, 128], origin: [40, 62], duration: 0.7, loop: false, fps: 30, bg: "dark",
  options: { palette: STEEL },
};

export const HIT = 0.07;
const CX = 8, CY = -2, R = 34, A0 = -2.5, A1 = 0.9;

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const k = ease.outCubic(clamp(t / HIT)), w = 11 * shrink(t, 0.2, 0.45);
      if (w > 0.6) crescent(p, CX, CY, R, A0, A1, w, C[4], WHITE, k, 0.8);
      const tx = CX + Math.cos(A1) * R, ty = CY + Math.sin(A1) * R * 0.8, s = pop(t, HIT, 0.08) * shrink(t, 0.2, 0.38);
      if (s > 0) star(p, tx, ty, 8 * s, C[6]);
      for (let i = 0; i < 2; i++) { const v = clamp((t - HIT) / 0.3), kk = pop(t, HIT + 0.02, 0.06) * shrink(t, 0.25, 0.4); if (kk > 0) star(p, tx + (8 + i * 6) * v, ty + (i ? 10 : -6) * v, 3 * kk, i ? C[5] : WHITE); }
    },
  };
}
