// 천류·풍마수리검 — 데포르메 (fuma-storm 의 굵은 판) — a big chunky outlined fuma shuriken circles the target faster and faster (eight cuts,
// same times), a white star pops on each pass, then it slams through: two thick X bars and five round water petals pop round the feet.
// (0, 0) is the target's feet.
import { fit, clamp, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, CRIM, fumaC, star, band, blob, petal, pop, shrink, LINE } from "./_chibi_ninja.js";
import { HITS, FINAL } from "./fuma-storm.js";

export { HITS, FINAL };
export const meta = {
  name: "Fuma storm (chunky)",
  desc: "A big chunky outlined fuma shuriken circles the target faster and faster with a star on each pass, then slams through: an X of thick bars and round water petals.",
  tags: ["shadow", "water", "shuriken", "ultimate", "multi-hit", "chunky", "one-shot"],
  size: [220, 168], origin: [110, 128], duration: 2.8, loop: false, fps: 30, bg: "dark",
  options: { palette: TIDE, part: "all" },   // part: back (바닥 층 — 몸 뒤를 지날 때 · 뒤 꽃잎 · 바닥 고리) | front | all
};

const CY = -26, SY = 0.36, RX = 36;

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), Rc = fit(CRIM, 6), BACK = o.part !== "front", FRONT = o.part !== "back";
  let t = 0;
  const ang = () => {
    if (t < HITS[0]) return lerp(-Math.PI * 1.1, Math.PI / 2, ease.outCubic(t / HITS[0]));
    for (let i = 1; i < HITS.length; i++) if (t < HITS[i]) return Math.PI / 2 + ((t - HITS[i - 1]) / (HITS[i] - HITS[i - 1])) * TAU;
    return Math.PI / 2;
  };
  function bar(p, a, L, w) {
    const c = Math.cos(a), s = Math.sin(a);
    p.shade(-L - 3, CY - L - 3, L + 3, CY + L + 3, (px, py) => { const dx = px, dy = py - CY, u = dx * c + dy * s, v = -dx * s + dy * c, ww = w * (1 - Math.abs(u) / (L + 1)); if (Math.abs(u) > L + 1) return; if (Math.abs(v) <= ww) return Math.abs(v) < ww * 0.4 ? WHITE : K[3]; if (Math.abs(v) <= ww + 1.15) return LINE; });
  }
  return {
    update(dt) { t += dt; },
    draw(p) {
      const rk = pop(t, 0, 0.2) * shrink(t, FINAL + 0.3, FINAL + 0.5);
      if (rk > 0) { if (BACK) band(p, 0, 0, (RX + 4) * rk, 0.32, 3, C[4], C[5], (a) => Math.sin(a) < 0); if (FRONT) band(p, 0, 0, (RX + 4) * rk, 0.32, 3, C[4], C[5], (a) => Math.sin(a) >= 0); }
      const fk = shrink(t, FINAL, FINAL + 0.12);
      if (fk > 0) {
        const a = ang(), front = Math.sin(a) >= 0;
        if (front ? FRONT : BACK) { const x = Math.cos(a) * RX, y = CY + Math.sin(a) * RX * SY; blob(p, Math.cos(a - 0.4) * RX, CY + Math.sin(a - 0.4) * RX * SY, 6 * fk, C[4]); fumaC(p, x, y, 22 * fk, t * 22, 0.66, K[3], C[6], Rc[3]); }
      }
      HITS.slice(0, -1).forEach((h, i) => { const k = pop(t, h, 0.06) * shrink(t, h + 0.05, h + 0.18); if (FRONT && k > 0) star(p, (i % 2 ? 6 : -6), CY - 2, 8 * k, WHITE); });
      const xk = pop(t, FINAL, 0.08) * shrink(t, FINAL + 0.2, FINAL + 0.4);
      if (FRONT && xk > 0) { bar(p, Math.PI / 4, 24 * xk, 4 * xk); bar(p, -Math.PI / 4, 24 * xk, 4 * xk); }
      const pk = pop(t, FINAL + 0.04, 0.16) * shrink(t, FINAL + 0.3, FINAL + 0.5);
      if (pk > 0) for (let i = 0; i < 5; i++) { const g = (i / 5) * TAU + Math.PI / 2, near = Math.sin(g) >= 0; if (near ? !FRONT : !BACK) continue; petal(p, Math.cos(g) * 24, Math.sin(g) * 24 * 0.32, (near ? 14 : 20) * pk, 5 * pk, Math.cos(g) * 5, near ? C[5] : C[4], C[6]); }
    },
  };
}
