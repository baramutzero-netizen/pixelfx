// 마법사 마법진 (용사 학원 마법사 시전 모션 wizardCircles) — three rune circles drawn in the air in front of the staff tip, facing the target.
// (0, 0) is the staff tip; the circles stand edge-on (squashed in x) a little in front of it. Faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, PAL } from "../../core/index.js";
import { sigil } from "./_lib.js";

export const meta = {
  name: "Wizard sigil",
  desc: "Three rune circles are traced in the air before the staff, big to small, spinning as they stack toward the target, then flare and dissolve into motes.",
  tags: ["arcane", "cast", "circle", "charge", "one-shot"],
  size: [96, 96], origin: [20, 48], duration: 1.4, loop: false, fps: 30, bg: "dark",
  options: { palette: PAL.arcane, seed: 4, tint: ["#0c1430", "#162c5c", "#1f4f94", "#2f7fcc", "#58b4ec", "#9bdcff", "#d8f4ff", "#ffffff"] },
};

const RINGS = [{ dx: 10, r: 30, t0: 0, n: 6 }, { dx: 22, r: 22, t0: 0.12, n: 5 }, { dx: 32, r: 14, t0: 0.24, n: 4 }];
const TRACE = 0.28, FLARE = 0.75, END = 1.05, SX = 0.38;

export function create(o) {
  const C = fit(o.palette, 8), B = fit(o.tint, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 999, sparks: [C[7], C[6], C[5], C[4]] }), lights = new Lights();
  let t = 0, flared = false;
  function ring(p, q, i, back) {
    const u = clamp((t - q.t0) / TRACE), out = smooth(FLARE, END, t), spin = t * (i % 2 ? -2.2 : 1.6) + i;
    if (u <= 0 || out >= 1) return;
    const cols = i === 1 ? B : C, a0 = 1 - out;
    for (let j = 0, m = Math.ceil(q.r * TAU * 1.3); j < m; j++) {   // the rim, traced round from the top
      const g = (j / m) * TAU;
      if (g / TAU > ease.outQuad(u)) break;
      const ang = g - Math.PI / 2 + spin, x = q.dx + Math.cos(ang) * q.r * SX, y = Math.sin(ang) * q.r, far = Math.cos(ang) > 0;
      if (far !== back) continue;
      p.dot(x, y, far ? cols[4] : cols[6], a0);
      if (j % 3 === 0) p.dot(x - 0.6 * Math.sign(Math.cos(ang)), y, cols[5], a0 * 0.7);
    }
    if (!back && u >= 1) for (let k = 0; k < q.n; k++) {               // runes riding the near face
      const ang = (k / q.n) * TAU + spin, x = q.dx + Math.cos(ang) * q.r * 0.7 * SX, y = Math.sin(ang) * q.r * 0.7;
      if (Math.cos(ang) > 0.3) continue;
      sigil(p, (k + i * 3) % 8, x, y, cols[6], a0 * 0.9, cols[1]);
    }
    if (!back) p.glow(q.dx, 0, q.r * 0.9, cols[4], 0.22 * a0 * u);
  }
  return {
    update(dt) {
      t += dt;
      if (t < FLARE && R.chance(dt * 40)) { const q = R.pick(RINGS), a = R.range(0, TAU); ps.spawn(P.MOTE, q.dx + Math.cos(a) * q.r * SX, Math.sin(a) * q.r, R.range(20, 60), R.range(-15, 15), R.range(0.2, 0.4), C[5]); }
      if (!flared && t >= FLARE) { flared = true; lights.add(30, 0, 40, C[5], 0.7, 0.3); for (let i = 0; i < 26; i++) { const a = R.range(-1, 1), sp = R.range(60, 160); ps.spawn(P.SPARK, 34, R.range(-10, 10), Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.12, 0.3)); } }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) { RINGS.forEach((q, i) => ring(p, q, i, true)); },
    draw(p) {
      RINGS.forEach((q, i) => ring(p, q, i, false));
      if (t < END) p.circle(0, 0, 1.5 + (t < FLARE ? Math.sin(t * 40) * 0.5 : 0), WHITE);
      if (t < END) p.glow(0, 0, 8, C[5], 0.5 * (1 - smooth(FLARE, END, t)));
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
