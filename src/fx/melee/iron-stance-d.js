// 철벽 태세 — 데포르메 (용사 학원 검투사 sw_2 · iron-stance 의 굵은 판) — a thick steel ring slams out on the floor, six chunky outlined
// steel plates pop up round the legs and lock with a white glint, two red embers hop up, then the plates sink back into the floor.
// part: back (the far half — under the body) | front (the near half) | all. (0, 0) is the gladiator's feet.
import { fit, clamp, ease, TAU, WHITE } from "../../core/index.js";
import { STEEL, RAGE } from "./_gladiator.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";
import { polyFill } from "./_chibi_sword.js";

export const meta = {
  name: "Iron stance (chunky)",
  desc: "A thick steel ring slams out on the floor, six chunky outlined steel plates pop up round the legs and lock with a white glint, red embers hop up, then the plates sink back.",
  tags: ["melee", "buff", "guard", "shield", "chunky", "one-shot"],
  size: [132, 124], origin: [66, 104], duration: 1.7, loop: false, fps: 30, bg: "light",
  options: { palette: STEEL, fire: RAGE, part: "all" },
};

const PLANT = 0.1, SET = 0.3, FOLD = 1.0, IN = 1.32, RX = 27, SY = 0.32, NP = 6, H = 20;
export const HIT = SET;

export function create(o) {
  const C = fit(o.palette, 8), F = fit(o.fire, 8), BACK = o.part !== "front", FRONT = o.part !== "back";
  const far = (a) => Math.sin(a) < 0, near = (a) => Math.sin(a) >= 0;
  let t = 0;
  function plates(p, wantNear) {
    for (let i = 0; i < NP; i++) {
      const g = (i / NP) * TAU + Math.PI / 6, isNear = Math.sin(g) >= 0; if (isNear !== wantNear) continue;
      const k = pop(t, PLANT + 0.02 + i * 0.025, 0.16) * shrink(t, FOLD + i * 0.02, IN), h = H * k * (isNear ? 0.85 : 1); if (h < 1) continue;
      const x = Math.cos(g) * RX, y = Math.sin(g) * RX * SY, w = 4.5 * (0.6 + 0.4 * Math.abs(Math.sin(g)));
      polyFill(p, [[x - w, y], [x - w, y - h + 3], [x, y - h], [x + w, y - h + 3], [x + w, y]], isNear ? C[4] : C[3], (px, py) => (px < x - w * 0.35 ? C[6] : py > y - 3 ? C[2] : 0));
      if (isNear) { const s = pop(t, SET + i * 0.03, 0.08) * shrink(t, SET + 0.12 + i * 0.03, SET + 0.3 + i * 0.03); if (s > 0) star(p, x - w * 0.4, y - h + 3, 4.5 * s, WHITE); }
    }
  }
  return {
    update(dt) { t += dt; },
    draw(p) {
      const rk = pop(t, PLANT, 0.12) * shrink(t, FOLD, IN + 0.2);
      if (rk > 0) { if (BACK) band(p, 0, 0, (RX + 4) * rk, SY, 4, C[3], C[5], far); if (FRONT) band(p, 0, 0, (RX + 4) * rk, SY, 4, C[3], C[5], near); }
      if (BACK) plates(p, false);
      if (!FRONT) return;
      plates(p, true);
      for (let i = 0; i < 2; i++) { const t0 = SET + 0.1 + i * 0.15, a = t - t0, k = pop(t, t0, 0.08) * shrink(t, t0 + 0.25, t0 + 0.4); if (k > 0) blob(p, i ? 14 : -12, -6 - a * 50, 2.2 * k, F[4], F[6]); }
    },
  };
}
