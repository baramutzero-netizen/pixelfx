// 재생의 씨앗 (용사 학원 드루이드 dr_1 — 상처 위에 생명을 틔운다) — a glowing seed drops onto the ally, sprouts at its feet into a sapling,
// green rings of life climb the body and motes rise. (0, 0) is the ally's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { drawLeaf } from "./_lib.js";
import { FOREST, LEAF } from "./_druid.js";

export const meta = {
  name: "Regen seed",
  desc: "A glowing seed drops onto the ally and bursts into a sapling at its feet, two leaves unfurl, three green rings of life climb the body and pale motes rise, then it softly fades.",
  tags: ["nature", "heal", "regen", "seed", "sprout", "one-shot"],
  size: [96, 120], origin: [48, 104], duration: 1.7, loop: false, fps: 30, bg: "light",
  options: { palette: FOREST, seed: 6 },
};

export const LAND = 0.3;
const SX = 6, SY = 0.32, GROW = 0.75, FADE = 1.2;

export function create(o) {
  const C = fit(o.palette, 8), L = LEAF(C), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[7], C[6], C[5]] }), lights = new Lights();
  let t = 0, landed = false;
  return {
    update(dt) {
      t += dt;
      if (!landed && t >= LAND) {
        landed = true; lights.add(SX, -2, 30, C[5], 0.7, 0.3); lights.add(0, -24, 34, C[4], 0.3, 0.6);
        for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + R.range(-1.3, 1.3), s = R.range(40, 120); ps.spawn(P.SPARK, SX, -1, Math.cos(a) * s, Math.sin(a) * s, R.range(0.15, 0.35)); }
        for (let i = 0; i < 5; i++) ps.spawn(P.DUST, SX + R.range(-4, 4), -1, R.sign() * R.range(10, 30), -R.range(2, 8), R.range(0.4, 0.6), C[3], R.range(1.5, 3));
      }
      if (t > LAND && t < FADE && R.chance(dt * 22)) ps.spawn(P.MOTE, R.range(-14, 14), -R.range(0, 30), R.range(-5, 5), -R.range(15, 35), R.range(0.5, 0.9), R.chance(0.5) ? C[6] : C[7], 0.8);
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      if (t < LAND) {                                                  // the seed falling, a tail of light behind it
        const u = ease.inQuad(t / LAND), y = -72 + 72 * u;
        for (let d = 0; d < 10; d++) p.dot(SX, y - d, d < 2 ? WHITE : C[5 + (d < 5 ? 1 : 0)], 1 - d / 10);
        p.disc(SX, y, 2, C[6], 1); p.glow(SX, y, 8, C[5], 0.5);
      }
      const f = 1 - smooth(FADE, meta.duration - 0.05, t);
      if (t >= LAND && f > 0) {
        const g = ease.outBack(clamp((t - LAND) / (GROW - LAND)));     // the sapling: a stem and two unfurling leaves, a bud on top
        const h = 14 * g;
        for (let y = 0; y < h; y++) p.dot(SX + Math.sin(y * 0.4) * 0.8, -y, y > h - 2 ? C[5] : C[3], f);
        if (g > 0.3) { drawLeaf(p, SX - 4, -h * 0.6, 8 * g, 2.6, -2.6, 0.3, L, f); drawLeaf(p, SX + 4, -h * 0.75, 8 * g, 2.6, -0.5, 0.2, L, f); }
        if (g > 0.6) { p.disc(SX, -h - 1, 1.6, C[6], f); p.dot(SX, -h - 2, WHITE, f); }
        for (let i = 0; i < 3; i++) {                                  // rings of life climbing the body
          const u = (t - LAND - 0.1 - i * 0.18) / 0.6;
          if (u < 0 || u > 1) continue;
          const y = -2 - 46 * ease.outCubic(u), r = 18 - 6 * u, a = (1 - u) * 0.9;
          for (let q = 0; q < TAU; q += 0.6 / r) { const x = Math.cos(q) * r, yy = y + Math.sin(q) * r * SY; p.dot(x, yy, Math.sin(q) > 0 ? C[6] : C[4], a * (Math.sin(q) > 0 ? 1 : 0.5)); }
        }
        const ru = (t - LAND) / 0.45;                                   // the floor ring snapping out
        if (ru < 1) for (let q = 0; q < TAU; q += 0.03) p.dot(SX + Math.cos(q) * (6 + 20 * ease.outCubic(ru)), Math.sin(q) * (6 + 20 * ease.outCubic(ru)) * SY, ru < 0.3 ? C[7] : C[5], 1 - ru);
        if (t < LAND + 0.18) sparkle(p, SX, -3, 8 * (1 - (t - LAND) / 0.18), WHITE, C[6], 0.6);
      }
      ps.draw(p); lights.draw(p);
    },
  };
}
