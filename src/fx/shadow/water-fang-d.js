// 수둔·수룡아 — 데포르메 (water-fang 의 굵은 판 · 1105 여섯째 다시: 동양 수룡) — the same path as water-fang: a chunky outlined water dragon
// rises from a puddle behind the target in an S-curve (round body beads with a pale belly, little fin spikes, three mane tufts), its big
// round head with two chunky swept-back horns and a big eye leans over, opens its jaws and bites the chest at 0.35 s (a star pops),
// then it pops into three water blobs and sinks. (0, 0) is the target's feet.
// part: back (puddle, body, fins, mane — behind the target, ground layer) | front (head, horns, jaws, bite star, blobs) | all.
import { fit, hex, clamp, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, blob, star, band, pop, shrink, LINE } from "./_chibi_ninja.js";
import { BITE, POOL, SINK, HEAD, headAt, spine, biteAt } from "./_water-dragon.js";

export const meta = {
  name: "Water fang (chunky)",
  desc: "A chunky outlined eastern water dragon rises from a puddle behind the target, its big horned head leans over and bites the chest, then it pops into water blobs.",
  tags: ["shadow", "water", "dragon", "bite", "chunky", "one-shot"],
  size: [120, 132], origin: [60, 112], duration: 1.1, loop: false, fps: 30, bg: "dark",
  options: { palette: TIDE, part: "all" },
};

export { BITE };
const SY = 0.32, AMBER = ["#e89a1a", "#ffd76a"].map(hex), BONE = ["#a8d0cc", "#e4f6f0"].map(hex), O = 1.15;

/** An outlined capsule from (x0, y0) radius r0 to (x1, y1) radius r1. hi colours the side toward -normal (the lit edge). */
function capsule(p, x0, y0, x1, y1, r0, r1, fill, hi) {
  const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1, R = Math.max(r0, r1) + 2;
  p.shade(Math.min(x0, x1) - R, Math.min(y0, y1) - R, Math.max(x0, x1) + R, Math.max(y0, y1) + R, (px, py) => {
    const u = clamp(((px - x0) * dx + (py - y0) * dy) / L2), cx = x0 + dx * u, cy = y0 + dy * u, d = Math.hypot(px - cx, py - cy), r = lerp(r0, r1, u);
    if (d <= r) return hi && ((px - cx) * -dy + (py - cy) * dx) / Math.sqrt(L2) > r * 0.35 ? hi : fill;
    if (d <= r + O) return LINE;
  });
}

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), BACK = o.part !== "front", FRONT = o.part !== "back";
  const [BX, BY] = biteAt();
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const h = headAt(t), k = pop(t, 0, 0.14) * shrink(t, SINK + 0.12, SINK + 0.3), c = Math.cos(h.a), s = Math.sin(h.a), nx = s, ny = -c;
      const at = (u, v) => [h.x + (c * u + nx * v) * HEAD, h.y + (s * u + ny * v) * HEAD];
      if (BACK) {
        const pk = pop(t, 0, 0.12) * shrink(t, 0.85, 1.05);
        if (pk > 0) { p.shade(POOL[0] - 22 * pk, -8 * pk, POOL[0] + 22 * pk, 8 * pk, (x, y) => { const d = Math.hypot((x - POOL[0]) / (22 * pk), y / (22 * pk * SY)); if (d <= 1) return K[2]; }); band(p, POOL[0], 0, 22 * pk, SY, 3, C[5], C[6]); }
        if (k > 0) {
          const pts = spine(h);
          for (let i = 0; i < 3; i++) {                                     // three mane tufts streaming back from the skull
            const [x0, y0] = at(-4 - i * 2.2, -3 + i * 1.6), [x1, y1] = at(-13 - i * 3 + Math.sin(t * 12 + i) * 1.2, -7 + i * 2.2);
            capsule(p, x0, y0, x1, y1, 3 * k, 1 * k, i % 2 ? C[4] : C[3], C[5]);
          }
          for (let i = 0; i < pts.length; i += 3) {                         // the body: beads from the pool up to the head (the neck lies over)
            const q = pts[i]; if (q.y > 0) continue;
            const r = (2.8 + 3.2 * Math.pow(q.u, 0.55)) * k, bx = q.ty, by = -q.tx;
            if (i % 12 === 0 && q.u > 0.15 && q.u < 0.9) capsule(p, q.x - bx * r * 0.6, q.y - by * r * 0.6, q.x - bx * (r + 3.5), q.y - by * (r + 3.5) - 0.5, 1.8 * k, 0.4, C[5], 0);   // a fin spike
            blob(p, q.x, q.y, r, C[3], 0);
            if (i % 8 === 0) blob(p, q.x - bx * r * 0.3, q.y - by * r * 0.3, r * 0.25, C[4], 0, C[3]);   // a scale glint
          }
          for (let i = 0; i < pts.length; i += 2) { const q = pts[i]; if (q.y > 0 || q.u > 0.94) continue; const r = (2.8 + 3.2 * Math.pow(q.u, 0.55)) * k;   // the pale belly band, over all the beads
            blob(p, q.x + q.ty * r * 0.5, q.y - q.tx * r * 0.5, r * 0.42, i % 6 < 2 ? C[4] : C[5], 0, C[4]); }
        }
      }
      if (FRONT) {
        if (k > 0) {
          for (const [hu, hv, L] of [[-2, -4.8, 12], [-4.5, -2.6, 9]]) { const [x0, y0] = at(hu, hv), [x1, y1] = at(hu - L * 0.85, hv - L * 0.55); capsule(p, x0, y0, x1, y1, 1.9 * k, 0.7 * k, BONE[0], BONE[1]); }   // chunky horns, swept back
          const op = h.open * 0.8;                                         // lower jaw: an outlined wedge hinged at the cheek
          const [jx0, jy0] = at(1, 2.2), [jx1, jy1] = at(1 + 12 * Math.cos(op), 2.2 + 12 * Math.sin(op));
          if (op > 0.15) { const [mx, my] = at(6, 2.6 + 2 * op); blob(p, mx, my, 3.4 * op * k, K[1], 0); }   // the dark mouth
          capsule(p, jx0, jy0, jx1, jy1, 2.6 * k, 1.1 * k, C[4], C[5]);
          for (let f = 0.35; f < 0.95; f += 0.25) { const [fx, fy] = at(1 + 12 * f * Math.cos(op) + 1.3 * Math.sin(op), 2.2 + 12 * f * Math.sin(op) - 1.3 * Math.cos(op)); p.dot(fx, fy, WHITE, 1); p.dot(fx, fy - 1, WHITE, 1); }
          const [sx0, sy0] = at(2, 0), [sx1, sy1] = at(15, 0.6); capsule(p, sx0, sy0, sx1, sy1, 3.6 * k, 1.7 * k, C[4], C[5]);   // the upper snout
          for (let f = 0.3; f < 0.95; f += 0.25) { const [fx, fy] = at(2 + 13 * f, 2.3); p.dot(fx, fy, WHITE, 1); p.dot(fx + 0.6, fy + 0.8, WHITE, 1); }
          const [hx, hy] = at(-1, -0.6); blob(p, hx, hy, 7.2 * k, C[3], C[5]);   // the round skull
          const [ex, ey] = at(0.6, -2.6); blob(p, ex, ey, 2.6 * k, WHITE, 0); p.disc(ex + 0.4, ey + 0.2, 1.6 * k, AMBER[0], 1); p.dot(ex - 0.6, ey - 0.8, WHITE, 1);   // the big eye
          const [wx0, wy0] = at(13, 1.4), [wx1, wy1] = at(6 + Math.sin(t * 10) * 1.5, 7); capsule(p, wx0, wy0, wx1, wy1, 0.9 * k, 0.4, C[6], 0);   // one whisker
        }
        const sk = pop(t, BITE, 0.07) * shrink(t, BITE + 0.08, BITE + 0.26); if (sk > 0) star(p, BX, BY, 10 * sk, C[6]);
        for (let i = 0; i < 3; i++) { const kk = pop(t, SINK, 0.08) * shrink(t, SINK + 0.12, SINK + 0.32), a = t - SINK; if (kk > 0) blob(p, h.x + (i - 1) * 9, h.y - 4 + a * 50 + i * 3, 2.6 * kk, C[5], C[6]); }
      }
    },
  };
}
