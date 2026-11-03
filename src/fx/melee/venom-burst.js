// 독 단검 — 맞는 쪽 (용사 학원 암살자 ro_1 — 지속 피해를 남긴다) — the dagger bites the chest, venom spatters, green mist clings and drips off the target.
// (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { VENOM } from "./_rogue.js";

export const meta = {
  name: "Venom burst",
  desc: "A dagger bites the chest with a green flash, venom spatters out in droplets, a sickly mist clings round the body bubbling, and drips fall off it to the floor.",
  tags: ["melee", "hit", "poison", "venom", "dot", "one-shot"],
  size: [128, 108], origin: [64, 96], duration: 1.3, loop: false, fps: 30, bg: "light",
  options: { palette: VENOM, seed: 9 },
};

export const HIT = 0.02;
const CY = -24, SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[7], C[6], C[5]] }), lights = new Lights(), drops = [], bub = [];
  let t = 0, hit = false;
  return {
    update(dt) {
      t += dt;
      if (!hit && t >= HIT) {
        hit = true; lights.add(0, CY, 30, C[5], 0.8, 0.25);
        for (let i = 0; i < 18; i++) { const a = R.range(-Math.PI, 0.2), s = R.range(50, 150); drops.push({ x: 0, y: CY, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 }); }
        for (let i = 0; i < 8; i++) { const a = R.range(0, TAU), s = R.range(60, 140); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.1, 0.25)); }
      }
      if (t > 0.1 && t < 0.95 && R.chance(dt * 24)) bub.push({ x: R.range(-14, 14), y: -R.range(4, 40), r: R.range(1, 2.5), life: R.range(0.3, 0.5), max: 0 });
      if (t > 0.2 && t < 0.9 && R.chance(dt * 10)) drops.push({ x: R.range(-10, 10), y: -R.range(10, 34), vx: 0, vy: 10, life: 1 });
      for (const b of bub) if (!b.max) b.max = b.life;
      for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; d.vy += 420 * dt; d.x += d.vx * dt; d.y += d.vy * dt; if (d.y >= 0) { drops.splice(i, 1); ps.spawn(P.DUST, d.x, -0.5, R.sign() * 10, -3, 0.3, C[3], 1.5); } }
      for (let i = bub.length - 1; i >= 0; i--) { const b = bub[i]; if ((b.life -= dt) <= 0) bub.splice(i, 1); else b.y -= 12 * dt; }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const mist = smooth(0.02, 0.2, t) * (1 - smooth(0.85, 1.2, t));
      if (mist > 0) for (let i = 0; i < 9; i++) { const a = (i / 9) * TAU + t * 1.5, x = Math.cos(a) * 13, y = CY + Math.sin(a) * 18; p.disc(x, y, 4 + Math.sin(t * 6 + i) * 1.2, C[4], 0.12 * mist); p.disc(x * 0.6, y, 2.5, C[5], 0.1 * mist); }
      if (mist > 0) for (let q = 0; q < TAU; q += 0.03) p.dot(Math.cos(q) * 16, Math.sin(q) * 16 * SY, C[4], 0.5 * mist);
      for (const d of drops) { p.disc(d.x, d.y, 1.2, C[5], 1); p.dot(d.x, d.y - 1, C[7], 1); }
      for (const b of bub) { const a = b.life / b.max; p.circle(b.x, b.y, b.r, C[6], a); }
      const u = t - HIT;
      if (u >= 0 && u < 0.18) { p.disc(0, CY, 6 * (1 - u / 0.18), C[6], 1 - u / 0.18); sparkle(p, 0, CY, 8 * (1 - u / 0.18), WHITE, C[6], 0.6); }
      ps.draw(p); lights.draw(p);
    },
  };
}
