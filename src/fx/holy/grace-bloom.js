// 대치유 (용사 학원 신성 사제 pr_1 — 크게 회복 · 디버프 하나를 지운다) — a ring of light opens under the ally, eight petals of light
// rise and unfold round the body like a lotus, a soft column of light lifts through it, a dark mote is driven out of the chest and
// breaks into white sparks, and gold motes drift up. (0, 0) is the ally's feet.
import { Particles, Lights, P, Rng, fit, hex, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE, glint, halo } from "./_priest.js";

export const meta = {
  name: "Grace bloom",
  desc: "Eight petals of light rise and unfold round the body like a lotus over a ring of light, a soft column lifts, and a dark mote is driven out of the chest and shatters.",
  tags: ["holy", "heal", "cleanse", "lotus", "one-shot"],
  size: [124, 132], origin: [62, 112], duration: 1.3, loop: false, fps: 30, bg: "ground",
  options: { palette: SAPPHIRE, seed: 8 },
};

export const BLOOM = 0.35;
const OUT = 0.5, SY = 0.32, NP = 8, CY = -26, DK = ["#2a1838", "#4a2a5a", "#8a6aa0"].map(hex);

export function create(o) {
  const C = fit(o.palette, 8), G = fit(GOLD, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], G[5]] }), lights = new Lights();
  let t = 0, bloomed = false, out = false;
  const fade = () => 1 - smooth(0.95, meta.duration - 0.03, t);
  function petal(p, g, back) {
    const near = Math.sin(g) > 0;
    if (near === back) return;
    const u = ease.outBack(clamp((t - 0.1) / 0.35)), f = fade();
    if (u <= 0) return;
    const open = smooth(BLOOM, BLOOM + 0.3, t), bx = Math.cos(g) * 20, by = Math.sin(g) * 20 * SY, H = 27 * u, lean = 0.25 + 0.55 * open;
    const dx = Math.cos(g) * lean, dy = Math.sin(g) * lean * SY;
    for (let s = 0; s < H; s += 0.5) {                                    // a petal: widest at the middle, tips leaning out as it opens
      const v = s / H, w = 5 * Math.sin(Math.PI * Math.pow(v, 0.8)), x = bx + dx * s, y = by + dy * s - s;
      for (let q = -w; q <= w; q += 0.7) {
        const rim = Math.abs(q) > w - 1.1, px = x + q * -Math.sin(g) * 0.9, py = y + q * Math.cos(g) * SY * 0.9;
        p.blend(px, py, rim ? (v > 0.55 ? WHITE : G[6]) : v < 0.2 ? C[5] : v > 0.65 ? G[6] : G[5], f * (rim ? (back ? 0.45 : 0.95) : back ? 0.28 : 0.16));
      }
    }
  }
  return {
    update(dt) {
      t += dt;
      if (!bloomed && t >= BLOOM) { bloomed = true; lights.add(0, CY, 46, C[5], 0.55, 0.4); }
      if (!out && t >= OUT) {
        out = true;
        for (let i = 0; i < 18; i++) { const a = R.range(0, TAU), s = R.range(40, 100); ps.spawn(P.STAR, 10, CY - 14, Math.cos(a) * s, Math.sin(a) * s, R.range(0.25, 0.5), R.chance(0.5) ? WHITE : C[6], 1); }
      }
      if (t > BLOOM && t < 0.85 && R.chance(dt * 28)) ps.spawn(P.MOTE, R.range(-14, 14), -R.range(0, 10), R.range(-4, 4), -R.range(26, 46), R.range(0.3, 0.45), R.chance(0.5) ? G[5] : C[6], 1);
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade(), ring = smooth(0, 0.2, t) * f;
      halo(p, 0, 0, 27, SY, G[6], G[4], ring, 8, t * 1.5);
      halo(p, 0, 0, 21, SY, C[5], C[4], ring * 0.8);
      for (let i = 0; i < NP; i++) petal(p, (i / NP) * TAU + t * 0.4, true);
      const col = smooth(BLOOM - 0.1, BLOOM + 0.15, t) * f;                 // the column of light
      if (col > 0) for (let y = -2; y > -62; y--) { const k = col * (1 - (-y) / 64) * 0.3; for (let x = -7; x <= 7; x++) p.blend(x, y, Math.abs(x) < 2 ? WHITE : G[6], k * (1 - Math.abs(x) / 8)); }
      const dk = t < OUT ? smooth(0.15, 0.35, t) : 0;                     // the dark mote, driven out of the chest
      if (dk > 0) { const u = clamp((t - 0.2) / (OUT - 0.2)), x = 10 * u, y = CY - 14 * u; p.disc(x, y, 3.5, DK[0], dk * 0.9); p.disc(x, y, 2, DK[1], dk); p.dot(x - 1, y - 1, DK[2], dk); }
      const bv = 1 - smooth(OUT, OUT + 0.25, t);
      if (t >= OUT && bv > 0) glint(p, 10, CY - 14, 4 + 10 * bv, C[6], bv);
      for (let i = 0; i < NP; i++) petal(p, (i / NP) * TAU + t * 0.4, false);
      const gb = smooth(BLOOM, BLOOM + 0.1, t) * (1 - smooth(BLOOM + 0.1, BLOOM + 0.45, t));
      if (gb > 0) glint(p, 0, CY, 18 * gb + 4, G[6], gb);
      ps.draw(p); lights.draw(p);
    },
  };
}
