// 시간 정지 — 데포르메 (용사 학원 시마도사 필살기 tm_u · chrono-halt 의 굵은 판) — a big round outlined clock face pops up over the
// enemy line with chunky gears, its thick hands spin backward faster and faster, then slam to twelve at 1.5 s: a big star, a thick grey
// shock ring across the floor, three grey blobs hang frozen in the air, white cracks on the face — and at 2.25 s it breaks into chunky
// pieces that fall. Same times as chrono-halt (STOP · BREAK · TICKS). (0, 0) is the middle of the enemy line's floor.
import { fit, hex, clamp, smooth, ease, TAU, WHITE } from "../../core/index.js";
import { CHRONO, BRASS } from "./_chrono.js";
import { band, blob, star, pop, shrink } from "../holy/_chibi.js";
import { capsule, shape } from "./_chibi_timemage.js";
import { gearD } from "./_chibi_timemage_gear.js";

export const meta = {
  name: "Chrono halt (chunky)",
  desc: "A big outlined clock pops up over the line and spins backward faster and faster, slams to twelve in a star and a grey shock ring, hangs frozen, then breaks and falls.",
  tags: ["arcane", "time", "stop", "ultimate", "aoe", "clock", "chunky", "one-shot"],
  size: [304, 248], origin: [152, 190], duration: 2.8, loop: false, fps: 30, bg: "ground",
  options: { palette: CHRONO, reach: 120, part: "all" },   // part: back (바닥 층 — 시계 · 고리 뒤 절반) | front (고리 앞 절반 · 멈춘 덩이) | all
};

export const STOP = 1.5;
export const TICKS = (() => { const n = 10, a = 0.35, b = 1.4, r = 0.82, g = (b - a) * (1 - r) / (1 - r ** (n - 1)); return Array.from({ length: n }, (_, i) => +(a + g * (1 - r ** i) / (1 - r)).toFixed(3)); })();
export const BREAK = 2.25;
const SY = 0.32, CY = -100, CR = 34, GREY = ["#6a7286", "#b4bacb"].map(hex);
const BK = (a) => Math.sin(a) < 0, FR = (a) => Math.sin(a) >= 0;

export function create(o) {
  const C = fit(o.palette, 8), B = fit(BRASS, 8), RX = o.reach, BACK = o.part !== "front", FRONT = o.part !== "back";
  const keep = BACK && FRONT ? null : BACK ? BK : FR;
  let t = 0;
  const turn = () => { if (t >= STOP) return 0; const u = t / STOP; return -(u * u * u) * TAU * 7; };
  const frozen = () => t >= STOP && t < BREAK;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const end = shrink(t, BREAK + 0.25, meta.duration - 0.05);
      const rk = pop(t, 0, 0.2) * end;                                      // the floor rim
      if (rk > 0) band(p, 0, 0, RX * rk, SY, 4.5, B[4], B[5], keep);
      const sv = clamp((t - STOP) / 0.5), sw = 5 * (1 - sv);                // the shock ring at the stop
      if (t >= STOP && sw > 0.6) band(p, 0, 0, 14 + (RX + 10) * ease.outCubic(sv), SY, sw, GREY[1], WHITE, keep);
      if (FRONT && frozen()) [[-60, -40], [10, -64], [70, -30]].forEach(([x, y], i) => { const k = pop(t, STOP + 0.04 + i * 0.03, 0.08); blob(p, x, y, 3.4 * k, GREY[0], GREY[1]); });
      if (!BACK) return;
      const shake = frozen() ? Math.round(Math.sin(t * 60)) : 0;
      if (t < BREAK) {                                                       // the clock
        const k = pop(t, 0.1, 0.22), x0 = shake, a = turn();
        if (k > 0) {
          gearD(p, x0 - CR * 0.9 * k, CY - CR * 0.7 * k, 10 * k, 8, a * 0.4, B[3]);
          gearD(p, x0 + CR * 0.95 * k, CY - CR * 0.55 * k, 8 * k, 7, -a * 0.55, B[4]);
          blob(p, x0, CY, CR * k, frozen() ? GREY[1] : B[6], WHITE);
          band(p, x0, CY, CR * k, 1, 4, B[4], B[5]);
          for (let i = 0; i < 12; i++) { const g = (i / 12) * TAU; blob(p, x0 + Math.cos(g) * (CR - 7) * k, CY + Math.sin(g) * (CR - 7) * k, (i % 3 ? 1.2 : 2) * k, B[3]); }
          const H = (ang, L, r) => { const g = ang - Math.PI / 2; capsule(p, x0, CY, x0 + Math.cos(g) * L * k, CY + Math.sin(g) * L * k, r, C[2]); };
          H(a / 12, CR * 0.5, 2); H(a, CR * 0.78, 1.4);
          blob(p, x0, CY, 3.2 * k, C[5], C[6]);
          if (frozen()) [[0.4, 0.8], [2.3, 0.65], [4.1, 0.9]].forEach(([g, L]) => { const l = L * CR * smooth(STOP, STOP + 0.12, t); capsule(p, x0 + Math.cos(g) * 6, CY + Math.sin(g) * 6, x0 + Math.cos(g) * l, CY + Math.sin(g) * l, 0.8, WHITE); });
        }
        const s = pop(t, STOP, 0.1) * shrink(t, STOP + 0.15, STOP + 0.4);
        if (s > 0) star(p, 0, CY, 34 * s, WHITE);
      } else {                                                               // it breaks into chunky pieces that fall
        const a = t - BREAK;
        for (let i = 0; i < 6; i++) {
          const g = (i / 6) * TAU + 0.4, x = Math.cos(g) * CR * 0.6 + Math.cos(g) * 30 * a, y = CY + Math.sin(g) * CR * 0.6 + 240 * a * a - 20 * a, s = shrink(t, BREAK + 0.25, BREAK + 0.5); if (s <= 0) continue;
          shape(p, [[0, -6], [6, 0], [0, 6], [-5, 1]].map(([u, v]) => [x + (u * Math.cos(g + a * 4) - v * Math.sin(g + a * 4)) * s, y + (u * Math.sin(g + a * 4) + v * Math.cos(g + a * 4)) * s]), i % 2 ? B[5] : B[6]);
        }
      }
    },
  };
}
