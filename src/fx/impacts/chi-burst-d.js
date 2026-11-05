// 기공파 — 맞는 쪽 · 데포르메 (용사 학원 무도가 mo_1 · chi-burst 의 굵은 판) — the chi ball bursts on the chest in a big outlined cyan
// blob that shrinks away, two thick rings (one upright, one tilted) swell and four little stars fly out. (0, 0) is the target's feet.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { CHI } from "./_monk.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";

export const meta = {
  name: "Chi burst (chunky)",
  desc: "The chi ball bursts on the chest in a big outlined cyan blob that shrinks away, two thick rings swell and four little stars fly out.",
  tags: ["impacts", "hit", "chi", "chunky", "one-shot"],
  size: [112, 100], origin: [56, 84], duration: 0.8, loop: false, fps: 30, bg: "light",
  options: { palette: CHI },
};

export const HIT = 0.0;
const CY = -24;

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const v = clamp(t / 0.45), w = 4.5 * (1 - v);
      if (w > 0.6) { band(p, 0, CY, 8 + 22 * ease.outCubic(v), 0.9, w, C[5], C[6]); band(p, 0, CY, 10 + 26 * ease.outCubic(v), 0.32, w, C[4], C[6]); }
      for (let i = 0; i < 4; i++) {
        const a = Math.PI / 4 + (i / 4) * TAU, u = clamp((t - 0.03) / 0.4), d = 8 + 26 * ease.outCubic(u), k = pop(t, 0.03, 0.08) * shrink(t, 0.22, 0.48);
        if (k > 0) star(p, Math.cos(a) * d, CY + Math.sin(a) * d * 0.8, 4.5 * k, C[6]);
      }
      const s = pop(t, 0, 0.08) * shrink(t, 0.1, 0.34);
      if (s > 0) { blob(p, 0, CY, 9 * s, C[5], C[6]); blob(p, 0, CY, 4 * s, C[6], WHITE); }
    },
  };
}
