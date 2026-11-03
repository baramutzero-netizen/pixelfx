// 성역 선포 (용사 학원 팔라딘 필살기 pa_u) — a sanctuary laid over the whole ally line (the canvas is the 5-slot formation's floor).
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, lerp, TAU, WHITE, flare, band, sparkle } from "../../core/index.js";
import { GOLD, Feathers, feather } from "./_lib.js";
import { floorRing } from "../arcane/_lib.js";

export const meta = {
  name: "Sanctuary",
  desc: "A golden circle draws under the line, pillars of light rise round its rim, a pale dome glows and feathers drift; five blessings pulse faster and faster, then it flares white.",
  tags: ["holy", "sanctuary", "heal", "buff", "ultimate", "aoe", "one-shot"],
  size: [304, 288], origin: [152, 232], duration: 2.4, loop: false, fps: 30, bg: "ground",
  options: { palette: GOLD, seed: 12, reach: 120 },
};

const OPEN = 0.45, FINAL = 1.28, P0 = 0.55, SY = 0.32, NP = 8;   // 1103 열셋째 — 일레븐랩스 소리(성역 선포 2.mp3)에 맞춤: 종이 0.55초부터 빨라지고 1.28초에 정점
// five blessings from 0.45 s to the final flare, each gap 0.8 of the one before — the host heals on each
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 4);
export const PULSES = Array.from({ length: 5 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

export function create(o) {
  const C = fit(o.palette, 8), RX = o.reach, R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5], C[4]] }), lights = new Lights();
  const fe = new Feathers(R, 0);
  const pillars = Array.from({ length: NP }, (_, i) => ({ a: (i / NP) * TAU + 0.2, t0: OPEN * 0.6 + (i % 4) * 0.06, h: R.range(70, 100) }));
  let t = 0, done = 0, final = false;
  const drawn = () => ease.outCubic(clamp(t / OPEN));
  const fade = () => 1 - smooth(FINAL + 0.25, FINAL + 0.8, t);
  const pulse = () => { let k = 0; for (const h of PULSES) { const d = t - h; if (d >= 0 && d < 0.22) k = Math.max(k, 1 - d / 0.22); } return k; };
  function circle(p, back) {
    const u = drawn(), f = fade(), k = pulse(), keep = (g) => (Math.sin(g) < 0) === back && ((g / TAU + 1) % 1) <= u + 1e-3;
    if (f <= 0) return;
    floorRing(p, 0, 0, RX, SY, back ? C[4] : C[6], f, keep);
    floorRing(p, 0, 0, RX - 6, SY, back ? C[3] : C[5], f * 0.85, keep);
    floorRing(p, 0, 0, RX * 0.45, SY, back ? C[4] : C[6], f * clamp((t - OPEN) / 0.3), (g) => (Math.sin(g) < 0) === back);
    if (!back) {                                                         // the cross of rays inside, lit on each blessing
      const r = clamp((t - OPEN * 0.5) / 0.4);
      for (let i = 0; i < 8; i++) {
        const g = (i / 8) * TAU + Math.PI / 8, L = (i % 2 ? 0.62 : 0.92) * (RX - 6) * r;
        for (let d = 10; d < L; d += 1) p.dot(Math.cos(g) * d, Math.sin(g) * d * SY, d > L - 3 ? WHITE : C[5], f * (0.45 + 0.55 * k) * (1 - d / (L + 6)));
      }
      p.glow(0, 0, RX * 0.9, C[5], f * (0.12 + 0.3 * k));
    }
  }
  function pillar(p, q, back) {
    const g = q.a + t * 0.25, near = Math.sin(g) >= 0, a0 = t - q.t0;
    if (near === back || a0 < 0) return;
    const f = fade(), up = ease.outCubic(clamp(a0 / 0.4)), h = q.h * up * (1 + 0.15 * pulse()), x = Math.cos(g) * (RX - 3), y = Math.sin(g) * (RX - 3) * SY, w = 2.2;
    for (let d = 0; d < h; d += 1) {
      const k = 1 - d / h;
      for (let i = -w; i <= w; i += 1) p.blend(x + i, y - d, Math.abs(i) < 1 ? WHITE : C[5], f * k * (back ? 0.35 : 0.6) * (Math.abs(i) < 1 ? 1 : 0.6));
    }
    p.glow(x, y - 2, 6, C[6], f * 0.4);
  }
  return {
    update(dt) {
      t += dt;
      while (done < PULSES.length && t >= PULSES[done]) {               // a blessing: a ring of light and sparkles from the centre
        lights.add(0, -10, RX * 1.1, C[5], 0.45, 0.25);
        for (let i = 0; i < 26; i++) { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX; ps.spawn(P.STAR, Math.cos(a) * d, Math.sin(a) * d * SY, 0, -R.range(20, 70), R.range(0.35, 0.7), R.chance(0.5) ? WHITE : C[6], R.range(0.6, 1.4)); }
        done++;
      }
      if (t > 0.2 && t < FINAL && R.chance(dt * 9)) fe.add({ x: R.range(-RX, RX), y: -R.range(70, 110), len: R.range(6, 9), wid: 2, life: R.range(0.8, 1.1), back: R.chance(0.4) });
      if (t > OPEN * 0.6 && t < FINAL && R.chance(dt * 30)) { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX; ps.spawn(P.MOTE, Math.cos(a) * d, Math.sin(a) * d * SY, 0, -R.range(30, 80), R.range(0.6, 1.1), R.chance(0.3) ? WHITE : C[5]); }
      if (!final && t >= FINAL) {
        final = true;
        lights.add(0, -30, RX * 1.2, C[6], 0.6, 0.45); lights.add(0, -30, 30, WHITE, 0.8, 0.1);
        for (let i = 0; i < 50; i++) { const a = R.range(0, TAU), d = R.range(0, RX); ps.spawn(P.SPARK, Math.cos(a) * d, Math.sin(a) * d * SY - 2, Math.cos(a) * 50, -R.range(80, 220), R.range(0.25, 0.6)); }
        for (let i = 0; i < 10; i++) fe.add({ x: R.range(-20, 20), y: -40, vx: R.range(-120, 120), vy: -R.range(40, 120), len: R.range(7, 10), wid: 2, life: R.range(0.7, 0.95), back: R.chance(0.3) });
      }
      fe.update(dt); ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      circle(p, true);
      for (const q of pillars) pillar(p, q, true);
      fe.draw(p, C, "back"); ps.draw(p, "back");
    },
    draw(p) {
      circle(p, false);
      for (const q of pillars) pillar(p, q, false);
      const dome = clamp((t - OPEN) / 0.5) * fade();                     // the pale dome over the line
      if (dome > 0) {
        for (let j = 0; j <= 120; j++) { const u = j / 120, ang = Math.PI * u; p.dot(-Math.cos(ang) * RX, -Math.sin(ang) * RX * 0.75, C[6], dome * 0.35 * (0.5 + 0.5 * Math.sin(ang))); }
        p.glow(0, -RX * 0.4, RX * 0.9, C[5], 0.12 * dome * (1 + pulse()));
      }
      const k = pulse();
      if (k > 0 && t < FINAL) band(p, 0, 0, RX * (0.2 + 0.85 * (1 - k)), SY, Math.max(1, 3 * k), k, [C[4], C[5], C[6], WHITE], () => true, k > 0.8);
      const h = (t - FINAL) / 0.45;                                      // the final flare: a white star and a column up
      if (h >= 0 && h < 1) {
        flare(p, 0, -36, 40 * (1 - h * 0.6), 1, [C[4], C[6], WHITE]);
        for (let y = -200; y < 0; y += 1) for (let x = -6; x <= 6; x += 1) p.blend(x, y, Math.abs(x) < 3 ? WHITE : C[6], (1 - h) * 0.7 * (1 + y / 220));
        p.glow(0, -30, RX * 0.6, WHITE, 0.3 * (1 - h));
        if (h < 0.2) sparkle(p, 0, -36, 12, WHITE, C[6], 0.8);
      }
      fe.draw(p, C, "front"); ps.draw(p, "front"); lights.draw(p);
    },
  };
}
