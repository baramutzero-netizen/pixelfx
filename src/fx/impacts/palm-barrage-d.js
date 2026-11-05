// 백열권 — 데포르메 (용사 학원 무도가 필살기 mo_u · palm-barrage 의 굵은 판) — chunky outlined white-hot palms thrust at the target from
// many angles faster and faster (same eight hit times), each landing with a small star and a palm print that pops and shrinks, then one
// huge palm from the left blasts it in a big star and a thick ring. (0, 0) is the target's feet.
import { fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { HEAT, CHI } from "./_monk.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";
import { capsule } from "./_chibi_monk.js";

export const meta = {
  name: "Palm barrage (chunky)",
  desc: "Chunky outlined white-hot palms thrust at the target from many angles, faster and faster, each landing in a star, then one huge palm from the left blasts it.",
  tags: ["impacts", "fist", "palm", "ultimate", "chunky", "one-shot"],
  size: [336, 256], origin: [168, 196], duration: 3.0, loop: false, fps: 30, bg: "ground",
  options: { palette: HEAT, chi: CHI },
};

const P0 = 0.5, FINAL = 2.2, CY = -24, SY = 0.32, IN = 0.07, REACH = 64;
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 7);
export const HITS = Array.from({ length: 8 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;
const ANG = [Math.PI, -2.4, 2.6, -0.5, 0.6, -1.9, 2.0];     // where each palm comes from (no palms from below the floor)
const SPOT = [[-6, -2], [4, -10], [-4, 6], [7, 2], [-8, -8], [3, 8], [0, -4]];

/** An open palm at (x, y), fingers pointing along angle a, size s: outlined palm blob, four finger capsules and a thumb. */
function palm(p, x, y, a, s, fill, hi) {
  const c = Math.cos(a), sn = Math.sin(a), at = (u, v) => [x + c * u * s - sn * v * s, y + sn * u * s + c * v * s];
  for (const [v, L] of [[-3, 5], [-1, 6], [1, 6], [3, 4.6]]) { const [x0, y0] = at(1, v), [x1, y1] = at(1 + L, v * 1.05); capsule(p, x0, y0, x1, y1, 0.95 * s, fill); }
  { const [x0, y0] = at(-1, -4), [x1, y1] = at(2.5, -7.5); capsule(p, x0, y0, x1, y1, 1 * s, fill); }
  const [px, py] = at(-1.5, 0); blob(p, px, py, 4.6 * s, fill, hi);
}

export function create(o) {
  const H = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      HITS.slice(0, 7).forEach((h, i) => {
        const [sx, sy] = SPOT[i], tx = sx, ty = CY + sy, a = ANG[i];
        const u = clamp((t - (h - IN)) / IN);
        if (u > 0 && u < 1) { const d = REACH * (1 - ease.outCubic(u)); palm(p, tx + Math.cos(a) * (d + 12), ty + Math.sin(a) * (d + 12), a + Math.PI, 1.8, H[6], WHITE); }
        const k = pop(t, h, 0.06) * shrink(t, h + 0.1, h + 0.24);
        if (k > 0) { palm(p, tx + Math.cos(a) * 12, ty + Math.sin(a) * 12, a + Math.PI, 1.8 * k, H[5], H[6]); star(p, tx, ty, 11 * k, WHITE); }
      });
      const u = clamp((t - (FINAL - 0.12)) / 0.12);                         // the huge palm from the left
      if (u > 0 && u < 1) palm(p, -26 - 70 * (1 - ease.outCubic(u)), CY, 0, 3.4, H[6], WHITE);
      const fk = pop(t, FINAL, 0.1) * shrink(t, FINAL + 0.22, FINAL + 0.5);
      if (fk > 0) { palm(p, -24, CY, 0, 3.4 * fk, H[5], H[6]); band(p, 0, 0, 36 * fk + 24 * clamp((t - FINAL) / 0.5), SY, 4 * fk, H[4], H[5]); star(p, 4, CY, 18 * fk, WHITE); }
      for (let i = 0; i < 3; i++) { const t0 = FINAL + 0.05 + i * 0.08, v = clamp((t - t0) / 0.4), k = pop(t, t0, 0.08) * shrink(t, t0 + 0.25, t0 + 0.45); if (k > 0) blob(p, 10 + 30 * v, CY - 26 * v * (i - 1) - 10 * v, 3 * k, H[4], H[5]); }
    },
  };
}
