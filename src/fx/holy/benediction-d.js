// 축복 — 데포르메 (용사 학원 신성 사제 pr_2 · benediction 의 굵은 판) — a thick outlined gold halo pops over the head, drops to the feet,
// squashes wide and flat as it lands, then two chunky up-chevrons pop up the body and a pair of stars wink. (0, 0) is the ally's feet.
import { fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE } from "./_priest.js";
import { band, chevron, star, blob, pop, shrink } from "./_chibi.js";

export const meta = {
  name: "Benediction (chunky)",
  desc: "A thick outlined gold halo pops over the head, drops to the feet and squashes flat as it lands, then two chunky up-chevrons pop up the body and stars wink.",
  tags: ["holy", "buff", "halo", "blessing", "chunky", "one-shot"],
  size: [80, 112], origin: [40, 96], duration: 1.1, loop: false, fps: 30, bg: "ground",
  options: { palette: GOLD, part: "all" },   // part: back (바닥 층 — 고리 뒤 절반) | front (고리 앞 절반 · 꺾쇠 · 별) | all
};

export const LAND = 0.5;
const TOP = -62, SY = 0.32;

export function create(o) {
  const G = fit(o.palette, 8), C = fit(SAPPHIRE, 8);
  const BACK = o.part !== "front", FRONT = o.part !== "back";
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const k = pop(t, 0, 0.14) * shrink(t, 0.85, 1.05);
      const u = clamp((t - 0.15) / (LAND - 0.15)), y = TOP * (1 - ease.inCubic(u));
      const sq = t < LAND ? 1 : 1 + 0.35 * Math.sin(clamp((t - LAND) / 0.18) * Math.PI) * (1 - clamp((t - LAND) / 0.3));   // squash on landing
      if (k > 0) {
        if (BACK) band(p, 0, y, 13 * k * sq, SY / sq, 4.5, G[5], G[6], (a) => Math.sin(a) < 0);
        if (FRONT) band(p, 0, y, 13 * k * sq, SY / sq, 4.5, G[5], G[6], (a) => Math.sin(a) >= 0);
        if (FRONT) for (let i = 0; i < 3; i++) { const g = (i + 0.5) / 3 * Math.PI; blob(p, Math.cos(g) * 13 * k * sq, y + Math.sin(g) * 13 * SY * k, 1.6 * k, C[5], C[6]); }
      }
      if (!FRONT) return;
      for (let i = 0; i < 2; i++) {                                            // two chevrons popping up the body
        const t0 = LAND + 0.06 + i * 0.1, a = t - t0; if (a < 0) continue;
        const kk = pop(t, t0, 0.1) * shrink(t, t0 + 0.3, t0 + 0.45);
        if (kk > 0) chevron(p, i ? 6 : -6, -18 - i * 10 - a * 30, 5 * kk, 2.5 * kk, i ? C[6] : G[6]);
      }
      for (let i = 0; i < 2; i++) { const t0 = LAND + 0.04 + i * 0.16, kk = pop(t, t0, 0.08) * shrink(t, t0 + 0.12, t0 + 0.3); if (kk > 0) star(p, i ? 14 : -15, -8 - i * 26, 4 * kk, WHITE); }
    },
  };
}
