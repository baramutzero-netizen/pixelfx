// 도발 — 분노 표식 (용사 학원 검투사 sw_1 맞는 쪽 — 예전 tauntAnger 그림) — an angry vein mark pops over the target's head and throbs, a red ring pulses at its feet.
// (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { RAGE } from "./_gladiator.js";

export const meta = {
  name: "Taunt mark",
  desc: "A red vein mark pops over the target's head with a bounce and throbs three times, a red ring snaps out on the floor at its feet, hot specks puff off, then it fades.",
  tags: ["melee", "taunt", "status", "anger", "debuff", "one-shot"],
  size: [104, 120], origin: [52, 104], duration: 1.4, loop: false, fps: 30, bg: "light",
  options: { palette: RAGE, seed: 11 },
};

export const POP = 0.1;
const MX = 13, MY = -60, SY = 0.32, OUT = 1.0;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[6], C[5], C[4]] }), lights = new Lights();
  let t = 0, popped = false;
  const throb = () => { const u = t - POP; return u < 0 ? 0 : 1 + 0.18 * Math.max(0, Math.sin(u * 15)) * (1 - smooth(0.4, 0.8, u)); };
  // one corner of the vein cross: a fat bent stroke bowed in toward the middle (the four of them make the 💢 mark)
  function corner(p, cx, cy, sx, sy, k, f) {
    const pts = [];
    for (let i = 0; i <= 10; i++) { const v = i / 10, a = v * Math.PI / 2; pts.push([cx + sx * (9.5 - Math.cos(a) * 6.5) * k, cy + sy * (9.5 - Math.sin(a) * 6.5) * k]); }   // bowed in toward the middle
    for (const [x, y] of pts) { p.disc(x, y, 1.9 * k, C[1], f); }
    for (const [x, y] of pts) { p.disc(x, y, 1.2 * k, C[3], f); }
    for (const [x, y] of pts.slice(2, 7)) p.dot(x - sx * 0.5, y - sy * 0.5, C[5], f);
  }
  return {
    update(dt) {
      t += dt;
      if (!popped && t >= POP) {
        popped = true; lights.add(MX, MY, 20, C[4], 0.6, 0.2); lights.add(0, -24, 30, C[3], 0.35, 0.35);
        for (let i = 0; i < 12; i++) { const a = R.range(0, TAU), sp = R.range(40, 110); ps.spawn(P.SPARK, MX, MY, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.15, 0.35)); }
        for (let i = 0; i < 6; i++) ps.spawn(P.MOTE, MX + R.range(-6, 6), MY + R.range(-4, 4), R.range(-15, 15), -R.range(15, 40), R.range(0.4, 0.8), C[R.int(4, 5)], 0.8);
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const u = t - POP;
      if (u < 0) return;
      const f = 1 - smooth(OUT, OUT + 0.3, t);
      // the floor ring: snaps out wide, thins and fades; a second one on the second throb
      for (const [d, big] of [[0, 1], [0.21, 0.75]]) {
        const v = (u - d) / 0.45;
        if (v < 0 || v > 1) continue;
        const r = (10 + 22 * big * ease.outCubic(v)), a = (1 - v) * 0.9;
        for (let g = 0; g < TAU; g += 0.7 / r) p.dot(Math.cos(g) * r, Math.sin(g) * r * SY, v < 0.3 ? C[5] : C[3], a);
      }
      const k = ease.outBack(clamp(u / 0.12)) * throb();
      if (k > 0.02) {
        p.glow(MX, MY, 12 * k, C[3], 0.35 * f);
        corner(p, MX, MY, -1, -1, k, f); corner(p, MX, MY, 1, -1, k, f); corner(p, MX, MY, -1, 1, k, f); corner(p, MX, MY, 1, 1, k, f);
        if (u < 0.08) p.disc(MX, MY, 4, WHITE, 1 - u / 0.08);
      }
      ps.draw(p); lights.draw(p);
    },
  };
}
