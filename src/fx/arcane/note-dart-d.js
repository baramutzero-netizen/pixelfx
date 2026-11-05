// note-dart 의 데포르메 판 (용사 학원 음유시인 bd_b) — a chunky rose note bobbing, one ghost note and one thick gold arc of sound behind. Loops.
import { fit, TAU } from "../../core/index.js";
import { band, blob, noteC, HARP, WINE } from "./_chibi_bard.js";

export const meta = {
  name: "Note dart (chibi)",
  desc: "Chunky: a rose note bobbing as it flies, one ghost note and one thick gold arc of sound rolling off behind it.",
  tags: ["arcane", "projectile", "music", "bard", "chibi", "loop"],
  size: [56, 32], origin: [40, 18], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: WINE },
};

export function create(o) {
  const W = fit(o.palette, 8), G = fit(HARP, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / 0.2) * TAU, bob = Math.sin(ph) * 1.2, u = (t / 0.2) % 1;
      band(p, -10 - u * 8, 2, 6 + u * 2, 1, 2.4 * (1 - u * 0.6), G[5], G[6], (a) => Math.abs(Math.abs(a) - Math.PI) < 0.8);
      blob(p, -18, 3 - bob * 0.5, 2.2, W[3], W[5]);
      noteC(p, -3, 4 + bob, 2.8, W[5], W[6], 1, 0.6);
    },
  };
}
