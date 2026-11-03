// 독 단검 — 날아가는 칼 (용사 학원 암살자 ro_1) — a thrown dagger spinning end over end, dripping a green trail. Loops; (0, 0) is its middle, flying right.
import { Rng, fit, TAU, WHITE } from "../../core/index.js";
import { VENOM, EDGE } from "./_rogue.js";

export const meta = {
  name: "Venom dagger",
  desc: "A thrown dagger spinning end over end with a steel glint, its blade wet green, leaving a short dotted trail of venom behind it.",
  tags: ["melee", "projectile", "dagger", "poison", "throw", "loop"],
  size: [48, 24], origin: [34, 12], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: VENOM, edge: EDGE, seed: 3 },
};

export function create(o) {
  const C = fit(o.palette, 8), Ed = fit(o.edge, 6);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const a = (t / meta.duration) * TAU;
      for (let i = 0; i < 14; i++) p.dot(-6 - i * 2, Math.sin(i * 1.7 + t * 30) * 0.8, i < 4 ? C[6] : C[4], 1 - i / 14);
      for (let d = -6; d <= 8; d += 0.5) {                              // blade one way, hilt the other
        const x = Math.cos(a) * d, y = Math.sin(a) * d * 0.9, blade = d > 0;
        p.disc(x, y, blade ? 1.1 * (1 - d / 10) + 0.4 : 0.9, blade ? (d > 6 ? WHITE : d > 3 ? C[5] : Ed[3]) : d > -2 ? Ed[2] : Ed[1], 1);
      }
      p.glow(0, 0, 6, C[5], 0.35);
    },
  };
}
