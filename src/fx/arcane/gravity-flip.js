// 중력 반전 (용사 학원 마법사 필살기 wz_u) — gravity turns over the whole enemy line (the canvas is the 5-slot formation's floor).
import { Particles, Lights, P, Rng, fit, band, flare, clamp, smooth, ease, rand, TAU, WHITE, PAL, rgb } from "../../core/index.js";
import { floorRing, sigil } from "./_lib.js";

export const meta = {
  name: "Gravity flip",
  desc: "A violet circle opens under the line, a three-strand spiral winds up into the sky as everything falls upward, ten pulses that come faster and faster, then gravity snaps back: flash, slam ring, dust.",
  tags: ["arcane", "gravity", "ultimate", "aoe", "one-shot"],
  size: [304, 288], origin: [152, 232], duration: 3.9, loop: false, fps: 30, bg: "ground",
  options: { palette: PAL.arcane, seed: 11, reach: 120 },
};

const OPEN = 0.4, SLAM = 2.85, LIFT = SLAM - 0.1, SY = 0.32;
// ten hits from 0.45 s to the slam, each gap 0.8 of the one before (long first, quick at the end) — the host plays a hit on each
const GAP0 = (SLAM - 0.45) * 0.2 / (1 - 0.8 ** 9);
export const HITS = Array.from({ length: 10 }, (_, i) => 0.45 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = SLAM;

export function create(o) {
  const C = fit(o.palette, 8), RX = o.reach, R = new Rng(o.seed);
  const ps = new Particles({ rng: R, ground: () => 0, sparks: [C[7], C[6], C[5], C[4]] }), lights = new Lights();
  const rocks = Array.from({ length: 34 }, () => { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX * 0.95;
    return { x: Math.cos(a) * d, y0: Math.sin(a) * d * SY, s: R.int(1, 3), d0: R.range(0, 0.35), sp: R.range(50, 110), c: R.pick([C[2], C[3], rgb(120, 104, 120)]) }; });
  const sig = Array.from({ length: 10 }, (_, i) => ({ a: (i / 10) * TAU, g: i % 8 }));
  let t = 0, slammed = false;
  const fade = () => 1 - smooth(SLAM + 0.3, SLAM + 0.85, t);
  const pulse = () => { let k = 0; for (const h of HITS) { const d = t - h; if (d >= 0 && d < 0.18) k = Math.max(k, 1 - d / 0.18); } return k; };
  function circle(p, back) {
    const u = ease.outCubic(clamp(t / OPEN)), f = fade(), keep = (g) => (Math.sin(g) < 0) === back;
    if (f <= 0) return;
    const spin = t * 0.6, r = RX * u;
    floorRing(p, 0, 0, r, SY, back ? C[4] : C[6], f, keep);
    floorRing(p, 0, 0, r * 0.82, SY, back ? C[3] : C[5], f * 0.9, keep);
    floorRing(p, 0, 0, r * 0.4, SY, back ? C[3] : C[5], f * 0.8, keep);
    const k = pulse();
    if (k > 0 && t < SLAM) floorRing(p, 0, 0, r * (0.55 + 0.4 * (1 - k)), SY, back ? C[5] : WHITE, k * 0.9, keep);
    for (const s of sig) {
      const a = s.a + spin, x = Math.cos(a) * r * 0.91, y = Math.sin(a) * r * 0.91 * SY;
      if ((Math.sin(a) < 0) !== back) continue;
      sigil(p, s.g, x, y - 3, back ? C[5] : C[6], f * u, C[1]);
    }
  }
  // the spiral: three violet strands winding up into the sky, turning as they climb, narrowing toward the top; far side behind
  const H = 210;
  function helix(p, front) {
    const grow = ease.outCubic(clamp((t - OPEN * 0.5) / 0.5)), b = clamp((t - OPEN * 0.5) / 0.15) * (1 - smooth(SLAM - 0.05, SLAM + 0.12, t));
    if (b <= 0) return;
    const top = H * grow;
    for (let s = 0; s < 3; s++) {
      const ph = (s / 3) * TAU;
      for (let h = 0; h <= top; h += 1.2) {
        const ang = h * 0.045 - t * 7 + ph, r = RX * 0.8 * (1 - (h / H) * 0.72), sa = Math.sin(ang);
        if ((sa > 0) !== front) continue;
        const x = Math.cos(ang) * r, y = -h + sa * r * SY, head = (top - h) / 26, u = h / H;
        const c = head < 1 ? WHITE : front ? (u < 0.5 ? C[6] : C[5]) : (u < 0.5 ? C[4] : C[3]);
        const a = b * (front ? 1 : 0.6) * (0.35 + 0.65 * Math.min(1, (top - h) / 60 + 0.4));
        p.dot(x, y, c, a);
        if (front && (Math.floor(h) % 3 === 0)) p.dot(x, y + 1, C[4], a * 0.6);
        if (front && Math.floor(h) % 16 === 0) p.light(x, y, C[5], 0.25 * b);
      }
      if (front) { const ang = top * 0.045 - t * 7 + ph, r = RX * 0.8 * (1 - (top / H) * 0.72); p.glow(Math.cos(ang) * r, -top + Math.sin(ang) * r * SY, 10, C[6], 0.5 * b); }
    }
    if (front) { p.glow(0, -H * 0.45, RX * 0.8, C[5], 0.22 * b); p.glow(0, -4, RX * 0.6, C[6], 0.18 * b); }
  }
  return {
    update(dt) {
      t += dt;
      if (t > OPEN * 0.5 && t < LIFT) for (let i = 0; i < 2; i++) { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX; ps.spawn(P.MOTE, Math.cos(a) * d, Math.sin(a) * d * SY, 0, -R.range(60, 140), R.range(0.4, 0.8), R.chance(0.3) ? WHITE : C[5]); }
      for (const h of HITS) if (h < SLAM - 0.01 && t - dt < h && t >= h) {            // each hit: a violet burst at the floor and sparks thrown up
        lights.add(0, -30, RX * 0.9, C[5], 0.35, 0.12);
        for (let i = 0; i < 10; i++) { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX * 0.9; ps.spawn(P.SPARK, Math.cos(a) * d, Math.sin(a) * d * SY - 2, 0, -R.range(90, 200), R.range(0.15, 0.35)); }
      }
      if (!slammed && t >= SLAM) {
        slammed = true;
        lights.add(0, -10, RX * 1.4, C[5], 0.8, 0.5); lights.add(0, -10, 40, WHITE, 0.9, 0.08);
        for (let i = 0; i < 24; i++) { const a = R.range(0, TAU), d = Math.sqrt(R.next()) * RX; ps.spawn(P.DUST, Math.cos(a) * d, Math.sin(a) * d * SY, Math.cos(a) * R.range(30, 90), -R.range(5, 25), R.range(0.5, 0.85), rgb(150, 132, 160), R.range(3, 6)); }
        for (let i = 0; i < 50; i++) { const a = R.range(0, TAU), d = R.range(0, RX); ps.spawn(P.SPARK, Math.cos(a) * d, Math.sin(a) * d * SY - 2, Math.cos(a) * 60, -R.range(60, 200), R.range(0.2, 0.5)); }
      }
      ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      circle(p, true);
      helix(p, false);
      ps.draw(p, "back");
    },
    draw(p) {
      circle(p, false);
      helix(p, true);
      for (const q of rocks) {                                   // everything on the floor falls up, then drops back at the slam
        const tt = t - OPEN * 0.6 - q.d0;
        if (tt < 0) continue;
        const hover = (x) => q.y0 - q.sp * 1.1 * ease.outCubic(clamp(x / 1.4)) - Math.sin(x * 2.2 + q.d0 * 9) * 4 * clamp(x / 1.4);   // float up, then bob
        let y;
        if (t < SLAM) y = hover(tt);
        else { const s = t - SLAM; y = Math.min(q.y0, hover(SLAM - OPEN * 0.6 - q.d0) + 900 * s * s); if (y >= q.y0 && s > 0.6) continue; }
        p.rect(q.x, y - q.s, q.s, q.s, q.c);
        p.px(q.x, y - q.s, C[6]);
      }
      if (t >= SLAM && t < SLAM + 0.07) { p.glow(0, -20, RX, WHITE, 0.6); flare(p, 0, -12, 30, 0.9, [C[4], C[6], WHITE]); }
      const g = (t - SLAM) / 0.4;
      if (g > 0 && g < 1) { band(p, 0, 0, RX * (0.3 + 0.95 * ease.outCubic(g)), SY, Math.max(1, 5 * (1 - g)), 1.1 - g, [C[3], C[4], C[6], WHITE], () => true, g < 0.2); }
      ps.draw(p, "front");
      lights.draw(p);
    },
  };
}
