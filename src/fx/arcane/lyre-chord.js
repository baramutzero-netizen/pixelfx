// 시전 화음 (용사 학원 음유시인 — 기술마다 · 예전 bardMelody) — at the harp on her chest: the gold strings tremble brighter and brighter,
// at 0.22 s a chord rings out — a gold ring and two sound-wave arcs — and three wine-rose notes float up swaying. (0, 0) is the harp.
import { fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { HARP, WINE, note, waves } from "./_bard.js";

export const meta = {
  name: "Lyre chord",
  desc: "Harp strings tremble brighter and brighter, then a chord rings out in a gold ring and sound-wave arcs while three rose notes float up swaying.",
  tags: ["arcane", "cast", "music", "bard", "one-shot"],
  size: [72, 72], origin: [32, 44], duration: 0.8, loop: false, fps: 30, bg: "dark",
  options: { palette: HARP },
};

export const RING = 0.22;

export function create(o) {
  const G = fit(o.palette, 8), W = fit(WINE, 8);
  let t = 0;
  const NOTES = [{ dx: -9, kind: 1, d: 0 }, { dx: 2, kind: 2, d: 0.05 }, { dx: 12, kind: 1, d: 0.1 }];
  return {
    update(dt) { t += dt; },
    draw(p) {
      const build = smooth(0, RING, t), fade = 1 - smooth(0.45, 0.75, t);
      for (let s = 0; s < 5; s++) {                                         // the strings, trembling
        const x = -6 + s * 3, amp = (0.2 + 0.7 * build) * (1 - smooth(RING, 0.6, t)), k = (0.35 + 0.65 * build) * fade;
        for (let y = -9; y <= 7; y += 0.5) p.dot(x + Math.sin(t * 70 + s * 1.7) * amp * Math.sin(((y + 9) / 16) * Math.PI), y, s % 2 ? G[5] : G[6], k);
      }
      if (t < RING) for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU + t * 3, d = 18 * (1 - t / RING); p.dot(Math.cos(a) * d, Math.sin(a) * d, G[6], t / RING); }
      p.glow(0, 0, 9 + 6 * build, G[4], 0.3 * build * fade);
      const v = clamp((t - RING) / 0.35);
      if (v > 0 && v < 1) {                                                // the chord rings
        p.ring(0, 0, 3 + 15 * ease.outCubic(v), 1.2, G[5], 1 - v);
        waves(p, 4, 0, 6 + 14 * ease.outCubic(v), 4, 2, 0, 0.7, G[6], 1 - v);
        waves(p, -4, 0, 6 + 14 * ease.outCubic(v), 4, 2, Math.PI, 0.7, W[5], (1 - v) * 0.8);
      }
      const fl = 1 - smooth(RING, RING + 0.12, t);
      if (t >= RING && fl > 0) { p.disc(0, 0, 3 * fl + 1, WHITE, fl); p.glow(0, 0, 14, G[5], 0.5 * fl); }
      for (const n of NOTES) {                                              // notes float up, swaying
        const u = clamp((t - RING - n.d) / 0.44); if (u <= 0) continue;
        const k = u < 0.15 ? u / 0.15 : 1 - smooth(0.6, 1, u);
        note(p, n.dx + Math.sin(u * 7 + n.dx) * 2.5, -4 - 24 * ease.outCubic(u), 1.6, n.kind === 2 ? G[5] : W[5], WHITE, k, n.kind, Math.sin(u * 7) * 1.5);
      }
    },
  };
}
