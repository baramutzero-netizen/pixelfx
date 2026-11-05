// 암살 — 데포르메 (용사 학원 암살자 필살기 ro_u · inverse-cut 의 굵은 판) — one thick outlined crimson crescent sweeps up through the target,
// then its wound sprays seven times, faster and faster — each a fan of three chunky ink-dark drops (white once the host inverts the screen)
// that fly out, fall and splat as outlined puddles on the floor, which shrink away at the end. (0, 0) is the target's feet.
import { fit, clamp, ease, hex, WHITE } from "../../core/index.js";
import { INK } from "./_rogue.js";
import { star, blob, pop, shrink } from "../holy/_chibi.js";
import { crescent, puddle } from "./_chibi_rogue.js";

export const meta = {
  name: "Inverse cut (chunky)",
  desc: "One thick outlined crimson crescent sweeps up through the target, then its wound sprays seven times faster and faster in fans of chunky ink drops that splat on the floor.",
  tags: ["melee", "ultimate", "assassinate", "cut", "spray", "chunky", "one-shot"],
  size: [344, 224], origin: [172, 176], duration: 2.8, loop: false, fps: 30, bg: "light",
  options: { palette: INK },
};

const CY = -24, SY = 0.32;
export const SLASH = 0.35;
export const INVERT = 0.45;
const P0 = 0.6, FINAL = 2.2, GONE = 2.6;
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 6);
export const SPRAYS = Array.from({ length: 7 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HITS = [SLASH, ...SPRAYS];
export const HIT = FINAL;
const INKC = [hex("#000000"), hex("#1c1c22"), hex("#3a3a44")];          // ink-dark (white once inverted)

export function create(o) {
  const C = fit(o.palette, 6);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const gone = shrink(t, GONE - 0.2, GONE + 0.15);
      SPRAYS.forEach((h, i) => {                                               // puddles where each spray's drops landed
        const k = pop(t, h + 0.32, 0.12) * gone; if (k <= 0) return;
        for (let j = 0; j < 3; j++) { const d = (j - 1) * (26 + i * 4) + (i % 2 ? 8 : -8); puddle(p, d * 1.3, 0, (8 + i * 1.1) * k, SY, INKC[0], INKC[2]); }
      });
      SPRAYS.forEach((h, i) => {                                               // the fans of drops
        const v = t - h; if (v <= 0 || v > 0.34) return;
        const last = i === SPRAYS.length - 1;
        for (let j = 0; j < 3; j++) {
          const d = (j - 1) * (26 + i * 4) + (i % 2 ? 8 : -8), u = v / 0.34, H = last ? 50 : 30 + j * 6, x = d * 1.3 * u, y = CY * (1 - u) - H * 4 * u * (1 - u);
          blob(p, x, Math.min(-1, y), (last ? 6.5 : 5) - j * 0.3, INKC[0], INKC[2]);
        }
        const s = pop(t, h, 0.05) * shrink(t, h + 0.06, h + 0.14); if (s > 0) blob(p, 0, CY, (last ? 8 : 5) * s, INKC[0], INKC[2]);
      });
      const k = ease.outCubic(clamp((t - SLASH + 0.08) / 0.1)), w = 17 * shrink(t, SLASH + 0.12, SLASH + 0.4);
      if (w > 0.6) crescent(p, 38, CY + 8, 58, 2.4, 4.4, w, C[3], C[5], k, 1);   // the one cut, sweeping up through the target
      const st = pop(t, SLASH, 0.07) * shrink(t, SLASH + 0.08, SLASH + 0.24);
      if (st > 0) star(p, 0, CY, 16 * st, C[5], 0.3);
    },
  };
}
