// 매의 눈 — 데포르메 (용사 학원 궁수 ar_2 · hawk-eye 의 굵은 판) — a big outlined gold eye pops open over the archer's head, a thick
// reticle ring with four ticks tightens round it, the eye blinks shut at 1.05 s and a white star winks. (0, 0) is the archer's feet.
import { fit, hex, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { HAWK } from "./_archer.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";
import { capsule, shape } from "./_chibi_archer.js";

export const meta = {
  name: "Hawk eye (chunky)",
  desc: "A big outlined gold eye pops open over the head, a thick reticle ring with four ticks tightens round it, then it blinks shut and a white star winks.",
  tags: ["projectiles", "buff", "eye", "aim", "chunky", "one-shot"],
  size: [96, 124], origin: [48, 110], duration: 1.5, loop: false, fps: 30, bg: "light",
  options: { palette: HAWK },
};

export const OPEN = 0.3;
const EY = -66, SHUT = 1.05, DK = hex("#2c2450");

export function create(o) {
  const G = fit(o.palette, 8);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const k = pop(t, 0.05, 0.16);
      const lid = t < OPEN ? 0.25 + 0.75 * smooth(0.05, OPEN, t) : t < SHUT ? 1 : 1 - smooth(SHUT, SHUT + 0.12, t);
      if (k > 0 && lid > 0.05) {                                            // the eye: an almond, an amber iris, a dark slit
        const W = 13 * k, H = 7 * k * lid, pts = [];
        for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI * 2; pts.push([Math.cos(a) * W, EY + Math.sin(a) * H * (Math.abs(Math.cos(a)) < 0.2 ? 1 : 0.9)]); }
        shape(p, pts, G[6]);
        if (lid > 0.4) { blob(p, 0, EY, 4.8 * k * Math.min(1, lid), G[4], G[5]); capsule(p, 0, EY - 3 * lid, 0, EY + 3 * lid, 0.8, DK, false, DK); }
      }
      const rr = (26 - 10 * smooth(OPEN, 0.9, t)) * pop(t, OPEN, 0.14) * shrink(t, SHUT, SHUT + 0.2);   // the reticle tightening
      if (rr > 1) {
        band(p, 0, EY, rr, 1, 2.6, G[5], G[6]);
        for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU; capsule(p, Math.cos(a) * (rr + 2), EY + Math.sin(a) * (rr + 2), Math.cos(a) * (rr + 8), EY + Math.sin(a) * (rr + 8), 1.2, G[6]); }
      }
      const s = pop(t, SHUT + 0.08, 0.08) * shrink(t, SHUT + 0.2, SHUT + 0.4);
      if (s > 0) star(p, 0, EY, 12 * s, WHITE);
    },
  };
}
