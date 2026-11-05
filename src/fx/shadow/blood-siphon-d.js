// 흡혈 의식 — 데포르메 (용사 학원 암흑사제 dp_1 · blood-siphon 의 굵은 판) — three crimson blobs are pulled out of the body and spiral up
// into an outlined blood orb above the chest, which swells until it leaves at 0.35 s; three drops fall and shrink. (0, 0) is the target's feet.
import { clamp, ease, lerp, TAU } from "../../core/index.js";
import { BLOODC, blob, drop, pop, shrink } from "./_chibi_darkpriest.js";

export const meta = {
  name: "Blood siphon (chunky)",
  desc: "Three crimson blobs are pulled out of the body and spiral up into an outlined blood orb above the chest, which swells until it leaves; drops fall and shrink.",
  tags: ["shadow", "blood", "drain", "chunky", "one-shot"],
  size: [80, 100], origin: [40, 88], duration: 1.0, loop: false, fps: 30, bg: "light",
  options: {},
};

const GATHER = 0.35, OY = -28;
export const LEAVE = GATHER;

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      if (t < GATHER) {
        for (let i = 0; i < 3; i++) {
          const u = clamp((t - i * 0.05) / (GATHER - i * 0.05)); if (u <= 0) continue;
          const a = (i / 3) * TAU + u * 5, r = 12 * (1 - u), y = lerp(-6 - i * 6, OY, ease.inCubic(u));
          blob(p, Math.cos(a) * r, y + Math.sin(a) * r * 0.4, 2.6, BLOODC[3], BLOODC[5]);
        }
        const k = pop(t, 0.02, 0.15), r = (3 + 4 * (t / GATHER)) * k; blob(p, 0, OY, r, BLOODC[3], BLOODC[5]);
      }
      for (let i = 0; i < 3; i++) {                                           // drops falling
        const t0 = GATHER + i * 0.08, a = t - t0; if (a < 0) continue;
        const k = pop(t, t0, 0.06) * shrink(t, t0 + 0.25, t0 + 0.4); if (k > 0) drop(p, (i - 1) * 7, Math.min(-6, OY + 6 + a * a * 300), 2.4 * k, BLOODC[3], BLOODC[5]);
      }
    },
  };
}
