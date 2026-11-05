// 관통 화살 — 데포르메 (용사 학원 궁수 ar_1 · pierce-shot 의 굵은 판) — one chunky glowing arrow tears through the whole line from the
// archer's side, a thick mint trail thinning behind it, and as it passes each slot a white star and a ring pop. Faces right.
import { fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { WIND } from "./_archer.js";
import { band, star, pop, shrink } from "../holy/_chibi.js";
import { capsule, shape } from "./_chibi_archer.js";

export const meta = {
  name: "Pierce shot (chunky)",
  desc: "One chunky glowing arrow tears through the whole line from the archer's side, a thick mint trail thinning behind it, and a star and a ring pop at each slot.",
  tags: ["projectiles", "arrow", "pierce", "aoe", "chunky", "one-shot"],
  size: [344, 128], origin: [172, 104], duration: 1.3, loop: false, fps: 30, bg: "ground",
  options: { palette: WIND, reach: 130 },
};

const CY = -24, GO = 0.08, ACROSS = 0.32;
export const HIT = GO;

export function create(o) {
  const C = fit(o.palette, 8), RX = o.reach, X0 = -RX - 30, X1 = RX + 40, SLOTS = [-90, -45, 0, 45, 90];
  let t = 0;
  const head = () => X0 + (X1 - X0) * clamp((t - GO) / ACROSS);
  const passT = (x) => GO + ACROSS * (x - X0) / (X1 - X0);
  return {
    update(dt) { t += dt; },
    draw(p) {
      if (t < GO) return;
      const h = head(), tw = 3.4 * shrink(t, GO + ACROSS, GO + ACROSS + 0.45);   // the trail: thick, then thinning away
      if (tw > 0.5) { capsule(p, X0, CY, Math.min(h, X1) - 6, CY, tw, C[5], true); }
      for (const x of SLOTS) {
        const t0 = passT(x), k = pop(t, t0, 0.08) * shrink(t, t0 + 0.2, t0 + 0.42); if (k <= 0) continue;
        band(p, x, CY, 10 * k + 4 * clamp((t - t0) / 0.3), 1.05, 3 * k, C[6], WHITE);
        star(p, x, CY, 8 * k, WHITE);
      }
      if (t < GO + ACROSS) { capsule(p, h - 22, CY, h - 6, CY, 2.4, C[6], true); shape(p, [[h + 4, CY], [h - 8, CY - 6], [h - 5, CY], [h - 8, CY + 6]], WHITE); }
    },
  };
}
