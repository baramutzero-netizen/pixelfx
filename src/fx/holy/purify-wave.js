// 신성 파동 — 터지는 정화의 빛 (용사 학원 신성 사제 pr_b) — where the mote lands on the chest: a four-point glint, three rings of
// sapphire light pulsing outward one after another, and shards of light that drift down and wink out. (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE, glint } from "./_priest.js";

export const meta = {
  name: "Purify wave",
  desc: "A mote of light strikes the chest in a white four-point glint, three rings of sapphire light pulse outward one after another, and a thin shaft and falling shards of light wink out.",
  tags: ["holy", "impact", "light", "wave", "one-shot"],
  size: [76, 96], origin: [38, 84], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: SAPPHIRE, seed: 5 },
};

const CY = -26;

export function create(o) {
  const C = fit(o.palette, 8), G = fit(GOLD, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], G[5]] }), lights = new Lights();
  let t = 0, hit = false;
  return {
    update(dt) {
      t += dt;
      if (!hit) {
        hit = true; lights.add(0, CY, 34, C[5], 0.7, 0.3);
        for (let i = 0; i < 16; i++) { const a = R.range(0, TAU), s = R.range(30, 90); ps.spawn(P.STAR, Math.cos(a) * 4, CY + Math.sin(a) * 4, Math.cos(a) * s, Math.sin(a) * s * 0.8, R.range(0.25, 0.5), R.chance(0.4) ? WHITE : R.chance(0.5) ? C[6] : G[5], 1); }
        for (let i = 0; i < 8; i++) ps.spawn(P.FLAKE, R.range(-18, 18), CY - R.range(4, 20), R.range(-6, 6), R.range(10, 30), R.range(0.4, 0.7), R.chance(0.5) ? C[6] : WHITE, 1);
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const sh = 1 - smooth(0.05, 0.35, t);                                // a thin shaft of light through the target
      if (sh > 0) for (let y = CY - 34; y < 2; y++) { const k = sh * (1 - Math.abs(y - CY) / 38); p.blend(0, y, WHITE, k); p.blend(-1, y, C[6], k * 0.6); p.blend(1, y, C[6], k * 0.6); }
      for (let i = 0; i < 3; i++) {                                         // three rings pulse outward
        const v = (t - i * 0.12) / 0.45;
        if (v <= 0 || v >= 1) continue;
        const r = 5 + 21 * ease.outCubic(v), a = (1 - v) * (i ? 0.8 : 1);
        for (let g = 0; g < TAU; g += 0.6 / r) { const x = Math.cos(g) * r, y = CY + Math.sin(g) * r * 0.82; p.dot(x, y, v < 0.2 ? WHITE : i === 1 ? G[5] : C[5], a); if (i === 0) p.dot(x * 0.93, y * 0.97 + CY * 0.03, C[4], a * 0.5); }
      }
      const g0 = 1 - smooth(0, 0.3, t);
      if (g0 > 0) glint(p, 0, CY, 6 + 16 * g0, C[6], g0);
      p.glow(0, CY, 22, C[5], 0.35 * (1 - smooth(0.05, 0.5, t)));
      ps.draw(p); lights.draw(p);
    },
  };
}
