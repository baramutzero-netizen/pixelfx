// 봉인 해제 — 데포르메 (unseal 의 굵은 판) — three thick outlined gold seal rings pop round her; each squeezes and bursts into three chunky
// shards (0.6 · 1.0 · 1.4 s); at 1.8 s a flat crimson pillar pops up from her feet, a thick floor ring pops out and three chunky flames burn
// round her. part: back (바닥 층 — 고리 뒤 절반 · 기둥) | front (고리 앞 절반 · 조각 · 불꽃 · 별) | all. (0, 0) is her feet.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { FORCE, STAR, blob, star, band, petal, pop, shrink } from "./_chibi_forcemage.js";

export const meta = {
  name: "Unseal (chunky)",
  desc: "Thick gold seal rings pop round her and burst one by one, then a flat crimson pillar pops up, a thick floor ring pops out and chunky flames burn round her.",
  tags: ["arcane", "buff", "force", "unseal", "ultimate", "chunky", "one-shot"],
  size: [228, 200], origin: [114, 160], duration: 2.6, loop: false, fps: 30, bg: "ground",
  options: { palette: FORCE, part: "all" },
};

export const BREAKS = [0.6, 1.0, 1.4];
export const FINAL = 1.8;
const SY = 0.32, SEALS = [{ y: -8, r: 36 }, { y: -30, r: 32 }, { y: -52, r: 28 }];
const BK = (a) => Math.sin(a) < 0, FR = (a) => Math.sin(a) >= 0;

export function create(o) {
  const C = fit(o.palette, 8), S = fit(STAR, 8), BACK = o.part !== "front", FRONT = o.part !== "back";
  let t = 0;
  const end = () => shrink(t, 2.25, 2.55);
  return {
    update(dt) { t += dt; },
    draw(p) {
      SEALS.forEach((s, i) => {
        const b = BREAKS[i], k = pop(t, i * 0.08, 0.16);
        if (t < b) { const sq = t > b - 0.15 ? 1 - 0.15 * Math.sin((t - b + 0.15) / 0.15 * Math.PI) : 1; if (BACK) band(p, 0, s.y, s.r * k * sq, SY, 4, S[4], S[6], BK); if (FRONT) band(p, 0, s.y, s.r * k * sq, SY, 4, S[4], S[6], FR); }
        else if (FRONT) for (let j = 0; j < 3; j++) { const a = (j / 3) * TAU + i, u = clamp((t - b) / 0.4), kk = pop(t, b, 0.06) * shrink(t, b + 0.2, b + 0.4); if (kk > 0) blob(p, Math.cos(a) * (s.r + 20 * u), s.y + Math.sin(a) * (s.r + 20 * u) * SY - 14 * u, 2.6 * kk, S[5], S[6]); }
        if (FRONT && t >= b) { const kk = pop(t, b, 0.06) * shrink(t, b + 0.08, b + 0.22); if (kk > 0) star(p, 0, s.y, 10 * kk, WHITE); }
      });
      const pk = pop(t, FINAL, 0.12) * shrink(t, FINAL + 0.3, FINAL + 0.6);
      if (BACK && pk > 0) for (let y = 0; y > -130 * pk; y--) { const w = 10 * pk; for (let x = -w - 1; x <= w + 1; x++) p.blend(x, y, Math.abs(x) > w ? C[2] : Math.abs(x) < w * 0.35 ? C[6] : C[4], Math.abs(x) > w ? 0.9 : 0.75); }
      const gk = pop(t, FINAL, 0.16) * end();
      if (gk > 0) { if (BACK) band(p, 0, 0, 40 * gk, SY, 4.5, C[4], C[6], BK); if (FRONT) band(p, 0, 0, 40 * gk, SY, 4.5, C[4], C[6], FR); }
      if (FRONT) for (let i = 0; i < 3; i++) { const g = Math.PI / 2 + (i - 1) * 0.9, k = pop(t, FINAL + 0.08 + i * 0.05, 0.12) * end(); if (k > 0) petal(p, Math.cos(g) * 34, Math.sin(g) * 34 * SY, (14 + 3 * Math.sin(t * 12 + i)) * k, 5 * k, Math.sin(t * 9 + i) * 2, C[4], C[6]); }
      const s = pop(t, FINAL, 0.1) * shrink(t, FINAL + 0.12, FINAL + 0.35); if (FRONT && s > 0) star(p, 0, -30, 22 * s, WHITE);
    },
  };
}
