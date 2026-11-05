// Shared by the 용사 학원 신성 사제 데포르메(-d) effects: chunky flat shapes with a 1 px dark outline and a white highlight,
// drawn solid (no dithered fades — things pop in with an overshoot and shrink away), to sit with the game's outlined pixel sprites.
// Files starting with _ are helpers, not effects.
import { hex, TAU, WHITE, clamp } from "../../core/index.js";

/** The outline: the dark navy round the game's sprites. */
export const LINE = hex("#2c2450");
/** Pop: 0 → 1 with an overshoot over d seconds from t0 — then hold. */
export const pop = (t, t0, d = 0.14) => { const u = clamp((t - t0) / d); return u <= 0 ? 0 : u >= 1 ? 1 : 1 + 2.2 * Math.pow(u - 1, 3) + 1.2 * Math.pow(u - 1, 2); };
/** Shrink: 1 → 0 between a and b (ease in). */
export const shrink = (t, a, b) => { const u = clamp((t - a) / (b - a)); return 1 - u * u; };

const O = 1.15;   // outline thickness (px)

/** A round blob: fill, outline, a highlight dot up-left when hi. */
export function blob(p, x, y, r, fill, hi = 0, line = LINE) {
  if (r < 0.6) return;
  p.shade(x - r - 2, y - r - 2, x + r + 2, y + r + 2, (px, py) => {
    const dx = px - x, dy = py - y, d = Math.hypot(dx, dy);
    if (d <= r) return hi && r >= 2 && Math.hypot(dx + r * 0.38, dy + r * 0.38) < r * 0.32 ? hi : fill;
    if (d <= r + O) return line;
  });
}

/** A four-point star (tips at s), turned rot: fill, outline, white middle. */
export function star(p, x, y, s, fill, rot = 0, line = LINE) {
  if (s < 1) return;
  const lim = (a) => s * (0.36 + 0.64 * Math.pow(Math.abs(Math.cos(2 * (a - rot))), 2.4));
  p.shade(x - s - 2, y - s - 2, x + s + 2, y + s + 2, (px, py) => {
    const dx = px - x, dy = py - y, d = Math.hypot(dx, dy), L = lim(Math.atan2(dy, dx));
    if (d <= L) return d < s * 0.22 ? WHITE : fill;
    if (d <= L + O) return line;
  });
}

/** A thick ring on a tilted plane (sy), w px wide: fill, outline, a lighter inner edge. keep(angle) picks the part. */
export function band(p, x, y, r, sy, w, fill, inner, keep = null, line = LINE) {
  if (r < 1) return;
  const ry = r * sy;
  p.shade(x - r - w - 2, y - ry - w - 2, x + r + w + 2, y + ry + w + 2, (px, py) => {
    const dx = px - x, dy = (py - y) / sy, d = Math.hypot(dx, dy), e = Math.abs(d - r) * (0.5 + 0.5 * Math.hypot(dx / Math.max(d, 1e-6), (dy * sy) / Math.max(d, 1e-6)));
    if (keep && !keep(Math.atan2(dy, dx))) return;
    if (e <= w / 2) return d < r - w / 6 ? inner : fill;
    if (e <= w / 2 + O) return line;
  });
}

/** A petal standing up from (x, y): height h, width w, tip leaning by lean px: fill with a highlight stripe, outline. */
export function petal(p, x, y, h, w, lean, fill, hi, line = LINE) {
  if (h < 2) return;
  p.shade(x - w - Math.abs(lean) - 2, y - h - 2, x + w + Math.abs(lean) + 2, y + 2, (px, py) => {
    const u = (y - py) / h; if (u < -0.05 || u > 1.08) return;
    const cx = x + lean * u * u, half = w * Math.pow(Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, u)))), 0.7), dx = px - cx;
    if (u >= 0 && u <= 1 && Math.abs(dx) <= half) return dx < -half * 0.25 && dx > -half * 0.7 && u > 0.2 && u < 0.8 ? hi : fill;
    if (Math.abs(dx) <= half + O && u > -0.05 && u < 1.08) return line;
  });
}

/** An up chevron: tip at (x, y - s), arms s wide, t thick. */
export function chevron(p, x, y, s, t, fill, line = LINE) {
  p.shade(x - s - 2, y - s - 2, x + s + 2, y + t + 2, (px, py) => {
    const dx = Math.abs(px - x); if (dx > s + O) return;
    const top = y - s + dx, v = py - top;
    if (dx <= s && v >= 0 && v <= t) return fill;
    if (v >= -O && v <= t + O) return line;
  });
}

/** A plus sign (healing cross): arm half-length s, half-thickness t. */
export function plus(p, x, y, s, t, fill, hi, line = LINE) {
  p.shade(x - s - 2, y - s - 2, x + s + 2, y + s + 2, (px, py) => {
    const dx = Math.abs(px - x), dy = Math.abs(py - y);
    const inside = (dx <= t && dy <= s) || (dy <= t && dx <= s);
    if (inside) return px - x < -t * 0.2 && py - y < 0 && dx <= t && dy <= s * 0.8 ? hi : fill;
    if ((dx <= t + O && dy <= s + O) || (dy <= t + O && dx <= s + O)) return line;
  });
}
