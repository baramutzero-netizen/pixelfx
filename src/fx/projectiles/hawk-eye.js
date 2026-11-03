// 매의 눈 (용사 학원 궁수 ar_2 — 치명타 · 명중 · 스킬 성공률 상승) — a golden hawk's eye opens above the archer, a reticle tightens round its head,
// gold feathers of light rise and it all narrows into a glint. (0, 0) is the archer's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { HAWK } from "./_archer.js";

export const meta = {
  name: "Hawk eye",
  desc: "A golden hawk's eye opens above the archer and its slit pupil narrows, a reticle tightens round the head, gold motes rise, then the eye closes into a single glint.",
  tags: ["projectiles", "buff", "eye", "focus", "crit", "one-shot"],
  size: [112, 120], origin: [56, 104], duration: 1.5, loop: false, fps: 30, bg: "light",
  options: { palette: HAWK, seed: 8 },
};

export const OPEN = 0.3;
const EY = -66, SHUT = 1.05, SY = 0.32;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5]] }), lights = new Lights();
  let t = 0, opened = false;
  const lid = () => ease.outBack(clamp(t / OPEN)) * (1 - ease.inCubic(clamp((t - SHUT) / 0.2)));
  return {
    update(dt) {
      t += dt;
      if (!opened && t >= OPEN) { opened = true; lights.add(0, EY, 30, C[5], 0.7, 0.25); for (let i = 0; i < 10; i++) { const a = R.range(0, TAU), s = R.range(40, 100); ps.spawn(P.SPARK, 0, EY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.15, 0.3)); } }
      if (t > 0.15 && t < SHUT && R.chance(dt * 22)) ps.spawn(P.MOTE, R.range(-16, 16), -R.range(0, 20), R.range(-4, 4), -R.range(25, 45), R.range(0.5, 0.8), R.chance(0.5) ? C[5] : C[6], 0.8);
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const k = lid();
      if (k > 0.02) {                                                    // the eye: an almond of gold, the lids parting, an iris with a slit pupil
        const W = 15, H = 7 * k;
        for (let x = -W; x <= W; x += 0.5) { const y = H * Math.sqrt(Math.max(0, 1 - (x / W) ** 2)); p.dot(x, EY - y, C[6]); p.dot(x, EY + y, C[4]); }
        for (let x = -W + 2; x <= W - 2; x += 1) { const y = H * Math.sqrt(Math.max(0, 1 - (x / W) ** 2)) - 1; for (let yy = -y; yy <= y; yy++) p.dot(x, EY + yy, C[1], 0.35); }
        const ir = 5 * Math.min(1, k), pw = 1.6 * (1 - 0.6 * smooth(OPEN, OPEN + 0.4, t));
        for (let yy = -ir; yy <= ir; yy += 0.5) for (let xx = -ir; xx <= ir; xx += 0.5) { const d = Math.hypot(xx, yy); if (d <= ir && Math.abs(yy) <= H) p.dot(xx, EY + yy, Math.abs(xx) < pw ? C[0] : d > ir - 1 ? C[3] : C[5]); }
        p.dot(-2, EY - 2, WHITE);
        for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.35, r0 = 11, L = 6 * k; p.line(Math.cos(a) * r0, EY + Math.sin(a) * r0 * 0.9 - 3, Math.cos(a) * (r0 + L), EY + Math.sin(a) * (r0 + L) * 0.9 - 3, C[5], 0.7); }
        p.glow(0, EY, 18, C[5], 0.3 * k);
      }
      const m = ease.outCubic(clamp((t - 0.1) / 0.5)), mk = smooth(0.1, 0.25, t) * (1 - smooth(SHUT - 0.1, SHUT + 0.2, t));
      if (mk > 0) {                                                      // the reticle round the head, tightening
        const r = 34 - 16 * m, cy = -40;
        for (let g = 0; g < TAU; g += 0.6 / r) if (Math.cos(g * 4) < 0.6) p.dot(Math.cos(g) * r, cy + Math.sin(g) * r, C[5], mk);
        for (let i = 0; i < 4; i++) { const g = (i * Math.PI) / 2 + Math.PI / 4; for (let d = r - 4; d < r + 5; d += 0.5) p.dot(Math.cos(g) * d, cy + Math.sin(g) * d, C[6], mk); }
      }
      const fr = (t - OPEN) / 0.45;
      if (fr > 0 && fr < 1) for (let g = 0; g < TAU; g += 0.03) p.dot(Math.cos(g) * (8 + 22 * ease.outCubic(fr)), Math.sin(g) * (8 + 22 * ease.outCubic(fr)) * SY, C[5], 1 - fr);
      if (t > SHUT + 0.15 && t < SHUT + 0.4) sparkle(p, 0, EY, 9 * (1 - (t - SHUT - 0.15) / 0.25), WHITE, C[6], 0.7);
      ps.draw(p); lights.draw(p);
    },
  };
}
