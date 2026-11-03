// 서리 결계 (용사 학원 마법사 wz_2) — a frost seal laid over the whole enemy line (the canvas is the 5-slot formation's floor).
import { Particles, Lights, P, Rng, fit, crystal, band, clamp, smooth, ease, rand, TAU, WHITE, PAL } from "../../core/index.js";
import { floorRing, glyph } from "../arcane/_lib.js";

export const meta = {
  name: "Frost ward",
  desc: "A frost ring draws itself on the floor, runes and ice crystals rise, then a blizzard howls across the line: wind-driven snow, gusts, mist; it all melts.",
  tags: ["ice", "frost", "field", "debuff", "aoe", "one-shot"],
  size: [304, 184], origin: [152, 120], duration: 2.8, loop: false, fps: 30, bg: "ground",
  options: { palette: PAL.ice, seed: 8, reach: 120 },
};

const DRAW = 0.45, HOLD = 1.6, MELT = 0.7, SY = 0.32;

// the blizzard: wind-driven snow streaks over the whole line, a pure function of t (far layer dimmer and slower), and gust bands
function blizzard(p, C, RX, t, env, back) {
  if (env <= 0) return;
  const N = back ? 70 : 120, W = RX * 2 + 60, wind = back ? 150 : 230;
  for (let i = 0; i < N; i++) {
    if (rand(i, back ? 41 : 43) > env) continue;
    const y = -4 - rand(i, 7) * 112, sp = wind * (0.7 + rand(i, 3) * 0.6), x = ((rand(i, 5) * W + t * sp) % W) - W / 2, len = 3 + rand(i, 9) * (back ? 3 : 6), drop = len * 0.35;
    const c = back ? C[4] : rand(i, 11) < 0.35 ? WHITE : C[6];
    p.line(x, y, x - len, y - drop, c, (u) => (1 - u) * (back ? 0.55 : 0.95));
  }
  if (!back) for (let g = 0; g < 4; g++) {            // gusts: long thin bright bands sweeping past
    const y = -14 - rand(g, 13) * 80, x = ((rand(g, 17) * W + t * 340) % W) - W / 2, L = 26 + rand(g, 19) * 30;
    for (let k = 0; k < L; k++) p.blend(x - k, y - k * 0.2, WHITE, 0.22 * env * (1 - k / L));
  }
}

export function create(o) {
  const C = fit(o.palette, 8), DIM = [C[0], C[0], C[1], C[2], C[3], C[4], C[5], C[6]], RX = o.reach, R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[7], C[6], C[5], C[4]], haze: C[5] }), lights = new Lights();
  const spikes = [];
  for (let i = 0; i < 18; i++) {                      // crystals along the rim, the far half dimmer and behind
    const a = (i / 18) * TAU + R.range(-0.12, 0.12), h = R.range(8, 17), w = R.range(5, 8);
    spikes.push({ a, x: Math.cos(a) * RX, y: Math.sin(a) * RX * SY, h, w, lean: Math.cos(a) * h * R.range(0.1, 0.3), back: Math.sin(a) < 0, t0: DRAW * ((a / TAU + 1) % 1) + 0.05 });
  }
  const runes = Array.from({ length: 12 }, (_, i) => ({ a: (i / 12) * TAU + 0.26, g: R.int(0, 7) }));
  let t = 0, acc = 0, lit = false;
  const melt = () => smooth(HOLD, HOLD + MELT, t), drawn = () => ease.outCubic(clamp(t / DRAW));
  const storm = () => clamp((t - DRAW * 0.4) / 0.35) * (1 - smooth(HOLD - 0.2, HOLD + MELT * 0.8, t));   // the blizzard's strength
  function rim(p, back) {
    const u = drawn(), m = melt(), keep = (g) => (Math.sin(g) < 0) === back && ((g / TAU + 1) % 1) <= u + 1e-3;
    if (m >= 1) return;
    floorRing(p, 0, 0, RX, SY, back ? C[4] : C[6], 1 - m, keep);
    floorRing(p, 0, 0, RX - 5, SY, back ? C[3] : C[5], (1 - m) * 0.8, keep);
    floorRing(p, 0, 0, RX * 0.55, SY, back ? C[3] : C[4], (1 - m) * 0.6 * clamp((t - DRAW) / 0.3), (g) => (Math.sin(g) < 0) === back);
    for (const s of spikes) {
      if (s.back !== back || t < s.t0) continue;
      const g = ease.outBack(clamp((t - s.t0) / 0.12), 2.2);
      crystal(p, s.x, s.y, s.h * g * (1 - m), s.w * (1 - 0.3 * m), s.lean * g * (1 - m), back ? DIM : C, { white: t < s.t0 + 0.04, glint: ((t * 0.8 + s.a) % 1.6) <= 1 ? (t * 0.8 + s.a) % 1.6 : -1 });
    }
  }
  return {
    update(dt) {
      t += dt; acc += dt;
      if (!lit && t > DRAW) { lit = true; lights.add(0, -4, RX * 1.2, C[5], 0.5, 1.2); for (let i = 0; i < 40; i++) { const a = R.range(0, TAU); ps.spawn(P.SPARK, Math.cos(a) * RX, Math.sin(a) * RX * SY, Math.cos(a) * 40, -R.range(40, 120), R.range(0.2, 0.5)); } }
      if (t > DRAW * 0.6 && t < HOLD + 0.3) while (acc > 0.018) {   // mist breathing up off the seal, snow falling in it
        acc -= 0.018;
        const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX;
        ps.spawn(P.VAPOUR, Math.cos(a) * d, Math.sin(a) * d * SY, R.range(-6, 6), -R.range(6, 16), R.range(0.6, 1.0), C[5], R.range(4, 7));
        if (R.chance(0.6)) ps.spawn(P.FLAKE, R.range(-RX - 20, RX), -R.range(30, 100), R.range(60, 140), R.range(15, 35), R.range(0.6, 0.9), R.chance(0.3) ? WHITE : C[6]);
      } else acc = 0;
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      const m = melt(), u = drawn();
      if (m < 1) for (let y = Math.floor(-RX * SY); y <= Math.ceil(RX * SY); y++)   // frost over the floor inside the ring: a thin translucent sheen and sparse ice flecks
        for (let x = -RX; x <= RX; x++) {
          const d = Math.hypot((x + 0.5) / RX, (y + 0.5) / (RX * SY));
          if (d > 0.96 || d > u * 1.05) continue;
          const h = rand(x * 13, y * 7);
          if (h < 0.02) p.px(x, y, h < 0.005 ? WHITE : C[6]);
          else p.blend(x, y, C[5], 0.16 * (1 - m) * (1 - d * 0.6));
        }
      rim(p, true);
      ps.draw(p, "back");
      blizzard(p, C, RX, t, storm(), true);
    },
    draw(p) {
      rim(p, false);
      const m = melt();
      if (t > DRAW * 0.5 && m < 1) for (const r of runes) {
        const k = clamp((t - DRAW * 0.5 - (r.a / TAU) * 0.4) / 0.15) * (1 - m), x = Math.cos(r.a) * (RX - 11), y = Math.sin(r.a) * (RX - 11) * SY;
        if (k > 0) { glyph(p, r.g, x, y, Math.sin(r.a) < 0 ? C[5] : C[6], k, C[2]); p.glow(x, y - 2, 6, C[5], 0.25 * k); }
      }
      ps.draw(p, "front");
      blizzard(p, C, RX, t, storm(), false);
      if (m < 1) p.glow(0, -6, RX * 0.9, C[4], 0.18 * (1 - m) * drawn());
      lights.draw(p);
    },
  };
}
