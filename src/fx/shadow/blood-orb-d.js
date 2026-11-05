// 흡혈 의식 — 날아가는 피 구슬 · 데포르메 (용사 학원 암흑사제 dp_1 · blood-orb 의 굵은 판) — a round outlined crimson orb with a white shine,
// three shrinking drops bobbing behind it. Loops; (0, 0) is the orb, flying right.
import { TAU, WHITE } from "../../core/index.js";
import { BLOODC, blob } from "./_chibi_darkpriest.js";

export const meta = {
  name: "Blood orb (chunky)",
  desc: "A round outlined crimson orb with a white shine, three shrinking drops of blood bobbing behind it.",
  tags: ["shadow", "blood", "projectile", "chunky", "loop"],
  size: [48, 24], origin: [38, 12], duration: 0.4, loop: true, fps: 30, bg: "light",
  options: {},
};

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU;
      blob(p, -22, Math.sin(ph) * 1.2, 1.5, BLOODC[2]); blob(p, -15, -Math.sin(ph) * 1.2, 2.2, BLOODC[3]); blob(p, -8, Math.sin(ph + 1) * 0.8, 3, BLOODC[3], BLOODC[5]);
      blob(p, 0, 0, 5, BLOODC[3], WHITE);
    },
  };
}
