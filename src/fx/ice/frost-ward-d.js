// 서리 결계 — 데포르메 (용사 학원 마법사 wz_2 · frost-ward 의 굵은 판) — a thick outlined ice ring pops out on the floor under the enemy line,
// ten chunky ice crystals pop up round its rim one after another, a few snowflake stars twinkle over it, and at the end the crystals
// shrink back into the floor one by one. (0, 0) is the middle of the enemy line's floor.
import { clamp, TAU, WHITE } from "../../core/index.js";
import { ICE, band, polyO, star, pop, shrink } from "../arcane/_chibi_wizard.js";

export const meta = {
  name: "Frost ward (chunky)",
  desc: "A thick outlined ice ring pops out on the floor, chunky ice crystals pop up round its rim one after another, snowflake stars twinkle, then the crystals sink away.",
  tags: ["ice", "ward", "aoe", "ground", "chunky", "one-shot"],
  size: [304, 184], origin: [152, 120], duration: 2.8, loop: false, fps: 30, bg: "ground",
  options: { reach: 120 },
};

const DRAW = 0.45, MELT = 2.0, SY = 0.32, NC = 10;

export function create(o) {
  const RX = o.reach;
  const cr = Array.from({ length: NC }, (_, i) => ({ g: (i / NC) * TAU + 0.15, h: 13 + (i % 3) * 4, t0: 0.08 + ((i * 3) % NC) * 0.035, m: MELT + ((i * 7) % NC) * 0.05 })).sort((a, b) => Math.sin(a.g) - Math.sin(b.g));
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const rk = pop(t, 0, 0.25) * shrink(t, MELT + 0.4, 2.7);
      if (rk > 0) { band(p, 0, 0, RX * rk, SY, 4.5, ICE[3], ICE[4]); band(p, 0, 0, RX * 0.55 * rk, SY, 2.5, ICE[2], ICE[3]); }
      for (const c of cr) {                                                   // ice crystals round the rim (far ones first)
        const k = pop(t, c.t0, 0.14) * shrink(t, c.m, c.m + 0.25); if (k <= 0) continue;
        const x = Math.cos(c.g) * RX, y = Math.sin(c.g) * RX * SY, h = c.h * k, w = 4.5 * k;
        polyO(p, [[x, y - h], [x + w, y - h * 0.35], [x + w * 0.6, y + 1], [x - w * 0.6, y + 1], [x - w, y - h * 0.35]], ICE[3], (px) => (px < x - w * 0.15 && px > x - w * 0.75 ? ICE[5] : px > x + w * 0.2 ? ICE[2] : 0));
      }
      for (let i = 0; i < 4; i++) {                                           // snowflake stars twinkling
        const per = 0.6, t0 = DRAW + i * 0.17 + Math.floor((t - DRAW - i * 0.17) / per) * per; if (t < DRAW + i * 0.17 || t > MELT) continue;
        const n = Math.floor((t - DRAW - i * 0.17) / per), x = (((i * 53 + n * 29) % 100) / 100 - 0.5) * RX * 1.4, y = -20 - ((i * 37 + n * 17) % 40);
        const k = pop(t, t0, 0.08) * shrink(t, t0 + 0.2, t0 + 0.4); if (k > 0) star(p, x, y, 4 * k, i % 2 ? WHITE : ICE[5]);
      }
    },
  };
}
