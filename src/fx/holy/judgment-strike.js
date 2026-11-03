// 성스러운 일격 (용사 학원 팔라딘 pa_b) — a spear of judgement light drops onto the target and bursts at the chest. (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, lerp, TAU, WHITE, flare, band, sparkle } from "../../core/index.js";
import { GOLD } from "./_lib.js";

export const meta = {
  name: "Judgment strike",
  desc: "A narrow spear of golden light drops onto the target, a cross-star bursts white at the chest with a shock ring and a floor ring, gold shards and embers spray out.",
  tags: ["holy", "smite", "hit", "impact", "one-shot"],
  size: [120, 136], origin: [60, 112], duration: 1.1, loop: false, fps: 30, bg: "ground",
  options: { palette: GOLD, seed: 9 },
};

const DROP = 0.08, CY = -14, TOP = -112, SY = 0.32;
export const BANG = DROP;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5], C[4]] }), lights = new Lights();
  let t = 0, hit = false;
  return {
    update(dt) {
      t += dt;
      if (!hit && t >= BANG) {
        hit = true;
        lights.add(0, CY, 42, C[5], 0.9, 0.35); lights.add(0, CY, 14, WHITE, 1, 0.08);
        for (let i = 0; i < 34; i++) { const a = R.range(0, TAU), s = R.range(50, 170); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * s, Math.sin(a) * s * 0.8 - 20, R.range(0.15, 0.45)); }
        for (let i = 0; i < 12; i++) { const a = R.range(-Math.PI, 0), s = R.range(30, 80); ps.spawn(P.STAR, R.range(-4, 4), CY + R.range(-4, 4), Math.cos(a) * s, Math.sin(a) * s, R.range(0.4, 0.8), R.chance(0.5) ? WHITE : C[6], R.range(0.8, 1.6)); }
        for (let i = 0; i < 16; i++) ps.spawn(P.EMBER, R.range(-14, 14), R.range(-4, 0), R.range(-10, 10), -R.range(20, 50), R.range(0.5, 0.9), C[R.int(4, 6)]);
      }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      const g = (t - BANG) / 0.35;                                       // the floor ring under the target
      if (g > 0 && g < 1) band(p, 0, 0, 6 + 30 * ease.outCubic(g), SY, Math.max(1, 3 * (1 - g)), 1 - g, [C[3], C[4], C[6], WHITE], () => true, g < 0.15);
    },
    draw(p) {
      // the spear: a bright line growing down from the top, then a fading pillar
      if (t < BANG + 0.3) {
        const u = clamp(t / DROP), y1 = lerp(TOP, CY, ease.inQuad(u)), w = t < BANG ? 1.5 : 3.5 * (1 - smooth(BANG, BANG + 0.3, t)) + 0.5;
        const a = t < BANG ? 1 : 1 - smooth(BANG + 0.05, BANG + 0.3, t);
        for (let y = TOP; y <= y1; y += 1) {
          const k = (y - TOP) / (y1 - TOP + 1e-3);
          for (let x = -w; x <= w; x += 1) p.dot(x, y, Math.abs(x) < w * 0.45 ? WHITE : C[5], a * (0.35 + 0.65 * k) * (Math.abs(x) < w * 0.45 ? 1 : 0.7));
        }
        p.glowLine(0, TOP, 0, y1, 6, C[5], 0.25 * a);
      }
      const h = (t - BANG) / 0.28;                                       // the burst: a cross-star and a white core
      if (h >= 0 && h < 1) {
        const L = 26 * (h < 0.25 ? ease.outQuad(h / 0.25) : 1 - ease.inQuad((h - 0.25) / 0.75));
        flare(p, 0, CY, L, 1, [C[3], C[4], C[6], WHITE]);
        if (h < 0.4) p.disc(0, CY, 7 * (1 - h / 0.4) + 1, WHITE, 1);
        p.glow(0, CY, 22, C[6], 0.6 * (1 - h));
      }
      const s = (t - BANG) / 0.3;                                        // the shock ring standing round the chest
      if (s > 0 && s < 1) { const r = 6 + 22 * ease.outCubic(s); for (let j = 0, m = Math.ceil(r * TAU); j < m; j++) { const g = (j / m) * TAU; p.dot(Math.cos(g) * r, CY + Math.sin(g) * r * 0.85, s < 0.3 ? WHITE : C[5], 1 - s); } }
      if (t >= BANG && t < BANG + 0.1) sparkle(p, 0, CY - 2, 9, WHITE, C[6], 0.7);
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
