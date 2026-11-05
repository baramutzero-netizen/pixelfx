// 궁수 시전 바람 — 데포르메 (용사 학원 궁수 · archer-wind 의 굵은 판) — the bowstring snaps in an outlined white star, two thick mint
// swooshes curl forward off the bow and three leaf-blobs hop ahead and shrink. (0, 0) is the archer's chest; faces right.
import { fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { WIND } from "./_archer.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";

export const meta = {
  name: "Archer wind (chunky)",
  desc: "The bowstring snaps in an outlined white star, two thick mint swooshes curl forward off the bow and three leaf-blobs hop ahead and shrink.",
  tags: ["projectiles", "cast", "wind", "bow", "chunky", "one-shot"],
  size: [120, 88], origin: [28, 46], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: WIND },
};

export const HIT = 0.08;
const CX = 10;

export function create(o) {
  const C = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      for (let i = 0; i < 2; i++) {                                        // two swooshes curling forward
        const t0 = HIT + i * 0.08, u = clamp((t - t0) / 0.4), k = pop(t, t0, 0.1) * shrink(t, t0 + 0.3, t0 + 0.5); if (k <= 0) continue;
        const cx = CX + 16 + 26 * ease.outCubic(u) + i * 8, r = (15 + i * 5) * k, a0 = -1.4 + u * 1.6;
        band(p, cx, (i ? 4 : -4), r, 0.6, 4.6 * k, i ? C[5] : C[6], WHITE, (a) => { const d = ((a - a0) % TAU + TAU) % TAU; return d < 2.6; });
      }
      for (let i = 0; i < 3; i++) {                                         // leaf-blobs hopping ahead
        const t0 = HIT + 0.05 + i * 0.07, v = clamp((t - t0) / 0.4), k = pop(t, t0, 0.08) * shrink(t, t0 + 0.25, t0 + 0.45); if (k <= 0) continue;
        blob(p, CX + 12 + 50 * ease.outCubic(v), (i - 1) * 11 - 6 * Math.sin(v * Math.PI), 2.4 * k, C[5], C[6]);
      }
      const s = pop(t, HIT, 0.08) * shrink(t, HIT + 0.12, HIT + 0.3);
      if (s > 0) star(p, CX, 0, 10 * s, C[6]);
    },
  };
}
