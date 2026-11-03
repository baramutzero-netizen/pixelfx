// 성기사 휘두름 (용사 학원 팔라딘 시전 모션 — 예전 trail 그림) — a golden arc swept by the mace over the head and down in front, shedding sparkles.
// (0, 0) is the paladin's chest; the arc's centre sits a little above it. Faces right.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, lerp, TAU, WHITE, sparkle } from "../../core/index.js";
import { GOLD } from "./_lib.js";

export const meta = {
  name: "Paladin swing",
  desc: "A golden crescent swept fast from behind the shoulder, over the head and down in front, thick and white at the head, thinning to amber; sparkles shake off it and drift.",
  tags: ["holy", "cast", "swing", "trail", "melee", "one-shot"],
  size: [104, 124], origin: [48, 56], duration: 0.9, loop: false, fps: 30, bg: "dark",
  options: { palette: GOLD, seed: 5 },
};

const A0 = -2.7, A1 = 1.05, SWEEP = 0.16, R0 = 30, CY = -6, FADE = 0.5;
export const HIT = SWEEP;

export function create(o) {
  const C = fit(o.palette, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 999, sparks: [WHITE, C[6], C[5], C[4]] }), lights = new Lights();
  let t = 0, last = A0, flashed = false;
  const head = (tt) => lerp(A0, A1, ease.outQuart(clamp(tt / SWEEP)));
  const at = (g, r = R0) => [Math.cos(g) * r, CY + Math.sin(g) * r * 0.92];
  function arc(p) {
    const h = head(t), fade = 1 - smooth(SWEEP, SWEEP + FADE, t);
    if (fade <= 0) return;
    const span = h - A0, n = Math.ceil(span * R0 * 1.6);
    for (let j = 0; j <= n; j++) {
      const u = j / Math.max(1, n), g = A0 + span * u;                  // u = 0 at the tail, 1 at the head
      const th = (0.8 + 4.2 * Math.pow(u, 1.6)) * (0.6 + 0.4 * fade);
      for (let d = -th; d <= th; d += 0.7) {
        const [x, y] = at(g, R0 + d * 0.9), e = Math.abs(d) / th;
        const c = u > 0.92 && e < 0.6 ? WHITE : e > 0.75 ? (u < 0.4 ? C[2] : C[3]) : u < 0.35 ? C[3] : u < 0.75 ? C[4] : C[6];
        p.dot(x, y, c, fade * (0.35 + 0.65 * u) * (e > 0.75 ? 0.8 : 1));
      }
      if (j % 6 === 0) { const [x, y] = at(g); p.glow(x, y, 5, C[5], 0.12 * fade * u); }
    }
    const [hx, hy] = at(h);
    if (t < SWEEP + 0.12) p.glow(hx, hy, 10, C[6], 0.5 * fade);
  }
  return {
    update(dt) {
      t += dt;
      const h = head(t);
      if (t < SWEEP + 0.02) for (let g = last; g < h; g += 0.09) {        // sparkles shaken off where the head passes
        const [x, y] = at(g, R0 + R.range(-3, 3)), out = R.range(10, 40);
        ps.spawn(R.chance(0.35) ? P.STAR : P.SPARK, x, y, Math.cos(g) * out + R.range(-8, 8), Math.sin(g) * out - R.range(5, 25), R.range(0.25, 0.6), R.chance(0.4) ? WHITE : C[5], R.range(0.6, 1.4));
      }
      last = h;
      if (!flashed && t >= SWEEP) { flashed = true; const [x, y] = at(A1); lights.add(x, y, 18, C[5], 0.6, 0.18); }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      arc(p);
      if (t >= SWEEP && t < SWEEP + 0.12) { const [x, y] = at(A1); sparkle(p, x, y, 5 * (1 - (t - SWEEP) / 0.12) + 1, WHITE, C[5], 0.6); }
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
