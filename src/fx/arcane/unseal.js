// 봉인 해제 (용사 학원 전쟁법사 필살기 fm_u — 자신의 모든 능력 상승 · 단일 대상 공격 기술 전체화) — three gold seal rings with lock
// studs close round her and chains of light cross her body; the seals crack and fly apart one by one (0.6 · 1.0 · 1.4 s), and at 1.8 s
// the last bond breaks: a crimson pillar of force erupts from her feet, a shock ring races across the floor and a crown of crimson
// flames burns round her until it fades. (0, 0) is her feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, sparkle } from "../../core/index.js";
import { FORCE, STAR, runeRing } from "./_forcemage.js";

export const meta = {
  name: "Unseal",
  desc: "Gold seal rings and chains of light bind her, crack and fly apart one by one, then a crimson pillar erupts, a shock ring races out and crimson flames crown her.",
  tags: ["arcane", "buff", "force", "unseal", "ultimate", "one-shot"],
  size: [228, 200], origin: [114, 160], duration: 2.6, loop: false, fps: 30, bg: "ground",
  options: { palette: FORCE, seed: 27, part: "all" },
};

/** The three seals break, then the last bond (the host gives the buff on FINAL). */
export const BREAKS = [0.6, 1.0, 1.4];
export const FINAL = 1.8;
const SY = 0.32, SEALS = [{ y: -8, r: 36 }, { y: -30, r: 32 }, { y: -52, r: 28 }];

export function create(o) {
  const C = fit(o.palette, 8), S = fit(STAR, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[6], S[5]] }), lights = new Lights();
  const shards = SEALS.map(() => Array.from({ length: 8 }, (_, j) => ({ a: (j / 8) * TAU + R.range(0, 0.3), v: R.range(40, 80) })));
  let t = 0, done = 0, fin = false;
  const fade = () => 1 - smooth(2.25, meta.duration - 0.03, t);
  return {
    update(dt) {
      t += dt;
      while (done < BREAKS.length && t >= BREAKS[done]) { const s = SEALS[done]; lights.add(0, s.y, 30, S[5], 0.5, 0.2); for (let i = 0; i < 6; i++) { const a = R.range(0, TAU); ps.spawn(P.SPARK, Math.cos(a) * s.r, s.y + Math.sin(a) * s.r * SY, Math.cos(a) * 90, Math.sin(a) * 30 - 20, R.range(0.15, 0.3), S[6], 1); } done++; }
      if (!fin && t >= FINAL) { fin = true; lights.add(0, -30, 70, C[5], 0.7, 0.4); for (let i = 0; i < 18; i++) { const a = R.range(0, TAU), s = R.range(50, 140); ps.spawn(P.STAR, 0, -30, Math.cos(a) * s, Math.sin(a) * s * 0.7, R.range(0.25, 0.45), R.chance(0.5) ? WHITE : C[6], 1); } }
      if (t > FINAL && t < 2.05 && R.chance(dt * 30)) ps.spawn(P.EMBER, R.range(-18, 18), -R.range(0, 10), R.range(-6, 6), -R.range(40, 80), R.range(0.3, 0.5), C[R.int(4, 6)], 1);
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade();
      SEALS.forEach((s, i) => {
        const b = BREAKS[i], open = ease.outBack(clamp((t - i * 0.08) / 0.25));
        if (t < b) {
          const shake = t > b - 0.2 ? Math.sin(t * 80) * 1.2 : 0;
          runeRing(p, shake, s.y, s.r * open, SY, 1, (i % 2 ? -1 : 1) * t * 1.5, S[5], S[3], C[5], 6);
        } else {
          const a = t - b, k = 1 - smooth(0.1, 0.45, a);
          for (const q of shards[i]) { const d = s.r + q.v * a; for (let g = -0.25; g < 0.25; g += 0.05) p.dot(Math.cos(q.a + g) * d, s.y + Math.sin(q.a + g) * d * SY - 40 * a * a, S[5], k); }
          const fl = 1 - smooth(0, 0.15, a); if (fl > 0) p.glow(0, s.y, s.r * 1.4, S[5], 0.5 * fl);
        }
      });
      const ch = smooth(0, 0.3, t) * (1 - smooth(FINAL - 0.05, FINAL + 0.05, t));     // chains of light crossing the body
      if (ch > 0) for (const sgn of [-1, 1]) for (let u = 0; u <= 1; u += 0.04) { const x = sgn * (-20 + 40 * u), y = -6 - 50 * u; p.dot(x, y, Math.floor(u * 25) % 2 ? S[5] : S[3], ch * (Math.sin(t * 60) > -0.8 ? 1 : 0.5)); }
      const pk = smooth(FINAL, FINAL + 0.08, t) * (1 - smooth(FINAL + 0.25, FINAL + 0.6, t));   // the pillar of force
      if (pk > 0) for (let y = 0; y > -140; y--) { const w = 12 + 4 * Math.sin(y * 0.3 + t * 20), k = pk * (1 - (-y) / 160); for (let x = -w; x <= w; x++) p.blend(x, y, Math.abs(x) < w * 0.15 ? WHITE : Math.abs(x) < w * 0.5 ? C[6] : C[4], k * (1 - Math.abs(x) / (w + 1)) * 0.8); }
      const sv = (t - FINAL) / 0.55;                                              // the shock ring across the floor
      if (sv > 0 && sv < 1) { const r = 10 + 86 * ease.outCubic(sv), k = 1 - sv; for (let g = 0; g < TAU; g += 0.5 / r) { p.dot(Math.cos(g) * r, Math.sin(g) * r * SY, sv < 0.2 ? WHITE : C[5], k); p.dot(Math.cos(g) * (r - 2), Math.sin(g) * (r - 2) * SY, C[3], k * 0.7); } }
      const fk = smooth(FINAL + 0.05, FINAL + 0.2, t) * f;                         // a crown of crimson flames round her
      if (fk > 0) for (let i = 0; i < 9; i++) { const g = (i / 9) * TAU + t * 1.5, x = Math.cos(g) * 20, y = Math.sin(g) * 20 * SY, h = 17 + 7 * Math.sin(t * 14 + i * 2); for (let d = 0; d < h; d++) { const w = 3.6 * (1 - d / h); for (let q = -w; q <= w; q += 1) p.dot(x + q + Math.sin(d * 0.4 + t * 20 + i) * 1, y - d, d < h * 0.3 ? C[6] : C[4], fk * (Math.sin(g) > 0 ? 0.9 : 0.5)); } }
      ps.draw(p); lights.draw(p);
    },
  };
}
