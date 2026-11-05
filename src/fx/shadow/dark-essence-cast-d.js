// 암흑사제 시전 — 데포르메 (용사 학원 암흑사제 · dark-essence-cast 의 굵은 판) — three chunky violet wisps spiral in to the staff tip and
// knot into an outlined black orb with a lilac shine, which throbs at 0.62 s with a violet ring popping round it, then shrinks away. (0, 0) is the staff tip.
import { clamp, ease, TAU } from "../../core/index.js";
import { VOIDC, blob, band, star, pop, shrink } from "./_chibi_darkpriest.js";

export const meta = {
  name: "Dark essence cast (chunky)",
  desc: "Three chunky violet wisps spiral in to the staff tip and knot into an outlined black orb, which throbs with a violet ring popping round it, then shrinks away.",
  tags: ["shadow", "cast", "staff", "chunky", "one-shot"],
  size: [96, 88], origin: [60, 44], duration: 1.0, loop: false, fps: 30, bg: "light",
  options: {},
};

const GATHER = 0.5, POP = 0.62;

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      for (let i = 0; i < 3; i++) {
        const u = clamp(t / GATHER); if (u >= 1) break;
        const a = (i / 3) * TAU + u * 4, r = 26 * (1 - ease.inCubic(u)); blob(p, Math.cos(a) * r, Math.sin(a) * r * 0.6, 2.8 * pop(t, i * 0.05, 0.12), VOIDC[4], VOIDC[6]);
      }
      const g = clamp(t / GATHER), th = t >= POP ? 1 + 0.35 * Math.sin(clamp((t - POP) / 0.15) * Math.PI) : 1;
      const r = (2 + 4 * g) * th * shrink(t, 0.75, 0.95);
      if (r > 0.6) blob(p, 0, 0, r, VOIDC[1], VOIDC[5]);
      const v = clamp((t - POP) / 0.3), w = 3.5 * (1 - v); if (t >= POP && w > 0.6) band(p, 0, 0, 6 + 12 * ease.outCubic(v), 0.7, w, VOIDC[4], VOIDC[6]);
      const s = pop(t, POP, 0.08) * shrink(t, POP + 0.06, POP + 0.2); if (s > 0) star(p, 0, 0, 9 * s, VOIDC[6]);
    },
  };
}
