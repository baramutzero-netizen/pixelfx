// 수둔·수렁 — 데포르메 (water-mire 의 굵은 판) — a flat dark pool with a thick outlined rim pops open under the enemy line, two rings
// ripple across, and four chunky water tendrils hop up to grip. (0, 0) is the middle of the enemy line's floor.
import { fit, clamp, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, band, blob, pop, shrink, LINE } from "./_chibi_ninja.js";

export const meta = {
  name: "Water mire (chunky)",
  desc: "A flat dark pool with a thick outlined rim pops open under a line of enemies, two rings ripple across it and four chunky water tendrils hop up to grip.",
  tags: ["shadow", "debuff", "slow", "water", "aoe", "chunky", "one-shot"],
  size: [304, 140], origin: [152, 96], duration: 2.0, loop: false, fps: 30, bg: "ground",
  options: { palette: TIDE, reach: 120 },
};

export const GRIP = 0.4;
const SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), RX = o.reach;
  const tend = [-0.75, -0.25, 0.25, 0.75].map((f, i) => ({ x: f * RX, dir: i % 2 ? 1 : -1, t0: GRIP - 0.08 + i * 0.03 }));
  let t = 0;
  function tendril(p, x, h, dir) {
    p.shade(x - 10, -h - 3, x + 10, 3, (px, py) => {
      const v = -py / h; if (v < -0.05 || v > 1.05) return;
      const cx = x + dir * Math.sin(v * 3) * 4 * v, w = 3.2 * (1 - v * 0.6), dx = px - cx;
      if (v >= 0 && v <= 1 && Math.abs(dx) <= w) return dx < -w * 0.3 ? C[6] : C[4];
      if (Math.abs(dx) <= w + 1.15) return LINE;
    });
  }
  return {
    update(dt) { t += dt; },
    draw(p) {
      const k = pop(t, 0, 0.2) * shrink(t, 1.55, 1.95);
      if (k > 0) {
        const rx = RX * k, ry = rx * SY;
        p.shade(-rx - 2, -ry - 2, rx + 2, ry + 2, (x, y) => { const d = Math.hypot(x / rx, y / ry); if (d > 1) return; return d > 0.82 ? C[3] : K[2]; });
        band(p, 0, 0, rx, SY, 4, C[5], C[6]);
        for (let i = 0; i < 2; i++) { const v = (t * 0.8 + i * 0.5) % 1; if (v > 0.05) band(p, 0, 0, rx * 0.2 + rx * 0.6 * v, SY, 2.5 * (1 - v) + 0.6, C[4], C[5]); }
      }
      for (const q of tend) { const kk = pop(t, q.t0, 0.16) * shrink(t, 1.5, 1.8); if (kk > 0) { tendril(p, q.x, 22 * kk, q.dir); blob(p, q.x + q.dir * Math.sin(3) * 4, -22 * kk, 1.6 * kk, C[6], WHITE); } }
    },
  };
}
