// 야수 변신 — 데포르메 (용사 학원 드루이드 dr_2 · beast-form 의 굵은 판) — a big flat amber bear spirit pops up behind the druid, its eyes
// light and it roars with a thick shock ring, three chunky claw marks rake the air in front, two leaves hop off, then it sinks into the body.
// part: back (the bear — under the body) | front (ring · claws · leaves) | all. (0, 0) is the druid's feet, facing right.
import { fit, clamp, ease, smooth, lerp, WHITE } from "../../core/index.js";
import { AMBER, FOREST } from "./_druid.js";
import { blob, band, petal, pop, shrink } from "../holy/_chibi.js";
import { polyFill, bar } from "../melee/_chibi_sword.js";

export const meta = {
  name: "Beast form (chunky)",
  desc: "A big flat amber bear spirit pops up behind the druid, its eyes light as it roars with a thick shock ring, three chunky claw marks rake the air, then it sinks into the body.",
  tags: ["nature", "buff", "beast", "bear", "spirit", "chunky", "one-shot"],
  size: [136, 148], origin: [64, 126], duration: 1.6, loop: false, fps: 30, bg: "light",
  options: { palette: AMBER, leaf: FOREST, part: "all" },
};

export const ROAR = 0.35;
const RISE = 0.3, CLAW = 0.5, SINK = 1.0, IN = 1.3, SY = 0.32;
const SIL = [[-31, 0], [-31, -18], [-27, -32], [-18, -42], [-19, -52], [-21, -58], [-17, -63], [-11, -62], [-8, -66], [0, -67], [8, -66], [11, -62], [17, -63], [21, -58], [19, -52], [18, -42], [27, -32], [31, -18], [31, 0]];

export function create(o) {
  const C = fit(o.palette, 8), L = fit(o.leaf, 8), BACK = o.part !== "front", FRONT = o.part !== "back";
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const up = pop(t, 0, RISE), sink = smooth(SINK, IN, t), sc = up * (1 - 0.6 * sink) * 0.82, dy = 0;
      if (BACK && sc > 0.05 && t < IN + 0.05) {
        const pts = SIL.map(([x, y]) => [x * sc, y * sc - 4 + dy]);
        polyFill(p, pts, C[3], (px, py) => (py < -60 * sc + dy ? C[5] : px < -14 * sc ? C[4] : 0));
        const eye = pop(t, ROAR - 0.05, 0.08) * (1 - sink);
        for (const ex of [-8, 8]) blob(p, ex * sc, -48 * sc + dy, (eye > 0 ? 2.6 * eye : 1.6) * sc, eye > 0 ? C[7] : C[1], eye > 0 ? WHITE : 0);
        blob(p, 0, -38 * sc + dy, 5 * sc, C[5], C[6]); blob(p, 0, -41 * sc + dy, 1.8 * sc, C[1]);
      }
      if (!FRONT) return;
      const v = clamp((t - ROAR) / 0.35);
      if (v > 0 && v < 1) band(p, 0, -40, 14 + 30 * ease.outCubic(v), 0.7, 4 * (1 - v) + 0.6, C[5], C[6]);
      for (let i = 0; i < 3; i++) {                                           // claw marks raking the air in front
        const t0 = CLAW + i * 0.04, k = ease.outCubic(clamp((t - t0) / 0.08)) * shrink(t, t0 + 0.18, t0 + 0.34); if (k <= 0) continue;
        const x = 16 + i * 7, y0 = -58 + i * 2;
        bar(p, x, y0, lerp(x, x + 10, k), lerp(y0, y0 + 30, k), 3 * (0.6 + 0.4 * k), C[6], WHITE);
      }
      for (let i = 0; i < 2; i++) { const a = t - CLAW - 0.05; const k = pop(t, CLAW + 0.05, 0.1) * shrink(t, CLAW + 0.35, CLAW + 0.55); if (k > 0) petal(p, (i ? 30 : -24) + (i ? 20 : -20) * a, -30 - 30 * a, 8 * k, 3 * k, i ? 3 : -3, L[4], L[6]); }
    },
  };
}
