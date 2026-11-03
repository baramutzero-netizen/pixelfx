// 드루이드 시전 문양 (용사 학원 드루이드 시전 모션 — 예전 druidCircle 그림) — a ring of living green opens at the outstretched hand,
// six leaves turn in it, leaves spiral in and motes rise. (0, 0) is the druid's chest; faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { drawLeaf } from "./_lib.js";
import { FOREST, LEAF } from "./_druid.js";

export const meta = {
  name: "Druid glyph",
  desc: "A ring of living green opens edge-on at the outstretched hand, six leaves turn inside it, leaves spiral in from around and pale motes rise, then it folds shut in a sparkle.",
  tags: ["nature", "cast", "glyph", "druid", "leaf", "one-shot"],
  size: [104, 104], origin: [36, 56], duration: 0.95, loop: false, fps: 30, bg: "dark",
  options: { palette: FOREST, seed: 4 },
};

const CX = 14, CY = -4, OPEN = 0.18, SHUT = 0.65, RX = 7, RY = 17;
export const HIT = OPEN;

export function create(o) {
  const C = fit(o.palette, 8), L = LEAF(C), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 999, sparks: [C[7], C[6], C[5]] }), lights = new Lights();
  const swirl = Array.from({ length: 7 }, (_, i) => ({ a: (i / 7) * TAU, r: R.range(26, 36), d: R.range(0, 0.15), fl: R.range(0, TAU) }));
  let t = 0, opened = false, shut = false;
  const k = () => ease.outBack(clamp(t / OPEN)) * (1 - ease.inCubic(clamp((t - SHUT) / 0.2)));
  return {
    update(dt) {
      t += dt;
      if (!opened && t >= OPEN) { opened = true; lights.add(CX, CY, 26, C[5], 0.6, 0.25); }
      if (t > 0.1 && t < SHUT && R.chance(dt * 30)) ps.spawn(P.MOTE, CX + R.range(-6, 6), CY + R.range(-14, 14), R.range(-6, 6), -R.range(15, 35), R.range(0.4, 0.7), R.chance(0.5) ? C[6] : C[7], 0.8);
      if (!shut && t >= SHUT + 0.2) { shut = true; for (let i = 0; i < 8; i++) { const a = R.range(0, TAU), s = R.range(30, 80); ps.spawn(P.STAR, CX, CY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.2, 0.4), C[7], 1); } }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const s = k();
      if (s > 0.02) {
        const rx = RX * s, ry = RY * s;
        p.glow(CX, CY, 20 * s, C[4], 0.35 * s);
        for (let g = 0; g < TAU; g += 0.03) { const x = CX + Math.cos(g) * rx, y = CY + Math.sin(g) * ry; p.dot(x, y, Math.cos(g) > 0 ? C[6] : C[4], 1); p.dot(x + 1.2, y, C[3], 0.5); }
        for (let g = 0; g < TAU; g += 0.05) p.dot(CX + Math.cos(g) * rx * 0.6, CY + Math.sin(g) * ry * 0.6, C[5], 0.6);
        for (let i = 0; i < 6; i++) {                                   // six leaves turning on the ring's face
          const g = (i / 6) * TAU + t * 4, x = CX + Math.cos(g) * rx * 0.8, y = CY + Math.sin(g) * ry * 0.8;
          drawLeaf(p, x, y, 6 * s, 2, g + Math.PI / 2, t * 6 + i, L, 0.95);
        }
        if (t < OPEN + 0.1) p.disc(CX, CY, 3 * (1 - (t - OPEN) / 0.1), WHITE, 0.8);
      }
      for (const q of swirl) {                                          // leaves spiralling in to the ring
        const u = clamp((t - q.d) / 0.5);
        if (u <= 0 || u >= 1) continue;
        const r = q.r * (1 - ease.inQuad(u)), g = q.a + u * 3, x = CX + Math.cos(g) * r, y = CY + Math.sin(g) * r * 0.8;
        drawLeaf(p, x, y, 6, 2.2, g + 1.2, q.fl + t * 9, L, 1 - u * 0.4);
      }
      if (t >= SHUT + 0.2 && t < SHUT + 0.4) sparkle(p, CX, CY, 7 * (1 - (t - SHUT - 0.2) / 0.2), WHITE, C[6], 0.6);
      ps.draw(p); lights.draw(p);
    },
  };
}
