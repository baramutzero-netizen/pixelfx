// 화염 폭발 (용사 학원 마법사 wz_1) — a fireball blooms on the target's chest.
// Fire puffs / sparks recipe adapted from Sprite Fusion's open-source explosion (https://www.spritefusion.com/pixel-art-vfx/explosion),
// MIT License, Copyright (c) 2026 Hugo Duprez.
import { Particles, Lights, P, PF, Rng, fit, sparkle, ease, TAU, WHITE, rgb } from "../../core/index.js";
import { fireRamp, drawPs } from "../explosions/_lib.js";

export const meta = {
  name: "Fire blast",
  desc: "Heat gathers on the target's chest, then a fireball blooms: white flash, shock ring, swelling flame puffs and tongues, sparks, embers, cooling to thin smoke.",
  tags: ["fire", "explosion", "spell", "aoe", "one-shot"],
  size: [128, 128], origin: [64, 104], duration: 2.1, loop: false, fps: 30, bg: "dark",
  options: { palette: ["#4a1712", "#c9281f", "#f2561d", "#ff8a2a", "#ffc23d", "#ffe26b", "#fff3a6", "#ffffff"], seed: 3, size: 1 },
};

export const BANG = 0.12;   // the gather ends, the fireball goes off (the hit lands here)

export function create(o) {
  const F = fit(o.palette, 8), FR = fireRamp(F), R = new Rng(o.seed), S = o.size, CY = -19 * S;
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [F[6], F[5], F[3], F[2]] }), lights = new Lights();
  let t = 0, fired = false;
  function fire() {
    fired = true;
    lights.add(0, CY, 58 * S, rgb(255, 168, 88), 0.7, 0.55);
    lights.add(0, CY, 20 * S, WHITE, 0.8, 0.09);
    lights.add(0, 0, 30 * S, rgb(255, 120, 50), 0.35, 0.9);                     // the floor glows while it burns
    // the ball: puffs thrown out from the core, the outer ones cooling to smoke
    for (let i = 0; i < 34; i++) {
      const a = R.range(0, TAU), d = R.range(0, 5) * S, sp = R.range(35, 125) * S;
      ps.spawn(P.FIRE, Math.cos(a) * d, CY + Math.sin(a) * d, Math.cos(a) * sp, Math.sin(a) * sp * 0.8 - 25, R.range(0.3, 0.55), 0, R.range(4, 7.5) * S, R.range(0, 0.05), R.chance(0.4) ? PF.SMOKES : 0);
    }
    // a few hot puffs held at the heart, so the core stays bright for a beat
    for (let i = 0; i < 5; i++) ps.spawn(P.FIRE, R.range(-2, 2), CY + R.range(-2, 2), R.range(-8, 8), R.range(-20, 0), R.range(0.18, 0.26), 0, R.range(6, 8) * S);
    // tongues licking up
    for (let i = 0; i < 7; i++) ps.spawn(P.FIRE, R.range(-6, 6) * S, CY - 3, R.range(-14, 14), -R.range(90, 150) * S, R.range(0.3, 0.5), 0, R.range(2.8, 4.2) * S, R.range(0.03, 0.14), R.chance(0.5) ? PF.SMOKES : 0);
    for (let i = 0; i < 44; i++) { const a = R.range(0, TAU), sp = R.range(110, 250) * S; ps.spawn(P.SPARK, 0, CY, Math.cos(a) * sp, Math.sin(a) * sp - 45, R.range(0.14, 0.42)); }
    for (let i = 0; i < 14; i++) { const a = R.range(0, TAU), sp = R.range(20, 70); ps.spawn(P.EMBER, Math.cos(a) * 6, CY + Math.sin(a) * 6, Math.cos(a) * sp, Math.sin(a) * sp - 45, R.range(0.55, 1.0), F[3]); }
    for (let i = 0; i < 2; i++) ps.spawn(P.SMOKE, R.range(-6, 6), CY - R.range(4, 10), R.range(-12, 12), -R.range(30, 55), R.range(0.7, 0.95), 0, R.range(2.5, 3.5) * S, R.range(0.22, 0.34));
  }
  return {
    update(dt) { t += dt; if (!fired && t >= BANG) fire(); ps.update(dt); lights.update(dt); },
    drawBack(p) { drawPs(p, ps, "back", FR); },
    draw(p) {
      if (t < BANG) {                                                              // the gather: heat pulls into a point
        const k = ease.inQuad(t / BANG);
        p.glow(0, CY, (8 + 12 * k) * S, F[4], 0.45 * k);
        p.circle(0, CY, 1 + 2.2 * k, F[6]);
        sparkle(p, 0, CY, (2 + 6 * k) * S, WHITE, F[5], 0.6);
      }
      drawPs(p, ps, "front", FR);
      const f = (t - BANG) / 0.067;                                                // two hero frames
      if (f >= 0 && f < 1) { const r = 10 * S * (0.85 + 0.15 * f); p.circle(0, CY, r + 1.4, F[3]); p.circle(0, CY, r, f < 0.5 ? WHITE : F[6]); p.circle(0, CY, r * 0.55, WHITE); }
      const g = (t - BANG) / 0.18;                                                 // the shock ring, gone fast
      if (g > 0 && g < 1) p.ring(0, CY, (9 + 22 * ease.outCubic(g)) * S, 1, g < 0.4 ? F[6] : F[5]);
      lights.draw(p);
    },
  };
}
