// 쿠나이 — 꽂히는 순간 · 데포르메 (kunai-strike 의 굵은 판) — a big outlined star pops on the chest beside a stuck chunky kunai, two thick
// water bars cross in an X and shrink, three droplets hop out. (0, 0) is the target's feet.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, CRIM, kunaiC, blob, star, pop, shrink, LINE } from "./_chibi_ninja.js";

export const meta = {
  name: "Kunai strike (chunky)",
  desc: "A big outlined star pops on the chest beside a stuck chunky kunai, two thick water bars cross in an X and shrink, and three droplets hop out.",
  tags: ["shadow", "impact", "kunai", "water", "chunky", "one-shot"],
  size: [80, 84], origin: [40, 74], duration: 0.6, loop: false, fps: 30, bg: "dark",
  options: { palette: TIDE },
};

const CY = -26;

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), R = fit(CRIM, 6);
  let t = 0;
  function bar(p, a, L, w) {
    const c = Math.cos(a), s = Math.sin(a);
    p.shade(-L - 3, CY - L - 3, L + 3, CY + L + 3, (px, py) => { const dx = px, dy = py - CY, u = dx * c + dy * s, v = -dx * s + dy * c, ww = w * (1 - Math.abs(u) / (L + 1)); if (Math.abs(u) > L + 1) return; if (Math.abs(v) <= ww) return Math.abs(v) < ww * 0.4 ? WHITE : C[5]; if (Math.abs(v) <= ww + 1.15) return LINE; });
  }
  return {
    update(dt) { t += dt; },
    draw(p) {
      const xk = pop(t, 0, 0.08) * shrink(t, 0.15, 0.35);
      if (xk > 0) { bar(p, Math.PI / 4, 16 * xk, 3 * xk); bar(p, -Math.PI / 4, 16 * xk, 3 * xk); }
      const kk = shrink(t, 0.35, 0.5); if (kk > 0) kunaiC(p, -2, CY - 1, Math.PI * 0.06, 14 * kk, K[4], R[3]);
      for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + (i - 1) * 1.1, v = clamp((t - 0.04) / 0.3), k = pop(t, 0.04, 0.08) * shrink(t, 0.25, 0.42); if (k > 0) blob(p, Math.cos(a) * 18 * v, CY + Math.sin(a) * 16 * v, 2.2 * k, C[6], WHITE); }
      const s = pop(t, 0, 0.06) * shrink(t, 0.08, 0.24); if (s > 0) star(p, 3, CY, 10 * s, C[6]);
    },
  };
}
