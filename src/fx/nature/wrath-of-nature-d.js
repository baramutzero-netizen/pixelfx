// 자연의 분노 — 데포르메 (용사 학원 드루이드 필살기 dr_u · wrath-of-nature 의 굵은 판) — a thick outlined ring of moss runes pops open under
// the line; on each of six jolts (faster and faster) two chunky thorned roots pop up through it and shrink back, and on the last the whole
// bramble bursts up at once and blooms in big outlined pink flowers. (0, 0) is the middle of the enemy line's floor.
import { fit, clamp, ease, smooth, lerp, hex, TAU, WHITE } from "../../core/index.js";
import { FOREST, BARK } from "./_druid.js";
import { blob, band, star, petal, pop, shrink } from "../holy/_chibi.js";
import { spike } from "../melee/_chibi_sword.js";

export const meta = {
  name: "Wrath of nature (chunky)",
  desc: "A thick outlined ring of moss runes pops open under the line; on six jolts chunky thorned roots pop up through it, and on the last the bramble bursts up and blooms in pink flowers.",
  tags: ["nature", "ultimate", "aoe", "roots", "bloom", "chunky", "one-shot"],
  size: [360, 240], origin: [180, 190], duration: 3.2, loop: false, fps: 30, bg: "ground",
  options: { palette: FOREST, bark: BARK, reach: 122 },
};

const PINK = hex("#ff9ac8"), BLUSH = hex("#ffd0e8"), POLLEN = hex("#fff4a0"), OPEN = 0.4, P0 = 0.5, FINAL = 2.2, SY = 0.32, END = 2.85;
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 5);
export const HITS = Array.from({ length: 6 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

export function create(o) {
  const C = fit(o.palette, 8), Bk = fit(o.bark, 7), RX = o.reach;
  const big = Array.from({ length: 7 }, (_, i) => ({ x: lerp(-RX + 16, RX - 16, i / 6) + (i % 2 ? 6 : -6), h: 64 + (i % 3) * 16, lean: (i % 2 ? 1 : -1) * 9 }));
  let t = 0;
  const end = () => shrink(t, END - 0.1, meta.duration - 0.05);
  function root(p, x, h, lean, k) { spike(p, x, 0, h * k, 17 * Math.min(1, k + 0.3), lean * k, Bk[4], Bk[6]); spike(p, x + lean * k * 0.6, -h * k * 0.5, 9 * k, 6, lean > 0 ? 6 : -6, C[4], C[6]); }
  return {
    update(dt) { t += dt; },
    draw(p) {
      const rk = pop(t, 0, OPEN) * end();
      if (rk > 0) {
        band(p, 0, 0, RX * rk, SY, 5, C[3], C[5]);
        for (let i = 0; i < 8; i++) { const g = (i / 8) * TAU + t * 0.4; blob(p, Math.cos(g) * RX * 0.8 * rk, Math.sin(g) * RX * 0.8 * SY * rk, 3 * rk, C[4], C[6]); }
      }
      HITS.slice(0, -1).forEach((h, i) => {                                   // two roots pop up on each jolt
        const k = pop(t, h, 0.1) * shrink(t, h + 0.18, h + 0.36); if (k <= 0) return;
        for (let j = 0; j < 2; j++) { const x = ((i * 47 + j * 89) % 100) / 100 * 1.6 * RX - 0.8 * RX; root(p, x, 44 + i * 4, j ? 7 : -7, k); }
      });
      const fk = pop(t, FINAL, 0.16) * end();
      if (fk > 0) big.forEach((q, i) => {
        root(p, q.x, q.h, q.lean, fk);
        const tx = q.x + q.lean * fk, ty = -q.h * fk, bk = pop(t, FINAL + 0.12 + i * 0.03, 0.14) * end();
        if (i % 2 === 0 && bk > 0) { for (let j = 0; j < 5; j++) { const a = (j / 5) * TAU + i; blob(p, tx + Math.cos(a) * 7 * bk, ty + Math.sin(a) * 7 * bk, 5 * bk, PINK, BLUSH); } blob(p, tx, ty, 3.6 * bk, POLLEN, WHITE); }
      });
      const s = pop(t, FINAL, 0.1) * shrink(t, FINAL + 0.12, FINAL + 0.35);
      if (s > 0) star(p, 0, -30, 26 * s, C[7]);
      for (let i = 0; i < 3; i++) { const t0 = FINAL + 0.1 + i * 0.08, a = t - t0, k = pop(t, t0, 0.1) * shrink(t, t0 + 0.35, t0 + 0.55); if (k > 0) petal(p, (i - 1) * 70 + a * 30, -60 - a * 40, 9 * k, 3.4 * k, 4, C[5], C[7]); }
    },
  };
}
