// 백열권 (용사 학원 무도가 필살기 mo_u — 1103 스물둘째 다시 · 사용자 '주먹만이 아니라 여러가지 장권들을 여러 각도에서 연달아 날리는 느낌') — open palms of white heat
// thrust at the target from every angle, faster and faster, each leaving a glowing hand print where it lands, then one huge palm from the front blasts it.
// (0, 0) is the target's feet; the last palm comes from the left.
import { Particles, Lights, P, PF, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { HEAT, CHI, punchStar } from "./_monk.js";

export const meta = {
  name: "Palm barrage",
  desc: "Open palms of white heat thrust at the target from every angle faster and faster, each leaving a glowing hand print, then one huge palm from the front blasts it in a shockwave.",
  tags: ["impacts", "palm", "combo", "ultimate", "martial", "one-shot"],
  size: [336, 256], origin: [168, 196], duration: 3.0, loop: false, fps: 30, bg: "ground",
  options: { palette: HEAT, chi: CHI, seed: 71 },
};

const P0 = 0.5, FINAL = 2.2, CY = -24, SY = 0.32, IN = 0.07, REACH = 64;
// eight counted palms from 0.5 s to the last one, each gap 0.8 of the one before — the host hits on each
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 7);
export const HITS = Array.from({ length: 8 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

// an open hand in local space, fingers along +x: palm, four fingers, thumb (unit ≈ 1 px at s = 1)
const HAND = (() => {
  const pts = [];
  for (let x = -7; x <= 0; x += 0.5) for (let y = -4.2; y <= 4.2; y += 0.5) if (Math.hypot(Math.max(0, -x - 5), y * 0.9) < 4.5) pts.push([x, y]);
  for (const [fy, L] of [[-3.2, 5.2], [-1.1, 6.4], [1.1, 6.2], [3.2, 4.8]]) for (let x = 0; x <= L; x += 0.5) for (let w = -0.8; w <= 0.8; w += 0.5) pts.push([x, fy + w]);
  for (let u = 0; u <= 1; u += 0.08) for (let w = -0.9; w <= 0.9; w += 0.5) pts.push([-4 + u * 5.5, -4.2 - u * 3.4 + w]);
  return pts;
})();

export function create(o) {
  const C = fit(o.palette, 8), Q = fit(o.chi, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5], Q[6]], haze: C[2] }), lights = new Lights();
  // every angle round the target (the screen plane), never twice in a row from the same side; the counted ones bigger
  let last = 0;
  const pick = () => { let a; do a = R.range(-Math.PI, Math.PI); while (Math.sin(a) > 0.35 || Math.abs(((a - last + Math.PI * 3) % TAU) - Math.PI) < 0.9) /* not from under the floor */; last = a; return a; };
  const palms = [];
  HITS.slice(0, -1).forEach((h) => palms.push({ t: h, a: pick(), s: 2.4, big: true, hx: R.range(-7, 7), hy: CY + R.range(-12, 10), hot: R.chance(0.3) }));
  for (let tt = P0 - 0.1; tt < FINAL - 0.08; tt += 0.04 + 0.07 * (1 - tt / FINAL)) palms.push({ t: tt, a: pick(), s: R.range(1.4, 1.8), big: false, hx: R.range(-10, 10), hy: CY + R.range(-16, 14), hot: R.chance(0.3) });
  palms.push({ t: FINAL, a: Math.PI, s: 4.6, big: true, hx: -4, hy: CY, hot: false, last: true });   // the last one: huge, straight from the front
  const prints = [];
  let t = 0, done = new Set();
  function hand(p, x, y, a, s, col, rim, k) {
    const c = Math.cos(a), n = Math.sin(a);
    const st = Math.max(1, s * 0.55);
    for (const [u, v] of HAND) for (let du = 0; du < st; du += 0.6) for (let dv = 0; dv < st; dv += 0.6) { const U = u + du / s, V = v + dv / s, X = x + (U * c - V * n) * s, Y = y + (U * n + V * c) * s; p.dot(X, Y, rim, k * 0.9); }
    for (const [u, v] of HAND) for (let du = 0; du < st; du += 0.6) for (let dv = 0; dv < st; dv += 0.6) { const U = (u + du / s) * 0.82, V = (v + dv / s) * 0.72, X = x + (U * c - V * n) * s, Y = y + (U * n + V * c) * s; p.dot(X, Y, col, k); }
  }
  return {
    update(dt) {
      t += dt;
      for (const q of palms) if (!done.has(q) && t >= q.t) {
        done.add(q);
        const k = q.last ? 3 : q.big ? 1 : 0.4, d = q.a + Math.PI;                 // sparks fly on through, away from where the palm came from
        lights.add(q.hx, q.hy, 24 * Math.sqrt(k), C[5], 0.5 + 0.2 * k, 0.12);
        for (let i = 0; i < 6 * k; i++) { const b = d + R.range(-0.9, 0.9), sp = R.range(80, 220) * Math.sqrt(k); ps.spawn(P.SPARK, q.hx, q.hy, Math.cos(b) * sp, Math.sin(b) * sp, R.range(0.1, 0.25)); }
        if (q.big) prints.push({ x: q.hx, y: q.hy, a: q.a + Math.PI, s: q.s * 0.9, t0: t, last: q.last });
        if (q.last) for (let i = 0; i < 10; i++) ps.spawn(P.SMOKE, R.range(0, 20), CY + R.range(-10, 10), R.range(30, 90), R.range(-30, 10), Math.min(R.range(0.5, 0.8), meta.duration - 0.1 - t), R.chance(0.5) ? C[2] : C[1], R.range(5, 9), 0, PF.BIG);
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const heat = smooth(P0 - 0.2, FINAL, t) * (1 - smooth(FINAL + 0.1, FINAL + 0.5, t));
      if (heat > 0) p.glow(0, CY, 30 + 20 * heat, C[4], 0.22 * heat);
      for (const pr of prints) {                                       // a glowing hand print where a palm landed, cooling away
        const v = (t - pr.t0) / (pr.last ? 0.6 : 0.45);
        if (v < 0 || v > 1) continue;
        hand(p, pr.x, pr.y, pr.a, pr.s * (1 + 0.15 * v), v < 0.2 ? WHITE : C[5], C[3], (1 - v) * 0.8);
      }
      for (const q of palms) {                                         // each palm: thrust in along its angle, holds a beat on contact, gone
        const u = (t - (q.t - IN)) / IN;
        if (u < 0 || u > 2.2) continue;
        const e = ease.outCubic(clamp(u)), r = REACH * (q.last ? 1.4 : 1) * (1 - e) + 6 * q.s, ca = Math.cos(q.a), sa = Math.sin(q.a);
        const x = q.hx + ca * r, y = q.hy + sa * r, k = u <= 1 ? 1 : 1 - (u - 1) / 1.2, a = q.a + Math.PI;
        if (u < 1.1) for (let d = 0; d < 26 * q.s * (1 - e * 0.6); d += 0.6) { const w = 2.2 * q.s * (1 - d / (26 * q.s)); for (let o2 = -w; o2 <= w; o2 += 0.8) p.dot(x + ca * (d + 6 * q.s) - sa * o2, y + sa * (d + 6 * q.s) + ca * o2, d < 3 ? WHITE : q.hot ? Q[5] : C[5], 0.6 * (1 - d / (26 * q.s))); }
        hand(p, x, y, a, q.s, q.big ? WHITE : q.hot ? Q[6] : C[6], q.hot ? Q[4] : C[4], k);
        if (u >= 1 && u < 1.3 && q.big) punchStar(p, q.hx, q.hy, (q.last ? 18 : 8) * q.s / 1.5, q.hot ? Q[6] : C[6], 1 - (u - 1) / 0.3, 8, q.a);
      }
      const u = t - FINAL;
      if (u >= 0 && u < 0.5) {                                         // the last palm's shockwave: a cone blown out to the right, and a ring on the floor
        const v = clamp(u / 0.35), r = 10 + 64 * ease.outCubic(v), a = 1 - v;
        for (let g = -1.2; g <= 1.2; g += 0.6 / r) p.dot(Math.cos(g) * r, CY + Math.sin(g) * r * 0.8, v < 0.25 ? WHITE : C[5], a);
        for (let g = 0; g < TAU; g += 0.02) p.dot(Math.cos(g) * r * 0.8, Math.sin(g) * r * 0.8 * SY, C[4], a);
      }
      if (u > 0 && u < 0.25) sparkle(p, 0, CY, 14 * (1 - u / 0.25), WHITE, C[6], 0.8);
      ps.draw(p); lights.draw(p);
    },
  };
}
