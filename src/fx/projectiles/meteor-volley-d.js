// 유성 화살 — 데포르메 (용사 학원 궁수 필살기 ar_u · meteor-volley 의 굵은 판) — seven chunky fire arrows drop on the target from the
// upper left faster and faster, each landing in a small outlined burst, then one big round meteor crashes down in a big star and a thick
// ring. Same hit times as meteor-volley (HITS). (0, 0) is the target's feet.
import { fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { EMBER } from "./_archer.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";
import { capsule, shape } from "./_chibi_archer.js";

export const meta = {
  name: "Meteor volley (chunky)",
  desc: "Seven chunky fire arrows drop on the target faster and faster, each landing in a small outlined burst, then a big round meteor crashes down in a big star.",
  tags: ["projectiles", "fire", "arrow", "ultimate", "chunky", "one-shot"],
  size: [280, 256], origin: [140, 216], duration: 3.1, loop: false, fps: 30, bg: "ground",
  options: { palette: EMBER },
};

const P0 = 0.5, FINAL = 2.2, FALL = 0.12, CY = -22, SY = 0.32;
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 7);
export const HITS = Array.from({ length: 8 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;
const SPOTS = [[-6, -4], [7, -12], [-9, -20], [4, -6], [10, -18], [-4, -14], [0, -24]];

export function create(o) {
  const E = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      HITS.slice(0, 7).forEach((h, i) => {
        const [sx, sy] = SPOTS[i], tx = sx, ty = CY + sy + 10;
        const u = clamp((t - (h - FALL)) / FALL);
        if (u > 0 && u < 1) { const x = tx - 70 * (1 - u), y = ty - 110 * (1 - u); capsule(p, x - 18, y - 28, x, y, 2.6, E[4], true); shape(p, [[x + 6, y + 8], [x - 5, y - 2], [x + 3, y - 5]], WHITE); }
        const k = pop(t, h, 0.07) * shrink(t, h + 0.1, h + 0.26);
        if (k > 0) { star(p, tx, ty, 12 * k, E[5]); blob(p, tx, ty, 3.6 * k, E[6], WHITE); }
      });
      const u = clamp((t - (FINAL - 0.3)) / 0.3);                           // the big meteor
      if (u > 0 && u < 1) { const x = -100 * (1 - u), y = CY - 150 * (1 - u); capsule(p, x - 26, y - 40, x, y, 6 * (0.6 + 0.4 * u), E[4], true); blob(p, x, y, 10, E[5], E[6]); }
      const fk = pop(t, FINAL, 0.1) * shrink(t, FINAL + 0.15, FINAL + 0.45);
      if (fk > 0) { band(p, 0, 0, 40 * fk + 20 * clamp((t - FINAL) / 0.5), SY, 4 * fk, E[5], E[6]); star(p, 0, CY, 18 * fk, E[6]); blob(p, 0, CY, 6 * fk, E[6], WHITE); }
      for (let i = 0; i < 3; i++) {                                         // three embers hop up after the crash
        const t0 = FINAL + 0.05 + i * 0.08, v = clamp((t - t0) / 0.4), k = pop(t, t0, 0.08) * shrink(t, t0 + 0.25, t0 + 0.45); if (k <= 0) continue;
        blob(p, (i - 1) * 24 * v, CY - 30 * v + 26 * v * v, 3 * k, E[5], E[6]);
      }
    },
  };
}
