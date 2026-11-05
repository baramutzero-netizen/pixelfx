// 불협화음 (용사 학원 음유시인 bd_2 — 적 모두 명중 감소) — a sour staff is strung across the enemy line: five wavering bruise-violet lines
// run in from the left just over the heads with sharps and flats sliding along them; at 0.45 s it goes off key — the lines twist into jagged waves,
// snap into pieces that sag and drop, acid ripples spread over the floor and sour glyphs wobble above. Drawn under the units.
// (0, 0) is the middle of the line's feet; the line is 240 px wide.
import { Rng, fit, clamp, smooth, ease, WHITE } from "../../core/index.js";
import { SOUR, WINE, floorRing } from "./_bard.js";

export const meta = {
  name: "Discord stave",
  desc: "A sour staff strung over the enemy line goes off key: its lines twist jagged, snap and drop, acid ripples spread and sharps and flats wobble over the heads.",
  tags: ["arcane", "debuff", "area", "music", "bard", "one-shot"],
  size: [304, 170], origin: [152, 124], duration: 1.6, loop: false, fps: 30, bg: "ground",
  options: { palette: SOUR, seed: 21 },
};

export const SET = 0.45;
const SY = 0.3, HW = 124, Y0 = -72, GAP = 5;

function flat1(p, x, y, s, c, k) { p.line(x - s * 0.4, y - s * 2.2, x - s * 0.4, y + s * 0.6, c, k); for (let g = -1.4; g <= 1.4; g += 0.15) p.dot(x - s * 0.4 + s * 0.7 * Math.cos(g) * (g > 0 ? 1 : 0.9), y + s * 0.6 * Math.sin(g) - s * 0.1, c, k); }
function sharp1(p, x, y, s, c, k) { p.line(x - s * 0.4, y - s * 1.4, x - s * 0.4, y + s * 1.4, c, k); p.line(x + s * 0.4, y - s * 1.6, x + s * 0.4, y + s * 1.2, c, k); p.line(x - s, y - s * 0.3, x + s, y - s * 0.7, c, k); p.line(x - s, y + s * 0.6, x + s, y + s * 0.2, c, k); }

const flat = (p, x, y, s, c, k) => { flat1(p, x, y, s, c, k); flat1(p, x + 0.8, y, s, c, k); };
const sharp = (p, x, y, s, c, k) => { sharp1(p, x, y, s, c, k); sharp1(p, x + 0.8, y + 0.4, s, c, k); };

export function create(o) {
  const C = fit(o.palette, 8), W = fit(WINE, 8), R = new Rng(o.seed);
  const cuts = Array.from({ length: 5 }, () => [-HW, ...Array.from({ length: 5 }, () => R.range(-HW + 20, HW - 20)).sort((a, b) => a - b), HW]);
  const marks = [-96, -48, 0, 48, 96].map((x, i) => ({ x: x + R.range(-6, 6), kind: i % 2, ph: R.range(0, 6), d: R.range(0, 0.12) }));
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const run = ease.outCubic(clamp(t / SET)), front = -HW + 2 * HW * run, snap = clamp((t - SET) / 0.6);
      const jag = smooth(SET - 0.15, SET, t), fade = 1 - smooth(1.1, 1.5, t);
      for (let l = 0; l < 5; l++) {                                        // the staff
        const y0 = Y0 - l * GAP, cs = cuts[l];
        for (let s = 0; s < cs.length - 1; s++) {
          const a = cs[s], b = cs[s + 1], mid = (a + b) / 2, drop = 90 * snap * snap * (0.6 + 0.4 * ((s + l) % 3) / 2), tilt = ((s + l) % 2 ? 1 : -1) * snap * 0.25;
          for (let x = a + (t > SET ? 2 : 0); x < b - (t > SET ? 2 : 0); x += 0.6) {
            if (x > front) break;
            const wv = Math.sin(x * 0.07 + t * 9 + l) * (1 + 1.5 * jag) + (jag > 0 ? (((Math.floor(x / 5) + l) % 2) * 2 - 1) * 2.4 * jag * (1 - snap * 0.5) : 0);
            const y = Math.min(-1, y0 + wv + drop + (x - mid) * tilt);
            const lk = fade * (1 - smooth(0.5, 1, snap) * 0.7); p.dot(x, y, l % 2 ? C[6] : C[5], lk); p.dot(x, y + 1, C[3], lk);
          }
        }
      }
      if (t < SET) for (let i = 0; i < 4; i++) { const x = -HW + (front + HW) * ((i + 1) / 5), y = Y0 - (i % 4) * GAP - 2; (i % 2 ? sharp : flat)(p, x, y, 2.6, C[6], run); }
      if (t >= SET && t < SET + 0.12) p.glow(0, Y0 - 10, 60, C[5], 0.35 * (1 - (t - SET) / 0.12));
      for (let i = 0; i < 3; i++) {                                        // acid ripples over the floor
        const v = clamp((t - SET - i * 0.12) / 0.7); if (v <= 0 || v >= 1) continue;
        floorRing(p, 0, 0, 30 + 110 * ease.outCubic(v), SY, i ? C[4] : C[5], (1 - v) * 0.85, null, 2);
      }
      p.glow(0, -4, 120, C[2], 0.18 * smooth(SET, SET + 0.2, t) * fade);
      for (const m of marks) {                                             // sour glyphs wobble over the heads
        const u = clamp((t - SET - m.d) / 0.15); if (u <= 0) continue;
        const k = Math.min(1, u) * (1 - smooth(1.15, 1.5, t)), y = -100 - 4 * ease.outBack(Math.min(1, u)) + Math.sin(t * 14 + m.ph) * 1.5, x = m.x + Math.sin(t * 9 + m.ph) * 2;
        (m.kind ? sharp : flat)(p, x + 1, y + 1, 5.5, C[2], k); (m.kind ? sharp : flat)(p, x, y, 5.5, C[6], k);
      }
    },
  };
}
