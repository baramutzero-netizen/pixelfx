// 베기 — 데포르메 (용사 학원 검투사 sw_b · slant-cleave 의 굵은 판) — a thick outlined steel crescent cuts on a slant from high behind the
// target down and forward through it by the hit, a chunky white star pops on the chest, a short outlined cut line lingers on the slant,
// and three little stars hop off. (0, 0) is the target's feet.
import { fit, clamp, ease, WHITE } from "../../core/index.js";
import { STEEL } from "./_gladiator.js";
import { star, blob, pop, shrink } from "../holy/_chibi.js";
import { crescent, bar } from "./_chibi_sword.js";

export const meta = {
  name: "Slant cleave (chunky)",
  desc: "A thick outlined steel crescent cuts on a slant down and forward through the target, a chunky star pops on the chest, a short cut line lingers and three little stars hop off.",
  tags: ["melee", "impact", "sword", "cleave", "chunky", "one-shot"],
  size: [140, 136], origin: [68, 110], duration: 0.85, loop: false, fps: 30, bg: "light",
  options: { palette: STEEL },
};

export const HIT = 0.08;
const CY = -24;
// the cut's arc: through A (high behind) and B (low in front), bowed out by BOW px
const A = [-26, CY - 32], B = [26, CY + 20], BOW = 14;
const ARC = (() => { const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), h = L / 2, r = (h * h + BOW * BOW) / (2 * BOW), nx = dy / L, ny = -dx / L, cx = mx + nx * (r - BOW), cy = my + ny * (r - BOW); let a0 = Math.atan2(A[1] - cy, A[0] - cx), a1 = Math.atan2(B[1] - cy, B[0] - cx); if (a1 > a0 + Math.PI) a1 -= 2 * Math.PI; if (a1 < a0 - Math.PI) a1 += 2 * Math.PI; return { cx, cy, r, a0, a1 }; })();

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const k = ease.outCubic(clamp(t / (HIT + 0.04))), w = 13 * shrink(t, 0.16, 0.4);
      if (w > 0.6) crescent(p, ARC.cx, ARC.cy, ARC.r, ARC.a0, ARC.a1, w, C[4], WHITE, k, 1);   // high behind → down and forward through the chest
      const lk = shrink(t, 0.3, 0.6);
      if (t > HIT && lk > 0) bar(p, -16 * lk, CY - 14 * lk, 16 * lk, CY + 14 * lk, 2.6, WHITE);
      const s = pop(t, HIT, 0.08) * shrink(t, 0.18, 0.36);
      if (s > 0) { blob(p, 0, CY, 4 * s, C[6], WHITE); star(p, 0, CY, 13 * s, C[6], 0.4); }
      for (let i = 0; i < 3; i++) {
        const a = -0.6 + i * 0.6, v = clamp((t - HIT) / 0.3), kk = pop(t, HIT + 0.02, 0.06) * shrink(t, 0.25, 0.42);
        if (kk > 0) star(p, Math.cos(a) * (8 + 18 * v), CY + Math.sin(a) * (8 + 18 * v) + 10 * v * v, 3.2 * kk, i === 1 ? WHITE : C[5]);
      }
    },
  };
}
