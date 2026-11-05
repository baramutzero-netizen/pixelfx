// 전쟁법사 데포르메(-d) 도우미 — holy/_chibi.js 의 굵은 모양에 전쟁법사 빛깔 · 주먹 모양을 더한다. Files starting with _ are helpers, not effects.
import { WHITE } from "../../core/index.js";
import { LINE } from "../holy/_chibi.js";
export * from "../holy/_chibi.js";
export { FORCE, STAR } from "./_forcemage.js";

/** A chunky fist facing right at (x, y), size s (1 ≈ 20 px wide): fill, knuckle lines, highlight, outline. */
export function fistD(p, x, y, s, fill, hi, line = LINE) {
  if (s < 0.15) return;
  const W = 10 * s, H = 8 * s;
  p.shade(x - W - 2, y - H - 2, x + W * 0.8 + 2, y + H + 2, (px, py) => {
    const dx = px - x, dy = py - y, nx = dx / (dx > 0 ? W * 0.75 : W), ny = dy / H, d = nx ** 4 + ny ** 4;
    if (d <= 1) { if (dx > W * 0.3 && Math.abs(((dy + H) % (H / 2)) - H / 4) < 0.6) return line; return dx < -W * 0.2 && dy < -H * 0.3 ? hi : fill; }
    if (d <= 1.35) return line;
  });
}
