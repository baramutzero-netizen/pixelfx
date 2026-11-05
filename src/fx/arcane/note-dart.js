// 현 튕기기 — 날아가는 음표 (용사 학원 음유시인 bd_b) — a plucked note flies: a glowing wine-rose eighth note bobbing,
// gold sound-wave arcs rolling off behind it and two fading ghost notes. Loops while the host moves it. (0, 0) is the note, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { HARP, WINE, note, waves } from "./_bard.js";

export const meta = {
  name: "Note dart",
  desc: "A plucked wine-rose note flies bobbing, gold sound-wave arcs rolling off behind it and two ghost notes trailing.",
  tags: ["arcane", "projectile", "music", "bard", "loop"],
  size: [56, 32], origin: [40, 18], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: WINE },
};

export function create(o) {
  const W = fit(o.palette, 8), G = fit(HARP, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / 0.2) * TAU, bob = Math.sin(ph) * 1.2;
      for (let i = 0; i < 3; i++) { const u = ((t / 0.2) + i / 3) % 1; waves(p, -6 - u * 16, 1, 3 + u * 3, 3, 1, Math.PI, 0.8, G[5 + (i % 2)], 1 - u); }
      note(p, -22, 3 - bob * 0.6, 1.4, W[3], 0, 0.35, 1);
      note(p, -12, 2 + bob * 0.4, 1.7, W[4], 0, 0.55, 1);
      p.glow(0, 1, 9, W[5], 0.45);
      note(p, -2, 3 + bob, 2.4, W[5], WHITE, 1, 1, 0.6);
      p.disc(-2, 3 + bob, 0.9, WHITE, 1);
    },
  };
}
