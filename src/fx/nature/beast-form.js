// 야수화 (용사 학원 드루이드 dr_2 — 야수의 몸으로 바뀐다) — a great amber bear spirit rises up behind the druid, roars with a shock ring,
// three claw marks rake the air in front, leaves burst off, then the spirit sinks into the body. (0, 0) is the druid's feet; faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { drawLeaf } from "./_lib.js";
import { AMBER, FOREST, LEAF } from "./_druid.js";

export const meta = {
  name: "Beast form",
  desc: "A great amber bear spirit rises behind the druid, its eyes light and it roars with a shock ring, three claw marks rake the air, leaves burst off, then it sinks into the body.",
  tags: ["nature", "buff", "beast", "bear", "transform", "spirit", "one-shot"],
  size: [136, 148], origin: [64, 126], duration: 1.6, loop: false, fps: 30, bg: "light",
  options: { palette: AMBER, leaf: FOREST, seed: 8 },
};

export const ROAR = 0.35;
const RISE = 0.3, CLAW = 0.5, SINK = 1.0, IN = 1.3, SY = 0.32;
// the bear's head and shoulders seen from the front, in units of the druid's height (48 px)
const SIL = [[-31, 0], [-31, -18], [-27, -32], [-18, -42], [-19, -52], [-21, -58], [-17, -63], [-11, -62], [-8, -66], [0, -67], [8, -66], [11, -62], [17, -63], [21, -58], [19, -52], [18, -42], [27, -32], [31, -18], [31, 0]];

export function create(o) {
  const C = fit(o.palette, 8), Fg = fit(o.leaf, 8), L = LEAF(Fg), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[6], C[5], C[4]] }), lights = new Lights(), leaves = [];
  let t = 0, roared = false, clawed = false;
  const up = () => ease.outBack(clamp(t / RISE)), gone = () => ease.inCubic(clamp((t - SINK) / (IN - SINK)));
  const bump = () => { const u = t - ROAR; return u > 0 && u < 0.3 ? 1 + 0.08 * Math.sin(u / 0.3 * Math.PI) : 1; };
  const at = ([x, y]) => { const s = (1 - gone() * 0.6) * bump(), k = clamp(t / RISE), lift = (1 - ease.outCubic(k)) * 26; return [x * s, y * s * (0.75 + 0.25 * up()) + lift, s]; };
  function bear(p) {
    const k = up(), g = gone(), f = (1 - g) * smooth(0, RISE * 0.7, t);
    if (k < 0.02 || f <= 0) return;
    const pts = SIL.map(at);
    for (let y = -68; y <= 0; y++) for (let x = -32; x <= 32; x++) {        // a faint amber body inside the outline
      let inside = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside; }
      if (inside && x % 3 === 0 && y % 2 === 0) p.dot(x, y, C[3], 0.2 * f);
    }
    for (let i = 1; i < pts.length; i++) { p.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], C[5], f); p.line(pts[i - 1][0] + 1, pts[i - 1][1], pts[i][0] + 1, pts[i][1], C[4], 0.6 * f); }
    for (let i = 3; i < pts.length - 3; i += 2) p.glow(pts[i][0], pts[i][1], 8, C[4], 0.18 * f);
    const s = pts[0][2], ey = pts[9][1] + 12 * s, mz = pts[9][1] + 21 * s, lit = smooth(ROAR - 0.1, ROAR, t);
    p.ellipse(0, mz, 7 * s, 5 * s * k, C[4], 0.7 * f); p.dot(0, mz - 3 * s, C[1], f);
    for (const sx of [-1, 1]) { p.disc(sx * 7 * s, ey, 1.4, lit > 0.5 ? C[7] : C[5], f); if (lit > 0) p.glow(sx * 7 * s, ey, 6, C[6], 0.5 * lit * f); }
    if (t > ROAR && t < ROAR + 0.35) { const u = (t - ROAR) / 0.35; p.ellipse(0, mz + 2, 4 * s, (2 + 3 * Math.sin(u * Math.PI)) * s, C[0], f); }
  }
  return {
    update(dt) {
      t += dt;
      if (!roared && t >= ROAR) {
        roared = true; lights.add(0, -40, 60, C[5], 0.6, 0.35);
        for (let i = 0; i < 10; i++) { const a = R.range(0, TAU), s = R.range(40, 110); leaves.push({ x: R.range(-20, 20), y: -R.range(10, 50), vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, a: R.range(0, TAU), va: R.range(-10, 10), fl: R.range(0, TAU), life: R.range(0.6, 0.9) }); }
        for (let i = 0; i < 16; i++) { const a = R.range(0, TAU), s = R.range(60, 160); ps.spawn(P.SPARK, 0, -46, Math.cos(a) * s, Math.sin(a) * s * 0.7, R.range(0.15, 0.35)); }
      }
      if (!clawed && t >= CLAW) { clawed = true; lights.add(30, -30, 30, C[6], 0.6, 0.15); }
      for (let i = leaves.length - 1; i >= 0; i--) { const l = leaves[i]; if ((l.life -= dt) <= 0) { leaves.splice(i, 1); continue; } l.vy += 120 * dt; l.vx *= 1 - 2 * dt; l.x += l.vx * dt; l.y += l.vy * dt; l.a += l.va * dt; l.fl += 10 * dt; }
      if (t > ROAR && t < SINK && R.chance(dt * 16)) ps.spawn(P.EMBER, R.range(-20, 20), -R.range(0, 30), R.range(-6, 6), -R.range(20, 45), R.range(0.5, 0.8), C[R.int(4, 6)], 1);
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      bear(p);
      const u = (t - ROAR) / 0.5;                                        // the roar: a shock ring out from the mouth, and one on the floor
      if (u > 0 && u < 1) {
        const r = 8 + 40 * ease.outCubic(u), a = 1 - u;
        for (let g = 0; g < TAU; g += 0.6 / r) p.dot(Math.cos(g) * r, -46 + Math.sin(g) * r * 0.75, u < 0.25 ? C[7] : C[5], a * 0.8);
        for (let g = 0; g < TAU; g += 0.02) p.dot(Math.cos(g) * (10 + 34 * ease.outCubic(u)), Math.sin(g) * (10 + 34 * ease.outCubic(u)) * SY, C[4], a);
      }
      const c = (t - CLAW) / 0.28;                                       // three claw marks raking down in front
      if (c > 0 && c < 1) for (let i = 0; i < 3; i++) {
        const x0 = 22 + i * 7, y0 = -52 + i * 2, L = 34 * ease.outExpo(clamp(c * 2.5)), f = 1 - smooth(0.4, 1, c);
        for (let d = 0; d < L; d += 0.5) { const v = d / 34, w = Math.sin(v * Math.PI) * 1.6; for (let q = -w; q <= w; q += 0.5) p.dot(x0 + d * 0.35 + q, y0 + d, Math.abs(q) < 0.6 ? WHITE : C[6], f); }
      }
      for (const l of leaves) drawLeaf(p, l.x, l.y, 6, 2.2, l.a, l.fl, L, Math.min(1, l.life / 0.3));
      if (t >= IN && t < IN + 0.2) sparkle(p, 0, -26, 9 * (1 - (t - IN) / 0.2), WHITE, C[6], 0.6);
      ps.draw(p); lights.draw(p);
    },
  };
}
