// 가시 채찍 — 데포르메 (용사 학원 드루이드 dr_b · thorn-lash 의 굵은 판) — a thick outlined thorny vine pops up beside the target, rears
// back, then lashes so its tip cracks on the target's chest with a chunky star and three sap blobs, lies a beat, rears up and sinks away.
// (0, 0) is the target's feet; it comes in from the left.
import { fit, clamp, smooth, lerp, WHITE } from "../../core/index.js";
import { blob, star, petal, pop, shrink } from "../holy/_chibi.js";
import { bar, spike } from "../melee/_chibi_sword.js";

const OX = -64, LASH = 0.26, LAG = 0.0052, TAU_S = 0.055, OMEGA = (2 * Math.PI) / 0.21, N0 = 24;
const CRACK = LASH + LAG * N0 + (Math.PI - Math.atan(OMEGA * TAU_S)) / OMEGA;   // the original's crack time (0.456)

export const meta = {
  name: "Thorn lash (chunky)",
  desc: "A thick outlined thorny vine pops up beside the target, rears back, then lashes so its tip cracks on the chest with a chunky star and sap blobs, then rears up and sinks away.",
  tags: ["nature", "attack", "vine", "whip", "chunky", "one-shot"],
  size: [200, 128], origin: [134, 114], duration: 1.4, loop: false, fps: 30, bg: "ground",
  options: { palette: ["#0c1a10", "#173a1a", "#24582a", "#357a34", "#52a03e", "#86c84e", "#c4ec7a", "#f4ffd0"], thorn: ["#2a1410", "#5e2a1a", "#a04c2e", "#e89a6a"] },
};
export const HIT = CRACK;

// key poses of the vine: [time, control point, tip] (base fixed at (OX, 0))
const KEYS = [[0, [OX, 0], [OX, 0]], [0.18, [OX, -24], [OX + 2, -50]], [0.34, [OX - 6, -48], [OX - 26, -34]], [CRACK, [OX + 26, -58], [0, -24]], [0.85, [OX + 26, -52], [-2, -22]], [1.02, [OX + 4, -30], [OX + 6, -54]], [1.3, [OX, -4], [OX, -8]]];

export function create(o) {
  const C = fit(o.palette, 8), Th = fit(o.thorn, 4);
  let t = 0;
  const pose = () => {
    let i = 0; while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
    const [t0, c0, p0] = KEYS[i], [t1, c1, p1] = KEYS[i + 1], u = smooth(0, 1, clamp((t - t0) / (t1 - t0))), fast = i === 2 ? clamp((t - t0) / (t1 - t0)) ** 2 : u;
    return { c: [lerp(c0[0], c1[0], fast), lerp(c0[1], c1[1], fast)], q: [lerp(p0[0], p1[0], fast), lerp(p0[1], p1[1], fast)] };
  };
  return {
    update(dt) { t += dt; },
    draw(p) {
      if (t > 1.32) return;
      const { c, q } = pose(), N = 12, pts = [];
      for (let i = 0; i <= N; i++) { const u = i / N, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), d = u * u; pts.push([a * OX + b * c[0] + d * q[0], b * c[1] + d * q[1]]); }
      for (let i = 0; i < N; i++) { const [ax, ay] = pts[i], [bx, by] = pts[i + 1]; bar(p, ax, ay, bx, by, 9 - 5.5 * (i / N), C[4], C[6]); }
      [3, 6, 9].forEach((i, j) => { const [x, y] = pts[i], [x2, y2] = pts[i + 1], nx = -(y2 - y), ny = x2 - x, L = Math.hypot(nx, ny) || 1, s = j % 2 ? 1 : -1; spike(p, x + (s * nx / L) * 3, y + (s * ny / L) * 3, 7, 5, s * 3, Th[2], Th[3]); });
      const [lx, ly] = pts[5]; petal(p, lx + 2, ly - 2, 10, 4, 5, C[5], C[7]);
      const s = pop(t, CRACK, 0.08) * shrink(t, CRACK + 0.1, CRACK + 0.28);
      if (s > 0) star(p, 0, -24, 12 * s, C[7]);
      for (let i = 0; i < 3; i++) { const a = -1.2 + i * 0.6, v = clamp((t - CRACK) / 0.35), k = pop(t, CRACK + 0.02, 0.06) * shrink(t, CRACK + 0.2, CRACK + 0.4); if (k > 0) blob(p, Math.cos(a) * 18 * v + 4, -24 + Math.sin(a) * 18 * v + 30 * v * v, 2.6 * k, C[5], C[7]); }
      const dk = pop(t, 0, 0.1) * shrink(t, 1.15, 1.32);
      if (dk > 0) blob(p, OX, 1, 4 * dk, Th[1], Th[2]);
    },
  };
}
