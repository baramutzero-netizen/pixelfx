// 수둔·수룡아 (용사 학원 무영객 nj_2) — 1105 여섯째 다시: an eastern water dragon. A dark pool opens behind the target under shafts of
// underwater light; the dragon rises out of it in an S-curve — layered teal scales, a pale banded belly, a finned ridge, a flowing mane,
// swept-back antler horns, whiskers and an amber eye — rears over the target, opens its jaws wide and lunges, snapping shut on the chest
// at 0.35 s (white fangs, a crash of spray), shakes, then breaks into water and sinks back into the pool. (0, 0) is the target's feet.
// part: back (pool, light, body, mane — behind the target, on the ground layer) | front (head, jaws, horns, spray) | all.
import { Rng, fit, hex, clamp, smooth, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { INK, TIDE, ripple } from "./_ninja.js";
import { BITE, POOL, SINK, HEAD, headAt, spine, biteAt } from "./_water-dragon.js";

export const meta = {
  name: "Water fang",
  desc: "An eastern water dragon rises from a pool behind the target in an S-curve — scales, mane, antler horns — lunges and bites the chest, then breaks into water.",
  tags: ["shadow", "water", "dragon", "bite", "one-shot"],
  size: [120, 132], origin: [60, 112], duration: 1.1, loop: false, fps: 30, bg: "dark",
  options: { palette: TIDE, seed: 9, part: "all" },
};

export { BITE };
const SY = 0.32, AMBER = ["#7a3a08", "#e89a1a", "#ffd76a"].map(hex), BONE = ["#4a6a70", "#a8d0cc", "#e4f6f0"].map(hex);

export function create(o) {
  const C = fit(o.palette, 8), K = fit(INK, 8), R = new Rng(o.seed), BACK = o.part !== "front", FRONT = o.part !== "back";
  const [BX, BY] = biteAt();
  const spray = Array.from({ length: 12 }, () => ({ a: R.range(-Math.PI, 0.2), s: R.range(40, 95), r: R.range(0.8, 1.6) }));
  const drops = Array.from({ length: 16 }, (_, i) => ({ u: (i + 0.5) / 16, vx: R.range(-14, 14), vy: R.range(-30, -5) }));
  const bubbles = Array.from({ length: 6 }, (_, i) => ({ x: POOL[0] + R.range(-16, 16), t0: R.range(0, 0.5), v: R.range(40, 70), r: R.range(0.8, 1.6) }));
  let t = 0;
  const dot = (p, x, y, c, k) => { if (y < 2) p.dot(x, y, c, k); };   // nothing below the pool's surface
  const pool = () => smooth(0, 0.12, t) * (1 - smooth(0.88, 1.08, t));
  function body(p, pts, k) {
    const n = pts.length - 1;
    for (let i = n; i >= 0; i--) {                                         // tail end first so the neck lies over it
      const q = pts[i]; if (q.y > 1) continue;
      const r = 2.6 + 3.6 * Math.pow(q.u, 0.55), nx = q.ty, ny = -q.tx;   // n points to the belly side
      for (let o = -r - 0.5; o <= r + 0.5; o += 0.5) {
        const x = q.x + nx * o, y = q.y + ny * o, w = o / r;
        let c;
        if (Math.abs(o) > r - 0.6) c = C[1];                               // the dark rim
        else if (w > 0.4) c = (q.L / 2.4) % 1 < 0.28 ? C[4] : C[5];        // belly plates
        else {
          const f = (q.L / 3.4 + Math.abs(w) * 0.55 + (w < 0 ? 0.5 : 0)) % 1;   // overlapping scales: a dark arc edge, a lit crown
          c = f < 0.2 ? C[2] : w < -0.55 ? C[2] : f > 0.45 && f < 0.6 && w > -0.45 && w < 0 ? C[6] : w < -0.1 ? C[3] : C[4];
        }
        dot(p, x, y, c, k);
      }
      if (q.u > 0.12 && q.u < 0.9) {                                      // the dorsal fin: a low wavy membrane with a spine every few px
        const fh = 1.6 + 1.4 * Math.max(0, Math.sin(q.L * 0.7)), sp = (q.L % 4) < 0.6;
        for (let d = 0; d < (sp ? fh + 1.5 : fh); d += 0.5) dot(p, q.x - nx * (r + d), q.y - ny * (r + d), sp ? (d > fh ? C[6] : C[5]) : C[3], k * (sp ? 1 : 0.8));
      }
    }
  }
  function mane(p, h, k) {
    const c = Math.cos(h.a), s = Math.sin(h.a), nx = s, ny = -c;   // +v = belly side (same as the body's normal)            // back = -dir, dorsal = -n
    for (let j = 0; j < 8; j++) {
      const bu = (-5 - j * 1.6) * HEAD, bv = (-4.5 + j * 0.5) * HEAD, L = (10 + (j % 3) * 3) * HEAD;
      for (let d = 0; d < L; d += 0.5) {
        const wv = Math.sin(d * 0.3 + t * 12 + j) * (0.8 + d * 0.1), u = bu - d * 0.9, v = bv - d * 0.45 + wv;
        const ww = 1.3 * (1 - d / L) + 0.3;                                   // a solid tapering lock (no dither fade — it reads as hair, not spray)
        for (let w2 = -ww; w2 <= ww; w2 += 0.4) dot(p, h.x + c * u + nx * (v + w2), h.y + s * u + ny * (v + w2), w2 < -ww * 0.3 ? C[6] : d > L - 4 ? C[6] : j % 2 ? C[5] : C[4], k);
      }
    }
  }
  function head(p, h, k) {
    const c = Math.cos(h.a), s = Math.sin(h.a), nx = s, ny = -c;   // +v = belly side (same as the body's normal)
    const at = (u, v) => [h.x + (c * u + nx * v) * HEAD, h.y + (s * u + ny * v) * HEAD];
    const fill = (u0, u1, vf, col) => { for (let u = u0; u <= u1; u += 0.33) { const [v0, v1] = vf(u); for (let v = v0; v <= v1; v += 0.33) { const [x, y] = at(u, v); p.dot(x, y, col(u, v, v0, v1), k); } } };
    // horns: two swept-back antlers with a tine
    for (const [hu, hv, L] of [[-2, -4.5, 14], [-4, -2.5, 11]]) {
      const ha = Math.PI + 0.55, hc = Math.cos(ha), hs = Math.sin(ha);
      for (let d = 0; d < L; d += 0.33) { const w = 1.4 * (1 - d / L) + 0.4, u = hu + hc * d, v = hv + hs * d - d * d * 0.012; for (let q = -w; q <= w; q += 0.33) { const [x, y] = at(u + q * 0.3, v + q); p.dot(x, y, q < -w * 0.3 ? BONE[2] : d > L - 3 ? BONE[2] : BONE[1], k); } }
      const tu = hu + hc * L * 0.55, tv = hv + hs * L * 0.55; for (let d = 0; d < 5; d += 0.33) { for (const q of [0, 0.4]) { const [x, y] = at(tu - d * 0.5 + q, tv - d * 0.85); p.dot(x, y, BONE[1], k); } }
    }
    const open = h.open * 0.75;
    // lower jaw: hinged at the back of the mouth, swings down by `open`
    const oc = Math.cos(open), os = Math.sin(open);
    for (let u = 0; u <= 13; u += 0.33) { const w = 2.6 * (1 - u / 16); for (let v = -w; v <= w; v += 0.33) { const lu = 1 + u * oc - (v + 2.5) * os * 0 , lv = 2.5 + u * os + v * oc; const [x, y] = at(lu, lv); p.dot(x, y, Math.abs(v) > w - 0.6 ? C[1] : v < 0 ? C[4] : C[5], k); }
      if (u > 3 && u % 3 < 0.33) { const [x, y] = at(1 + u * oc + 3.2 * os, 2.5 + u * os - 3.2 * oc); p.dot(x, y, WHITE, k); } }
    if (open > 0.15) fill(2, 11, (u) => [0.5, 2.5 + (u - 1) * Math.tan(open) * 0.9], () => K[1]);   // the dark mouth
    // skull and upper snout
    fill(-6, 15, (u) => { const sk = u < 4 ? Math.sqrt(Math.max(0, 1 - ((u + 1) / 6.5) ** 2)) * 5.2 : 0; const sn = u >= 1 ? 3.6 * (1 - (u - 1) / 16) : 0; const top = -Math.max(sk, sn + 0.6), bot = Math.max(u < 4 ? sk * 0.7 : 0, 1.6 * (1 - u / 18)); return [top, bot]; },
      (u, v, v0, v1) => v < v0 + 0.6 || v > v1 - 0.6 ? C[1] : v < v0 + 1.8 && u > -3 ? C[5] : (u * 0.8 + v) % 3 < 0.6 && u < 4 ? C[2] : v > 0 ? C[4] : C[3]);
    for (let u = 3; u <= 13; u += 2.5) { const [x, y] = at(u, 1.9); p.dot(x, y, WHITE, k); const [x2, y2] = at(u + 0.4, 2.6); p.dot(x2, y2, WHITE, k); }   // upper fangs
    const [nx0, ny0] = at(14.2, -0.6); p.dot(nx0, ny0, K[1], k);                                  // nostril
    // whiskers trailing back from the snout
    for (const sv of [-1.2, 1.2]) for (let d = 0; d < 18; d += 0.33) { const u = 12 - d * 0.9, v = sv * (1 + d * 0.35) + Math.sin(d * 0.45 + t * 12) * 1.5; const [x, y] = at(u, v); p.dot(x, y, C[6], k * (1 - d / 20)); }
    // brow ridge and amber eye
    for (let u = -2; u <= 4; u += 0.33) { const [x, y] = at(u, -4.4 + (u - 1) * 0.12); p.dot(x, y, C[6], k); }
    const [ex, ey] = at(1, -2.8); p.glow(ex, ey, 6, AMBER[1], 0.35 * k); p.disc(ex, ey, 2.4, AMBER[0], k); p.disc(ex, ey, 1.9, AMBER[1], k); p.dot(ex - 0.5, ey - 0.5, AMBER[2], k); p.dot(ex + 0.6, ey + 0.2, K[0], k);
  }
  return {
    update(dt) { t += dt; },
    draw(p) {
      const h = headAt(t), k = 1 - smooth(SINK + 0.1, 0.9, t), pk = pool();
      if (BACK) {
        const lk = pk * 0.14;                                              // two faint shafts of underwater light
        if (lk > 0) for (const sx of [-6, 26]) for (let y = -110; y < 2; y++) { const x = sx + (y + 110) * 0.18; for (let q = -4; q <= 4; q++) p.blend(x + q, y, C[6], lk * (1 - Math.abs(q) / 5) * (0.4 + 0.6 * (y + 110) / 112)); }
        if (pk > 0) { p.shade(POOL[0] - 26, -9, POOL[0] + 26, 9, (x, y, out) => { const d = Math.hypot((x - POOL[0]) / 24, y / (24 * SY)); if (d > 1) return; out.a = pk * 0.7; return d > 0.86 ? C[5] : K[1]; });
          for (const ph of [0, 0.5]) { const v = ((t * 1.6 + ph) % 1); ripple(p, POOL[0], 0, 8 + 18 * v, SY, C[6], pk * (1 - v)); } }
        for (const b of bubbles) { const a = t - b.t0; if (a < 0 || a > 0.6) continue; const y = -a * b.v, x = b.x + Math.sin(a * 9 + b.x) * 2; for (let g = 0; g < TAU; g += 0.8) p.dot(x + Math.cos(g) * b.r * 1.4, y + Math.sin(g) * b.r * 1.4, C[6], pk * 0.8); }
        if (k > 0) { const pts = spine(h); mane(p, h, k); body(p, pts, k); }
        const ds = clamp((t - SINK) / 0.4);                                // the body breaking into falling water
        if (ds > 0 && ds < 1) { const pts = spine(headAt(SINK)); for (const d of drops) { const q = pts[Math.floor(d.u * (pts.length - 1))]; const a = ds * 0.4, x = q.x + d.vx * a, y = q.y + d.vy * a + 300 * a * a; if (y < 1) { p.disc(x, y, 1.6, C[5], 1 - ds); p.dot(x - 0.5, y - 0.5, WHITE, 1 - ds); } } }
      }
      if (FRONT) {
        if (k > 0) head(p, h, k);
        const sv = (t - BITE) / 0.32;                                      // the bite: a white flash and a crash of spray
        if (sv > 0 && sv < 1) {
          if (sv < 0.25) { p.glow(BX, BY, 14, C[6], 0.6 * (1 - sv / 0.25)); p.disc(BX, BY, 6 * (1 - sv / 0.25) + 1, WHITE, 1); }
          for (const d of spray) { const a = sv * 0.32, x = BX + Math.cos(d.a) * d.s * a, y = BY + Math.sin(d.a) * d.s * a + 260 * a * a; if (y < 2) p.disc(x, y, d.r, sv < 0.4 ? WHITE : C[6], 1 - sv); }
          for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.45, L = 6 + 14 * ease.outCubic(sv); p.line(BX + Math.cos(a) * 3, BY + Math.sin(a) * 3, BX + Math.cos(a) * L, BY + Math.sin(a) * L, i % 2 ? C[6] : WHITE, 1 - sv); }
        }
      }
    },
  };
}
