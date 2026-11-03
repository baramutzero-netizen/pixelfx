// 어둠의 성찬 (용사 학원 암흑사제 필살기 dp_u) — a blood rite laid under the whole enemy line, drinking their life (the canvas is the 5-slot formation's floor).
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, rand, TAU, WHITE, flare, band, sparkle, PAL } from "../../core/index.js";
import { floorRing, glyph } from "../arcane/_lib.js";
import { VOID } from "./_lib.js";

export const meta = {
  name: "Dark communion",
  desc: "A crimson rite circle opens under the line, blood is drawn up out of it in twisting streams into a dark vortex, eight draughts come faster and faster, then all is swallowed.",
  tags: ["shadow", "blood", "drain", "ritual", "ultimate", "aoe", "one-shot"],
  size: [304, 288], origin: [152, 232], duration: 3.3, loop: false, fps: 30, bg: "ground",
  options: { palette: PAL.blood, seed: 21, reach: 120, dark: VOID },
};

const OPEN = 0.4, FINAL = 2.45, P0 = 0.45, SY = 0.32, NS = 9;
// eight draughts from 0.45 s to the final gulp, each gap 0.8 of the one before — the host hits on each
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 7);
export const HITS = Array.from({ length: 8 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

export function create(o) {
  const C = fit(o.palette, 8), V = fit(o.dark, 8), RX = o.reach, R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[6], C[5], C[4]], haze: V[2] }), lights = new Lights();
  const streams = Array.from({ length: NS }, (_, i) => ({ a: (i / NS) * TAU + 0.15, d: R.range(0.5, 0.95), ph: R.range(0, 1) }));
  const runes = Array.from({ length: 12 }, (_, i) => ({ a: (i / 12) * TAU, g: R.int(0, 7) }));
  let t = 0, done = 0, gulped = false;
  const drawn = () => ease.outCubic(clamp(t / OPEN)), fade = () => 1 - smooth(FINAL + 0.2, FINAL + 0.75, t);
  const beat = () => { let k = 0; for (const h of HITS) { const d = t - h; if (d >= 0 && d < 0.2) k = Math.max(k, 1 - d / 0.2); } return k; };
  const VY = -150;                                                       // where the vortex drinks it all
  function circle(p, back) {
    const u = drawn(), f = fade(), k = beat(), keep = (g) => (Math.sin(g) < 0) === back && ((g / TAU + 1) % 1) <= u + 1e-3;
    if (f <= 0) return;
    floorRing(p, 0, 0, RX, SY, back ? C[3] : k > 0.5 ? C[6] : C[5], f, keep);
    floorRing(p, 0, 0, RX - 7, SY, back ? C[2] : C[4], f * 0.85, keep);
    if (!back) {
      const r = clamp((t - OPEN * 0.6) / 0.35);
      for (let i = 0; i < 12; i++) {                                   // twelve spokes inside, growing in from the rim, a ring of drops at their tips
        const a = (i / 12) * TAU + 0.13, L = (i % 2 ? 0.35 : 0.55) * (RX - 7) * r;
        for (let d = 0; d < L; d += 1) { const rr = RX - 7 - d; p.dot(Math.cos(a) * rr, Math.sin(a) * rr * SY, d > L - 2 ? C[6] : C[4], f * (0.6 + 0.4 * k)); }
      }
      floorRing(p, 0, 0, RX * 0.42, SY, C[4], f * clamp((t - OPEN) / 0.3) * (0.6 + 0.4 * k), (g) => Math.sin(g) >= 0);
      for (const q of runes) { const g = q.a - t * 0.5, x = Math.cos(g) * (RX - 3.5), y = Math.sin(g) * (RX - 3.5) * SY; if (Math.sin(g) >= 0) glyph(p, q.g, x, y - 2, C[6], f * clamp((t - OPEN) / 0.3), C[1]); }
      p.glow(0, 0, RX, C[3], f * (0.15 + 0.35 * k));
    }
  }
  function stream(p, q, back) {
    const g = q.a + t * 0.8, near = Math.sin(g) >= 0, f = fade() * clamp((t - OPEN * 0.7) / 0.3) * (1 - smooth(FINAL - 0.1, FINAL + 0.1, t));
    if (near === back || f <= 0) return;
    const x0 = Math.cos(g) * RX * q.d, y0 = Math.sin(g) * RX * q.d * SY;
    for (let j = 0; j < 60; j++) {                                     // a twisting thread of blood rising toward the vortex, beads riding up it
      const v = j / 60, ang = g + v * 5, r = RX * q.d * (1 - v * 0.9);
      const x = Math.cos(ang) * r * (v < 0.05 ? 1 : 1) * (1 - v) + x0 * 0 , y = lerpN(y0, VY, v) + Math.sin(ang) * r * SY * (1 - v);
      const bead = ((v * 6 - t * 3 + q.ph) % 1 + 1) % 1 < 0.18;
      p.dot(x, y, bead ? C[6] : back ? C[3] : C[4], f * (back ? 0.5 : 0.9) * (0.4 + 0.6 * (1 - v)));
    }
  }
  return {
    update(dt) {
      t += dt;
      while (done < HITS.length && t >= HITS[done]) {                  // a draught: blood spurts up off the circle
        lights.add(0, -6, RX, C[4], 0.4, 0.2);
        for (let i = 0; i < 18; i++) { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX; ps.spawn(P.SPARK, Math.cos(a) * d, Math.sin(a) * d * SY, 0, -R.range(60, 160), R.range(0.2, 0.45)); }
        done++;
      }
      if (t > OPEN && t < FINAL - 0.5 && R.chance(dt * 26)) { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX; ps.spawn(P.SMOKE, Math.cos(a) * d, Math.sin(a) * d * SY, 0, -R.range(10, 30), R.range(0.5, 0.8), V[2], R.range(4, 7)); }
      if (!gulped && t >= FINAL) {
        gulped = true; lights.add(0, VY, 60, C[5], 0.9, 0.4); lights.add(0, VY, 20, WHITE, 0.8, 0.08);
        for (let i = 0; i < 40; i++) { const a = R.range(0, TAU), s = R.range(60, 200); ps.spawn(P.SPARK, 0, VY, Math.cos(a) * s, Math.sin(a) * s, R.range(0.2, 0.5)); }
      }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) { circle(p, true); for (const q of streams) stream(p, q, true); ps.draw(p, "back"); },
    draw(p) {
      circle(p, false);
      for (const q of streams) stream(p, q, false);
      const vk = clamp((t - OPEN) / 0.6) * (1 - smooth(FINAL, FINAL + 0.3, t));   // the dark vortex drinking above the line
      if (vk > 0) {
        const r = 14 + 6 * beat();
        for (let j = 0; j < 90; j++) { const v = j / 90, a = v * TAU * 3 + t * 6, rr = r * (1 - v * 0.7); p.dot(Math.cos(a) * rr, VY + Math.sin(a) * rr * 0.4, v < 0.3 ? C[3] : C[5], vk); }
        p.disc(0, VY, 4 + 2 * beat(), V[0], vk);
        p.glow(0, VY, 26, C[4], 0.35 * vk);
      }
      const h = (t - FINAL) / 0.4;
      if (h >= 0 && h < 1) { flare(p, 0, VY, 36 * (1 - h * 0.5), 1, [C[3], C[5], C[6], WHITE]); if (h < 0.2) sparkle(p, 0, VY, 10, WHITE, C[6], 0.8); }
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
function lerpN(a, b, s) { return a + (b - a) * s; }
