// 저주 (용사 학원 암흑사제 dp_2) — a curse sigil laid over the whole enemy line (the canvas is the 5-slot formation's floor).
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, rand, TAU, WHITE } from "../../core/index.js";
import { floorRing, glyph } from "../arcane/_lib.js";
import { VOID } from "./_lib.js";

export const meta = {
  name: "Curse sigil",
  desc: "A violet curse circle scratches itself onto the floor with thorns and runes, black smoke and violet wisps crawl up out of it and hang over the line, then it sinks and fades.",
  tags: ["shadow", "curse", "field", "debuff", "aoe", "one-shot"],
  size: [304, 184], origin: [152, 120], duration: 2.8, loop: false, fps: 30, bg: "ground",
  options: { palette: VOID, seed: 13, reach: 120 },
};

const DRAW = 0.45, HOLD = 1.7, FADE = 0.7, SY = 0.32;
export const SET = DRAW;

export function create(o) {
  const C = fit(o.palette, 8), RX = o.reach, R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[6], C[5], C[4]], haze: C[2] }), lights = new Lights();
  const thorns = Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * TAU + R.range(-0.1, 0.1); return { a, h: R.range(5, 12), back: Math.sin(a) < 0, t0: DRAW * ((a / TAU + 1) % 1) + 0.04 }; });
  const runes = Array.from({ length: 10 }, (_, i) => ({ a: (i / 10) * TAU + 0.3, g: R.int(0, 7) }));
  let t = 0, acc = 0, lit = false;
  const drawn = () => ease.outCubic(clamp(t / DRAW)), gone = () => smooth(HOLD, HOLD + FADE, t);
  function circle(p, back) {
    const u = drawn(), m = gone(), keep = (g) => (Math.sin(g) < 0) === back && ((g / TAU + 1) % 1) <= u + 1e-3, a = 1 - m;
    if (a <= 0) return;
    floorRing(p, 0, 0, RX, SY, back ? C[3] : C[5], a, keep);
    floorRing(p, 0, 0, RX - 7, SY, back ? C[2] : C[4], a * 0.85, keep);
    floorRing(p, 0, 0, RX * 0.5, SY, back ? C[3] : C[5], a * clamp((t - DRAW) / 0.3), (g) => (Math.sin(g) < 0) === back);
    for (const q of thorns) {                                          // thorns along the rim, crooked, the far half dimmer
      if (q.back !== back || t < q.t0) continue;
      const g = ease.outBack(clamp((t - q.t0) / 0.1), 2) * (1 - m), x = Math.cos(q.a) * RX, y = Math.sin(q.a) * RX * SY;
      for (let d = 0; d < q.h * g; d += 1) p.dot(x + Math.cos(q.a) * d * 0.25 + (d > q.h * 0.6 ? 1 : 0), y - d, d > q.h * g - 2 ? C[6] : back ? C[2] : C[3], a);
    }
    if (!back) for (const r of runes) {
      const g = r.a + t * 0.4, x = Math.cos(g) * (RX - 3.5), y = Math.sin(g) * (RX - 3.5) * SY;
      if (Math.sin(g) < 0) continue;
      glyph(p, r.g, x, y - 2, C[6], a * clamp((t - DRAW) / 0.25), C[1]);
    }
    if (!back) p.glow(0, 0, RX * 0.8, C[4], 0.18 * a * u);
  }
  // violet wisps crawling up over the line: a pure function of t, so they never pop
  function wisps(p) {
    const env = clamp((t - DRAW * 0.6) / 0.4) * (1 - smooth(HOLD - 0.1, HOLD + FADE * 0.8, t));
    if (env <= 0) return;
    for (let i = 0; i < 26; i++) {
      if (rand(i, 31) > env) continue;
      const x0 = (rand(i, 5) * 2 - 1) * RX * 0.9, ph = rand(i, 7), life = 1.1 + rand(i, 9) * 0.6, u = ((t + ph * life) % life) / life;
      const y = -u * (40 + rand(i, 11) * 50), x = x0 + Math.sin(u * 6 + i) * 6, k = Math.sin(u * Math.PI);
      for (let j = 0; j < 7; j++) p.dot(x0 + Math.sin((u - j * 0.02) * 6 + i) * 6, y + j * 1.5, j < 2 ? C[6] : C[4], env * k * (1 - j / 7));
    }
  }
  return {
    update(dt) {
      t += dt; acc += dt;
      if (!lit && t > DRAW) { lit = true; lights.add(0, -4, RX * 1.1, C[4], 0.45, 1); }
      if (t > DRAW * 0.6 && t < HOLD - 0.3) while (acc > 0.03) {        // black smoke breathing up off the sigil
        acc -= 0.03;
        const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX;
        ps.spawn(P.SMOKE, Math.cos(a) * d, Math.sin(a) * d * SY, R.range(-6, 6), -R.range(8, 22), R.range(0.6, 0.9), R.chance(0.6) ? C[2] : C[3], R.range(4, 7));
      }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) { circle(p, true); ps.draw(p, "back"); },
    draw(p) { circle(p, false); wisps(p); ps.draw(p, "front"); lights.draw(p); },
  };
}
