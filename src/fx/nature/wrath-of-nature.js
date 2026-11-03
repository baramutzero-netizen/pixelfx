// 대자연의 진노 (용사 학원 드루이드 필살기 dr_u — 전체 피해와 방어 저하 · 회복) — a ring of moss runes opens under the whole enemy line, thorned roots
// burst up through it six times, faster and faster, in a storm of leaves and spores, then the whole bramble erupts and blooms.
// The canvas is the 5-slot formation's floor.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, lerp, hex } from "../../core/index.js";
import { drawLeaf } from "./_lib.js";
import { FOREST, BARK, SPORE, LEAF } from "./_druid.js";

export const meta = {
  name: "Wrath of nature",
  desc: "A ring of moss runes opens under the line, thorned roots burst up through it six times faster and faster in a storm of leaves and spores, then the whole bramble erupts and blooms.",
  tags: ["nature", "root", "thorn", "ultimate", "aoe", "ground", "one-shot"],
  size: [360, 240], origin: [180, 190], duration: 3.2, loop: false, fps: 30, bg: "ground",
  options: { palette: FOREST, bark: BARK, spore: SPORE, reach: 122, seed: 23 },
};

const PINK = hex("#ff9ac8"), BLUSH = hex("#ffd0e8"), POLLEN = hex("#fff4a0"), OPEN = 0.4, P0 = 0.5, FINAL = 2.2, SY = 0.32, END = 2.85;
// six bursts from 0.5 s to the eruption, each gap 0.8 of the one before — the host hits on each
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 5);
export const HITS = Array.from({ length: 6 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

export function create(o) {
  const C = fit(o.palette, 8), Bk = fit(o.bark, 7), Sp = fit(o.spore, 7), L = LEAF(C), RX = o.reach, R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[7], C[6], C[5]] }), lights = new Lights(), leaves = [], puffs = [];
  // roots: each bursts at one of the hits (two per hit) and again, taller, at the eruption
  const roots = Array.from({ length: 14 }, (_, i) => ({ x: lerp(-RX + 10, RX - 10, (i + R.range(-0.3, 0.3)) / 13), z: R.range(-6, 6), h: R.range(26, 44), H: R.range(54, 86), bend: R.sign() * R.range(6, 16), w: R.range(3.5, 5.5), hit: HITS[R.int(0, HITS.length - 1)], ph: R.range(0, TAU) }));
  const flowers = Array.from({ length: 9 }, () => ({ r: R.int(0, 13), v: R.range(0.55, 0.95), s: R.range(2.5, 4) }));
  const runes = Array.from({ length: 10 }, (_, i) => ({ a: (i / 10) * TAU }));
  let t = 0, j = 0, erupted = false;
  const fade = () => 1 - smooth(END, meta.duration - 0.05, t);
  function height(q) {
    const a = t - q.hit, b = t - FINAL;
    let h = 0;
    if (a > 0) h = q.h * ease.outBack(clamp(a / 0.12)) * (1 - smooth(0.35, 0.6, a));
    if (b > 0) h = Math.max(h, q.H * ease.outBack(clamp(b / 0.14)) * (1 - smooth(0.45, 0.65, t - END + 0.45)));
    return h;
  }
  function root(p, q) {
    const h = height(q);
    if (h < 1) return;
    const N = Math.ceil(h / 2.5), pts = [];
    for (let i = 0; i <= N; i++) { const v = i / N; pts.push([q.x + Math.sin(v * 2.2 + q.ph) * q.bend * v + Math.sin(t * 6 + q.ph) * v * 1.5, q.z - v * h]); }
    for (let i = 0; i < N; i++) {                                       // a tapered bark stroke, lit left, thorns raking down
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1], w = q.w * (1 - i / N) + 0.8;
      for (let d = -w; d <= w; d += 0.6) { const e = (d + w) / (2 * w); p.line(ax + d, ay, bx + d, by, e < 0.3 ? Bk[5] : e > 0.75 ? Bk[2] : Bk[4]); }
      p.dot(ax - w - 0.5, ay, Bk[1]); p.dot(ax + w + 0.5, ay, Bk[1]);
      if (i % 3 === 1 && i < N - 1) { const s = i % 2 ? 1 : -1; p.line(ax + s * w, ay, ax + s * (w + 3), ay + 2, Bk[6]); }
      if (i % 4 === 2) drawLeaf(p, ax + (i % 8 < 4 ? -w - 3 : w + 3), ay, 6, 2, i % 8 < 4 ? -2.6 : -0.5, Math.sin(t * 5 + i), L, 1);
    }
    const [tx, ty] = pts[N];
    p.dot(tx, ty, C[6]);
  }
  return {
    update(dt) {
      t += dt;
      while (j < HITS.length && t >= HITS[j]) {
        const k = 0.6 + j * 0.08; j++;
        lights.add(0, -10, 100, C[4], 0.35 * k, 0.35);
        for (const q of roots) if (Math.abs(q.hit - HITS[j - 1]) < 1e-6) for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + R.range(-1, 1), s = R.range(50, 150); ps.spawn(P.GRIT, q.x, q.z - 1, Math.cos(a) * s, Math.sin(a) * s, R.range(0.4, 0.7), R.pick([Bk[3], Bk[4], C[3]]), 1); }
        for (let i = 0; i < 4; i++) puffs.push({ x: R.range(-RX, RX), y: -R.range(2, 12), r: R.range(3, 5), vx: R.range(-10, 10), vy: -R.range(10, 25), life: Math.min(R.range(0.7, 1.1), meta.duration - 0.1 - t), max: 1 });
      }
      if (!erupted && t >= FINAL) {
        erupted = true; lights.add(0, -30, 160, C[5], 0.7, 0.5); lights.add(0, -30, 60, WHITE, 0.5, 0.1);
        for (let i = 0; i < 40; i++) { const a = R.range(0, TAU), s = R.range(60, 200); leaves.push({ x: R.range(-RX, RX), y: -R.range(10, 60), vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, a: R.range(0, TAU), va: R.range(-10, 10), fl: R.range(0, TAU), life: Math.min(R.range(0.6, 0.95), meta.duration - 0.1 - t) }); }
        for (let i = 0; i < 10; i++) puffs.push({ x: R.range(-RX, RX), y: -R.range(4, 30), r: R.range(5, 8), vx: R.range(-20, 20), vy: -R.range(15, 35), life: Math.min(R.range(0.6, 0.85), meta.duration - 0.1 - t), max: 1 });
      }
      if (t > OPEN * 0.5 && t < FINAL && R.chance(dt * (8 + 30 * t / FINAL))) {   // the leaf storm swirling along the line
        const side = R.sign(); leaves.push({ x: side * (RX + 10), y: -R.range(5, 60), vx: -side * R.range(110, 180), vy: R.range(-30, 20), a: R.range(0, TAU), va: R.range(-12, 12), fl: R.range(0, TAU), life: Math.min(R.range(0.9, 1.4), meta.duration - 0.1 - t) });
      }
      for (const q of puffs) if (!q.max0) { q.max0 = true; q.max = q.life; }
      for (let i = leaves.length - 1; i >= 0; i--) { const l = leaves[i]; if ((l.life -= dt) <= 0) { leaves.splice(i, 1); continue; } l.vy += 60 * dt; l.vy += Math.sin(t * 5 + l.fl) * 80 * dt; l.x += l.vx * dt; l.y = Math.min(-2, l.y + l.vy * dt); l.a += l.va * dt; l.fl += 9 * dt; }
      for (let i = puffs.length - 1; i >= 0; i--) { const q = puffs[i]; if ((q.life -= dt) <= 0) { puffs.splice(i, 1); continue; } q.x += q.vx * dt; q.y += q.vy * dt; q.r += 4 * dt; }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      const u = ease.outCubic(clamp(t / OPEN)), f = fade();
      for (let g = 0; g < TAU * u; g += 0.012) {                        // the moss ring and its runes
        const x = Math.cos(g) * RX, y = Math.sin(g) * RX * SY;
        p.dot(x, y, C[5], f); p.dot(x * 0.94, y * 0.94, C[3], 0.7 * f);
      }
      for (const q of runes) {
        const g = q.a + t * 0.4, x = Math.cos(g) * RX * 0.97, y = Math.sin(g) * RX * SY * 0.97;
        if (g % TAU > TAU * u) continue;
        drawLeaf(p, x, y - 2, 6, 2.4, -Math.PI / 2 + Math.sin(t * 3 + q.a) * 0.4, 0.4, L, f * clamp((t - OPEN * 0.5) / 0.3));
      }
      p.glow(0, 0, RX, C[3], f * (0.12 + 0.1 * Math.sin(t * 8)));
      ps.draw(p, "back");
    },
    draw(p) {
      const f = fade();
      for (const q of puffs) { const a = Math.min(1, q.life / (q.max * 0.5)) * 0.55; p.disc(q.x, q.y, q.r, Sp[4], a); p.disc(q.x - 1, q.y - 1, q.r * 0.6, Sp[5], a); }
      [...roots].sort((a, b) => a.z - b.z).forEach((q) => root(p, q));
      if (t > FINAL) for (const fl of flowers) {                         // flowers opening on the erupted roots
        const q = roots[fl.r], h = height(q), b = ease.outBack(clamp((t - FINAL - 0.1) / 0.2)) * f;
        if (h < 10 || b <= 0) continue;
        const v = fl.v, x = q.x + Math.sin(v * 2.2 + q.ph) * q.bend * v, y = q.z - v * h, s = fl.s * b;
        for (let k = 0; k < 5; k++) { const a = (k / 5) * TAU + t; p.disc(x + Math.cos(a) * s, y + Math.sin(a) * s, s * 0.6, k % 2 ? BLUSH : PINK, f); }
        p.disc(x, y, s * 0.45, POLLEN, f);
      }
      for (const l of leaves) drawLeaf(p, l.x, l.y, 6, 2.2, l.a, l.fl, L, Math.min(1, l.life / 0.3));
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
