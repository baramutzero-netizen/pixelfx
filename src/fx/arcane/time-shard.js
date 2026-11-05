// 시간 파편 — 날아가는 시간 조각 (용사 학원 시마도사 tm_b) — a splinter of fractured time in flight: a spinning azure glass shard
// with a brass clock hand caught inside it, and three fading after-images trailing behind. Loops; (0, 0) is its middle, flying right.
import { fit, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS } from "./_chrono.js";

export const meta = {
  name: "Time shard",
  desc: "A spinning splinter of azure glass with a brass clock hand caught inside, three fading after-images of it trailing behind like echoes of a moment ago.",
  tags: ["arcane", "projectile", "time", "shard", "loop"],
  size: [56, 32], origin: [40, 16], duration: 0.2, loop: true, fps: 30, bg: "dark",
  options: { palette: CHRONO },
};

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8);
  let t = 0;
  function shard(p, x, rot, k, ghost) {
    const pts = [[7, 0], [0, 3.5], [-6, 0.5], [-1, -3.5]].map(([a, b]) => [x + a * Math.cos(rot) - b * Math.sin(rot), a * Math.sin(rot) + b * Math.cos(rot)]);
    p.poly(pts, ghost ? C[3] : C[4], k * (ghost ? 0.5 : 0.9));
    for (let i = 0; i < 4; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % 4]; p.line(x0, y0, x1, y1, ghost ? C[5] : i < 2 ? WHITE : C[6], k); }
    if (!ghost) { p.line(x, 0, x + Math.cos(rot * 2) * 4, Math.sin(rot * 2) * 4, B[5], k); p.dot(x, 0, WHITE, k); }
  }
  return {
    update(dt) { t += dt; },
    draw(p) {
      const ph = (t / meta.duration) * TAU;
      for (let i = 3; i >= 1; i--) shard(p, -i * 9, ph - i * 0.9, 0.55 - i * 0.14, true);
      p.glow(0, 0, 9, C[4], 0.45);
      shard(p, 0, ph, 1, false);
    },
  };
}
