// 철벽 자세 (용사 학원 검투사 sw_2 — 자세를 굳혀 방어와 공격을 함께 올린다) — the sword plants, a ring of steel plates rises round the swordsman and locks,
// a gleam runs up them, embers of fight rise, then the plates fold into the body. (0, 0) is the swordsman's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { STEEL, RAGE } from "./_gladiator.js";

export const meta = {
  name: "Iron stance",
  desc: "A sword plants and a steel ring slams out on the floor, six bevelled steel plates rise round the body and lock, a gleam runs up them, red embers rise, then they fold in.",
  tags: ["melee", "buff", "guard", "defense", "stance", "one-shot"],
  size: [132, 124], origin: [66, 104], duration: 1.7, loop: false, fps: 30, bg: "light",
  options: { palette: STEEL, fire: RAGE, seed: 13 },
};

const PLANT = 0.1, RISE = 0.12, SET = 0.3, FOLD = 1.0, IN = 1.32, RX = 27, SY = 0.32, NP = 6, H = 36;
export const HIT = SET;

export function create(o) {
  const C = fit(o.palette, 8), F = fit(o.fire, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], C[5]] }), lights = new Lights();
  const plates = Array.from({ length: NP }, (_, i) => ({ a: (i / NP) * TAU + 0.26, d: i * 0.025 }));
  let t = 0, planted = false, set = false, folded = false;
  const height = (q) => H * ease.outBack(clamp((t - RISE - q.d) / (SET - RISE))) * (1 - ease.inCubic(clamp((t - FOLD) / (IN - FOLD))));
  const inward = () => 1 - ease.inCubic(clamp((t - FOLD) / (IN - FOLD))) * 0.85;
  function plate(p, q, back) {
    const g = q.a + t * 0.25, s = Math.sin(g);
    if ((s < 0) !== back) return;
    const h = height(q);
    if (h < 0.5) return;
    const r = RX * inward(), x = Math.cos(g) * r, y = s * r * SY, w = 4.5 * (0.45 + 0.55 * Math.abs(s)) + 1.5, a = back ? 0.75 : 0.5;
    const gl = (t - SET) * 140;                                   // the gleam running up, once, as they lock
    for (let yy = 0; yy < h; yy++) for (let xx = -w; xx <= w; xx++) {
      const top = h - yy < 3 - Math.abs(xx) / w * 2, edge = Math.abs(xx) > w - 1, c = yy > h - 1.5 || top ? C[6] : edge ? (xx < 0 ? C[5] : C[2]) : xx < 0 ? C[4] : C[3];
      const shine = gl > 0 && Math.abs(yy - gl) < 2.5 ? 1 : 0;
      p.dot(x + xx, y - yy, shine ? WHITE : c, Math.min(1, (edge || top ? a + 0.3 : a) + shine * 0.5));
    }
  }
  return {
    update(dt) {
      t += dt;
      if (!planted && t >= PLANT) {
        planted = true; lights.add(10, -2, 26, C[5], 0.7, 0.18);
        for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + R.range(-1.3, 1.3), sp = R.range(60, 200); ps.spawn(P.SPARK, 10, -1, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.12, 0.3)); }
        for (let i = 0; i < 8; i++) ps.spawn(P.DUST, R.range(-14, 14), -1, R.sign() * R.range(15, 45), -R.range(3, 12), R.range(0.4, 0.7), C[3], R.range(2, 4));
      }
      if (!set && t >= SET) { set = true; lights.add(0, -20, 40, C[5], 0.55, 0.3); }
      if (t > SET && t < FOLD + 0.2 && R.chance(dt * 18)) { const x = R.range(-16, 16); ps.spawn(P.EMBER, x, -R.range(2, 20), R.range(-6, 6), -R.range(25, 55), R.range(0.5, 0.9), F[R.int(4, 6)], 1); }
      if (!folded && t >= IN) { folded = true; lights.add(0, -22, 30, WHITE, 0.7, 0.16); for (let i = 0; i < 10; i++) { const a = R.range(0, TAU), sp = R.range(30, 90); ps.spawn(P.STAR, 0, -22, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.25, 0.5), C[6], 1); } }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      // the sword planting: a bright streak down into the floor in front, a cross-guard glint
      if (t < PLANT + 0.25) { const u = clamp(t / PLANT), f = 1 - smooth(PLANT, PLANT + 0.25, t);
        for (let y = -40 + 38 * ease.inQuad(u); y > -40 + 38 * ease.inQuad(u) - 18 && y < 0; y -= 0.5) p.dot(10, y, C[6], f); }
      // the floor ring slamming out, and a steady ring under the plates while they stand
      const v = (t - PLANT) / 0.4;
      if (v > 0 && v < 1) for (let g = 0; g < TAU; g += 0.02) p.dot(Math.cos(g) * (8 + 38 * ease.outCubic(v)), Math.sin(g) * (8 + 38 * ease.outCubic(v)) * SY, v < 0.3 ? WHITE : C[4], 1 - v);
      const keep = smooth(RISE, SET, t) * (1 - smooth(FOLD, IN, t));
      if (keep > 0) for (let g = 0; g < TAU; g += 0.025) p.dot(Math.cos(g) * RX * inward(), Math.sin(g) * RX * inward() * SY, Math.sin(g) > 0 ? C[5] : C[3], keep * 0.8);
      for (const q of plates) plate(p, q, true);
      if (keep > 0) p.glow(0, -18, 30, C[4], 0.12 * keep);
      for (const q of plates) plate(p, q, false);
      if (t >= IN && t < IN + 0.25) sparkle(p, 0, -22, 10 * (1 - (t - IN) / 0.25), WHITE, C[5], 0.7);
      ps.draw(p); lights.draw(p);
    },
  };
}
