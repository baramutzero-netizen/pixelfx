// 대치유 — 데포르메 (용사 학원 신성 사제 pr_1 · grace-bloom 의 굵은 판) — a thick gold ring on the floor, five round cream petals pop up
// round the feet like a lotus, a big outlined healing cross pops over the head, a purple blob (the debuff) pops out of the chest and
// bursts into three little stars, and three cream blobs float up. (0, 0) is the ally's feet.
import { fit, hex, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { GOLD, GREEN } from "./_lib.js";
import { SAPPHIRE } from "./_priest.js";
import { blob, star, band, petal, plus, pop, shrink } from "./_chibi.js";

export const meta = {
  name: "Grace bloom (chunky)",
  desc: "Round cream petals pop up round the feet like a lotus, an outlined healing cross pops over the head, and a purple debuff blob pops out of the chest and bursts into stars.",
  tags: ["holy", "heal", "cleanse", "lotus", "chunky", "one-shot"],
  size: [96, 108], origin: [48, 92], duration: 1.2, loop: false, fps: 30, bg: "ground",
  options: { palette: GOLD, part: "all" },   // part: back (바닥 층 — 몸 뒤) | front (몸 앞) | all
};

export const BLOOM = 0.35;
const OUT = 0.5, SY = 0.32, NP = 5, CY = -26, PU = ["#6a3a8a", "#a46ac8"].map(hex);

export function create(o) {
  const G = fit(o.palette, 8), C = fit(SAPPHIRE, 8), N = fit(GREEN, 8);
  const BACK = o.part !== "front", FRONT = o.part !== "back";
  let t = 0;
  const end = () => shrink(t, 0.85, 1.15);
  function petals(p, back) {
    for (let i = 0; i < NP; i++) {
      const g = (i / NP) * TAU + Math.PI / 2, near = Math.sin(g) > 0; if (near === back) continue;
      const k = pop(t, 0.08 + i * 0.03, 0.16) * end(); if (k <= 0) continue;
      const x = Math.cos(g) * 19, y = Math.sin(g) * 19 * SY, open = smooth(BLOOM, BLOOM + 0.25, t);
      petal(p, x, y, (back ? 20 : 15) * k, 5.5 * k, Math.cos(g) * (2 + 5 * open), back ? G[5] : G[6], WHITE);
    }
  }
  function floats(p) {                                                     // cream blobs floating up (behind the body)
    for (let i = 0; i < 3; i++) {
      const t0 = BLOOM + i * 0.12, a = t - t0; if (a < 0) continue;
      const k = pop(t, t0, 0.1) * shrink(t, t0 + 0.3, t0 + 0.5); if (k > 0) blob(p, (i - 1) * 13, -10 - a * 60, 2.2 * k, G[6], WHITE);
    }
  }
  return {
    update(dt) { t += dt; },
    draw(p) {
      const rk = pop(t, 0, 0.14) * end();
      if (rk > 0 && BACK) band(p, 0, 0, 24 * rk, SY, 4.5, G[4], G[6], (a) => Math.sin(a) < 0);
      if (rk > 0 && FRONT) band(p, 0, 0, 24 * rk, SY, 4.5, G[4], G[6], (a) => Math.sin(a) >= 0);
      if (BACK) petals(p, true);
      if (!FRONT) { floats(p); return; }
      if (t < OUT) { const k = pop(t, 0.15, 0.12), u = clamp((t - 0.2) / (OUT - 0.2)); if (k > 0) blob(p, 10 * u, CY - 12 * u, 3.5 * k, PU[0], PU[1]); }
      for (let i = 0; i < 3; i++) {                                          // the debuff bursts into three stars
        const a = -Math.PI / 2 + (i - 1) * 1.2, v = clamp((t - OUT) / 0.3), k = pop(t, OUT, 0.08) * shrink(t, OUT + 0.15, OUT + 0.35);
        if (k > 0) star(p, 10 + Math.cos(a) * 10 * v, CY - 12 + Math.sin(a) * 10 * v, 3.2 * k, WHITE);
      }
      const ck = pop(t, BLOOM, 0.14) * shrink(t, 0.8, 1.05);                  // the healing cross over the head
      if (ck > 0) plus(p, 0, -50 - 5 * smooth(BLOOM, 1, t), 7 * ck, 2.6 * ck, N[5], N[6]);
      if (o.part === "all") floats(p);
      petals(p, false);
    },
  };
}
