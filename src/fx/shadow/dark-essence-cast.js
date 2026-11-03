// 암흑사제 시전 (용사 학원 암흑사제 시전 모션 — 예전 darkEssence 그림) — shadow wisps spiral into the staff tip and knot into a dark orb.
// (0, 0) is the staff tip; the swirl gathers from behind it. Faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { VOID } from "./_lib.js";

export const meta = {
  name: "Dark essence cast",
  desc: "Violet shadow wisps spiral in from behind the staff and knot into a black orb with a lilac rim at the tip; it throbs, sheds a dark ring and the wisps burn away.",
  tags: ["shadow", "cast", "charge", "orb", "one-shot"],
  size: [96, 88], origin: [60, 44], duration: 1.0, loop: false, fps: 30, bg: "light",
  options: { palette: VOID, seed: 7 },
};

const GATHER = 0.5, POP = 0.62, NW = 5;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 999, sparks: [C[6], C[5], C[4]] }), lights = new Lights();
  const wisps = Array.from({ length: NW }, (_, i) => ({ a0: Math.PI * 0.55 + (i / NW) * Math.PI * 1.1, r0: R.range(26, 34), sp: R.range(5, 7) * (i % 2 ? 1 : -1), d: i * 0.04 }));
  let t = 0, popped = false;
  const orbR = () => (t < POP ? 5 * ease.outBack(clamp((t - 0.15) / 0.35), 1.6) : 5 * (1 - smooth(POP, POP + 0.25, t))) + (t < POP ? Math.sin(t * 40) * 0.6 : 0);
  function wisp(p, w) {
    const u = clamp((t - w.d) / GATHER), f = 1 - smooth(POP - 0.05, POP + 0.25, t);
    if (u <= 0 || f <= 0) return;
    for (let j = 0; j < 22; j++) {                                     // a tail of dots along its spiral path behind the head
      const v = u - j * 0.025; if (v < 0) break;
      const r = w.r0 * (1 - ease.inQuad(v)), g = w.a0 + w.sp * v, x = Math.cos(g) * r * 1.15 - 4 * (1 - v), y = Math.sin(g) * r * 0.75;
      const c = j === 0 ? C[6] : j < 6 ? C[5] : j < 14 ? C[4] : C[3];
      p.dot(x, y, c, f * (1 - j / 22));
      p.dot(x + 1, y, j < 8 ? C[4] : C[3], f * (1 - j / 22) * 0.9);
      if (j < 6) p.dot(x, y + 1, C[3], f * 0.8);
    }
  }
  return {
    update(dt) {
      t += dt;
      if (t < POP && R.chance(dt * 30)) { const a = R.range(0, TAU), d = R.range(14, 26); ps.spawn(P.MOTE, Math.cos(a) * d - 6, Math.sin(a) * d * 0.7, -Math.cos(a) * 40, -Math.sin(a) * 30, R.range(0.25, 0.45), R.chance(0.5) ? C[5] : C[4]); }
      if (!popped && t >= POP) { popped = true; lights.add(0, 0, 20, C[5], 0.6, 0.2); for (let i = 0; i < 16; i++) { const a = R.range(0, TAU), s = R.range(30, 80); ps.spawn(P.SPARK, 0, 0, Math.cos(a) * s, Math.sin(a) * s, R.range(0.15, 0.35)); } }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) { for (const w of wisps) wisp(p, w); },
    draw(p) {
      const r = orbR();
      if (r > 0.5) {
        p.glow(0, 0, r * 3.2, C[4], 0.45);
        p.disc(0, 0, r + 1.2, C[5], 1);
        p.disc(0, 0, r, C[1], 1);
        p.dot(-r * 0.4, -r * 0.4, C[6], 1);
      }
      const g = (t - POP) / 0.3;                                         // the dark ring it sheds
      if (g > 0 && g < 1) { const rr = 4 + 18 * ease.outCubic(g); for (let j = 0, m = Math.ceil(rr * TAU); j < m; j++) { const a = (j / m) * TAU; p.dot(Math.cos(a) * rr, Math.sin(a) * rr, g < 0.3 ? C[6] : C[4], 1 - g); } }
      if (t >= POP && t < POP + 0.1) sparkle(p, 0, 0, 5, C[7], C[5], 0.6);
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
