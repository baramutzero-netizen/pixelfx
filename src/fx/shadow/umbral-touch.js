// 어둠의 손길 (용사 학원 암흑사제 dp_b) — shadow tendrils lash in and close on the target's chest, then burst. (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, lerp, TAU, WHITE, sparkle } from "../../core/index.js";
import { VOID } from "./_lib.js";

export const meta = {
  name: "Umbral touch",
  desc: "Four violet shadow tendrils lash in from around the target and close on its chest, a black star bursts with a lilac rim, obsidian shards and dark smoke fly out.",
  tags: ["shadow", "hit", "touch", "burst", "one-shot"],
  size: [136, 124], origin: [68, 100], duration: 1.0, loop: false, fps: 30, bg: "light",
  options: { palette: VOID, seed: 4 },
};

const IN = 0.15, CY = -14, SY = 0.32;
export const BANG = IN;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[6], C[5], C[4]], haze: C[3] }), lights = new Lights();
  const ten = [[-44, -40], [46, -34], [-38, 8], [40, 10]].map(([x, y], i) => ({ x, y, bend: (i % 2 ? 1 : -1) * R.range(8, 14) }));
  let t = 0, hit = false;
  function tendril(p, q) {
    const u = ease.inCubic(clamp(t / IN)), f = 1 - smooth(IN, IN + 0.18, t);
    if (f <= 0) return;
    const hx = lerp(q.x, 0, u), hy = lerp(q.y, CY, u);
    for (let j = 0; j <= 24; j++) {                                    // from where it came in to its head, bowed sideways
      const v = j / 24, x = lerp(q.x * 1.25, hx, v), y = lerp(q.y * 1.25, hy, v) + Math.sin(v * Math.PI) * q.bend * (1 - u * 0.5), th = 0.6 + 2.2 * v;
      for (let d = -th; d <= th; d += 0.8) p.dot(x, y + d, Math.abs(d) < th * 0.4 ? C[5] : C[2], f * (0.3 + 0.7 * v));
    }
    p.glow(hx, hy, 5, C[5], 0.4 * f);
  }
  return {
    update(dt) {
      t += dt;
      if (!hit && t >= BANG) {
        hit = true; lights.add(0, CY, 34, C[5], 0.8, 0.3);
        for (let i = 0; i < 26; i++) { const a = R.range(0, TAU), s = R.range(40, 140); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * s, Math.sin(a) * s * 0.8, R.range(0.15, 0.4)); }
        for (let i = 0; i < 6; i++) { const a = R.range(0, TAU); ps.spawn(P.SMOKE, Math.cos(a) * 4, CY + Math.sin(a) * 4, Math.cos(a) * 20, Math.sin(a) * 14 - 10, R.range(0.3, 0.5), C[3], R.range(3, 5)); }
      }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) { ps.draw(p, "back"); },
    draw(p) {
      for (const q of ten) tendril(p, q);
      const h = (t - BANG) / 0.32;                                       // the black star
      if (h >= 0 && h < 1) {
        const L = 22 * (h < 0.2 ? ease.outQuad(h / 0.2) : 1 - ease.inQuad((h - 0.2) / 0.8)), rot = h * 0.6;
        for (let i = 0; i < 8; i++) {
          const a = rot + (i * Math.PI) / 4, len = i % 2 ? L * 0.5 : L;
          for (let d = 0; d < len; d += 0.6) { const w = (1 - d / len) * 2.2; for (let e = -w; e <= w; e += 0.8) p.dot(Math.cos(a) * d - Math.sin(a) * e, CY + Math.sin(a) * d + Math.cos(a) * e, Math.abs(e) > w - 0.9 ? C[6] : C[0], 1 - h * 0.6); }
        }
        p.glow(0, CY, 20, C[5], 0.5 * (1 - h));
      }
      const g = (t - BANG) / 0.35;
      if (g > 0 && g < 1) { const r = 6 + 24 * ease.outCubic(g); for (let j = 0, m = Math.ceil(r * TAU); j < m; j++) { const a = (j / m) * TAU; p.dot(Math.cos(a) * r, Math.sin(a) * r * SY, C[5], 1 - g); } }
      if (t >= BANG && t < BANG + 0.08) sparkle(p, 0, CY, 7, C[7], C[5], 0.6);
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
