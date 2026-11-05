// 마력탄 — 날아가는 탄 · 데포르메 (용사 학원 마법사 wz_b · mana-bolt 의 굵은 판) — a round outlined violet orb with a white shine, three
// shrinking blobs bobbing behind it. Loops; (0, 0) is the orb, flying right.
import { TAU, WHITE } from "../../core/index.js";
import { ARC, blob, star } from "./_chibi_wizard.js";

export const meta = {
  name: "Mana bolt (chunky)",
  desc: "A round outlined violet orb with a white shine and a little turning star on it, three shrinking blobs of mana bobbing behind.",
  tags: ["arcane", "projectile", "orb", "chunky", "loop"],
  size: [56, 24], origin: [44, 12], duration: 0.4, loop: true, fps: 30, bg: "dark",
  options: {},
};

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU;
      blob(p, -26, Math.sin(ph) * 1.2, 1.6, ARC[3]); blob(p, -18, -Math.sin(ph) * 1.2, 2.4, ARC[4]); blob(p, -10, Math.sin(ph + 1) * 0.8, 3.2, ARC[4], ARC[5]);
      blob(p, 0, 0, 5.5, ARC[5], WHITE);
      star(p, 1, -1, 4.5 + Math.sin(ph * 2) * 0.8, WHITE, ph / 2);
    },
  };
}
