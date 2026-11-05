// 화염 폭발 — 데포르메 (용사 학원 마법사 wz_1 · fire-blast 의 굵은 판) — a bright ember swells on the chest, goes off at 0.12 s in a big
// outlined fireball (orange, yellow, white core) with a star, which breaks into three flame tongues, three chunky embers fly out and
// two grey puffs of smoke rise and shrink away. (0, 0) is the target's feet.
import { clamp, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { FLAME, SMOKE, blob, star, drop, pop, shrink } from "../arcane/_chibi_wizard.js";

export const meta = {
  name: "Fire blast (chunky)",
  desc: "An ember swells on the chest and goes off in a big outlined fireball with a star, breaks into three flame tongues, embers fly out and grey puffs rise and shrink.",
  tags: ["fire", "explosion", "impact", "chunky", "one-shot"],
  size: [128, 128], origin: [64, 104], duration: 2.1, loop: false, fps: 30, bg: "dark",
  options: {},
};

export const BANG = 0.12;
const CY = -19;

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      for (let i = 0; i < 2; i++) {                                          // smoke puffs (behind)
        const t0 = 0.3 + i * 0.15, a = t - t0; if (a < 0) continue;
        const k = pop(t, t0, 0.2) * shrink(t, t0 + 0.8, t0 + 1.4); if (k <= 0) continue;
        blob(p, (i ? 8 : -8) + Math.sin(a * 3 + i) * 3, CY - 16 - a * 30, (5 + i) * k, SMOKE[2], SMOKE[3]);
      }
      if (t < BANG) { const k = t / BANG; blob(p, 0, CY, 2 + 4 * k, FLAME[4], WHITE); return; }
      for (let i = 0; i < 3; i++) {                                          // flame tongues left by the blast
        const k = pop(t, BANG + 0.12, 0.14) * shrink(t, 0.45 + i * 0.08, 0.8 + i * 0.08); if (k <= 0) continue;
        drop(p, (i - 1) * 13, CY + 8 - Math.abs(i - 1) * 2, (i === 1 ? 9 : 6.5) * k, i === 1 ? FLAME[4] : FLAME[3], FLAME[6]);
      }
      const b = pop(t, BANG, 0.1) * shrink(t, BANG + 0.16, BANG + 0.5);       // the fireball
      if (b > 0) { blob(p, 0, CY, 24 * b, FLAME[3], FLAME[4]); blob(p, -3, CY - 3, 15 * b, FLAME[4], FLAME[5]); blob(p, -5, CY - 5, 7 * b, FLAME[6], WHITE); }
      const s = pop(t, BANG, 0.08) * shrink(t, BANG + 0.06, BANG + 0.22);
      if (s > 0) star(p, 0, CY, 26 * s, FLAME[5]);
      for (let i = 0; i < 3; i++) {                                          // embers flung out
        const a = -Math.PI / 2 + (i - 1) * 1.1, u = clamp((t - BANG) / 0.6), k = pop(t, BANG + 0.02, 0.08) * shrink(t, BANG + 0.35, BANG + 0.65);
        if (k > 0) blob(p, Math.cos(a) * 38 * ease.outCubic(u), CY + Math.sin(a) * 26 * ease.outCubic(u) + 40 * u * u, 3.4 * k, FLAME[4], FLAME[6]);
      }
    },
  };
}
