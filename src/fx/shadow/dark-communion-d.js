// 어둠의 성찬 — 데포르메 (용사 학원 암흑사제 필살기 dp_u · dark-communion 의 굵은 판) — a thick outlined crimson circle pops under the line,
// three chunky blood blobs spiral up from it into a dark vortex orb that swells on each of eight draughts (each a ring popping across the
// floor and a drop), and at the last it bursts in a big crimson star, then all shrinks away. (0, 0) is the middle of the line's floor.
import { clamp, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { BLOODC, VOIDC, band, blob, star, drop, pop, shrink } from "./_chibi_darkpriest.js";

export const meta = {
  name: "Dark communion (chunky)",
  desc: "A thick crimson circle pops under the line, blood blobs spiral up into a dark orb that swells on each of eight draughts, and at the last it bursts in a big star.",
  tags: ["shadow", "blood", "drain", "ultimate", "aoe", "chunky", "one-shot"],
  size: [304, 288], origin: [152, 232], duration: 3.3, loop: false, fps: 30, bg: "ground",
  options: { reach: 120 },
};

const OPEN = 0.4, FINAL = 2.45, P0 = 0.45, SY = 0.32, OY = -150;
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 7);
export const HITS = Array.from({ length: 8 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

export function create(o) {
  const RX = o.reach;
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const end = shrink(t, FINAL + 0.35, 3.2), rk = pop(t, 0, OPEN) * end;
      if (rk > 0) { band(p, 0, 0, RX * rk, SY, 4.5, BLOODC[3], BLOODC[4]); band(p, 0, 0, RX * 0.5 * rk, SY, 3, BLOODC[2], BLOODC[4]); }
      HITS.forEach((h, i) => {
        const v = clamp((t - h) / 0.3); if (v <= 0 || v >= 1 || h >= FINAL) return;
        const w = 4 * (1 - v); if (w > 0.6) band(p, 0, 0, 10 + RX * 0.9 * ease.outCubic(v), SY, w, BLOODC[4], BLOODC[6]);
        const k = pop(t, h, 0.06) * shrink(t, h + 0.12, h + 0.28), a = i * 2.3;
        if (k > 0) drop(p, Math.cos(a) * RX * 0.6, Math.sin(a) * RX * 0.6 * SY - 14 - 20 * v, 4.5 * k, BLOODC[3], BLOODC[5]);
      });
      const n = HITS.filter((h) => t >= h).length, ok = clamp((t - OPEN) / 0.3);
      if (t < FINAL) {
        for (let i = 0; i < 3; i++) {
          const v = ((t * 0.7 + i / 3) % 1), a = v * TAU * 1.5 + i, y = lerp(0, OY, v), rr = RX * 0.55 * (1 - v), k = pop(t, OPEN + i * 0.1, 0.15);
          if (k > 0) blob(p, Math.cos(a) * rr, y + Math.sin(a) * rr * SY, (5 + 4 * v) * k, BLOODC[3], BLOODC[5]);
        }
        const r = (13 + n * 2) * ok; if (r > 0.6) { blob(p, 0, OY, r + 3, BLOODC[2]); blob(p, 0, OY, r, VOIDC[1], BLOODC[4]); }
      } else {
        const r = (13 + n * 2) * shrink(t, FINAL, FINAL + 0.15); if (r > 0.6) blob(p, 0, OY, r, VOIDC[1], BLOODC[4]);
        const s = pop(t, FINAL, 0.1) * shrink(t, FINAL + 0.15, FINAL + 0.5); if (s > 0) star(p, 0, OY, 40 * s, BLOODC[5]);
        const v = clamp((t - FINAL) / 0.5), w = 6 * (1 - v); if (w > 0.6) band(p, 0, 0, 14 + (RX + 6) * ease.outCubic(v), SY, w, BLOODC[5], WHITE);
      }
    },
  };
}
