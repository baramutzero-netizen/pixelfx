// 그림자 밟기 (용사 학원 암살자 ro_2 — 속도와 회피를 끌어올린다) — shadow smoke wreathes the rogue, it steps and leaves three violet afterimages behind,
// speed lines streak past, wisps trail off its feet. (0, 0) is the rogue's feet; faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { SHADE } from "./_rogue.js";

export const meta = {
  name: "Shade step",
  desc: "Shadow smoke wreathes the rogue, it steps and leaves three violet afterimages fading behind it, speed lines streak past, shadow wisps trail off its feet.",
  tags: ["melee", "buff", "shadow", "speed", "evasion", "afterimage", "one-shot"],
  size: [128, 104], origin: [76, 92], duration: 1.3, loop: false, fps: 30, bg: "light",
  options: { palette: SHADE, seed: 12 },
};

export const STEP = 0.2;
const SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5]] }), lights = new Lights();
  const lines = Array.from({ length: 9 }, () => ({ y: -R.range(4, 46), len: R.range(18, 40), d: R.range(0, 0.12), sp: R.range(260, 380) }));
  let t = 0, stepped = false;
  function ghost(p, x, a) {                                            // a smeared standing figure: head, shoulders, body, two legs
    for (let y = -48; y <= 0; y++) for (let xx = -8; xx <= 8; xx++) {
      const hd = Math.hypot(xx, y + 42) < 4.2, body = y >= -37 && y < -14 && Math.abs(xx) < 4 + 2.5 * Math.sin(((y + 37) / 23) * Math.PI * 0.6),
        legs = y >= -14 && Math.abs(Math.abs(xx) - 2.4) < 1.6 + (y + 14) * 0.02;
      if (!(hd || body || legs) || (xx + y) % 2) continue;
      const rim = !(Math.hypot(xx, y + 42) < 3) && hd || (body && Math.abs(xx) > 3.2);
      p.dot(x + xx, y, rim ? C[5] : C[3], a);
    }
  }
  return {
    update(dt) {
      t += dt;
      if (t < STEP + 0.1 && R.chance(dt * 60)) { const a = R.range(0, TAU); ps.spawn(P.SMOKE, Math.cos(a) * 10, -R.range(0, 40), Math.cos(a) * 8, -R.range(10, 30), R.range(0.3, 0.5), C[R.int(1, 3)], R.range(3, 5)); }
      if (!stepped && t >= STEP) { stepped = true; lights.add(0, -24, 34, C[5], 0.6, 0.2); for (let i = 0; i < 12; i++) { const a = R.range(0, TAU), s = R.range(40, 120); ps.spawn(P.STAR, 0, -24, Math.cos(a) * s, Math.sin(a) * s, R.range(0.2, 0.4), C[6], 1); } }
      if (t > STEP && t < 1.0 && R.chance(dt * 20)) ps.spawn(P.SMOKE, R.range(-6, 6), -1, -R.range(20, 50), -R.range(2, 8), Math.min(R.range(0.3, 0.5), meta.duration - 0.05 - t), C[2], R.range(2, 3));
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const u = t - STEP;
      if (u > 0) for (let i = 0; i < 3; i++) {
        const a = (1 - smooth(0, 0.6 + i * 0.12, u)) * (0.75 - i * 0.18), x = -(12 + i * 13) * ease.outCubic(clamp(u / 0.18));
        if (a > 0.02) ghost(p, x, a);
      }
      for (const q of lines) {                                         // speed lines streaking back past it
        const v = u - q.d;
        if (v < 0 || v > 0.3) continue;
        const x0 = 20 - q.sp * v, f = 1 - v / 0.3;
        for (let d = 0; d < q.len; d += 0.6) p.dot(x0 - d, q.y, d < 3 ? WHITE : C[5], f * (1 - d / q.len));
      }
      const r = (t - STEP) / 0.4;
      if (r > 0 && r < 1) for (let g = 0; g < TAU; g += 0.03) p.dot(Math.cos(g) * (8 + 24 * ease.outCubic(r)), Math.sin(g) * (8 + 24 * ease.outCubic(r)) * SY, C[5], 1 - r);
      if (u > 0 && u < 0.2) sparkle(p, 2, -26, 8 * (1 - u / 0.2), WHITE, C[6], 0.6);
      ps.draw(p); lights.draw(p);
    },
  };
}
