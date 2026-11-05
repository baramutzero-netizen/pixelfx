// 독 단검 — 터지는 독 · 데포르메 (용사 학원 암살자 ro_1 · venom-burst 의 굵은 판) — a chunky green star pops on the chest, four outlined venom
// drops fly out and fall, two bubbles pop on the body, and a green puddle spreads at the feet and shrinks away. (0, 0) is the target's feet.
import { fit, clamp, ease, WHITE } from "../../core/index.js";
import { VENOM } from "./_rogue.js";
import { star, blob, pop, shrink } from "../holy/_chibi.js";
import { puddle } from "./_chibi_rogue.js";

export const meta = {
  name: "Venom burst (chunky)",
  desc: "A chunky green star pops on the chest, four outlined venom drops fly out and fall, two bubbles pop on the body, and a green puddle spreads at the feet and shrinks away.",
  tags: ["melee", "impact", "venom", "poison", "chunky", "one-shot"],
  size: [128, 108], origin: [64, 96], duration: 1.3, loop: false, fps: 30, bg: "light",
  options: { palette: VENOM },
};

export const HIT = 0.02;
const CY = -24, SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const pk = pop(t, 0.25, 0.25) * shrink(t, 0.95, 1.25);
      if (pk > 0) puddle(p, 0, 0, 18 * pk, SY, C[4], C[6]);
      [[-1.1, 70], [-0.4, 90], [-2.7, 80], [-2.0, 60]].forEach(([a, sp], i) => {     // venom drops thrown out, falling
        const v = t - HIT - 0.01 * i; if (v <= 0) return;
        const x = Math.cos(a) * sp * v, y = CY + Math.sin(a) * sp * v + 260 * v * v; if (y > -1) return;
        blob(p, x, y, 2.6, C[5], C[6]);
      });
      for (let i = 0; i < 2; i++) { const t0 = 0.35 + i * 0.25, k = pop(t, t0, 0.1) * shrink(t, t0 + 0.18, t0 + 0.28); if (k > 0) blob(p, i ? 9 : -8, -18 - i * 14, 3 * k, C[5], WHITE); }
      const s = pop(t, HIT, 0.07) * shrink(t, HIT + 0.1, HIT + 0.3);
      if (s > 0) { blob(p, 0, CY, 4 * s, C[6], WHITE); star(p, 0, CY, 12 * s, C[6]); }
    },
  };
}
