// 시간 파편 — 날아가는 조각 · 데포르메 (용사 학원 시마도사 tm_b · time-shard 의 굵은 판) — a chunky outlined azure diamond with a white
// shine and a brass hand stripe, spinning, two lighter ghost diamonds trailing. Loops; (0, 0) is its middle, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS } from "./_chrono.js";
import { shape, capsule } from "./_chibi_timemage.js";

export const meta = {
  name: "Time shard (chunky)",
  desc: "A chunky outlined azure diamond with a white shine and a brass hand stripe, spinning in flight, two lighter ghost diamonds trailing behind.",
  tags: ["arcane", "projectile", "time", "shard", "chunky", "loop"],
  size: [52, 32], origin: [36, 16], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: CHRONO },
};

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8);
  let t = 0;
  const dia = (p, x, s, rot, fill) => shape(p, [[8, 0], [0, 4.5], [-7, 0], [0, -4.5]].map(([a, b]) => [x + (a * Math.cos(rot) - b * Math.sin(rot)) * s, (a * Math.sin(rot) + b * Math.cos(rot)) * s]), fill);
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU * 0.5;
      dia(p, -22, 0.55, ph - 1.2, C[4]); dia(p, -12, 0.75, ph - 0.6, C[5]);
      dia(p, 0, 1, ph, C[5]);
      capsule(p, 0, 0, Math.cos(ph * 2) * 4, Math.sin(ph * 2) * 4, 0.8, B[5]);
      p.dot(-2, -2, WHITE, 1); p.dot(-1, -2, WHITE, 1);
    },
  };
}
