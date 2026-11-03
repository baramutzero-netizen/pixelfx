// 기공파 — 맞는 쪽 (용사 학원 무도가 mo_1 — 응축한 기를 쏘아낸다) — the chi ball bursts on the chest in a cyan sphere, rings fly out, motes scatter.
// (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { CHI, punchStar } from "./_monk.js";

export const meta = {
  name: "Chi burst",
  desc: "A ball of chi bursts on the chest: a white flash, a cyan sphere swells and pops, two rings fly out edge-on, motes scatter and a ring snaps out on the floor.",
  tags: ["impacts", "chi", "burst", "hit", "energy", "one-shot"],
  size: [128, 120], origin: [64, 100], duration: 0.8, loop: false, fps: 30, bg: "light",
  options: { palette: CHI, seed: 7 },
};

export const HIT = 0.0;
const CY = -24, SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5]] }), lights = new Lights();
  let t = 0, hit = false;
  return {
    update(dt) {
      t += dt;
      if (!hit) { hit = true; lights.add(0, CY, 40, C[5], 0.9, 0.25); for (let i = 0; i < 20; i++) { const a = R.range(0, TAU), s = R.range(60, 180); ps.spawn(P.MOTE, 0, CY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.3, 0.55), R.chance(0.5) ? C[6] : C[7], 0.8); } }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const u = t / 0.22;
      if (u < 1) { const r = 6 + 14 * ease.outCubic(u), a = 1 - smooth(0.6, 1, u); p.disc(0, CY, r, C[4], 0.45 * a); p.disc(0, CY, r * 0.6, C[6], 0.6 * a); p.disc(0, CY, r * 0.3, WHITE, a); }
      for (const [d, tilt] of [[0, 0.35], [0.05, -0.35]]) {
        const v = (t - d) / 0.4;
        if (v < 0 || v > 1) continue;
        const r = 8 + 26 * ease.outCubic(v), a = 1 - v;
        for (let g = 0; g < TAU; g += 0.6 / r) { const x = Math.cos(g) * r, y = Math.sin(g) * r * 0.3; p.dot(x * Math.cos(tilt) - y * Math.sin(tilt), CY + x * Math.sin(tilt) + y * Math.cos(tilt), v < 0.3 ? WHITE : C[5], a); }
      }
      const f = (t - 0.04) / 0.4;
      if (f > 0 && f < 1) for (let g = 0; g < TAU; g += 0.025) p.dot(Math.cos(g) * (6 + 22 * ease.outCubic(f)), Math.sin(g) * (6 + 22 * ease.outCubic(f)) * SY, C[5], 1 - f);
      if (t < 0.12) punchStar(p, 0, CY, 14, C[6], 1 - t / 0.12, 8);
      ps.draw(p); lights.draw(p);
    },
  };
}
