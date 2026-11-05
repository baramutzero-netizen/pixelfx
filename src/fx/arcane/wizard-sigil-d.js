// 마법사 시전 마법진 — 데포르메 (용사 학원 마법사 · wizard-sigil 의 굵은 판) — three thick outlined rings (violet, cyan, violet) pop out one
// after another in front of the staff tip, facing the way she casts, three rune blobs ride the big ring, and a star pops at the front before they shrink away.
// (0, 0) is the staff tip; the rings stand to the right.
import { clamp, smooth, TAU, WHITE } from "../../core/index.js";
import { ARC, CYAN, ringXY, blob, star, pop, shrink } from "./_chibi_wizard.js";

export const meta = {
  name: "Wizard sigil (chunky)",
  desc: "Three thick outlined rings pop out one after another in front of the staff tip, rune blobs ride the big ring, and a star pops at the front before they shrink away.",
  tags: ["arcane", "cast", "circle", "staff", "chunky", "one-shot"],
  size: [96, 96], origin: [20, 48], duration: 1.4, loop: false, fps: 30, bg: "dark",
  options: {},
};

const RINGS = [{ dx: 10, r: 26, t0: 0, c: 4 }, { dx: 22, r: 19, t0: 0.12, c: -1 }, { dx: 32, r: 12, t0: 0.24, c: 4 }];
const FLARE = 0.75, END = 1.05, SX = 0.38;

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const out = shrink(t, END, 1.3);
      RINGS.forEach((q, i) => {
        const k = pop(t, q.t0, 0.16) * out; if (k <= 0) return;
        const r = q.r * k, f = q.c < 0 ? CYAN[3] : ARC[4], inner = q.c < 0 ? CYAN[4] : ARC[5];
        ringXY(p, q.dx, 0, r * SX, r, 3.6, f, inner);
        if (i === 0) for (let j = 0; j < 3; j++) { const a = t * 2.2 + (j / 3) * TAU; blob(p, q.dx + Math.cos(a) * r * SX, Math.sin(a) * r, 2.2 * k, ARC[5], WHITE); }
      });
      blob(p, 0, 0, 2.5 * shrink(t, 1.1, 1.35), ARC[5], WHITE);
      const s = pop(t, FLARE, 0.1) * shrink(t, FLARE + 0.12, END);
      if (s > 0) star(p, 34, 0, 11 * s, ARC[6]);
    },
  };
}
