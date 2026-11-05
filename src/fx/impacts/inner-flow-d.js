// 내공 순환 — 데포르메 (용사 학원 무도가 mo_2 · inner-flow 의 굵은 판) — a thick gold ring pops on the floor, four gold blobs spiral up
// round the body and gather at the navel, which flares in an outlined star at 0.75 s while a thick aura ring hugs the body and shrinks.
// (0, 0) is the monk's feet.
import { fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { INNER } from "./_monk.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";

export const meta = {
  name: "Inner flow (chunky)",
  desc: "A thick gold ring pops on the floor, four gold blobs spiral up round the body to the navel, which flares in an outlined star as a thick aura ring hugs the body.",
  tags: ["impacts", "buff", "chi", "aura", "chunky", "one-shot"],
  size: [96, 120], origin: [48, 104], duration: 1.6, loop: false, fps: 30, bg: "light",
  options: { palette: INNER },
};

export const GATHER = 0.3;
const FLARE = 0.75, NAVEL = -20, SY = 0.32;

export function create(o) {
  const G = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const rk = pop(t, 0, 0.14) * shrink(t, 1.2, 1.5);
      if (rk > 0) band(p, 0, 0, 20 * rk, SY, 4, G[4], G[6]);
      for (let i = 0; i < 4; i++) {                                          // blobs spiralling up to the navel
        const u = clamp((t - 0.08 - i * 0.04) / (FLARE - 0.12)); if (u <= 0 || u >= 1) continue;
        const a = i * (TAU / 4) + u * 7, r = 16 * (1 - u * 0.8), y = -4 + (NAVEL + 4) * u;
        blob(p, Math.cos(a) * r, y + Math.sin(a) * r * SY, 2.6, G[5], G[6]);
      }
      const ak = pop(t, FLARE, 0.12) * shrink(t, FLARE + 0.35, 1.25);         // the aura ring hugging the body
      if (ak > 0) band(p, 0, -24, 17 * ak + 3, 1.7, 3.2 * ak, G[5], G[6]);
      const s = pop(t, FLARE, 0.08) * shrink(t, FLARE + 0.12, FLARE + 0.32);
      if (s > 0) star(p, 0, NAVEL, 13 * s, G[6]);
      for (let i = 0; i < 3; i++) { const t0 = FLARE + 0.06 + i * 0.1, v = clamp((t - t0) / 0.4), k = pop(t, t0, 0.08) * shrink(t, t0 + 0.25, t0 + 0.4); if (k > 0) blob(p, (i - 1) * 16, NAVEL - 10 - 30 * v, 2.4 * k, G[6], WHITE); }
    },
  };
}
