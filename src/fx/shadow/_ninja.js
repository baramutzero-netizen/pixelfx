// Shared by the 용사 학원 무영객(ninja) effects: ink-shadow, tide-water and crimson ramps, a kunai, a fuma shuriken and floor ripples.
// Files starting with _ are helpers, not effects.
import { TAU, WHITE } from "../../core/index.js";

/** Ink shadow, dark to bright: night ink, indigo, violet ink, lavender, white. */
export const INK = ["#0a0814", "#18122a", "#2a1e44", "#3e2c62", "#5a4486", "#8070b0", "#b8acdc", "#ffffff"];
/** Tide water, dark to bright: abyss, deep teal, sea, aqua, foam, white. */
export const TIDE = ["#04141c", "#0a2c3c", "#0e4a5e", "#13708a", "#2a9cb4", "#64cade", "#b4ecf4", "#ffffff"];
/** Crimson ribbon (the scarf and sash). */
export const CRIM = ["#2a0610", "#5a0e1e", "#8e1a2e", "#c42c40", "#e85a64", "#ffb0b0"];

/** A kunai pointing along angle a, tip at (x, y), length L: dark steel blade, ring pommel, crimson ribbon. */
export function kunai(p, x, y, a, L, steel, edge, ribbon, k = 1) {
  const c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c;
  for (let d = 0; d < L * 0.55; d += 0.5) { const w = 2.2 * (d / (L * 0.55)); for (let o = -w; o <= w; o += 0.6) p.dot(x - c * d + nx * o, y - s * d + ny * o, o < -w * 0.3 ? edge : steel, k); }
  for (let d = L * 0.55; d < L * 0.85; d += 0.5) p.dot(x - c * d, y - s * d, steel, k);
  const rx = x - c * L * 0.92, ry = y - s * L * 0.92;
  for (let g = 0; g < TAU; g += 0.5) p.dot(rx + Math.cos(g) * 1.6, ry + Math.sin(g) * 1.6, steel, k);
  for (let d = 0; d < L * 0.5; d += 0.5) p.dot(rx - c * d + nx * Math.sin(d * 0.6) * 1.5, ry - s * d + ny * Math.sin(d * 0.6) * 1.5, ribbon, k * (1 - d / (L * 0.5)));
}

/** A four-bladed fuma shuriken at (x, y), radius R, turned rot, squashed vertically by sy: blades curve like hooks. */
export function fuma(p, x, y, R, rot, sy, blade, edge, hub, k = 1) {
  for (let b = 0; b < 4; b++) {
    const a0 = rot + (b / 4) * TAU;
    for (let d = R * 0.2; d < R; d += 0.5) {
      const u = d / R, a = a0 + u * 0.7, w = R * 0.28 * Math.sin(Math.PI * Math.min(1, u * 1.05)) * (1 - u * 0.5);
      for (let o = -w; o <= w; o += 0.7) {
        const aa = a + o / d, px = x + Math.cos(aa) * d, py = y + Math.sin(aa) * d * sy;
        p.dot(px, py, o > w * 0.45 ? edge : blade, k);
      }
    }
  }
  p.disc(x, y, R * 0.24, hub, k); p.disc(x, y, R * 0.1, edge, k);
}

/** A ripple ring on the floor at (x, y), radius r (squash sy), colour c, alpha k. */
export function ripple(p, x, y, r, sy, c, k) {
  if (r < 1 || k <= 0) return;
  for (let g = 0; g < TAU; g += 0.6 / r) p.dot(x + Math.cos(g) * r, y + Math.sin(g) * r * sy, c, k * (Math.sin(g) > 0 ? 1 : 0.6));
}
