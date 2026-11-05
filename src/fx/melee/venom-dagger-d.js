// 독 단검 — 날아가는 단검 · 데포르메 (용사 학원 암살자 ro_1 · venom-dagger 의 굵은 판) — a chunky outlined dagger spinning end over end,
// its blade wet green, two green drops trailing. Loops; (0, 0) is its middle, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { VENOM, EDGE } from "./_rogue.js";
import { blob } from "../holy/_chibi.js";
import { polyFill } from "./_chibi_rogue.js";

export const meta = {
  name: "Venom dagger (chunky)",
  desc: "A chunky outlined dagger spinning end over end, its blade wet green, two green drops trailing behind it.",
  tags: ["melee", "projectile", "dagger", "venom", "chunky", "loop"],
  size: [48, 24], origin: [34, 12], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: VENOM, edge: EDGE },
};

export function create(o) {
  const C = fit(o.palette, 8), Ed = fit(o.edge, 6);
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const a = (t / meta.duration) * TAU, c = Math.cos(a), s = Math.sin(a), R = (x, y) => [x * c - y * s, x * s + y * c];
      blob(p, -18, 1, 1.6, C[4]); blob(p, -11, -1, 2.2, C[5], C[6]);
      polyFill(p, [R(-7, -2.4), R(-1, -2.4), R(-1, 2.4), R(-7, 2.4)], Ed[1]);                        // the grip
      polyFill(p, [R(-1, -3.2), R(8, 0), R(-1, 3.2)], Ed[3], (px, py) => { const u = (px * c + py * s); return u > 4 ? C[5] : (px * -s + py * c) < 0 ? WHITE : 0; });   // the blade, green at the tip
    },
  };
}
