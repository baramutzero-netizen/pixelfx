// 대지 가르기 (용사 학원 검투사 필살기 sw_u — 1103 스물셋째 다시 · 사용자 '마지막 타에서 갈라진 대지 사이로 커다란 돌덩이가 튀어나오며 큰 피해') — a rift tears in from
// the swordsman's side under the whole enemy line, the ground jolts six times, faster and faster, then huge boulders burst up out of the split and crash back. The canvas is the 5-slot formation's floor; faces right
// (the rift comes in from the left). Adapted from the quake recipe (nature/quake — after Sprite Fusion's explosion, MIT, Hugo Duprez).
import { Particles, Bits, Lights, P, PF, B, Rng, fit, clamp, smooth, ease, rand, TAU, WHITE, hex, mix } from "../../core/index.js";
import { stone, rock } from "./_lib.js";
import { stoneShape, drawRock } from "../nature/_lib.js";
import { EARTH, MAGMA } from "./_gladiator.js";

export const meta = {
  name: "Boulder rend",
  desc: "A glowing rift tears in from the left under the line, the ground jolts six times faster and faster, then huge boulders burst up out of the split and crash back in dust.",
  tags: ["melee", "earth", "quake", "rift", "ultimate", "aoe", "ground", "one-shot"],
  size: [352, 264], origin: [176, 212], duration: 3.6, loop: false, fps: 30, bg: "ground",
  options: { palette: EARTH, glow: MAGMA, reach: 128, seed: 17 },
};

const TEAR = 0.32, P0 = 0.5, FINAL = 2.3, CLOSE = 3.0;
// seven jolts from 0.5 s to the burst (the last is the boulders), each gap 0.8 of the one before — the host hits on each
const GAP0 = (FINAL - P0) * 0.2 / (1 - 0.8 ** 6);
export const HITS = Array.from({ length: 7 }, (_, i) => P0 + GAP0 * (1 - 0.8 ** i) / 0.2);
export const HIT = FINAL;

export function create(o) {
  const S = fit(o.palette, 8), G = fit(o.glow, 5), R = new Rng(o.seed), RX = o.reach, floor = () => 0;
  const ST = stone(S[4]), DUST = mix(S[6], hex("#9a8c7c"), 0.35), DUST2 = mix(S[5], hex("#7a6c60"), 0.3);
  const ps = new Particles({ rng: R, ground: floor, sparks: [G[4], G[3], G[2], G[1]] }), bits = new Bits({ ground: floor }), lights = new Lights();
  const rift = [];
  for (let x = -RX - 30; x <= RX; x += R.range(2.5, 5)) rift.push([x, R.range(-1.5, 1.5)]);
  const forks = Array.from({ length: 9 }, () => { const x = R.range(-RX, RX), pts = [[x, 0]]; let xx = x, yy = 0; for (let j = R.int(3, 6); j > 0; j--) { xx += R.range(-4, 4); yy += R.sign() * R.range(1.5, 3); pts.push([xx, yy]); } return pts; });
  const slabs = [];
  for (let x = -RX + 6; x < RX - 4; x += R.range(13, 18)) slabs.push({ x: x + R.range(-2, 2), y: 0, vy: 0, a: 0, va: 0, rest: true, s: R.range(4.5, 6.5) });
  const spikes = [];
  for (let x = -RX + 4; x < RX; x += R.range(9, 14)) spikes.push({ x, h: R.range(26, 62) * (0.7 + 0.3 * (1 - Math.abs(x) / RX)), w: R.range(5, 9), lean: R.range(-0.25, 0.25), d: R.range(0, 0.08) });
  const boulders = [{ x: 0, s: 36, top: -96, d: 0 }, { x: -66, s: 17, top: -56, d: 0.05 }, { x: 68, s: 18, top: -60, d: 0.08 }, { x: -108, s: 9, top: -34, d: 0.1 }, { x: 108, s: 10, top: -38, d: 0.12 }]
    .map((b) => ({ ...b, pts: stoneShape(R, 7), a0: R.range(-0.4, 0.4), va: R.range(-1.2, 1.2) }));
  const BR = [S[1], S[2], S[3], S[4], S[5], S[6], S[7]];
  let t = 0, j = 0, burst = false;
  const open = () => -RX - 30 + (2 * RX + 30) * ease.outCubic(clamp(t / TEAR));       // the rift's head racing in from the left
  const gap = (x) => (1 - smooth(CLOSE, CLOSE + 0.4, t)) * (1.2 + 2.4 * smooth(P0, FINAL, t)) * (0.7 + 0.3 * (1 - Math.abs(x) / RX));
  const heat = () => smooth(0, 0.3, t) * (1 - smooth(FINAL + 0.2, CLOSE + 0.2, t)) * (0.8 + 0.2 * Math.sin(t * 19));
  const shake = () => HITS.reduce((s, tj, i) => (t > tj ? s + Math.exp(-(t - tj) * 10) * Math.sin((t - tj) * 80) * (1.2 + i * 0.25) : s), 0);
  function jolt(k, L) {
    lights.add(0, -2, 90, G[2], 0.45 * k, 0.4); lights.add(0, -2, 30, WHITE, 0.3 * k, 0.06);
    for (const s of slabs) { if (s.x > L || R.chance(0.35)) continue; s.rest = false; s.vy = -R.range(60, 150) * k; s.va = R.sign() * R.range(3, 8); }
    for (let i = 0; i < 60 * k; i++) { const x = R.range(-RX, L), a = -Math.PI / 2 + R.range(-0.6, 0.6), sp = R.range(40, 190) * k; ps.spawn(P.GRIT, x, -1, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.5, 1.1), R.pick([S[7], S[6], S[5], S[4]]), R.chance(0.35) ? 2 : 1); }
    for (let i = 0; i < 6 * k; i++) { const x = R.range(-RX, L) * 0.9, a = -Math.PI / 2 + R.range(-0.9, 0.9), sp = R.range(90, 200) * k; bits.add({ kind: B.CHUNK, x, y: -2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 1, drag: 0.5, bounce: 0.3, life: Math.min(R.range(0.9, 1.4), meta.duration - 0.1 - t), a: R.range(0, TAU), va: R.range(-14, 14), s: R.range(1.6, 3.2) }); }
    for (let i = 0; i < 4 * k; i++) ps.spawn(P.SMOKE, R.range(-RX, L) * 0.9, -R.range(1, 4), R.range(-40, 40), -R.range(10, 30) * k, Math.min(R.range(0.7, 1.2), meta.duration - 0.15 - t), R.chance(0.5) ? DUST : DUST2, R.range(2.5, 4.5) * k, R.range(0, 0.15), PF.BIG);
    for (let i = 0; i < 8 * k; i++) { const x = R.range(-RX, L) * 0.8, a = -Math.PI / 2 + R.range(-1, 1), sp = R.range(120, 280); ps.spawn(P.SPARK, x, -1, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.12, 0.3)); }
  }
  function boulder(p, b) {                                             // bursts up out of the split, hangs a beat, crashes back down and sinks as it closes
    const u = t - FINAL - b.d;
    if (u < 0) return;
    const up = ease.outBack(clamp(u / 0.16)), fall = ease.inQuad(clamp((u - 0.32) / 0.22)), y = 18 + (b.top - 18) * up + (-b.s * 0.7 - b.top) * fall + 14 * smooth(0.8, 1.2, u);
    const f = 1 - smooth(0.9, 1.2, u);
    if (f <= 0) return;
    drawRock(p, b.x + shake(), y, b.s, b.a0 + b.va * Math.min(u, 0.55), b.pts, BR, f);
  }
  function spike(p, q) {
    const u = t - FINAL - q.d;
    if (u < 0) return;
    const up = ease.outBack(clamp(u / 0.12)), down = smooth(0.3, 0.62, u), h = q.h * 0.45 * up * (1 - down);   // shorter now — the boulders are the burst
    if (h < 1) return;
    for (let y = 0; y < h; y++) {                                        // a jagged stone fang leaning a little, lit on the left
      const v = y / h, w = q.w * (1 - v) * (1 - v * 0.2), cx = q.x + q.lean * y;
      for (let x = -w; x <= w; x += 0.6) { const e = (x + w) / (2 * w + 0.01); p.dot(cx + x, -y, e < 0.25 ? ST.light : e > 0.75 ? ST.shade : v > 0.85 ? ST.light : ST.body, 1 - down * 0.6); }
      p.dot(cx - w - 0.5, -y, ST.dark, 1 - down); p.dot(cx + w + 0.5, -y, ST.dark, 1 - down);
    }
  }
  return {
    update(dt) {
      t += dt;
      while (j < HITS.length && t >= HITS[j]) { jolt(0.6 + j * 0.06, open()); j++; }
      if (!burst && t >= FINAL) {
        burst = true; jolt(1.5, RX);
        lights.add(0, -10, 150, G[3], 0.8, 0.5); lights.add(0, -10, 60, WHITE, 0.6, 0.1);
        for (let i = 0; i < 14; i++) ps.spawn(P.SMOKE, R.range(-RX, RX), -R.range(2, 10), R.range(-50, 50), -R.range(20, 60), R.range(0.55, 0.85), R.chance(0.5) ? DUST : DUST2, R.range(6, 10), R.range(0, 0.15), PF.BIG);
      }
      if (t > TEAR * 0.5 && t < CLOSE && R.chance(0.4 * Math.min(1, dt * 120))) { const x = R.range(-RX, Math.min(RX, open())); ps.spawn(P.EMBER, x, -1, R.range(-10, 10), -R.range(20, 50), Math.min(R.range(0.5, 1), meta.duration - 0.1 - t), G[3], 1); }
      for (const s of slabs) {
        if (s.rest) continue;
        s.vy += 950 * dt; s.y += s.vy * dt; s.a += s.va * dt;
        if (s.y >= 0 && s.vy > 0) { s.y = 0; s.a = clamp(s.a, -0.4, 0.4); if (s.vy > 150) { s.vy *= -0.25; s.va *= -0.4; } else s.rest = true; }
      }
      bits.update(dt); ps.update(dt); lights.update(dt);
    },
    drawBack(p) {
      const L = open(), hk = heat(), jx = shake(), fade = 1 - smooth(CLOSE, CLOSE + 0.4, t);
      for (let i = 1; i < rift.length; i++) {
        const [x0, d0] = rift[i - 1], [x1, d1] = rift[i];
        if (x0 > L) break;
        for (let x = Math.ceil(x0); x < Math.min(x1, L); x++) {
          const u = (x - x0) / (x1 - x0), d = Math.round(d0 + (d1 - d0) * u), w = gap(x), X = x + jx, edge = Math.abs(x) > RX ? smooth(RX + 30, RX, Math.abs(x)) : 1;
          p.dot(X, d - 1, S[6], fade * edge);
          for (let y = 0; y < w * edge; y++) { const hot = hk * clamp(rand(Math.floor(x / 3), 5) + 0.3, 0, 1); p.dot(X, d + y, y > w / 2 - 1 && hot > 0.5 ? (rand(x, Math.floor(t * 12)) < 0.5 ? G[3] : G[2]) : y > w / 2 - 1 && hot > 0.2 ? G[1] : S[0], fade); }
          p.dot(X, d + Math.ceil(w * edge), S[2], fade * edge);
        }
        if (i % 3 === 0 && hk > 0 && x1 < L) p.glow(x1 + jx, d1 + 1, 10, G[2], 0.3 * hk);
      }
      for (const f of forks) { if (f[0][0] > L) continue; const k = fade * smooth(P0, P0 + 0.6, t); for (let i = 1; i < f.length; i++) p.line(f[i - 1][0] + jx, f[i - 1][1], f[i][0] + jx, f[i][1], S[1], k); }
      ps.draw(p, "back");
    },
    draw(p) {
      const jx = shake(), sink = smooth(CLOSE, CLOSE + 0.4, t);
      for (const s of slabs) if (!s.rest || s.a) { const b = { x: s.x + jx, y: s.y - 1.5 + sink * 4, s: s.s, a: s.a, life: 1 - sink }; rock(p, b, ST); }
      for (const q of spikes) spike(p, q);
      for (const b of boulders) boulder(p, b);
      for (const b of bits.list) rock(p, b, ST);
      ps.draw(p, "front"); lights.draw(p);
    },
  };
}
