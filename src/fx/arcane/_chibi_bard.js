// Shared by the 용사 학원 음유시인 데포르메(-d) effects: the holy/_chibi.js shapes plus a chunky outlined music note, a chunky harp,
// a chunky flat sign and a thick arc — flat fills, a 1 px dark outline, a white highlight.
// Files starting with _ are helpers, not effects.
import { WHITE, clamp } from "../../core/index.js";
import { LINE } from "../holy/_chibi.js";
export { LINE, pop, shrink, blob, star, band, petal, chevron, plus } from "../holy/_chibi.js";
export { capsule } from "./_chibi_timemage.js";
export { HARP, WINE, SOUR } from "./_bard.js";

const segD = (px, py, x0, y0, x1, y1) => { const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy || 1, u = clamp(((px - x0) * dx + (py - y0) * dy) / L); return Math.hypot(px - x0 - dx * u, py - y0 - dy * u); };

/** Fill a box by inside(px, py) → colour | 0, and outline it 1 px in line where a neighbour is inside. */
export function solid(p, x0, y0, x1, y1, inside, line = LINE) {
  p.shade(x0 - 2, y0 - 2, x1 + 2, y1 + 2, (px, py) => {
    const c = inside(px, py); if (c) return c;
    if (inside(px + 1, py) || inside(px - 1, py) || inside(px, py + 1) || inside(px, py - 1)) return line;
  });
}

/** A chunky music note, head middle at (x, y), head radius s: kind 1 eighth (a flag), 2 two beamed eighths. Tilted by lean px. */
export function noteC(p, x, y, s, fill, hi = WHITE, kind = 1, lean = 0, line = LINE) {
  if (s < 0.8) return;
  const H = s * 3.4, sw = Math.max(0.9, s * 0.42), x2 = x + s * 3.6, y2 = y - s * 0.7;
  const head = (px, py, hx, hy) => { const dx = px - hx, dy = py - hy, c = Math.cos(-0.4), sn = Math.sin(-0.4), u = dx * c - dy * sn, v = dx * sn + dy * c; return (u * u) / (s * s * 1.8) + (v * v) / (s * s) <= 1 ? (u < -s * 0.3 && v < -s * 0.1 ? 2 : 1) : 0; };
  const sx = x + s * 0.95, sx2 = x2 + s * 0.95;
  const inside = (px, py) => {
    let h = head(px, py, x, y); if (kind === 2 && !h) h = head(px, py, x2, y2);
    if (h) return h === 2 ? hi : fill;
    if (segD(px, py, sx, y, sx + lean, y - H) <= sw) return fill;
    if (kind === 2) { if (segD(px, py, sx2, y2, sx2 + lean, y2 - H) <= sw) return fill; if (segD(px, py, sx + lean, y - H, sx2 + lean, y2 - H) <= sw * 1.5) return fill; }
    else if (kind === 1) { for (let u = 0; u <= 1; u += 0.2) { const fx = sx + lean + Math.sin(u * 2.2) * s * 1.5, fy = y - H + u * s * 2.2; if (Math.hypot(px - fx, py - fy) <= sw * (1.3 - u * 0.5)) return fill; } }
    return 0;
  };
  solid(p, x - s * 1.6, y - H - s * 1.4, (kind === 2 ? x2 : x) + s * 2.6 + Math.abs(lean), y + s * 1.4, inside, line);
}

/** A chunky harp standing on (x, y), height h: column, S-curved neck, slanted board, n strings; lit(i) whitens a string. */
export function harpC(p, x, y, h, frame, dark, str, n = 5, lit = null, line = LINE) {
  if (h < 6) return;
  const w = h * 0.72, x0 = x - w * 0.45, x1 = x + w * 0.5, yb = y - h * 0.5, t = Math.max(1.4, h * 0.05);
  const neckY = (px) => { const u = clamp((px - x0) / (x1 - x0)); return y - h + h * 0.5 * u + Math.sin(u * Math.PI * 2) * h * 0.07; };
  const boardY = (px) => y - (y - yb) * clamp((px - (x0 + 2)) / (x1 - x0 - 2));
  const strs = Array.from({ length: n }, (_, s) => x0 + t + 2 + (s / (n - 1)) * (x1 - x0 - 2 * t - 5));
  const frameAt = (px, py) => {
    if (Math.abs(px - x0) <= t && py <= y + 0.5 && py >= y - h - t) return px < x0 ? frame : dark;
    if (px >= x0 && px <= x1 + t * 0.5 && Math.abs(py - neckY(px)) <= t) return py < neckY(px) ? frame : dark;
    if (px >= x0 && px <= x1 + t * 0.5 && Math.abs(py - boardY(px)) <= t * 1.2) return py < boardY(px) ? frame : dark;
    if (Math.hypot(px - x0, py - (y - h - t)) <= t * 1.5) return frame;
    return 0;
  };
  for (let s = 0; s < n; s++) { const sx = strs[s], ty = neckY(sx) + t, by = boardY(sx) - t; p.line(sx, ty, sx, by, lit && lit(s) > 0.3 ? WHITE : str, 1); if (lit && lit(s) > 0.3) p.line(sx + 1, ty, sx + 1, by, str, lit(s)); }
  solid(p, x0 - t * 2, y - h - t * 3, x1 + t * 2, y + t, frameAt, line);
}

/** A chunky flat (♭) sign at (x, y), size s. */
export function flatC(p, x, y, s, fill, line = LINE) {
  const t = Math.max(0.9, s * 0.32);
  solid(p, x - s * 1.2, y - s * 2.6, x + s * 1.3, y + s * 1.1, (px, py) => {
    if (segD(px, py, x - s * 0.5, y - s * 2.3, x - s * 0.5, y + s * 0.8) <= t) return fill;
    const d = Math.hypot((px - x + s * 0.05) / 1.1, py - y - s * 0.05); if (d <= s * 0.85 && d >= s * 0.85 - t * 1.8 && px > x - s * 0.5) return fill;
    return 0;
  }, line);
}
