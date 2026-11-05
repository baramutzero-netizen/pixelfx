// 축복 (용사 학원 신성 사제 pr_2 — 아군 전체 공격 · 방어 상승) — a gold halo with sapphire studs appears over the ally's head,
// sinks down round the body to the feet trailing sparkles, rings on the floor as it lands, and streaks of light and two up-chevrons rise.
// (0, 0) is the ally's feet.
import { Particles, Lights, P, Rng, fit, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { GOLD } from "./_lib.js";
import { SAPPHIRE, glint, halo } from "./_priest.js";

export const meta = {
  name: "Benediction",
  desc: "A gold halo studded with sapphire appears over the head, sinks to the feet trailing sparkles, rings out on the floor, and streaks of light and two chevrons rise.",
  tags: ["holy", "buff", "halo", "blessing", "one-shot"],
  size: [96, 144], origin: [48, 112], duration: 1.2, loop: false, fps: 30, bg: "ground",
  options: { palette: GOLD, seed: 6 },
};

export const LAND = 0.5;
const TOP = -66, SY = 0.32;

export function create(o) {
  const G = fit(o.palette, 8), C = fit(SAPPHIRE, 8), R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [WHITE, G[6], C[6]] }), lights = new Lights();
  const streaks = Array.from({ length: 9 }, (_, i) => ({ x: -18 + i * 4.5 + R.range(-1.5, 1.5), t0: LAND + R.range(0, 0.25), h: R.range(16, 30), v: R.range(60, 90) }));
  let t = 0, landed = false;
  const fade = () => 1 - smooth(0.9, meta.duration - 0.03, t);
  const y = () => { const u = clamp((t - 0.12) / (LAND - 0.12)); return TOP + (-TOP) * ease.inOutCubic(u); };
  const r = () => 11 + 9 * smooth(0.12, LAND, t);
  return {
    update(dt) {
      t += dt;
      if (t > 0.12 && t < LAND && R.chance(dt * 40)) { const g = R.range(0, TAU); ps.spawn(P.MOTE, Math.cos(g) * r(), y() + Math.sin(g) * r() * SY, 0, -R.range(6, 16), R.range(0.25, 0.45), R.chance(0.5) ? G[6] : C[6], 1); }
      if (!landed && t >= LAND) {
        landed = true; lights.add(0, -8, 40, G[5], 0.55, 0.35);
        for (let i = 0; i < 16; i++) { const a = R.range(0, TAU), s = R.range(30, 70); ps.spawn(P.STAR, Math.cos(a) * 20, Math.sin(a) * 20 * SY, Math.cos(a) * s, Math.sin(a) * s * SY - 20, R.range(0.25, 0.45), R.chance(0.5) ? WHITE : G[5], 1); }
      }
      ps.update(dt); lights.update(dt);
    },
    draw(p) {
      const f = fade(), app = smooth(0, 0.12, t), Y = y(), Rr = r();
      if (t < LAND + 0.05) { p.glow(0, Y, Rr * 1.3, G[5], 0.3 * app); halo(p, 0, Y, Rr, SY, G[6], G[3], app * 0.9, 0); halo(p, 0, Y + 1, Rr - 1, SY, G[5], G[3], app * 0.7, 0); }   // the back half first
      const lv = (t - LAND) / 0.45;
      if (lv > 0 && lv < 1) { const k = (1 - lv) * f; halo(p, 0, 0, 20 + 16 * ease.outCubic(lv), SY, lv < 0.25 ? WHITE : G[5], G[3], k, 0); halo(p, 0, 0, 20 + 8 * ease.outCubic(lv), SY, C[6], C[4], k * 0.7, 0); }
      if (t >= LAND) halo(p, 0, 0, 20, SY, G[5], G[3], f * 0.8, 6, t * 2);               // it stays, a ring on the floor, until it fades
      for (const q of streaks) {                                            // streaks of light rising
        const a = t - q.t0; if (a < 0) continue;
        const top = -a * q.v, k = f * (1 - smooth(0.25, 0.6, a));
        for (let d = 0; d < q.h; d++) p.blend(q.x, top + d, d < 3 ? WHITE : G[5], k * (1 - d / q.h) * 0.8);
      }
      for (let i = 0; i < 2; i++) {                                         // two chevrons: up
        const a = t - LAND - 0.1 - i * 0.12; if (a < 0) continue;
        const cy = -30 - a * 40 - i * 4, k = f * (1 - smooth(0.25, 0.55, a));
        for (let d = 0; d <= 6; d++) { p.dot(-d, cy + d * 0.8, i ? C[6] : G[6], k); p.dot(d, cy + d * 0.8, i ? C[6] : G[6], k); p.dot(-d, cy + d * 0.8 + 1, i ? C[5] : G[4], k * 0.8); p.dot(d, cy + d * 0.8 + 1, i ? C[5] : G[4], k * 0.8); }
      }
      if (t < LAND + 0.05) {                                                // the near half of the sinking halo, studs of sapphire on it
        for (let g = 0; g < Math.PI; g += 0.03) { p.dot(Math.cos(g) * Rr, Y + Math.sin(g) * Rr * SY, WHITE, app); p.dot(Math.cos(g) * Rr, Y + Math.sin(g) * Rr * SY + 1, G[6], app); p.dot(Math.cos(g) * (Rr - 1), Y + Math.sin(g) * (Rr - 1) * SY + 2, G[4], app * 0.8); }
        for (let i = 0; i < 4; i++) { const g = (i + 0.5) / 4 * Math.PI + t; p.disc(Math.cos(g) * Rr, Y + Math.sin(g) * Rr * SY + 1, 1.8, C[5], app); p.dot(Math.cos(g) * Rr, Y + Math.sin(g) * Rr * SY, C[6], app); }
      }
      const gv = 1 - smooth(LAND, LAND + 0.3, t);
      if (t >= LAND && gv > 0) glint(p, 0, -2, 4 + 12 * gv, G[6], gv);
      ps.draw(p); lights.draw(p);
    },
  };
}
