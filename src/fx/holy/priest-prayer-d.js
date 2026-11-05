// 신성 사제 시전 — 데포르메 (용사 학원 신성 사제 · priest-prayer 의 굵은 판) — four chunky dots of light hop into the sapphire gem,
// a big outlined four-point star pops out of it with an overshoot, a thick gold ring with four stubs swells round it, and three little stars hop away.
// (0, 0) is the gem.
import { fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE } from "./_priest.js";
import { blob, star, band, pop, shrink } from "./_chibi.js";

export const meta = {
  name: "Priest prayer (chunky)",
  desc: "Chunky dots of light hop into a sapphire gem, an outlined four-point star pops out of it, a thick gold ring swells round it and three little stars hop away.",
  tags: ["holy", "cast", "staff", "light", "chunky", "one-shot"],
  size: [64, 64], origin: [32, 32], duration: 0.75, loop: false, fps: 30, bg: "dark",
  options: { palette: SAPPHIRE },
};

export const FLARE = 0.22;

export function create(o) {
  const C = fit(o.palette, 8), G = fit(GOLD, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      for (let i = 0; i < 4; i++) {                                         // dots hopping in
        const a = (i / 4) * TAU + 0.8, u = clamp(t / FLARE); if (u >= 1) break;
        const r = 18 * (1 - ease.inCubic(u)); blob(p, Math.cos(a) * r, Math.sin(a) * r, 1.8, C[6], WHITE);
      }
      const s = pop(t, FLARE, 0.12) * shrink(t, 0.38, 0.6);
      const rr = (8 + 5 * smooth(FLARE, 0.5, t)) * shrink(t, 0.45, 0.7);
      if (t >= FLARE && rr > 1) {
        band(p, 0, 0, rr, 1, 2.6, G[5], G[6]);
        for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU + Math.PI / 4 + t * 2; blob(p, Math.cos(a) * (rr + 3), Math.sin(a) * (rr + 3), 1.6, G[5]); }
      }
      blob(p, 0, 0, 3 * shrink(t, 0.55, 0.72), t < FLARE ? C[4] : C[5], WHITE);
      if (s > 0) star(p, 0, 0, 10 * s, C[6]);
      for (let i = 0; i < 3; i++) {                                         // three little stars hop away
        const a = -Math.PI / 2 + (i - 1) * 0.9, v = clamp((t - FLARE - 0.04) / 0.4); if (v <= 0) continue;
        const k = pop(t, FLARE + 0.04, 0.1) * shrink(t, 0.5, 0.7), d = 8 + 14 * ease.outCubic(v);
        if (k > 0) star(p, Math.cos(a) * d, Math.sin(a) * d - 3 * v, 3.5 * k, i === 1 ? G[6] : C[6]);
      }
    },
  };
}
