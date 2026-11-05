// 시간 정지 (용사 학원 시마도사 필살기 tm_u — 적 전체 행동 초기화) — over the enemy line a brass clock rim lies on the floor and a great
// clock face rises behind them; its hands spin backward faster and faster as rings of time draw inward, then slam to twelve: a white
// stroke, a grey-blue shock ring across the floor, and everything hangs frozen — motes stopped in the air, cracks of light on the face —
// until the clock breaks apart and falls. (0, 0) is the middle of the enemy line's floor.
import { Particles, Lights, P, Rng, fit, hex, clamp, smooth, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS, clockFace, gear } from "./_chrono.js";

export const meta = {
  name: "Chrono halt",
  desc: "A clock rises over the line and spins backward ever faster as rings of time draw in, then slams to twelve: a white stroke, a shock ring, motes hang frozen until the clock breaks.",
  tags: ["arcane", "time", "stop", "ultimate", "aoe", "clock", "one-shot"],
  size: [304, 248], origin: [152, 190], duration: 2.8, loop: false, fps: 30, bg: "ground",
  options: { palette: CHRONO, seed: 31, reach: 120 },
};

/** The rewind's ticks (the host plays a tick on each) and the moment it stops. */
export const STOP = 1.5;
export const TICKS = (() => { const n = 10, a = 0.35, b = 1.4, r = 0.82, g = (b - a) * (1 - r) / (1 - r ** (n - 1)); return Array.from({ length: n }, (_, i) => +(a + g * (1 - r ** i) / (1 - r)).toFixed(3)); })();   // ten ticks, each gap 0.82 of the one before
export const BREAK = 2.25;
const SY = 0.32, CY = -100, CR = 38, NM = 40, GREY = ["#5a6276", "#9aa2b6", "#d8dce8"].map(hex);

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8), RX = o.reach, R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], B[5]] }), lights = new Lights();
  const motes = Array.from({ length: NM }, () => ({ x: R.range(-RX, RX), y: -R.range(4, 120), vy: -R.range(30, 70), c: R.int(4, 6) }));
  const cracks = Array.from({ length: 7 }, (_, i) => ({ a: (i / 7) * TAU + R.range(-0.2, 0.2), L: R.range(0.55, 0.95), kink: R.range(-0.35, 0.35) }));
  const shards = Array.from({ length: 14 }, (_, i) => ({ a: (i / 14) * TAU, vx: R.range(-30, 30), vy: R.range(-40, 0) }));
  let t = 0, stopped = false, broke = false;
  const fade = () => 1 - smooth(BREAK + 0.3, meta.duration - 0.03, t);
  // the hands: backward, accelerating, then fixed at twelve from STOP
  const turn = () => { if (t >= STOP) return 0; const u = t / STOP; return -(u * u * u) * TAU * 7; };
  const frozen = () => t >= STOP && t < BREAK;
  function rim(p, back, f) {
    const u = ease.outCubic(clamp(t / 0.4)) * f;
    if (u <= 0) return;
    const keep = (g) => (Math.sin(g) < 0) === back && ((g / TAU + 1) % 1) <= u + 1e-3;
    for (let g = 0; g < TAU; g += 0.005) if (keep(g)) { p.dot(Math.cos(g) * RX, Math.sin(g) * RX * SY, back ? B[3] : B[5], f); p.dot(Math.cos(g) * (RX - 3), Math.sin(g) * (RX - 3) * SY, back ? B[2] : B[4], f * 0.8); }
    for (let i = 0; i < 12; i++) {                                         // the hour marks on the floor rim
      const g = (i / 12) * TAU; if ((Math.sin(g) < 0) !== back) continue;
      for (let d = RX - 12; d < RX - 4; d += 0.5) p.dot(Math.cos(g) * d, Math.sin(g) * d * SY, back ? B[3] : B[6], u);
    }
  }
  return {
    update(dt) {
      t += dt;
      if (!stopped && t >= STOP) {
        stopped = true; lights.add(0, CY, 90, WHITE, 0.7, 0.3);
        for (let i = 0; i < 24; i++) { const a = R.range(0, TAU), s = R.range(60, 160); ps.spawn(P.STAR, Math.cos(a) * 10, CY + Math.sin(a) * 10, Math.cos(a) * s, Math.sin(a) * s, R.range(0.2, 0.4), R.chance(0.5) ? WHITE : C[6], 1); }
      }
      if (!broke && t >= BREAK) { broke = true; lights.add(0, CY, 60, C[5], 0.4, 0.3); }
      if (!frozen()) for (const m of motes) { m.y += m.vy * dt * (t < STOP ? -1 : 1); if (m.y > -2) m.y = -120; if (m.y < -124) m.y = -4; }   // before the stop the motes fall back (rewind) — frozen after
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade();
      rim(p, true, f);
      const up = ease.outCubic(clamp((t - 0.1) / 0.45));                       // the great clock face rising behind the line
      const shake = frozen() ? Math.sin(t * 90) * 0.6 : 0;
      if (t < BREAK) {
        const k = up * f, x0 = shake;
        p.glow(x0, CY, CR * 1.3, C[3], k * (0.25 + (frozen() ? 0.2 : 0)));
        for (let g = 0; g < TAU; g += 0.012) { p.blend(x0 + Math.cos(g) * (CR - 2) * 0.98, CY + Math.sin(g) * (CR - 2), C[2], k * 0.2); }
        gear(p, x0 - CR * 0.82, CY - CR * 0.7, 12, 10, turn() * 0.4, B[3], B[1], k);
        gear(p, x0 + CR * 0.86, CY - CR * 0.6, 9, 8, -turn() * 0.55, B[4], B[1], k);
        gear(p, x0 + CR * 0.7, CY + CR * 0.78, 7, 7, turn() * 0.7, B[3], B[1], k);
        const a = turn();
        clockFace(p, x0, CY, CR * up, 1, k, a / 12, a, B[5], B[6], frozen() ? WHITE : C[6]);
        clockFace(p, x0, CY, CR * 0.82 * up, 1, k * 0.5, 0, 0, B[3], B[4], B[3]);
        if (t < STOP) for (let i = 0; i < 3; i++) {                           // rings of time drawn inward (the rewind)
          const v = ((t * 1.6 + i / 3) % 1), r = CR * (1.6 - v * 1.2), q = (1 - v) * v * 4 * k * smooth(0.3, 0.6, t);
          for (let g = 0; g < TAU; g += 0.7 / r) p.dot(x0 + Math.cos(g) * r, CY + Math.sin(g) * r, C[5], q * 0.6);
        }
        if (frozen()) for (const c of cracks) {                               // cracks of light across the face
          const L = CR * c.L * smooth(STOP, STOP + 0.15, t);
          for (let d = 4; d < L; d += 0.5) { const g = c.a + (d > L / 2 ? c.kink : 0); p.dot(x0 + Math.cos(g) * d, CY + Math.sin(g) * d, d % 3 < 1 ? WHITE : C[6], k); }
        }
      } else {                                                                  // it breaks apart and falls
        const a = t - BREAK, k = f;
        for (const s of shards) {
          const r = CR * 0.7, x = Math.cos(s.a) * r + s.vx * a, y = CY + Math.sin(s.a) * r + s.vy * a + 260 * a * a;
          for (let g = -0.5; g < 0.5; g += 0.03) { p.dot(x + Math.cos(s.a + g) * 6, y + Math.sin(s.a + g) * 6, B[5], k); p.dot(x + Math.cos(s.a + g) * 5, y + Math.sin(s.a + g) * 5, B[3], k); }
          p.dot(x, y, C[6], k);
        }
      }
      for (const m of motes) p.dot(m.x, m.y, frozen() ? GREY[2] : C[m.c], f * smooth(0.2, 0.5, t) * 0.9);
      const sv = (t - STOP) / 0.55;                                            // the shock ring across the floor at the stop
      if (sv > 0 && sv < 1) { const r = 12 + (RX + 20) * ease.outCubic(sv), k = (1 - sv) * f; for (let g = 0; g < TAU; g += 0.004) { p.dot(Math.cos(g) * r, Math.sin(g) * r * SY, sv < 0.2 ? WHITE : GREY[2], k); p.dot(Math.cos(g) * (r - 2), Math.sin(g) * (r - 2) * SY, GREY[1], k * 0.7); } }
      const st = 1 - smooth(STOP, STOP + 0.25, t);
      if (t >= STOP && st > 0) { p.glow(0, CY, CR * 1.6, WHITE, 0.5 * st); for (let i = 0; i < 4; i++) { const g = i * Math.PI / 2; for (let d = 0; d < 70 * st + 10; d += 0.5) p.dot(Math.cos(g) * d, CY + Math.sin(g) * d, WHITE, st); } }
      rim(p, false, f);
      ps.draw(p); lights.draw(p);
    },
  };
}
