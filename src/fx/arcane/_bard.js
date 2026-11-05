// Shared by the 용사 학원 음유시인(bard) effects: harp-brass gold, wine-rose and sour-discord ramps, music-note glyphs, sound-wave arcs and a lyre.
// Files starting with _ are helpers, not effects.
import { TAU, WHITE, clamp } from "../../core/index.js";

/** Harp brass, dark to bright: umber, bronze, brass, gold, pale gold, white. */
export const HARP = ["#1e1004", "#4a2a08", "#7a4c10", "#b07a1c", "#dcaa34", "#f4d468", "#fff0b0", "#ffffff"];
/** Wine rose (the cloak and hat), dark to bright. */
export const WINE = ["#1a0610", "#3e0c22", "#6a1634", "#9a2448", "#c84468", "#ec7c96", "#ffc4d0", "#ffffff"];
/** Sour discord: bruise violet into an acid green edge. */
export const SOUR = ["#0e0a18", "#24183a", "#3e2a5a", "#5c3e7a", "#7e5c9a", "#9cc030", "#d0ec6a", "#f4ffd0"];

/**
 * A music note at (x, y) = the middle of its head, head radius s: kind 0 quarter, 1 eighth (flag), 2 two beamed eighths.
 * c fills it, hi (optional) lights the head's upper left, k is the alpha, lean tilts the stem (px over its height).
 */
export function note(p, x, y, s, c, hi = 0, k = 1, kind = 1, lean = 0) {
  if (k <= 0 || s < 0.6) return;
  const head = (hx, hy) => {
    const ca = Math.cos(-0.4), sa = Math.sin(-0.4), rx = s * 1.3, ry = s;
    p.shade(hx - rx - 1, hy - rx - 1, hx + rx + 1, hy + rx + 1, (px, py) => {
      const dx = px - hx, dy = py - hy, u = dx * ca - dy * sa, v = dx * sa + dy * ca;
      if ((u * u) / (rx * rx) + (v * v) / (ry * ry) > 1) return;
      return hi && u < -rx * 0.15 && v < 0 ? hi : c;
    });
  };
  const H = s * 3.6, sx = x + s * 1.05;
  const stem = (bx, by) => { p.line(bx, by, bx + lean, by - H, c, k); if (s >= 2) p.line(bx - 0.6, by, bx - 0.6 + lean, by - H, c, k); };
  if (kind === 2) {
    const x2 = x + s * 3.4, y2 = y - s * 0.6;
    head(x, y); head(x2, y2); stem(sx, y); stem(x2 + s * 1.05, y2);
    for (let w = 0; w < Math.max(1.2, s * 0.8); w += 0.5) p.line(sx + lean, y - H + w, x2 + s * 1.05 + lean, y2 - H + w, c, k);
    return;
  }
  head(x, y); stem(sx, y);
  if (kind === 1) for (let i = 0; i < H * 0.6; i += 0.5) { const u = i / (H * 0.6); p.dot(sx + lean + 0.5 + Math.sin(u * Math.PI * 0.9) * s * 1.3, y - H + i, c, k); }
}

/** Sound-wave arcs: n arcs round (x, y) facing angle face, from radius r spaced gap, spread ±half radians. */
export function waves(p, x, y, r, gap, n, face, half, c, k = 1, w = 1) {
  for (let i = 0; i < n; i++) { const rr = r + i * gap; if (rr < 1) continue; p.arc(x, y, rr, w, face - half, face + half, c, k * (1 - i / (n + 1))); }
}

/** A floor ellipse (radius r, squash sy): dots round it, front half (lower, sin > 0) brighter. keep: "back" | "front" | null picks a half. */
export function floorRing(p, x, y, r, sy, c, k = 1, keep = null, w = 1) {
  if (r < 1 || k <= 0) return;
  for (let g = 0; g < TAU; g += 0.5 / r) {
    const s = Math.sin(g); if (keep === "back" && s > 0) continue; if (keep === "front" && s <= 0) continue;
    for (let o = 0; o < w; o += 0.7) p.dot(x + Math.cos(g) * (r + o), y + s * (r + o) * sy, c, k * (s > 0 ? 1 : 0.65));
  }
}

/**
 * A harp standing on (x, y), height h, like the one she plays: a column on the left, an S-curved neck over the top, a slanted soundboard
 * and n strings between neck and board; str(i) gives each string's extra brightness (0..1), glow lights a plucked string's double.
 */
export function lyre(p, x, y, h, frame, str, ck, k = 1, n = 5, glow = null) {
  if (h < 4 || k <= 0) return;
  const w = h * 0.72, x0 = x - w * 0.45, x1 = x + w * 0.5, yb = y - h * 0.5;
  const neckY = (px) => { const u = clamp((px - x0) / (x1 - x0)); return y - h + h * 0.5 * u + Math.sin(u * TAU) * h * 0.07; };
  const boardY = (px) => y - (y - yb) * clamp((px - (x0 + 2)) / (x1 - x0 - 2));
  for (let s = 0; s < n; s++) {
    const sx = x0 + 3 + (s / (n - 1)) * (x1 - x0 - 8), ty = neckY(sx) + 1.5, by = boardY(sx) - 1.2, a = Math.min(1, 0.5 + (str ? str(s) : 0));
    p.line(sx, ty, sx, by, ck, k * a);
    if (glow && str && str(s) > 0.2) p.line(sx + 1, ty + 1, sx + 1, by - 1, glow, k * str(s) * 0.6);
  }
  for (let i = 0; i <= h; i += 0.5) { p.dot(x0, y - i, frame, k); p.dot(x0 - 1, y - i, frame, k * 0.85); }
  for (let px = x0; px <= x1; px += 0.4) { const py = neckY(px); p.dot(px, py, frame, k); p.dot(px, py + 1, frame, k * 0.85); }
  for (let px = x0 + 2; px <= x1; px += 0.4) { const py = boardY(px); p.dot(px, py, frame, k); p.dot(px + 0.7, py + 1, frame, k * 0.9); p.dot(px + 1.4, py + 2, frame, k * 0.6); }
  p.disc(x0 - 0.5, y - h - 1.5, Math.max(1.2, h * 0.03), frame, k); p.disc(x1, yb, Math.max(1, h * 0.025), frame, k);
}

export { WHITE };
