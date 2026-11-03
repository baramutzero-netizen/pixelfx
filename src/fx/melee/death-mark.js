// 암살 (용사 학원 암살자 필살기 ro_u — 빈사의 적에게 추가 피해) — the target is marked with a violet reticle, then cut eight times from every side,
// faster and faster, and finished with one great X that bursts into ink and shards. (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, sparkle, TAU, WHITE } from "../../core/index.js";
import { through, slash, star } from "./_lib.js";
import { SHADE, INK } from "./_rogue.js";

export const meta = {
  name: "Death mark",
  desc: "A violet reticle closes on the target, then eight dagger cuts flash through it from every side faster and faster, and one great X finishes it in a burst of ink and shards.",
  tags: ["melee", "slash", "dagger", "ultimate", "execute", "shadow", "one-shot"],
  size: [248, 184], origin: [124, 140], duration: 3.1, loop: false, fps: 30, bg: "ground",
  options: { palette: SHADE, ink: INK, seed: 31 },
};

const CY = -24, MARK = 0.45, P0 = 0.5, FINAL = 2.2, SY = 0.32;
// eight cuts from 0.5 s to the finish, each gap 0.8 of the one before — the host hits on each
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 7);
export const HITS = Array.from({ length: 8 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

export function create(o) {
  const C = fit(o.palette, 8), K = fit(o.ink, 6), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5], K[4]] }), lights = new Lights(), drops = [];
  const cuts = HITS.slice(0, -1).map((h, i) => { const a = (i * 2.4 + R.range(-0.3, 0.3)) % TAU; return { ...through(R.range(-3, 3), CY + R.range(-6, 6), a, R.sign(), 60, 1.15, 0.5), W: 8, t0: h - 0.05, sweep: 0.05, hold: 0.03, trail: 0.16, ramp: C, lens: true }; });
  const X1 = { ...through(0, CY, 0.8, -1, 90, 1.2, 0.5), W: 11, t0: FINAL - 0.06, sweep: 0.06, hold: 0.1, trail: 0.3, ramp: C, lens: true, hot: 0.6 };
  const X2 = { ...through(0, CY, 2.34, 1, 90, 1.2, 0.5), W: 11, t0: FINAL - 0.02, sweep: 0.06, hold: 0.1, trail: 0.3, ramp: C, lens: true, hot: 0.6 };
  const spikes = Array.from({ length: 10 }, (_, i) => ({ a: (i / 10) * TAU, len: i % 2 ? 12 : 24, w: i % 2 ? 1.6 : 3 }));
  let t = 0, j = 0, fin = false;
  const ink = (n, sp) => { for (let i = 0; i < n; i++) { const a = R.range(0, TAU), s = R.range(40, 150) * sp; drops.push({ x: 0, y: CY, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 40, s: R.range(0.8, 1.8) }); } };
  return {
    update(dt) {
      t += dt;
      while (j < HITS.length - 1 && t >= HITS[j]) { j++; lights.add(0, CY, 34, C[5], 0.5, 0.12); ink(4, 1); for (let i = 0; i < 8; i++) { const a = R.range(0, TAU), s = R.range(80, 200); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * s, Math.sin(a) * s * 0.8, R.range(0.1, 0.25)); } }
      if (!fin && t >= FINAL) {
        fin = true; lights.add(0, CY, 90, C[6], 0.9, 0.3); lights.add(0, CY, 30, WHITE, 0.8, 0.1); ink(30, 1.6);
        for (let i = 0; i < 26; i++) { const a = R.range(0, TAU), s = R.range(120, 320); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.15, 0.4)); }
      }
      if (t < FINAL + 0.4 && R.chance(dt * 14)) { const a = R.range(0, TAU); ps.spawn(P.SMOKE, Math.cos(a) * 30, Math.sin(a) * 30 * SY, -Math.cos(a) * 10, -R.range(6, 16), Math.min(R.range(0.5, 0.8), meta.duration - 0.1 - t), C[1], R.range(4, 7)); }
      for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; d.vy += 500 * dt; d.x += d.vx * dt; d.y += d.vy * dt; if (d.y >= 0) { drops.splice(i, 1); } }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = 1 - smooth(FINAL + 0.5, meta.duration - 0.1, t);
      // the floor gone dark under it, an ink ring that tightens
      const dk = smooth(0, 0.3, t) * f;
      for (let g = 0; g < TAU; g += 0.02) { const r = 34 - 6 * smooth(0, FINAL, t); p.dot(Math.cos(g) * r, Math.sin(g) * r * SY, C[3], dk * 0.8); p.dot(Math.cos(g) * (r - 3), Math.sin(g) * (r - 3) * SY, C[1], dk * 0.6); }
      // the reticle: closes in on the chest and stays while the cuts land
      const m = ease.outCubic(clamp(t / MARK)), mk = smooth(0, 0.15, t) * (1 - smooth(FINAL - 0.05, FINAL + 0.1, t));
      if (mk > 0) {
        const r = 40 - 22 * m, spin = t * 1.2;
        for (let g = 0; g < TAU; g += 0.6 / r) if (Math.sin(g * 4 + spin * 4) > -0.3) p.dot(Math.cos(g) * r, CY + Math.sin(g) * r, C[5], mk);
        for (let i = 0; i < 4; i++) { const g = spin + (i * Math.PI) / 2; for (let d = r - 5; d < r + 6; d += 0.5) p.dot(Math.cos(g) * d, CY + Math.sin(g) * d, d > r ? C[6] : C[4], mk); }
        if (t > MARK - 0.05 && t < MARK + 0.15) sparkle(p, 0, CY, 6, WHITE, C[6], 0.5 * mk);
      }
      for (const s of cuts) slash(p, s, t);
      slash(p, X1, t); slash(p, X2, t);
      const u = t - FINAL;
      if (u >= 0 && u < 0.22) star(p, 0, CY, spikes, 0.7 + 0.8 * ease.outBack(Math.min(1, u / 0.06)), 1 - u / 0.22, WHITE, C[6], C[7], C[3]);
      for (const d of drops) { p.disc(d.x, d.y, d.s, K[3], f); p.dot(d.x, d.y, K[5], f); }
      ps.draw(p); lights.draw(p);
    },
  };
}
