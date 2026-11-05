// Extra chunky (데포르메) shapes for the 용사 학원 궁수 -d effects, in the style of ../holy/_chibi.js: a 1 px dark outline round flat fills.
// Files starting with _ are helpers, not effects.
import { WHITE } from "../../core/index.js";
import { LINE } from "../holy/_chibi.js";

const O = 1.15;
const segD = (px, py, x0, y0, x1, y1) => { const dx = x1 - x0, dy = y1 - y0, L = dx * dx + dy * dy || 1, u = Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / L)); return Math.hypot(px - x0 - dx * u, py - y0 - dy * u); };

/** A thick rounded stroke from (x0, y0) to (x1, y1), radius r: fill, a white core line when core, outline. */
export function capsule(p, x0, y0, x1, y1, r, fill, core = false, line = LINE) {
  if (r < 0.4) return;
  p.shade(Math.min(x0, x1) - r - 2, Math.min(y0, y1) - r - 2, Math.max(x0, x1) + r + 2, Math.max(y0, y1) + r + 2, (px, py) => {
    const d = segD(px, py, x0, y0, x1, y1);
    if (d <= r) return core && r >= 1.4 && d < r * 0.4 ? WHITE : fill;
    if (d <= r + O) return line;
  });
}

/** A filled polygon [[x, y], …] with an outline; hi colours the part left of the first edge's middle when given. */
export function shape(p, pts, fill, line = LINE) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  const n = pts.length;
  p.shade(x0 - 2, y0 - 2, x1 + 2, y1 + 2, (px, py) => {
    let inside = false, dm = Infinity;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
      dm = Math.min(dm, segD(px, py, xi, yi, xj, yj));
    }
    if (inside) return fill;
    if (dm <= O) return line;
  });
}

/** A right-pointing chevron (tip at x + s, y), arms s tall, t thick. */
export function chevronR(p, x, y, s, t, fill, line = LINE) {
  p.shade(x - t - 2, y - s - 2, x + s + 2, y + s + 2, (px, py) => {
    const dy = Math.abs(py - y); if (dy > s + O) return;
    const tip = x + s - dy, v = tip - px;
    if (dy <= s && v >= 0 && v <= t) return fill;
    if (v >= -O && v <= t + O) return line;
  });
}
