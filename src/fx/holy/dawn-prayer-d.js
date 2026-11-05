// 부활의 기도 — 데포르메 (용사 학원 신성 사제 필살기 pr_u · dawn-prayer 의 굵은 판) — a chunky sun-window pops up in the sky (an outlined
// disc ringed by eight round petals, gold and sapphire), five flat beams of dawn fall on the line, and on each of five prayers the beams
// flash white, a thick ring pops across the floor and a few stars hop up; the last prayer pops a big star from the window.
// (0, 0) is the middle of the ally line's floor.
import { fit, clamp, smooth, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE, DAWN } from "./_priest.js";
import { blob, star, band, pop, shrink, LINE } from "./_chibi.js";

export const meta = {
  name: "Dawn prayer (chunky)",
  desc: "A chunky sun-window pops up in the sky, five flat beams of dawn fall on the line; on each of five prayers the beams flash, a thick ring pops on the floor and stars hop up.",
  tags: ["holy", "heal", "revive", "ultimate", "aoe", "dawn", "chunky", "one-shot"],
  size: [304, 200], origin: [152, 146], duration: 2.7, loop: false, fps: 30, bg: "ground",
  options: { palette: DAWN, reach: 120, part: "all" },   // part: back (바닥 층 — 기둥 · 해 창 · 고리 뒤 절반) | front (고리 앞 절반 · 별) | all
};

const OPEN = 0.4, WY = -66, WR = 13, SY = 0.32, NB = 5;
export const PULSES = [0.5, 0.88, 1.26, 1.64, 2.02];
export const FINAL = PULSES[PULSES.length - 1];

export function create(o) {
  const D = fit(o.palette, 8), G = fit(GOLD, 8), C = fit(SAPPHIRE, 8), RX = o.reach;
  const beams = Array.from({ length: NB }, (_, i) => lerp(-RX * 0.8, RX * 0.8, i / (NB - 1)));
  const BACK = o.part !== "front", FRONT = o.part !== "back";
  let t = 0;
  const end = () => shrink(t, FINAL + 0.3, meta.duration - 0.05);
  const flash = () => { for (const h of PULSES) if (t >= h && t < h + 0.1) return true; return false; };
  return {
    update(dt) { t += dt; },
    draw(p) {
      const e = end(), wk = pop(t, 0, 0.2) * e;
      const bk = smooth(OPEN * 0.6, OPEN, t) * e, fl = flash();
      if (bk > 0 && BACK) for (const bx of beams) {                                    // flat beams of dawn, slanting out from the window
        const x0 = bx * 0.08, y0 = WY + WR;
        for (let y = y0; y <= 0; y += 1) {
          const v = (y - y0) / -y0, cx = lerp(x0, bx, v), w = lerp(2, 9, v);
          for (let x = -w; x <= w; x += 1) p.blend(cx + x, y, fl ? WHITE : D[6], bk * (Math.abs(x) > w - 1.5 ? 0.6 : 0.32));
        }
      }
      if (wk > 0 && BACK) {                                                             // the sun-window
        for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU + t * 0.6; blob(p, Math.cos(a) * (WR + 4) * wk, WY + Math.sin(a) * (WR + 4) * wk, 3.6 * wk, i % 2 ? C[5] : G[5], i % 2 ? C[6] : G[6]); }
        blob(p, 0, WY, WR * wk, G[6], WHITE);
        blob(p, 0, WY, WR * 0.5 * wk, C[5], C[6]);
      }
      const fk = pop(t, FINAL, 0.14) * shrink(t, FINAL + 0.2, FINAL + 0.5);
      if (fk > 0 && BACK) star(p, 0, WY, 30 * fk, D[6]);
      const gk = pop(t, OPEN * 0.8, 0.2) * e;                                   // the floor ring that stays
      if (gk > 0) band(p, 0, 0, RX * gk, SY, 4.5, D[5], D[6], BACK && FRONT ? null : BACK ? (a) => Math.sin(a) < 0 : (a) => Math.sin(a) >= 0);
      PULSES.forEach((h, i) => {                                                // a thick ring popping out on each prayer
        const v = clamp((t - h) / 0.35); if (v <= 0 || v >= 1) return;
        const w = 4 * (1 - v); if (w > 0.6) band(p, 0, 0, 14 + (RX - 10) * ease.outCubic(v), SY, w, i === PULSES.length - 1 ? WHITE : G[6], WHITE, BACK && FRONT ? null : BACK ? (a) => Math.sin(a) < 0 : (a) => Math.sin(a) >= 0);
        if (!FRONT) return;
        for (let j = 0; j < 3; j++) {
          const x = (((i * 37 + j * 71) % 100) / 100 - 0.5) * RX * 1.5, k = pop(t, h + j * 0.04, 0.08) * shrink(t, h + 0.2, h + 0.36);
          if (k > 0) star(p, x, -14 - 30 * v - j * 6, 4 * k, j % 2 ? C[6] : WHITE);
        }
      });
    },
  };
}
