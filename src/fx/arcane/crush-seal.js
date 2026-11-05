// 파쇄격 (용사 학원 전쟁법사 fm_1 — 무너지는 적을 짓누른다) — a crimson rune circle opens over the target's head and slams down
// onto them at 0.3 s like a press: a white stroke, the floor cracks in a star, a flat ring of force bursts out and debris jumps. (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { FORCE, STAR, runeRing, crack } from "./_forcemage.js";

export const meta = {
  name: "Crush seal",
  desc: "A crimson rune circle opens over the head and slams down like a press: a white stroke, the floor cracks in a star, a flat ring bursts and debris jumps.",
  tags: ["arcane", "impact", "force", "crush", "one-shot"],
  size: [116, 180], origin: [58, 112], duration: 1.0, loop: false, fps: 30, bg: "ground",
  options: { palette: FORCE, seed: 11 },
};

export const HIT = 0.3;
const TOP = -66, SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), S = fit(STAR, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], S[5]] }), lights = new Lights();
  const cracks = Array.from({ length: 7 }, (_, i) => ({ a: (i / 7) * TAU + R.range(-0.2, 0.2), L: R.range(16, 30), s: R.range(0, 9) }));
  let t = 0, hit = false;
  const fade = () => 1 - smooth(0.7, meta.duration - 0.03, t);
  return {
    update(dt) {
      t += dt;
      if (!hit && t >= HIT) {
        hit = true; lights.add(0, -6, 40, C[5], 0.6, 0.3);
        for (let i = 0; i < 12; i++) { const a = R.range(0, TAU), s = R.range(30, 80); ps.spawn(P.GRIT, Math.cos(a) * 10, Math.sin(a) * 3, Math.cos(a) * s, -R.range(60, 140), R.range(0.3, 0.5), R.chance(0.5) ? C[3] : S[3], 1); }
        for (let i = 0; i < 8; i++) { const a = R.range(0, TAU); ps.spawn(P.SPARK, 0, -2, Math.cos(a) * 90, Math.sin(a) * 30 - 20, R.range(0.15, 0.3), WHITE, 1); }
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade();
      if (t < HIT + 0.05) {                                                  // the circle opens above, then presses down
        const open = ease.outBack(clamp(t / 0.16)), u = clamp((t - 0.14) / (HIT - 0.14)), y = TOP + (-TOP - 2) * ease.inCubic(u), sy = 0.5 + (SY - 0.5) * u;
        runeRing(p, 0, y, 22 * open, sy, 1, t * 3, C[5], C[3], S[5]);
        if (u > 0) for (let i = 0; i < 4; i++) { const yy = y - 8 - i * 6; p.dot(-14, yy, C[5], (1 - i / 4) * u); p.dot(14, yy, C[5], (1 - i / 4) * u); }
      }
      if (t >= HIT) {
        const v = clamp((t - HIT) / 0.12);
        for (const c of cracks) crack(p, 0, 0, c.a, c.L * ease.outCubic(v), C[4], f, c.s);
        runeRing(p, 0, 0, 22, SY, f * (1 - smooth(HIT + 0.2, 0.8, t)), 0, C[5], C[3], S[5]);
        const w = (t - HIT) / 0.4;
        if (w < 1) { const r = 10 + 38 * ease.outCubic(w), k = 1 - w; for (let g = 0; g < TAU; g += 0.6 / r) p.dot(Math.cos(g) * r, Math.sin(g) * r * SY, w < 0.2 ? WHITE : C[5], k); }
        const st = 1 - smooth(HIT, HIT + 0.15, t);
        if (st > 0) { p.glow(0, -14, 30, C[5], 0.6 * st); for (let y = -50; y < 0; y++) p.blend(0, y, WHITE, st * 0.8); }
      }
      ps.draw(p); lights.draw(p);
    },
  };
}
