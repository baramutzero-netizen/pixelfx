// 수호의 맹세 — 데포르메 (용사 학원 팔라딘 pa_1 · oath-ward 의 굵은 판) — a gold ring pops on the floor, a thick outlined steel-blue dome
// rises round the ally, a chunky shield emblem pops at its top when it seals at 0.36 s, it holds, then folds down and a star winks out.
// (0, 0) is the ally's feet.
import { clamp, ease, WHITE } from "../../core/index.js";
import { PGOLD, STEEL, band, ringXY, polyO, star, pop, shrink } from "./_chibi_paladin.js";

export const meta = {
  name: "Oath ward (chunky)",
  desc: "A gold ring pops on the floor, a thick outlined steel-blue dome rises round the ally, a chunky shield emblem pops at its top as it seals, then it folds down.",
  tags: ["holy", "ward", "shield", "buff", "chunky", "one-shot"],
  size: [76, 92], origin: [38, 82], duration: 1.8, loop: false, fps: 30, bg: "ground",
  options: {},
};

const RING = 0.12, RISE = 0.34, SEAL = 0.36, FOLD = 1.3, RX = 22, RH = 38, SY = 0.32;
export const SET = SEAL;

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const end = shrink(t, FOLD, FOLD + 0.25);
      const rk = pop(t, 0, RING) * end; if (rk > 0) band(p, 0, 0, RX * rk, SY, 4, PGOLD[4], PGOLD[5]);
      const h = RH * ease.outCubic(clamp((t - RING) / (RISE - RING))) * end;
      if (h > 2) ringXY(p, 0, 0, RX, h, 4, STEEL[3], STEEL[4], (a) => Math.sin(a) < 0.05);   // the dome: the upper half of an ellipse
      const k = pop(t, SEAL, 0.12) * end, y = -h - 4;
      if (k > 0) { const s = 7 * k; polyO(p, [[-s, y - s], [s, y - s], [s, y], [0, y + s * 1.1], [-s, y]], PGOLD[4], (px, py) => (Math.abs(px) < s * 0.3 || Math.abs(py - (y - s * 0.4)) < s * 0.22 ? WHITE : 0)); }
      const st = pop(t, FOLD + 0.2, 0.08) * shrink(t, FOLD + 0.3, FOLD + 0.45); if (st > 0) star(p, 0, -16, 7 * st, WHITE);
    },
  };
}
