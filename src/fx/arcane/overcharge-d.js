// 마력 과충전 — 데포르메 (overcharge 의 굵은 판) — four chunky crimson dots hop in to the chest, a big star pops at 0.35 s, a thick outlined
// aura ring breathes round the body, two thick rings hop up it and three gold stars orbit. (0, 0) is her feet.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { FORCE, STAR, blob, star, band, pop, shrink } from "./_chibi_forcemage.js";

export const meta = {
  name: "Overcharge (chunky)",
  desc: "Chunky crimson dots hop into the chest, a big star pops, a thick aura ring breathes round the body, two rings hop up it and three gold stars orbit.",
  tags: ["arcane", "buff", "force", "charge", "chunky", "one-shot"],
  size: [112, 120], origin: [56, 106], duration: 1.3, loop: false, fps: 30, bg: "ground",
  options: { palette: FORCE },
};

export const CHARGE = 0.35;
const CY = -26, SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), S = fit(STAR, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const end = shrink(t, 1.0, 1.25);
      for (let i = 0; i < 4; i++) { const u = clamp(t / CHARGE); if (u >= 1) break; const a = (i / 4) * TAU + u * 2, r = 36 * (1 - ease.inCubic(u)); blob(p, Math.cos(a) * r, CY + Math.sin(a) * r * 0.8, 2.4, C[5], WHITE); }
      const ak = pop(t, CHARGE, 0.16) * end;
      if (ak > 0) { const br = 1 + 0.05 * Math.sin(t * 16); band(p, 0, -26, 20 * ak * br, 1.55, 3, C[4], C[6], (a) => Math.sin(a) < 0.2); }
      for (let i = 0; i < 2; i++) { const v = clamp((t - CHARGE - 0.05 - i * 0.25) / 0.4); if (v <= 0 || v >= 1) continue; const w = 4 * (1 - v * 0.7); band(p, 0, -4 - 46 * ease.outCubic(v), 18 * (1 - 0.3 * v), SY, w, C[5], C[6]); }
      for (let i = 0; i < 3; i++) { const a = t * 4 + (i / 3) * TAU, k = pop(t, CHARGE + i * 0.05, 0.1) * end; if (k > 0) star(p, Math.cos(a) * 24, CY - 4 + Math.sin(a) * 8, 3.4 * k, S[5]); }
      const s = pop(t, CHARGE, 0.08) * shrink(t, CHARGE + 0.1, CHARGE + 0.3); if (s > 0) star(p, 0, CY, 12 * s, WHITE);
    },
  };
}
