// Shared by the 용사 학원 무영객 수룡아(water-fang) effects: the eastern water dragon's path — where the head is, which way it faces and
// how its S-curved body runs back down into the pool, at time t. Both the full and the chunky drawings follow the same path, so the
// bite lands at the same place and moment. Files starting with _ are helpers, not effects.
import { clamp, ease, lerp, smooth } from "../../core/index.js";

/** The bite: jaws snap shut on the target's chest at this moment. */
export const BITE = 0.35;
/** The pool (behind the target, away from the caster) the dragon rises from, and where its jaws close. */
export const POOL = [18, 1];
export const RISE = 0.25, SINK = 0.56;
/** The head's scale against its drawn coordinates (snout 15 units long → 22 px). */
export const HEAD = 1.5;

/** The head at time t: {x, y, a (heading of the snout), open (0 shut .. 1 wide), sink (0 .. 1 as it falls back into water)}. */
export function headAt(t) {
  let x, y, a;
  if (t < RISE) {                                                       // rising out of the pool, snout up-left
    const e = ease.outCubic(clamp(t / RISE));
    x = lerp(POOL[0] + 2, 4, e) + 12 * Math.sin(e * Math.PI); y = lerp(-2, -58, e); a = lerp(-1.75, -2.55, e);
  } else if (t < BITE) {                                                // the lunge: over the target's head and down onto the chest
    const v = ease.inCubic(clamp((t - RISE) / (BITE - RISE)));
    x = lerp(4, 11.5, v); y = lerp(-58, -42, v); a = -2.55 - 1.45 * v;
  } else {
    const sh = Math.sin(t * 90) * (1 - smooth(BITE, SINK, t)) * 0.9;    // shaking the bite
    x = 11.5 + sh; y = -42; a = -4.0;
  }
  const sink = smooth(SINK, 0.95, t);
  const open = t < 0.06 ? 0.2 : t < BITE - 0.05 ? 0.2 + 0.8 * smooth(0.06, BITE - 0.08, t) : t < BITE ? Math.max(0, 1 - (t - (BITE - 0.05)) / 0.05) : 0.12 * smooth(BITE + 0.12, SINK, t);
  return { x, y: y + 44 * ease.inCubic(sink), a, open, sink };
}

/** The body as points from the pool (s = 0) to the back of the skull (s = 1): {x, y, tx, ty (unit tangent), L (length so far)}. */
export function spine(h, n = 70) {
  const c = Math.cos(h.a), s = Math.sin(h.a);
  const P3 = [h.x - c * 7 * HEAD, h.y - s * 7 * HEAD], P2 = [P3[0] - c * 22 + 6, P3[1] - s * 22 - 2], P0 = [POOL[0] - 6, POOL[1] + 6 + 30 * h.sink], P1 = [POOL[0] + 34, P0[1] - 10];   // P1 low and far back: the body bows out behind before rising — an S
  const pts = []; let L = 0, px = 0, py = 0;
  for (let i = 0; i <= n; i++) {
    const u = i / n, m = 1 - u, b0 = m * m * m, b1 = 3 * m * m * u, b2 = 3 * m * u * u, b3 = u * u * u;
    const x = b0 * P0[0] + b1 * P1[0] + b2 * P2[0] + b3 * P3[0], y = b0 * P0[1] + b1 * P1[1] + b2 * P2[1] + b3 * P3[1];
    const dx = 3 * m * m * (P1[0] - P0[0]) + 6 * m * u * (P2[0] - P1[0]) + 3 * u * u * (P3[0] - P2[0]), dy = 3 * m * m * (P1[1] - P0[1]) + 6 * m * u * (P2[1] - P1[1]) + 3 * u * u * (P3[1] - P2[1]), d = Math.hypot(dx, dy) || 1;
    if (i) L += Math.hypot(x - px, y - py);
    pts.push({ x, y, tx: dx / d, ty: dy / d, L, u }); px = x; py = y;
  }
  return pts;
}

/** Where the jaws close (the snout tip at the bite). */
export function biteAt() { const h = headAt(BITE); return [h.x + Math.cos(h.a) * 15 * HEAD, h.y + Math.sin(h.a) * 15 * HEAD]; }
