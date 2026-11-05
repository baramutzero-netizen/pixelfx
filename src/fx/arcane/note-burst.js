// 현 튕기기 — 음표가 터진다 (용사 학원 음유시인 bd_b) — where the note strikes the chest: a white-hot pluck, sound-wave arcs ring out
// to both sides three times, the note bursts into little notes that tumble down and two staff lines flick away. (0, 0) is the target's feet.
import { Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { HARP, WINE, note, waves } from "./_bard.js";

export const meta = {
  name: "Note burst",
  desc: "Where a plucked note strikes the chest, sound-wave arcs ring out to both sides, the note bursts into little tumbling notes and staff lines flick away.",
  tags: ["arcane", "impact", "music", "bard", "one-shot"],
  size: [88, 88], origin: [44, 76], duration: 0.75, loop: false, fps: 30, bg: "dark",
  options: { palette: WINE, seed: 11 },
};

const CY = -26;

export function create(o) {
  const W = fit(o.palette, 8), G = fit(HARP, 8), R = new Rng(o.seed);
  const bits = Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + (i - 2) * 0.62 + R.range(-0.15, 0.15); return { vx: Math.cos(a) * R.range(40, 60), vy: Math.sin(a) * R.range(50, 75), kind: i % 3 === 1 ? 2 : 1, c: i % 2 }; });
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const fl = 1 - smooth(0, 0.16, t);
      if (fl > 0) { p.glow(0, CY, 20, W[5], 0.6 * fl); p.disc(0, CY, 5 * fl + 1, WHITE, fl); for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU + 0.4; p.line(0, CY, Math.cos(a) * 12 * fl, CY + Math.sin(a) * 12 * fl, WHITE, fl); } }
      for (let i = 0; i < 3; i++) {                                         // three rings of sound, both sides
        const v = clamp((t - i * 0.07) / 0.4); if (v <= 0 || v >= 1) continue;
        const r = 5 + 26 * ease.outCubic(v), k = 1 - v;
        waves(p, 0, CY, r, 0, 1, 0, 0.75, i ? G[5] : G[6], k, 1.2);
        waves(p, 0, CY, r, 0, 1, Math.PI, 0.75, i ? W[5] : W[6], k, 1.2);
      }
      const sv = clamp(t / 0.35);                                           // two staff lines flick away
      if (sv < 1) for (const s of [-1, 1]) { const y = CY - 3 + s * 3, x0 = s * (4 + 20 * ease.outCubic(sv)); p.line(x0 - 6, y + s * sv * 3, x0 + 6, y + s * sv * 3, G[4], 1 - sv); }
      for (const b of bits) {                                               // the note bursts into little notes
        const u = clamp((t - 0.03) / 0.65); if (u <= 0) continue;
        const tt = u * 0.65, x = b.vx * tt, y = CY + b.vy * tt + 120 * tt * tt;
        if (y > -3) continue;
        note(p, x, y, 1.3, b.c ? W[5] : G[5], WHITE, 1 - smooth(0.55, 1, u), b.kind, Math.sin(tt * 12) * 2);
      }
    },
  };
}
