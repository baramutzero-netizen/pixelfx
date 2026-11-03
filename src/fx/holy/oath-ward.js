// 수호의 맹세 (용사 학원 팔라딘 pa_1) — a dome of oath light raised round an ally, sealed with a shield emblem. (0, 0) is the ally's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, lerp, TAU, WHITE, sparkle, rgb } from "../../core/index.js";
import { GOLD } from "./_lib.js";

export const meta = {
  name: "Oath ward",
  desc: "A gold ring is struck on the floor, a pale-blue dome rises from it with a faint lattice, a shield emblem flashes on its face, it shimmers, then folds into the body in sparkles.",
  tags: ["holy", "shield", "barrier", "buff", "one-shot"],
  size: [76, 92], origin: [38, 82], duration: 1.8, loop: false, fps: 30, bg: "ground",
  options: { palette: GOLD, seed: 6, tint: ["#0d1b33", "#17345e", "#235a92", "#3a86c4", "#6cb2e6", "#a8d8f6", "#e2f4ff", "#ffffff"] },
};

const RING = 0.12, RISE = 0.34, SEAL = 0.36, HOLDT = 1.05, FOLD = 1.3, RX = 22, RH = 38, SY = 0.32;
export const SET = SEAL;
// a small heater shield: 1 = rim, 2 = field, 3 = cross
const SHIELD = ["11111111", "12232221", "12232221", "13333331", "12232221", ".122221.", "..1221..", "...11..."];

export function create(o) {
  const C = fit(o.palette, 8), B = fit(o.tint, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, B[6], C[6], C[5]] }), lights = new Lights();
  let t = 0, sealed = false, folded = false;
  const grow = () => ease.outBack(clamp((t - RING * 0.5) / (RISE - RING * 0.5)), 1.4) * (1 - ease.inCubic(clamp((t - HOLDT) / (FOLD - HOLDT))));
  const live = () => 1 - smooth(FOLD - 0.05, FOLD + 0.1, t);
  // the dome: a squashed half-ellipse over the floor ring; far half behind the ally, near half in front
  function dome(p, back) {
    const g = grow(), a = live();
    if (g <= 0.02 || a <= 0) return;
    const rx = RX * g, rh = RH * g, sweep = ((t - RISE) * 1.6) % 1.4;
    for (let j = 0; j <= 64; j++) {                                    // the outline
      const u = j / 64, ang = Math.PI * u, x = -Math.cos(ang) * rx, y = -Math.sin(ang) * rh;
      p.dot(x, y, Math.sin(ang) > 0.85 ? WHITE : C[6], a * (back ? 0.6 : 1));
    }
    if (!back) {
      p.each(-rx, -rh, rx, 0, (x, y, sx, sy) => {                     // the translucent pale-blue fill, brighter at the rim
        const e = (x / rx) ** 2 + (y / rh) ** 2;
        if (e > 1) return;
        const lat = (((Math.floor(x / 4 + y / 7) + Math.floor(-x / 4 + y / 7)) % 3) + 3) % 3 === 0 && e > 0.25 ? 0.14 : 0;   // a faint lattice
        const shine = Math.abs(y + rh * (sweep - 0.2)) < 1.5 && sweep < 1.2 ? 0.22 : 0;
        p.blendPx(sx, sy, e > 0.82 ? B[6] : B[5], a * (0.14 + 0.24 * e * e + lat + shine));
      });
      p.glow(0, -rh * 0.5, rx * 1.1, B[5], 0.22 * a * g);
    }
    for (let j = 0, m = Math.ceil(rx * TAU); j < m; j++) {              // the floor ring under it
      const ang = (j / m) * TAU, far = Math.sin(ang) < 0;
      if (far !== back) continue;
      p.dot(Math.cos(ang) * (rx + 1), Math.sin(ang) * (rx + 1) * SY, far ? C[4] : C[6], a);
    }
  }
  function emblem(p) {
    const e = (t - SEAL) / 0.6;
    if (e < 0 || e > 1 || live() <= 0) return;
    const a = e < 0.15 ? 1 : 1 - smooth(0.5, 1, e), hot = e < 0.12, X = -4, Y = -26;
    for (let j = 0; j < SHIELD.length; j++) for (let i = 0; i < 8; i++) {
      const ch = SHIELD[j][i]; if (ch === ".") continue;
      p.dot(X + i, Y + j, hot ? WHITE : ch === "1" ? C[6] : ch === "3" ? WHITE : B[5], a);
    }
    p.glow(0, -22, 12, C[6], 0.5 * a);
  }
  return {
    update(dt) {
      t += dt;
      if (!sealed && t >= SEAL) { sealed = true; lights.add(0, -22, 26, C[5], 0.7, 0.25); for (let i = 0; i < 14; i++) { const a = R.range(0, TAU); ps.spawn(P.STAR, Math.cos(a) * RX, -RH * 0.5 + Math.sin(a) * RH * 0.5, Math.cos(a) * 18, -R.range(4, 18), R.range(0.3, 0.6), R.chance(0.5) ? WHITE : B[6], R.range(0.6, 1.3)); } }
      if (t > RISE && t < HOLDT && R.chance(dt * 22)) { const ang = R.range(0, Math.PI); ps.spawn(P.MOTE, -Math.cos(ang) * RX, -Math.sin(ang) * RH, 0, -R.range(6, 16), R.range(0.3, 0.6), R.chance(0.5) ? C[6] : B[6]); }
      if (!folded && t >= FOLD) { folded = true; lights.add(0, -16, 18, C[6], 0.5, 0.2); for (let i = 0; i < 18; i++) ps.spawn(P.STAR, R.range(-8, 8), R.range(-30, -2), R.range(-12, 12), -R.range(10, 30), R.range(0.25, 0.5), R.chance(0.6) ? WHITE : C[6], R.range(0.5, 1.1)); }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      const r = (t / RING);                                              // the ring being struck: a quick gold flash on the floor
      if (r > 0 && r < 2) p.glow(0, 0, 18, C[5], 0.35 * (1 - Math.abs(1 - r)));
      dome(p, true); ps.draw(p, "back");
    },
    draw(p) {
      dome(p, false); emblem(p);
      if (t >= FOLD && t < FOLD + 0.12) sparkle(p, 0, -16, 6, WHITE, C[6], 0.6);
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
