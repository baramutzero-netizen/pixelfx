// 도발 — 외침 · 데포르메 (용사 학원 검투사 sw_1 · taunt-roar 의 굵은 판) — three thick outlined red shout arcs burst out in front one
// after another, widening as they roll forward and shrinking thin, and two orange specks hop off. (0, 0) is the mouth, facing right.
import { fit, clamp, ease, WHITE } from "../../core/index.js";
import { RAGE } from "./_gladiator.js";
import { blob, pop, shrink } from "../holy/_chibi.js";
import { crescent } from "./_chibi_sword.js";

export const meta = {
  name: "Taunt roar (chunky)",
  desc: "Three thick outlined red shout arcs burst out in front one after another, widening as they roll forward and thinning away, two orange specks hop off.",
  tags: ["melee", "cast", "taunt", "shout", "chunky", "one-shot"],
  size: [136, 116], origin: [28, 60], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: RAGE },
};

const WAVES = [0, 0.08, 0.16], LIFE = 0.42, REACH = 86;
export const HIT = 0.25;

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      WAVES.forEach((w0, i) => {
        const v = (t - w0) / LIFE; if (v <= 0 || v >= 1) return;
        const e = ease.outCubic(v), x = 8 + REACH * e * 0.7, r = 12 + 26 * e, th = 10 * (1 - v * 0.8);
        if (th > 0.6 && v < 0.9) crescent(p, x - r, 0, r, -0.9, 0.9, th, i === 1 ? C[5] : C[4], C[6], 1, 1.25);
      });
      for (let i = 0; i < 2; i++) { const v = clamp((t - 0.1) / 0.45), k = pop(t, 0.1, 0.08) * shrink(t, 0.35, 0.55); if (k > 0) blob(p, 16 + 50 * v, (i ? 18 : -18) * v, 2.4 * k, C[5], C[6]); }
      const m = pop(t, 0, 0.08) * shrink(t, 0.2, 0.4);
      if (m > 0) blob(p, 2, 0, 4 * m, C[5], WHITE);
    },
  };
}
