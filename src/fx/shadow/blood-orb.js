// 흡혈 의식 날아가는 피 구슬 (용사 학원 암흑사제 dp_1) — a looping crimson orb with a dripping trail. Faces right (the way it flies).
import { Rng, fit, TAU, WHITE, PAL } from "../../core/index.js";

export const meta = {
  name: "Blood orb",
  desc: "A small crimson orb with a bright core and a wobbling tail of blood drops trailing behind it, looping.",
  tags: ["shadow", "blood", "projectile", "loop"],
  size: [48, 24], origin: [38, 12], duration: 0.4, loop: true, fps: 30, bg: "light",
  options: { palette: PAL.blood, seed: 2 },
};

export function draw(p, t, o) {
  const C = fit(o.palette, 8), ph = (t / 0.4) * TAU;
  for (let j = 0; j < 14; j++) {                                       // the tail, wobbling as it goes
    const x = -2 - j * 2.2, y = Math.sin(ph * 2 - j * 0.7) * (j * 0.18), r = Math.max(0.6, 3 - j * 0.2);
    p.disc(x, y, r, j < 4 ? C[4] : C[3], 1 - j / 15);
  }
  p.glow(0, 0, 9, C[4], 0.5);
  p.disc(0, 0, 4.2, C[2], 1);
  p.disc(0, 0, 3.4, C[4], 1);
  p.disc(0.5, -0.5, 1.6, C[6], 1);
  p.dot(1, -1.5, WHITE, 1);
}
