// 가속 (용사 학원 시마도사 tm_1 — 아군의 행동 게이지를 밀어준다) — a brass clock dial lies on the floor under the ally and its hands race
// forward, azure streaks of speed sweep past the body to the front, and three chevrons dart ahead. (0, 0) is the ally's feet; it faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS, clockFace } from "./_chrono.js";

export const meta = {
  name: "Haste dial",
  desc: "A brass clock dial lies under the ally with its hands racing forward, azure streaks of speed sweep past the body to the front and three chevrons dart ahead.",
  tags: ["arcane", "buff", "time", "haste", "speed", "one-shot"],
  size: [132, 104], origin: [62, 92], duration: 1.2, loop: false, fps: 30, bg: "ground",
  options: { palette: CHRONO, seed: 10 },
};

export const RUSH = 0.3;
const SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], B[5]] }), lights = new Lights();
  const streaks = Array.from({ length: 10 }, () => ({ y: -R.range(4, 50), t0: RUSH + R.range(0, 0.4), L: R.range(14, 26), v: R.range(160, 240) }));
  let t = 0, rushed = false;
  const fade = () => 1 - smooth(0.85, meta.duration - 0.03, t);
  return {
    update(dt) {
      t += dt;
      if (!rushed && t >= RUSH) { rushed = true; lights.add(0, -24, 40, C[5], 0.5, 0.3); }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade(), u = smooth(0, 0.18, t) * f, spin = t < RUSH ? t * 4 : RUSH * 4 + (t - RUSH) * 40 * (1 - smooth(0.6, 1, t)) ;
      clockFace(p, 0, 0, 28, SY, u, spin / 12, spin, B[5], B[6], C[6], B[3]);
      for (const q of streaks) {                                            // streaks of speed, back to front
        const a = t - q.t0; if (a < 0) continue;
        const x = -36 + a * q.v, k = f * (1 - smooth(0.2, 0.35, a));
        for (let d = 0; d < q.L; d++) { const c = d < 3 ? WHITE : d < 9 ? C[6] : C[4]; p.blend(x - d, q.y, c, k * (1 - d / q.L)); p.blend(x - d, q.y + 1, C[4], k * 0.6 * (1 - d / q.L)); }
      }
      for (let i = 0; i < 3; i++) {                                          // chevrons darting ahead
        const a = t - RUSH - 0.08 - i * 0.07; if (a < 0) continue;
        const x = 14 + a * 90 + i * 2, k = f * (1 - smooth(0.2, 0.4, a)), y = -26;
        for (let d = 0; d <= 6; d++) { p.dot(x - d * 0.8, y - d, C[6], k); p.dot(x - d * 0.8, y + d, C[6], k); p.dot(x - d * 0.8 - 1, y - d, C[4], k * 0.8); p.dot(x - d * 0.8 - 1, y + d, C[4], k * 0.8); }
      }
      const gl = smooth(RUSH - 0.05, RUSH, t) * (1 - smooth(RUSH, RUSH + 0.4, t));
      if (gl > 0) p.glow(0, -24, 22, C[5], 0.35 * gl);
      ps.draw(p); lights.draw(p);
    },
  };
}
