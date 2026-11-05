// A chunky outlined gear for the 용사 학원 시마도사 -d effects. Files starting with _ are helpers, not effects.
import { LINE } from "../holy/_chibi.js";

/** A gear at (x, y): body radius r, n square teeth, turned rot, fill colour, a dark hole. */
export function gearD(p, x, y, r, n, rot, fill, line = LINE) {
  if (r < 1) return;
  p.shade(x - r - 4, y - r - 4, x + r + 4, y + r + 4, (px, py) => {
    const dx = px - x, dy = py - y, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
    const tooth = Math.cos((a - rot) * n) > 0.35, R = r + (tooth ? Math.max(1.2, r * 0.35) : 0);
    if (d < r * 0.35) return line;
    if (d <= R) return fill;
    if (d <= R + 1.15) return line;
  });
}
