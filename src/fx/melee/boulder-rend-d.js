// 대지 가르기 — 데포르메 (용사 학원 검투사 필살기 sw_u · boulder-rend 의 굵은 판) — an outlined rift of glowing magma tears in from the
// left under the line; on each of seven jolts (faster and faster) it flashes and two chunky rocks hop out, and on the last huge outlined
// boulders pop up out of the split with short stone spikes, hold, then sink back as it closes. (0, 0) is the middle of the enemy line's floor.
import { fit, clamp, ease, smooth, lerp, WHITE } from "../../core/index.js";
import { EARTH, MAGMA } from "./_gladiator.js";
import { blob, pop, shrink } from "../holy/_chibi.js";
import { polyFill, rock, spike } from "./_chibi_sword.js";

export const meta = {
  name: "Boulder rend (chunky)",
  desc: "An outlined magma rift tears in under the line; on seven jolts it flashes and rocks hop out, and on the last huge outlined boulders pop up out of the split, then sink back.",
  tags: ["melee", "earth", "ultimate", "aoe", "boulder", "chunky", "one-shot"],
  size: [352, 264], origin: [176, 212], duration: 3.6, loop: false, fps: 30, bg: "ground",
  options: { palette: EARTH, glow: MAGMA, reach: 128 },
};

const TEAR = 0.32, P0 = 0.5, FINAL = 2.3, CLOSE = 3.0;
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 6);
export const HITS = Array.from({ length: 7 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;
const BOULDERS = [{ x: 0, s: 40, top: -84, d: 0 }, { x: -66, s: 22, top: -50, d: 0.05 }, { x: 68, s: 23, top: -52, d: 0.08 }, { x: -108, s: 13, top: -30, d: 0.1 }, { x: 108, s: 13, top: -32, d: 0.12 }];
const SPIKES = [-86, -34, 36, 88];

export function create(o) {
  const S = fit(o.palette, 8), G = fit(o.glow, 5), RX = o.reach;
  const zig = Array.from({ length: 29 }, (_, i) => [lerp(-RX - 20, RX, i / 28), (i % 2 ? 1.6 : -1.6)]);
  let t = 0;
  const lastHit = () => { let h = -1; for (const x of HITS) if (t >= x) h = x; return h; };
  return {
    update(dt) { t += dt; },
    draw(p) {
      const head = lerp(-RX - 20, RX, ease.outCubic(clamp(t / TEAR))), close = 1 - smooth(CLOSE - 0.1, CLOSE + 0.35, t);
      const lh = lastHit(), flash = lh >= 0 && t - lh < 0.08, w = (2.6 + 4.4 * smooth(P0, FINAL, t)) * close;
      if (w > 0.5) {                                                         // the rift: an outlined strip of magma along the floor
        const pts = zig.filter(([x]) => x <= head), top = pts.map(([x, y]) => [x, y - w * (0.6 + 0.4 * (1 - Math.abs(x) / RX))]), bot = pts.map(([x, y]) => [x, y + w * 0.6 * (0.6 + 0.4 * (1 - Math.abs(x) / RX))]).reverse();
        if (pts.length > 1) polyFill(p, top.concat(bot), flash ? G[4] : G[2], (px, py) => (Math.abs(py) < w * 0.25 ? (flash ? WHITE : G[3]) : 0));
      }
      HITS.slice(0, -1).forEach((h, i) => {                                   // two rocks hop out on each jolt
        const a = t - h; if (a < 0 || a > 0.5) return;
        for (let j = 0; j < 2; j++) {
          const x0 = ((i * 53 + j * 97) % 200) / 200 * 2 * RX - RX, vx = (j ? 1 : -1) * 22, y = -a * 180 + 380 * a * a; if (y > 1) continue;
          rock(p, x0 + vx * a, y - 3, 5 + i * 0.4, S[4], S[6], S[2], i + j, a * 6);
        }
      });
      for (const q of SPIKES) { const k = pop(t, FINAL + 0.02, 0.1) * shrink(t, FINAL + 0.35, FINAL + 0.6); if (k > 0) spike(p, q, 0, 22 * k, 10, q > 0 ? 4 : -4, S[3], S[5]); }
      BOULDERS.forEach((b, i) => {                                            // the last jolt: boulders pop up out of the split, hold, sink back
        const u = pop(t, FINAL + b.d, 0.2), sink = smooth(CLOSE - 0.25, CLOSE + 0.15, t); if (u <= 0) return;
        const y = lerp(b.s * 0.4, b.top, u) + (b.s - b.top) * sink * 1.1, r = b.s * (1 - 0.35 * sink);
        if (y > b.s * 0.8 || r < 1) return;
        rock(p, b.x, y, r, S[4], S[6], S[2], i * 3 + 1, 0.2 * i);
      });
    },
  };
}
