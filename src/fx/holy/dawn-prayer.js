// 부활의 기도 (용사 학원 신성 사제 필살기 pr_u — 전체 대회복 · 디버프 해제 · 쓰러진 아군을 일으킨다) — the sky opens over the ally line:
// a rose window of gold and sapphire light kindles high above, broad shafts of dawn fall slanting onto the line, a pool of light
// spreads on the floor and sapphire wisps rise from it. Five prayers ring out — each a wave of white light running down the shafts
// and a ring on the floor — and the last opens in a sunrise flare. (0, 0) is the middle of the ally line's floor.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE, DAWN, glint, halo } from "./_priest.js";

export const meta = {
  name: "Dawn prayer",
  desc: "A rose window kindles in the sky, shafts of dawn fall on the line over a pool of light; five prayers send white waves down the shafts, the last in a sunrise flare.",
  tags: ["holy", "heal", "revive", "ultimate", "aoe", "dawn", "one-shot"],
  size: [304, 200], origin: [152, 146], duration: 2.7, loop: false, fps: 30, bg: "ground",
  options: { palette: DAWN, seed: 21, reach: 120 },
};

const OPEN = 0.4, WY = -64, WR = 18, SY = 0.32, NR = 7;
/** Five prayers, evenly spaced — the host heals on each (the last is the biggest). */
export const PULSES = [0.5, 0.88, 1.26, 1.64, 2.02];
export const FINAL = PULSES[PULSES.length - 1];

export function create(o) {
  const D = fit(o.palette, 8), G = fit(GOLD, 8), C = fit(SAPPHIRE, 8), RX = o.reach, R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, D[6], C[6]] }), lights = new Lights();
  const rays = Array.from({ length: NR }, (_, i) => ({ x: lerp(-RX * 0.95, RX * 0.95, i / (NR - 1)) + R.range(-6, 6), w: R.range(9, 15), ph: R.range(0, TAU) }));
  let t = 0, done = 0, fin = false;
  const fade = () => 1 - smooth(FINAL + 0.25, meta.duration - 0.03, t);
  const ring = () => { let k = 0; for (const h of PULSES) { const d = t - h; if (d >= 0 && d < 0.3) k = Math.max(k, 1 - d / 0.3); } return k; };
  function window_(p, f) {                                               // the rose window: twelve petals round a sapphire heart
    const u = smooth(0, OPEN, t) * f, k = ring(), spin = t * 0.5;
    if (u <= 0) return;
    p.glow(0, WY, WR * 2.2, D[5], u * (0.18 + 0.25 * k));
    for (let i = 0; i < 12; i++) {
      const a = spin + (i / 12) * TAU, c = Math.cos(a), s = Math.sin(a);
      for (let d = 6; d < WR; d += 0.5) { const w = 3.2 * Math.sin(Math.PI * (d - 6) / (WR - 6)); for (let q = -w; q <= w; q += 0.7) p.dot(c * d - s * q, WY + s * d + c * q, Math.abs(q) > w - 1 ? G[3] : i % 2 ? C[4] : G[4], u); }
    }
    for (let g = 0; g < TAU; g += 0.02) { p.dot(Math.cos(g) * WR, WY + Math.sin(g) * WR, G[5], u); p.dot(Math.cos(g) * (WR + 1), WY + Math.sin(g) * (WR + 1), G[3], u); p.dot(Math.cos(g) * (WR + 2), WY + Math.sin(g) * (WR + 2), G[2], u * 0.8); }
    p.disc(0, WY, 6, C[5], u); p.disc(0, WY, 3.5, C[6], u); p.disc(0, WY, 1.5, WHITE, u);
  }
  function shafts(p, f) {                                                // broad shafts of dawn from the window to the floor
    const u = smooth(OPEN * 0.6, OPEN + 0.25, t) * f, k = ring();
    if (u <= 0) return;
    for (const q of rays) {
      const x1 = q.x, y1 = 0, x0 = q.x * 0.12, y0 = WY + WR * 0.6;
      for (let y = y0; y <= y1; y += 1) {
        const v = (y - y0) / (y1 - y0), cx = lerp(x0, x1, v), w = lerp(2, q.w, v), shim = 0.8 + 0.2 * Math.sin(q.ph + t * 3 + v * 5);
        let wave = 0;                                                     // a wave of white light running down on each prayer
        for (const h of PULSES) { const d = t - h; if (d >= 0 && d < 0.35) wave = Math.max(wave, 1 - Math.abs(v - d / 0.25) * 6); }
        for (let x = -w; x <= w; x += 1) {
          const e = 1 - Math.abs(x) / (w + 1);
          p.blend(cx + x, y, wave > 0.2 ? WHITE : e > 0.6 ? D[6] : D[5], u * e * (0.42 + 0.2 * k) * shim + Math.max(0, wave) * e * 0.55 * f);
        }
      }
    }
  }
  function pool(p, back, f) {                                            // the pool of light on the floor
    const u = smooth(OPEN * 0.8, OPEN + 0.4, t) * f, k = ring();
    if (u <= 0) return;
    const keep = (g) => (Math.sin(g) < 0) === back;
    for (let g = 0; g < TAU; g += 0.006) if (keep(g)) { p.dot(Math.cos(g) * RX, Math.sin(g) * RX * SY, back ? D[4] : D[6], u * 0.9); p.dot(Math.cos(g) * (RX - 4), Math.sin(g) * (RX - 4) * SY, back ? C[4] : C[5], u * 0.7); }
    if (!back) {
      p.glow(0, 0, RX * 0.8, D[5], u * (0.16 + 0.3 * k));
      for (let i = 0; i < PULSES.length; i++) {                           // a ring across the floor on each prayer
        const v = (t - PULSES[i]) / 0.5; if (v <= 0 || v >= 1) continue;
        halo(p, 0, 0, 10 + (RX - 6) * ease.outCubic(v), SY, v < 0.2 ? WHITE : D[6], D[4], (1 - v) * f * (i === PULSES.length - 1 ? 1 : 0.85), 0);
      }
    }
  }
  return {
    update(dt) {
      t += dt;
      while (done < PULSES.length && t >= PULSES[done]) {
        const last = done === PULSES.length - 1;
        lights.add(0, -30, RX * (last ? 1.3 : 1), D[6], last ? 0.6 : 0.4, last ? 0.4 : 0.25);
        for (let i = 0; i < (last ? 40 : 18); i++) { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX; ps.spawn(P.STAR, Math.cos(a) * d, Math.sin(a) * d * SY, 0, -R.range(30, 90), R.range(0.3, 0.55), R.chance(0.5) ? WHITE : R.chance(0.5) ? D[6] : C[6], R.range(0.6, 1.4)); }
        done++;
      }
      if (!fin && t >= FINAL) { fin = true; lights.add(0, WY, 80, D[6], 0.6, 0.5); }
      if (t > OPEN && t < FINAL + 0.05 && R.chance(dt * 34)) { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX * 0.95; ps.spawn(P.MOTE, Math.cos(a) * d, Math.sin(a) * d * SY, R.range(-3, 3), -R.range(30, 60), R.range(0.45, 0.65), R.chance(0.6) ? C[6] : D[6], 1); }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade();
      pool(p, true, f);
      shafts(p, f);
      window_(p, f);
      const fv = (t - FINAL) / 0.6;                                       // the sunrise flare at the last prayer
      if (fv > 0 && fv < 1) { const k = 1 - fv; glint(p, 0, WY, 20 + 40 * ease.outCubic(fv), D[6], k); for (let i = 0; i < 16; i++) { const a = (i / 16) * TAU + 0.1, L = (i % 2 ? 26 : 50) * ease.outCubic(fv); for (let d = WR; d < WR + L; d += 1) p.dot(Math.cos(a) * d, WY + Math.sin(a) * d, d < WR + 6 ? WHITE : D[5], k * (1 - (d - WR) / (L + 1))); } }
      pool(p, false, f);
      ps.draw(p); lights.draw(p);
    },
  };
}
