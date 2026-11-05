// 중력 반전 — 데포르메 (용사 학원 마법사 필살기 wz_u · gravity-flip 의 굵은 판) — two thick outlined violet rings pop on the floor under the
// line, three chunky orbs spiral up from it into a big violet orb that swells on each of ten pulls (each a ring popping across the floor
// and a star), and at the slam it drops: a big star on the floor and a burst ring, then all shrinks away. (0, 0) is the middle of the line's floor.
import { clamp, ease, lerp, TAU, WHITE } from "../../core/index.js";
import { ARC, CYAN, band, blob, star, pop, shrink } from "./_chibi_wizard.js";

export const meta = {
  name: "Gravity flip (chunky)",
  desc: "Thick violet rings pop on the floor, chunky orbs spiral up into a big orb that swells on each of ten pulls, then it slams down in a big star and a burst ring.",
  tags: ["arcane", "gravity", "ultimate", "aoe", "chunky", "one-shot"],
  size: [304, 288], origin: [152, 232], duration: 3.9, loop: false, fps: 30, bg: "ground",
  options: { reach: 120 },
};

const OPEN = 0.4, SLAM = 2.85, SY = 0.32, OY = -150;
const GAP0 = (SLAM - 0.45) * 0.2 / (1 - 0.8 ** 9);
export const HITS = Array.from({ length: 10 }, (_, i) => 0.45 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = SLAM;

export function create(o) {
  const RX = o.reach;
  let t = 0;
  const done = () => HITS.filter((h) => t >= h).length;
  return {
    update(dt) { t += dt; },
    draw(p) {
      const out = shrink(t, SLAM + 0.3, 3.75), rk = pop(t, 0, 0.3) * out;
      if (rk > 0) { band(p, 0, 0, RX * rk, SY, 4.5, ARC[4], ARC[5]); band(p, 0, 0, RX * 0.55 * rk, SY, 3, CYAN[3], CYAN[4]); }
      HITS.forEach((h, i) => {                                                // a ring and a star on each pull
        const v = clamp((t - h) / 0.3); if (v <= 0 || v >= 1 || h >= SLAM) return;
        const w = 4 * (1 - v); if (w > 0.6) band(p, 0, 0, 10 + (RX * 0.9) * ease.outCubic(v), SY, w, ARC[5], WHITE);
        const k = pop(t, h, 0.06) * shrink(t, h + 0.1, h + 0.25), a = i * 2.4;
        if (k > 0) star(p, Math.cos(a) * RX * 0.7, Math.sin(a) * RX * 0.7 * SY - 6, 5 * k, i % 2 ? CYAN[4] : WHITE);
      });
      const ok = smoothOrb(t), r = (10 + done() * 1.6) * ok;
      if (t < SLAM) {
        for (let i = 0; i < 3; i++) {                                         // orbs spiralling up into it
          const v = ((t * 0.7 + i / 3) % 1), a = v * TAU * 1.5 + i, y = lerp(0, OY, v), rr = RX * 0.6 * (1 - v);
          const k = pop(t, OPEN + i * 0.1, 0.15); if (k > 0) blob(p, Math.cos(a) * rr, y + Math.sin(a) * rr * SY, (3.5 + 3 * v) * k, i % 2 ? CYAN[4] : ARC[5], WHITE);
        }
        if (r > 0.6) { blob(p, 0, OY, r + 2, ARC[3]); blob(p, 0, OY, r, ARC[4], WHITE); }
      } else {
        const u = clamp((t - SLAM) / 0.12), y = lerp(OY, -10, ease.inCubic(u));   // it drops
        const k = shrink(t, SLAM + 0.1, SLAM + 0.3); if (k > 0) blob(p, 0, y, r * k, ARC[4], WHITE);
        const s = pop(t, SLAM + 0.08, 0.1) * shrink(t, SLAM + 0.2, SLAM + 0.6); if (s > 0) star(p, 0, -8, 40 * s, ARC[6]);
        const v = clamp((t - SLAM - 0.08) / 0.5), w = 6 * (1 - v); if (w > 0.6) band(p, 0, 0, 14 + (RX + 10) * ease.outCubic(v), SY, w, WHITE, ARC[6]);
      }
    },
  };
}
function smoothOrb(t) { return clamp((t - OPEN) / 0.3); }
