// 마력 과충전 (용사 학원 전쟁법사 fm_2 — 마력을 끌어모아 봉인을 앞당긴다) — crimson force spirals in from all round to her chest,
// pops at 0.35 s into a flaring aura egg, rings of force rise three times up the body with crackling arcs, and gold sparks orbit. (0, 0) is her feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { FORCE, STAR } from "./_forcemage.js";

export const meta = {
  name: "Overcharge",
  desc: "Crimson force spirals in to the chest and pops into a flaring aura, rings of force rise three times up the body with crackling arcs, gold sparks orbit.",
  tags: ["arcane", "buff", "force", "charge", "aura", "one-shot"],
  size: [112, 120], origin: [56, 106], duration: 1.4, loop: false, fps: 30, bg: "ground",
  options: { palette: FORCE, seed: 14 },
};

export const CHARGE = 0.35;
const CY = -26, SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), S = fit(STAR, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], S[5]] }), lights = new Lights();
  const inflow = Array.from({ length: 16 }, (_, i) => ({ a: (i / 16) * TAU, r: R.range(34, 46), t0: R.range(0, 0.12) }));
  let t = 0, popped = false;
  const fade = () => 1 - smooth(1.05, meta.duration - 0.03, t);
  return {
    update(dt) {
      t += dt;
      if (!popped && t >= CHARGE) { popped = true; lights.add(0, CY, 44, C[5], 0.6, 0.35); for (let i = 0; i < 10; i++) { const a = R.range(0, TAU), s = R.range(40, 90); ps.spawn(P.STAR, 0, CY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.2, 0.4), R.chance(0.5) ? WHITE : S[5], 1); } }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade();
      for (const q of inflow) {                                              // force spiralling in
        const u = clamp((t - q.t0) / (CHARGE - q.t0)); if (u <= 0 || u >= 1) continue;
        const e = ease.inCubic(u), a = q.a + e * 2.2, r = q.r * (1 - e);
        for (let d = 0; d < 4; d++) p.dot(Math.cos(a - d * 0.08) * (r + d), CY + Math.sin(a - d * 0.08) * (r + d) * 0.8, d ? C[4] : WHITE, 1 - d / 4);
      }
      const gk = smooth(0, CHARGE, t) * (1 - smooth(CHARGE, CHARGE + 0.1, t));
      if (gk > 0) { p.glow(0, CY, 10 + 10 * gk, C[5], 0.5 * gk); p.disc(0, CY, 2 + 3 * gk, C[6], gk); }
      const ak = smooth(CHARGE, CHARGE + 0.1, t) * f;                         // the aura egg, breathing
      if (ak > 0) {
        const br = 1 + 0.06 * Math.sin(t * 18);
        for (let g = 0; g < TAU; g += 0.03) { const x = Math.cos(g) * 19 * br, y = -26 + Math.sin(g) * 31 * br; p.dot(x, y, Math.sin(t * 30 + g * 5) > 0.6 ? C[6] : C[4], ak); p.dot(x * 0.94, y * 0.96 - 1, C[5], ak * 0.8); }
      }
      for (let i = 0; i < 3; i++) {                                           // three rings rising up the body
        const v = (t - CHARGE - i * 0.22) / 0.4; if (v <= 0 || v >= 1) continue;
        const y = -2 - 52 * ease.outCubic(v), r = 20 - 6 * v, k = (1 - v) * f;
        for (let g = 0; g < TAU; g += 0.05) p.dot(Math.cos(g) * r, y + Math.sin(g) * r * SY, Math.sin(g) > 0 ? C[6] : C[4], k);
      }
      if (t > CHARGE && t < 1.1 && Math.sin(t * 47) > 0.3) {                   // crackling arcs
        const a = t * 13, x0 = Math.cos(a) * 16, y0 = CY + Math.sin(a) * 24;
        let x = x0, y = y0; for (let i = 0; i < 6; i++) { const nx = x * 0.7 + Math.sin(i * 7 + t * 40) * 3, ny = y + (CY - y) * 0.3 + Math.cos(i * 5 + t * 30) * 3; p.line(x, y, nx, ny, i < 2 ? WHITE : C[6], f); x = nx; y = ny; }
      }
      for (let i = 0; i < 3; i++) {                                           // gold sparks orbiting
        const a = t * 5 + (i / 3) * TAU, k = ak * (0.6 + 0.4 * Math.sin(t * 9 + i));
        if (k > 0.05) sparkle(p, Math.cos(a) * 24, CY + Math.sin(a) * 24 * 0.4 - 6, 3, S[5], WHITE, 0.4 * k);
      }
      ps.draw(p); lights.draw(p);
    },
  };
}
