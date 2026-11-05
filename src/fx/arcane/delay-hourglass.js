// 지연 (용사 학원 시마도사 tm_2 — 적의 행동 게이지를 되돌린다) — a tall hourglass of azure glass forms round the target, its sand
// runs back up, a brass dial above it turns backward, and heavy grey motes sink round the body. (0, 0) is the target's feet.
import { Particles, Lights, P, Rng, fit, hex, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS, clockFace } from "./_chrono.js";

export const meta = {
  name: "Delay hourglass",
  desc: "A tall hourglass of azure glass forms round the target, its sand runs back up, a brass dial above it turns backward and heavy grey motes sink round the body.",
  tags: ["arcane", "debuff", "time", "slow", "hourglass", "one-shot"],
  size: [80, 108], origin: [40, 96], duration: 1.4, loop: false, fps: 30, bg: "ground",
  options: { palette: CHRONO, seed: 13 },
};

export const SET = 0.3;
const TOP = -58, W = 17, GREY = ["#3a3e4e", "#6a7084", "#a4aabc"].map(hex);

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], B[5]] }), lights = new Lights();
  let t = 0, set = false;
  const fade = () => 1 - smooth(1.05, meta.duration - 0.03, t);
  const half = (y) => { const v = Math.abs(y - TOP / 2) / (-TOP / 2); return 2 + (W - 2) * Math.pow(v, 0.8); };   // the glass narrows to a neck at the middle
  return {
    update(dt) {
      t += dt;
      if (!set && t >= SET) { set = true; lights.add(0, TOP / 2, 36, C[5], 0.5, 0.3); }
      if (t > SET && t < 0.95 && R.chance(dt * 18)) ps.spawn(P.DUST, R.range(-W, W), TOP + R.range(0, 30), 0, R.range(10, 22), R.range(0.3, 0.4), GREY[R.int(0, 2)], 1);
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade(), u = ease.outCubic(clamp(t / SET));
      const y0 = TOP / 2 - (-TOP / 2) * u, y1 = TOP / 2 + (-TOP / 2) * u;      // the glass draws open from the neck out
      for (let y = y0; y <= y1; y += 1) { const h = half(y); p.dot(-h, y, C[5], f * 0.9); p.dot(h, y, C[6], f * 0.9); p.blend(-h + 1, y, C[4], f * 0.25); p.blend(h - 1, y, C[4], f * 0.18); }
      if (u >= 1) for (const yy of [TOP, 0]) for (let x = -W - 3; x <= W + 3; x++) { p.dot(x, yy, B[4], f); p.dot(x, yy + (yy ? -1 : 1), B[2], f); }
      const s = smooth(SET, 1.1, t);                                         // sand running back up: the bottom empties, the top fills
      if (u >= 1) {
        for (let y = -1; y > -1 - 16 * (1 - s); y--) { const h = half(y) - 2; for (let x = -h; x <= h; x += 1) p.blend(x, y, B[5], f * 0.3); }
        for (let y = TOP + 1; y < TOP + 1 + 16 * s; y++) { const h = half(y) - 2; for (let x = -h; x <= h; x += 1) p.blend(x, y, B[5], f * 0.3); }
        for (let y = TOP / 2 + 18; y > TOP / 2 - 18; y -= 3) { const ph = ((y + t * 60) % 3 + 3) % 3; p.dot(0, y - ph, B[6], f); }
      }
      const back = -smooth(0, 1.2, t) * TAU * 1.5;                             // the dial above, turning backward
      clockFace(p, 0, TOP - 12, 9, 1, f * smooth(0.1, 0.3, t), back / 12, back, B[5], B[6], C[6]);
      ps.draw(p); lights.draw(p);
    },
  };
}
