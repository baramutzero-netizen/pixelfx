// 저주 — 데포르메 (용사 학원 암흑사제 dp_2 · curse-sigil 의 굵은 판) — a thick outlined violet circle pops out on the floor under the enemy line
// with an inner ring, eight chunky thorns pop up round its rim, three violet wisps rise over it again and again, then the thorns sink
// and the circle shrinks away. (0, 0) is the middle of the enemy line's floor.
import { clamp, TAU } from "../../core/index.js";
import { VOIDC, band, polyO, blob, pop, shrink } from "./_chibi_darkpriest.js";

export const meta = {
  name: "Curse sigil (chunky)",
  desc: "A thick outlined violet circle pops out on the floor, chunky thorns pop up round its rim, violet wisps rise over it again and again, then it all sinks away.",
  tags: ["shadow", "curse", "aoe", "ground", "chunky", "one-shot"],
  size: [304, 184], origin: [152, 120], duration: 2.8, loop: false, fps: 30, bg: "ground",
  options: { reach: 120 },
};

const DRAW = 0.45, SINK = 2.1, SY = 0.32, NT = 8;
export const SET = DRAW;

export function create(o) {
  const RX = o.reach;
  const th = Array.from({ length: NT }, (_, i) => ({ g: (i / NT) * TAU + 0.2, h: 10 + (i % 2) * 5, t0: 0.1 + ((i * 3) % NT) * 0.04 })).sort((a, b) => Math.sin(a.g) - Math.sin(b.g));
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const end = shrink(t, SINK + 0.3, 2.7), rk = pop(t, 0, DRAW) * end;
      if (rk > 0) { band(p, 0, 0, RX * rk, SY, 4.5, VOIDC[4], VOIDC[5]); band(p, 0, 0, RX * 0.5 * rk, SY, 3, VOIDC[3], VOIDC[5]); }
      for (const q of th) {
        const k = pop(t, q.t0, 0.14) * shrink(t, SINK, SINK + 0.3); if (k <= 0) continue;
        const x = Math.cos(q.g) * RX, y = Math.sin(q.g) * RX * SY, h = q.h * k, w = 3.5 * k;
        polyO(p, [[x + w * 0.4, y - h], [x + w, y + 1], [x - w, y + 1]], VOIDC[2], (px) => (px < x - w * 0.1 ? VOIDC[4] : 0));
      }
      for (let i = 0; i < 3; i++) {                                           // wisps rising, over and over
        const per = 0.8, s0 = DRAW + i * 0.25; if (t < s0 || t > SINK + 0.2) continue;
        const n = Math.floor((t - s0) / per), t0 = s0 + n * per, a = t - t0;
        const k = pop(t, t0, 0.12) * shrink(t, t0 + 0.45, t0 + 0.7), x = (((i * 41 + n * 23) % 100) / 100 - 0.5) * RX * 1.3;
        if (k > 0) blob(p, x, -8 - a * 40, 4.5 * k, VOIDC[4], VOIDC[6]);
      }
    },
  };
}
