// 암살 (용사 학원 암살자 필살기 ro_u — 다시 그림 · 1103 스물한째 사용자: '기존 스킬 이펙트를 참고해서 먼저 한번 긋고, 화면이 반전되면서 하얀색 액체가
// 흩뿌리는 느낌') — one crimson crescent cut like the old assassination picture, then (the host inverts the whole screen) the wound sprays liquid seven
// times, faster and faster, ending in one great burst. The liquid is drawn BLACK on purpose: it shows under the host's inverted screen, so it reads WHITE.
// (0, 0) is the target's feet; the cut comes from the left.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE, BLACK, hex, sparkle } from "../../core/index.js";
import { through, slash } from "./_lib.js";
import { INK } from "./_rogue.js";

export const meta = {
  name: "Inverse cut",
  desc: "One crimson crescent cut sweeps up through the target, then its wound sprays ink-dark liquid seven times, faster and faster, in fans of jets and drops that splat on the floor.",
  tags: ["melee", "slash", "dagger", "ultimate", "execute", "splatter", "one-shot"],
  size: [344, 224], origin: [172, 176], duration: 2.8, loop: false, fps: 30, bg: "light",
  options: { palette: INK, seed: 61 },
};

const CY = -24, SY = 0.32;
export const SLASH = 0.35;                                             // the one cut
export const INVERT = 0.45;                                            // when the host flips the screen
const P0 = 0.6, FINAL = 2.2, GONE = 2.6;
// seven sprays from 0.6 s to the last burst, each gap 0.8 of the one before — the host hits on each (and once more on the cut)
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 6);
export const SPRAYS = Array.from({ length: 7 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HITS = [SLASH, ...SPRAYS];
export const HIT = FINAL;
const INKC = [hex("#000000"), hex("#0a0a0c"), hex("#1c1c22")];          // ink-dark liquid (white once inverted)

export function create(o) {
  const C = fit(o.palette, 6), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, C[5], C[4]] }), lights = new Lights();
  // the cut: a big crescent swept up and to the right through the chest (as the old picture), white at its edge
  const ramp = [C[0], C[1], C[2], C[3], C[4], C[5], hex("#ffd0c8"), WHITE];
  const A = { ...through(-6, CY + 2, -0.95, 1, 52, 1.9, 0.45), W: 13, t0: SLASH - 0.07, sweep: 0.07, hold: 0.1, trail: 0.35, ramp, lens: true, hot: 0.4 };
  const drops = [], splats = [], jets = [];
  let t = 0, j = 0, cut = false;
  const fadeAll = () => 1 - smooth(GONE - 0.15, GONE + 0.1, t);
  function spray(k) {                                                  // a burst of liquid out of the wound: drops on arcs, and a few long jets
    const n = Math.round(30 * k), dir = -0.8;                           // a fan up and away from the cut (as the old picture's spray), a few flung the other way
    for (let i = 0; i < n; i++) { const back = R.chance(0.18), a = back ? -Math.PI + 0.6 + R.range(-0.6, 0.6) : dir + R.range(-0.75, 0.75), sp = R.range(70, 260) * Math.sqrt(k); drops.push({ x: R.range(-3, 3), y: CY + R.range(-4, 4), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: R.range(0.6, 1.9) * Math.min(1.5, k), px: 0, py: CY }); }
    for (let i = 0; i < Math.round(3 * k); i++) jets.push({ a: dir + R.range(-0.6, 0.6), L: R.range(30, 64) * Math.min(1.8, k), w: R.range(1.4, 2.6) * Math.min(1.4, k), t0: t, ph: R.range(0, 3) });
  }
  return {
    update(dt) {
      t += dt;
      if (!cut && t >= SLASH) {
        cut = true; lights.add(0, CY, 50, C[4], 0.8, 0.18);
        for (let i = 0; i < 16; i++) { const a = -0.8 + R.range(-0.6, 0.6), s = R.range(80, 220); ps.spawn(P.SPARK, 0, CY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.12, 0.3)); }
        for (let i = 0; i < 14; i++) { const a = -0.75 + R.range(-0.5, 0.5), s = R.range(60, 180); ps.spawn(P.MOTE, R.range(-4, 4), CY + R.range(-6, 6), Math.cos(a) * s, Math.sin(a) * s, R.range(0.2, 0.4), C[R.int(3, 5)], 1.2); }
      }
      while (j < SPRAYS.length && t >= SPRAYS[j]) { const last = j === SPRAYS.length - 1; spray(last ? 3 : 0.8 + j * 0.12); j++; }
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]; d.px = d.x; d.py = d.y; d.vy += 520 * dt; d.vx *= 1 - 0.6 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.y >= 0) { drops.splice(i, 1); splats.push({ x: d.x, w: d.r * 2.2 + R.range(0.5, 2), t0: t }); }
      }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      const f = fadeAll();
      for (const s of splats) { const g = ease.outCubic(clamp((t - s.t0) / 0.12)); for (let x = -s.w * g; x <= s.w * g; x += 0.5) { p.dot(s.x + x, 0, INKC[0], f); if (Math.abs(x) < s.w * 0.6 * g) p.dot(s.x + x, -0.6, INKC[1], f * 0.8); } }
    },
    draw(p) {
      slash(p, A, t);
      const u = t - SLASH;
      if (u >= 0 && u < 0.18) sparkle(p, 0, CY, 12 * (1 - u / 0.18), WHITE, C[5], 0.7);
      const f = fadeAll();
      for (const q of jets) {                                          // jets of liquid shooting out of the wound and breaking up
        const v = (t - q.t0) / 0.28;
        if (v < 0 || v > 1) continue;
        const head = q.L * ease.outCubic(Math.min(1, v * 1.6)), tail = q.L * ease.inQuad(v), c = Math.cos(q.a), s = Math.sin(q.a);
        for (let d = tail; d < head; d += 0.5) {                        // a ribbon that breaks into beads toward its end
          const e = (d - tail) / (head - tail + 0.01), w = q.w * (1 - e * 0.5);
          if (e > 0.55 && Math.sin(d * 0.9 + q.ph) < 0.2) continue;
          for (let o2 = -w; o2 <= w; o2 += 0.6) p.dot(c * d - s * o2, CY + s * d + c * o2 + d * d * 0.006, INKC[0], f);
        }
        p.disc(c * head, CY + s * head + head * head * 0.006, q.w * 1.2, INKC[0], f);
      }
      for (const d of drops) { p.line(d.px, d.py, d.x, d.y, INKC[1], f); p.disc(d.x, d.y, d.r, INKC[0], f); }
      for (const h of SPRAYS) { const v = (t - h) / 0.14; if (v >= 0 && v < 1) p.disc(0, CY, 5 * (1 - v) + (h === FINAL ? 6 : 0), INKC[0], f); }
      ps.draw(p); lights.draw(p);
    },
  };
}
