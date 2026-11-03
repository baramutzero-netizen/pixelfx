// 치유의 빛 (용사 학원 팔라딘 pa_2) — a column of soft healing light comes down on one ally. (0, 0) is the ally's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, lerp, TAU, WHITE, sparkle } from "../../core/index.js";
import { GOLD, GREEN, plus } from "./_lib.js";

export const meta = {
  name: "Healing light",
  desc: "A soft column of warm light comes down onto the ally, a green-gold pool blooms on the floor, plus signs and motes spiral up through the light, then it thins away from the top.",
  tags: ["holy", "heal", "restore", "column", "one-shot"],
  size: [64, 156], origin: [32, 144], duration: 1.75, loop: false, fps: 30, bg: "ground",
  options: { palette: GOLD, seed: 3, green: GREEN },
};

const DOWN = 0.28, HOLDT = 0.95, GONE = 1.35, TOP = -140, W = 11, SY = 0.32;
export const LAND = DOWN;

export function create(o) {
  const C = fit(o.palette, 8), G = fit(o.green, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 999, sparks: [WHITE, G[6], C[6]] }), lights = new Lights();
  const pluses = Array.from({ length: 7 }, (_, i) => ({ t0: DOWN + i * 0.09, a0: (i / 7) * TAU, v: R.range(34, 52), r: R.range(6, 10), L: i % 3 === 0 ? 2 : 1 }));
  let t = 0, landed = false;
  const head = () => lerp(TOP, 0, ease.inQuad(clamp(t / DOWN)));       // the bottom edge coming down
  const tail = () => lerp(TOP, 0, ease.inCubic(clamp((t - HOLDT) / (GONE - HOLDT))));   // the top edge going away
  function column(p) {
    if (t > GONE) return;
    const y0 = tail(), y1 = head(), swell = 1 + 0.25 * Math.sin(clamp((t - DOWN) / 0.3) * Math.PI);
    for (let y = Math.ceil(y0); y <= y1; y++) {
      const k = (y - TOP) / -TOP, w = W * swell * (0.75 + 0.25 * k);
      for (let x = -w; x <= w; x += 1) {
        const e = Math.abs(x) / w, c = e < 0.25 ? WHITE : e < 0.6 ? C[6] : e < 0.85 ? C[5] : G[5];
        p.blend(x, y, c, (e < 0.25 ? 0.75 : e < 0.6 ? 0.5 : 0.3) * (0.4 + 0.6 * k) * (1 - 0.6 * e * e));
      }
    }
    if (y1 > y0) p.glowLine(0, y0, 0, y1, 12, C[5], 0.22);
  }
  return {
    update(dt) {
      t += dt;
      if (!landed && t >= DOWN) { landed = true; lights.add(0, -6, 30, C[5], 0.7, 0.3); for (let i = 0; i < 16; i++) { const a = R.range(0, TAU); ps.spawn(P.STAR, Math.cos(a) * 12, Math.sin(a) * 12 * SY, Math.cos(a) * 26, -R.range(4, 20), R.range(0.3, 0.6), R.chance(0.5) ? WHITE : G[6], R.range(0.6, 1.2)); } }
      if (t > DOWN && t < HOLDT && R.chance(dt * 40)) ps.spawn(P.MOTE, R.range(-W, W), R.range(-6, 0), 0, -R.range(30, 60), R.range(0.5, 0.9), R.chance(0.5) ? G[6] : C[6]);
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      const pool = smooth(DOWN - 0.05, DOWN + 0.1, t) * (1 - smooth(HOLDT, GONE + 0.15, t));   // the green-gold pool on the floor
      if (pool > 0) {
        p.each(-20, -7, 20, 7, (x, y, sx, sy) => { const e = (x / 20) ** 2 + (y / (20 * SY)) ** 2; if (e <= 1) p.blendPx(sx, sy, e > 0.8 ? G[6] : e > 0.45 ? G[5] : C[6], pool * (e > 0.8 ? 0.85 : 0.35)); });
        p.glow(0, -2, 24, G[5], 0.3 * pool);
      }
    },
    draw(p) {
      column(p);
      for (const q of pluses) {                                          // plus signs riding a spiral up through the light
        const a = t - q.t0; if (a < 0 || a > 0.75) continue;
        const ang = q.a0 + a * 6, x = Math.cos(ang) * q.r, y = -4 - q.v * a, k = 1 - smooth(0.5, 0.75, a);
        if (Math.sin(ang) < -0.4) continue;
        plus(p, x, y, q.L + 1, q.L > 1 ? 3 : 1, G, k, a < 0.1);
      }
      if (t >= DOWN && t < DOWN + 0.12) sparkle(p, 0, -6, 7, WHITE, C[6], 0.6);
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
