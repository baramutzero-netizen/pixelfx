// 승전의 합주 (용사 학원 음유시인 bd_u — 아군 모두 공격 · 속도 증가) — the whole party plays the victory: a gold stage ring is drawn round the ally line,
// two spotlights swing down onto it and a great gold lyre rises behind the line. Four beats (0.4 · 0.8 · 1.2 · 1.6 s) — each one flashes the strings,
// rolls a ripple over the stage, rings sound-waves out of the lyre and sends a volley of notes up behind the line — then at 2.05 s the finale:
// gold rays fan out of the lyre, a white burst, a ring wave and a fountain of notes. (0, 0) is the middle of the line's feet; the line is 240 px wide.
// part: back (stage ring's far half · spotlights · lyre · notes behind — under the units) | front (near halves · falling confetti notes) | all.
import { Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { HARP, WINE, note, waves, floorRing, lyre } from "./_bard.js";

export const meta = {
  name: "Encore finale",
  desc: "A gold stage ring, spotlights and a great lyre behind the ally line; four beats flash the strings and send notes up, then gold rays, a burst and a fountain of notes.",
  tags: ["arcane", "buff", "area", "ultimate", "music", "bard", "one-shot"],
  size: [304, 180], origin: [152, 130], duration: 2.8, loop: false, fps: 30, bg: "ground",
  options: { palette: HARP, seed: 33, part: "all" },
};

export const BEATS = [0.4, 0.8, 1.2, 1.6];
export const FINALE = 2.05;
const SY = 0.26, RS = 128, LH = 58;

export function create(o) {
  const G = fit(o.palette, 8), W = fit(WINE, 8), R = new Rng(o.seed), BACK = o.part !== "front", FRONT = o.part !== "back";
  const half = BACK && FRONT ? null : BACK ? "back" : "front";
  const volleys = BEATS.map(() => Array.from({ length: 3 }, (_, i) => ({ x: (i - 1) * 70 + R.range(-14, 14), kind: R.chance(0.35) ? 2 : 1, c: R.chance(0.5) ? 1 : 0, sw: R.range(0, 6) })));
  const fount = Array.from({ length: 9 }, (_, i) => { const a = -Math.PI / 2 + (i - 4) * 0.3; return { vx: Math.cos(a) * R.range(70, 110), vy: Math.sin(a) * R.range(70, 95), kind: i % 3 === 0 ? 2 : 1, c: i % 2 }; });
  const confetti = Array.from({ length: 4 }, (_, i) => ({ x: (i - 1.5) * 52 + R.range(-10, 10), d: R.range(0, 0.15), c: i % 2 }));
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const end = 1 - smooth(2.4, 2.8, t), draw = clamp(t / 0.35);
      const beat = BEATS.reduce((a, b) => Math.max(a, t >= b ? 1 - clamp((t - b) / 0.15) : 0), 0), fin = t >= FINALE ? 1 - clamp((t - FINALE) / 0.3) : 0;
      const ringK = end * (0.85 + 0.15 * beat);
      // the stage ring, drawn round
      for (const [r, c, w] of [[RS, beat > 0.4 || fin > 0.3 ? G[6] : G[5], 1.6], [RS - 6, W[4], 1], [RS - 10, G[3], 1]]) {
        for (let g = 0; g < TAU * draw; g += 0.5 / r) {
          const a = Math.PI / 2 + g, s = Math.sin(a); if (half === "back" && s > 0) continue; if (half === "front" && s <= 0) continue;
          for (let q = 0; q < w; q += 0.7) p.dot(Math.cos(a) * (r + q), Math.sin(a) * (r + q) * SY, c, ringK * (s > 0 ? 1 : 0.7));
        }
      }
      [...BEATS, FINALE].forEach((b, i) => { const v = clamp((t - b) / 0.5); if (v > 0 && v < 1) floorRing(p, 0, 0, RS + (i === 4 ? 20 : 16) * ease.outCubic(v), SY, i === 4 ? WHITE : G[5], (1 - v) * end, half, i === 4 ? 1.6 : 1); });
      if (BACK) {
        p.glow(0, -6, 110, G[3], (0.16 + 0.12 * beat + 0.25 * fin) * end * draw);
        // two spotlights swing down onto the stage
        const sw = ease.outCubic(clamp((t - 0.05) / 0.4)), sk = (0.13 + 0.07 * beat + 0.12 * fin) * end * sw;
        for (const s of [-1, 1]) {
          const tx = s * 138, ty = -120, bx = s * (80 - 60 * sw);
          for (let u = 0; u <= 1; u += 0.006) { const cx = tx + (bx - tx) * u, hw = 4 + 46 * u, y = ty + (0 - ty) * u; for (let d = -hw; d <= hw; d += 1) p.blend(cx + d, y, G[6], sk * (1 - Math.abs(d) / hw * 0.6) * smooth(0, 0.3, u)); }
        }
        // the lyre rises behind the line
        const up = ease.outBack(clamp((t - 0.1) / 0.35)), lk = end * clamp((t - 0.1) / 0.15);
        if (lk > 0) {
          const strum = (s) => Math.max(...BEATS.map((b) => (t >= b + s * 0.025 ? 1 - clamp((t - b - s * 0.025) / 0.2) : 0)), fin);
          p.glow(0, -LH * 0.5 * up, 40, G[4], (0.25 + 0.3 * beat + 0.5 * fin) * lk);
          lyre(p, -4, -2, LH * up, G[5], strum, G[6], lk, 7, WHITE);
          BEATS.forEach((b) => { const v = clamp((t - b) / 0.45); if (v > 0 && v < 1) { waves(p, 14, -LH * 0.5, 10 + 30 * ease.outCubic(v), 7, 2, 0, 0.6, G[6], (1 - v) * lk, 1.2); waves(p, -14, -LH * 0.5, 10 + 30 * ease.outCubic(v), 7, 2, Math.PI, 0.6, W[5], (1 - v) * lk, 1.2); } });
        }
        // a volley of notes behind the line on every beat
        BEATS.forEach((b, i) => volleys[i].forEach((n, j) => {
          const u = clamp((t - b - j * 0.05) / 0.8); if (u <= 0 || u >= 1) return;
          note(p, n.x + Math.sin(u * 6 + n.sw) * 4, -16 - 48 * ease.outCubic(u), 2.2, n.c ? W[5] : G[5], WHITE, (u < 0.12 ? u / 0.12 : 1 - smooth(0.65, 1, u)) * end, n.kind, Math.sin(u * 6) * 2);
        }));
        // the finale: gold rays fan out of the lyre
        const fr = clamp((t - FINALE) / 0.5);
        if (fr > 0 && fr < 1) for (let i = 0; i < 11; i++) {
          const a = Math.PI + (i / 10) * Math.PI, L = 30 + 70 * ease.outCubic(fr), k = (1 - fr);
          p.line(Math.cos(a) * 10, -LH * 0.55 + Math.sin(a) * 10, Math.cos(a) * L, -LH * 0.55 + Math.sin(a) * L * 0.75, i % 2 ? G[5] : G[6], k);
        }
        if (fin > 0) { p.glow(0, -LH * 0.55, 60, G[5], 0.6 * fin); p.disc(0, -LH * 0.55, 8 * fin + 1, WHITE, fin); }
        fount.forEach((n) => {
          const u = clamp((t - FINALE) / 0.75); if (u <= 0 || u >= 1) return;
          const tt = u * 0.75, x = n.vx * tt, y = -LH * 0.55 + n.vy * tt + 150 * tt * tt;
          if (y > -6) return;
          note(p, x, y, 2.2, n.c ? W[5] : G[6], WHITE, (1 - smooth(0.6, 1, u)) * end, n.kind, Math.sin(tt * 10) * 2);
        });
      }
      if (FRONT) confetti.forEach((n) => {                                  // a few confetti notes drift down in front, low
        const u = clamp((t - FINALE - n.d) / 0.7); if (u <= 0 || u >= 1) return;
        note(p, n.x + Math.sin(u * 8) * 3, -14 + 11 * u, 1.6, n.c ? W[5] : G[6], WHITE, (u < 0.1 ? u / 0.1 : 1 - smooth(0.6, 1, u)) * end, 1, Math.sin(u * 8) * 1.5);
      });
    },
  };
}
