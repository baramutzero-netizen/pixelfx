// 무영객 시전 — 데포르메 (ink-ripple 의 굵은 판) — a round ink drop drops to her feet and pops two thick outlined rings across the floor,
// with two droplets hopping up. (0, 0) is her feet.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, blob, band, pop, shrink } from "./_chibi_ninja.js";

export const meta = {
  name: "Ink ripple (chunky)",
  desc: "A round ink drop drops to the feet and pops two thick outlined rings across the floor, with two droplets hopping up.",
  tags: ["shadow", "cast", "water", "ripple", "chunky", "one-shot"],
  size: [104, 56], origin: [52, 40], duration: 0.75, loop: false, fps: 30, bg: "ground",
  options: { palette: TIDE },
};

export const SPLASH = 0.12;
const SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      if (t < SPLASH) blob(p, 0, -28 * (1 - ease.inCubic(clamp(t / SPLASH))), 2.6, K[4], C[6]);
      for (let i = 0; i < 2; i++) { const v = (t - SPLASH - i * 0.12) / 0.45; if (v <= 0 || v >= 1) continue; const w = 3.5 * (1 - v); if (w > 0.6) band(p, 0, 0, 6 + 30 * ease.outCubic(v), SY, w, C[5], C[6]); }
      for (let i = 0; i < 2; i++) { const a = t - SPLASH; if (a < 0) continue; const k = pop(t, SPLASH, 0.08) * shrink(t, SPLASH + 0.2, SPLASH + 0.38); if (k > 0) blob(p, (i ? 7 : -7) * (1 + a * 2), -6 - 30 * a + 60 * a * a, 2 * k, C[6], WHITE); }
    },
  };
}
