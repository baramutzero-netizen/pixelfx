// 팔라딘 시전 휘두름 — 데포르메 (용사 학원 팔라딘 · paladin-swing 의 굵은 판) — a thick outlined gold crescent sweeps round in front of the
// body in 0.16 s, thins and shrinks away, and three little stars pop along its path. (0, 0) is in front of the chest, as the original.
import { clamp, ease, TAU, WHITE } from "../../core/index.js";
import { PGOLD, arc, star, pop, shrink } from "./_chibi_paladin.js";

export const meta = {
  name: "Paladin swing (chunky)",
  desc: "A thick outlined gold crescent sweeps round in front of the body, thins and shrinks away, and three little stars pop along its path.",
  tags: ["holy", "melee", "swing", "chunky", "one-shot"],
  size: [104, 124], origin: [48, 56], duration: 0.9, loop: false, fps: 30, bg: "dark",
  options: {},
};

const A0 = -2.7, A1 = 1.05, SWEEP = 0.16, R0 = 30, CY = -6;
export const HIT = SWEEP;

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const u = ease.outCubic(clamp(t / SWEEP)), head = A0 + (A1 - A0) * u, tail = Math.max(A0, head - 2.6 * (1 - clamp((t - SWEEP) / 0.3)) - 0.05);
      const w = 9 * shrink(t, SWEEP + 0.05, 0.5);
      if (w > 0.8 && head - tail > 0.1) arc(p, 0, CY, R0, w, tail, head, PGOLD[4], PGOLD[6]);
      for (let i = 0; i < 3; i++) {
        const a = A0 + (A1 - A0) * (0.3 + i * 0.3), t0 = SWEEP * (0.3 + i * 0.3) + 0.04, k = pop(t, t0, 0.08) * shrink(t, t0 + 0.15, t0 + 0.35);
        if (k > 0) star(p, Math.cos(a) * (R0 + 6), CY + Math.sin(a) * (R0 + 6), 4 * k, i === 2 ? WHITE : PGOLD[5]);
      }
    },
  };
}
