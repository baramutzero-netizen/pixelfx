// 천류·풍마수리검 (용사 학원 무영객 필살기 nj_u — 한 명에게 큰 피해) — a great fuma shuriken of water and shadow whirls in and circles the
// target faster and faster, slicing it on each pass (eight cuts, the gaps shrinking), then slams through it: an ink X slash and a water
// flower bursts open round their feet. (0, 0) is the target's feet.
import { Particles, P, Rng, fit, clamp, smooth, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, CRIM, fuma, ripple } from "./_ninja.js";

export const meta = {
  name: "Fuma storm",
  desc: "A great fuma shuriken of water and shadow circles the target faster and faster, slicing on each pass, then slams through: an ink X slash and a water flower bursts open.",
  tags: ["shadow", "water", "shuriken", "ultimate", "multi-hit", "one-shot"],
  size: [220, 168], origin: [110, 128], duration: 2.8, loop: false, fps: 30, bg: "dark",
  options: { palette: TIDE, seed: 21, part: "all" },   // part: back (orbit behind the body + flower back) | front | all
};

/** Eight cuts: 0.5 s to 2.25 s, each gap 0.82 of the one before — the host splits the damage over them. */
export const HITS = (() => { const n = 8, a = 0.5, b = 2.25, r = 0.82, g = (b - a) * (1 - r) / (1 - r ** (n - 1)); return Array.from({ length: n }, (_, i) => +(a + g * (1 - r ** i) / (1 - r)).toFixed(3)); })();
export const FINAL = HITS[HITS.length - 1];
const CY = -26, SY = 0.36, RX = 36;

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), Rc = fit(CRIM, 6), R = new Rng(o.seed);
  const BACK = o.part !== "front", FRONT = o.part !== "back";
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6]] });
  let t = 0, done = 0;
  // orbit angle: each hit is a pass in front of the body (angle π/2 = front). Between hits it goes once round.
  const ang = () => {
    if (t < HITS[0]) { const u = t / HITS[0]; return lerp(-Math.PI * 1.1, Math.PI / 2, ease.outCubic(u)); }
    for (let i = 1; i < HITS.length; i++) if (t < HITS[i]) { const u = (t - HITS[i - 1]) / (HITS[i] - HITS[i - 1]); return Math.PI / 2 + u * TAU; }
    return Math.PI / 2;
  };
  const fade = () => 1 - smooth(FINAL + 0.25, meta.duration - 0.05, t);
  return {
    update(dt) {
      t += dt;
      while (done < HITS.length && t >= HITS[done]) {
        const last = done === HITS.length - 1;
        for (let i = 0; i < (last ? 22 : 6); i++) { const a = R.range(0, TAU), s = R.range(30, last ? 120 : 70); ps.spawn(P.MOTE, 0, CY, Math.cos(a) * s, Math.sin(a) * s - 20, R.range(0.25, 0.45), R.chance(0.5) ? C[6] : WHITE, 1); }
        done++;
      }
      ps.update(dt);
    },
    draw(p) {
      const f = fade();
      if (BACK) { const u = smooth(0, 0.4, t) * f; ripple(p, 0, 0, RX + 6, 0.32, C[4], u * 0.7); ripple(p, 0, 0, RX - 4, 0.32, K[4], u * 0.5); }
      if (t < FINAL + 0.05) {
        const a = ang(), x = Math.cos(a) * RX, y = CY + Math.sin(a) * RX * SY, front = Math.sin(a) >= 0;
        const draw = front ? FRONT : BACK;
        if (draw) {
          for (let i = 1; i <= 4; i++) { const b = a - i * 0.22; p.disc(Math.cos(b) * RX, CY + Math.sin(b) * RX * SY, 14 - i * 2.5, C[4], 0.35 * (1 - i / 5) * f); }   // the wake
          fuma(p, x, y, 20, t * 26, 0.62, K[3], C[6], Rc[3], f);
        }
      }
      for (let i = 0; i < HITS.length - 1; i++) {                           // a slice mark on each pass
        const v = (t - HITS[i]) / 0.18; if (v <= 0 || v >= 1 || !FRONT) continue;
        const sa = (i % 2 ? 0.6 : -0.6), L = 18;
        for (let d = -L; d <= L; d += 0.5) p.dot(Math.cos(sa) * d, CY + Math.sin(sa) * d, Math.abs(d) < 6 ? WHITE : C[6], 1 - v);
      }
      const fv = (t - FINAL) / 0.5;                                          // the final: ink X slash and a water flower
      if (fv > 0 && fv < 1) {
        const k = 1 - fv;
        if (FRONT) for (const sa of [Math.PI / 4, -Math.PI / 4]) { const L = 30 * ease.outCubic(Math.min(1, fv * 3)); for (let d = -L; d <= L; d += 0.5) { const w = 2.4 * (1 - Math.abs(d) / (L + 1)); for (let q = -w; q <= w; q += 0.6) p.dot(Math.cos(sa) * d - Math.sin(sa) * q, CY + Math.sin(sa) * d + Math.cos(sa) * q, Math.abs(q) < 0.8 ? WHITE : K[2], k); } }
        for (let i = 0; i < 10; i++) {                                       // water flower petals round the feet
          const g = (i / 10) * TAU, near = Math.sin(g) >= 0; if (near ? !FRONT : !BACK) continue;
          const h = 20 * ease.outBack(Math.min(1, fv * 2.2)), bx = Math.cos(g) * 24, by = Math.sin(g) * 24 * 0.32;
          for (let s = 0; s < h; s += 0.5) { const v = s / h, w = 3.5 * Math.sin(Math.PI * v); for (let q = -w; q <= w; q += 0.7) p.dot(bx + Math.cos(g) * s * 0.5 + q, by - s, q < -w * 0.4 ? C[6] : C[4], k * (near ? 0.9 : 0.6)); }
        }
      }
      ps.draw(p);
    },
  };
}
