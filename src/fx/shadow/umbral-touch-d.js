// 어둠의 손길 — 데포르메 (용사 학원 암흑사제 dp_b · umbral-touch 의 굵은 판) — four thick violet tendrils curl in to the chest and close at
// 0.15 s: a dark star pops with a lilac ring, three obsidian shards fly out, and two violet puffs rise and shrink. (0, 0) is the target's feet.
import { clamp, ease, TAU, WHITE } from "../../core/index.js";
import { VOIDC, arc, star, band, polyO, blob, pop, shrink } from "./_chibi_darkpriest.js";

export const meta = {
  name: "Umbral touch (chunky)",
  desc: "Four thick violet tendrils curl in to the chest and close: a dark star pops with a lilac ring, three obsidian shards fly out and violet puffs rise and shrink.",
  tags: ["shadow", "impact", "tendril", "chunky", "one-shot"],
  size: [136, 124], origin: [68, 100], duration: 1.0, loop: false, fps: 30, bg: "light",
  options: {},
};

const IN = 0.15, CY = -14;
export const BANG = IN;

export function create() {
  let t = 0;
  return {
    update(dt) { t += dt; },
    draw(p) {
      for (let i = 0; i < 4; i++) {                                           // tendrils curling in
        const base = Math.PI / 4 + (i / 4) * TAU, u = ease.outCubic(clamp(t / IN)), r = 40 - 26 * u, w = 6 * shrink(t, IN + 0.02, IN + 0.2);
        if (w > 0.6) arc(p, Math.cos(base) * r * 0.5, CY - 10 + Math.sin(base) * r * 0.4, r * 0.6, w, base + 0.6, base + 2.0, VOIDC[4], VOIDC[6]);
      }
      if (t < IN) return;
      const v = clamp((t - IN) / 0.35), w = 4 * (1 - v); if (w > 0.6) band(p, 0, CY - 10, 6 + 18 * ease.outCubic(v), 0.8, w, VOIDC[5], VOIDC[6]);
      for (let i = 0; i < 3; i++) {                                           // obsidian shards
        const a = -Math.PI / 2 + (i - 1) * 1.3, u = clamp((t - IN) / 0.45), k = pop(t, IN + 0.02, 0.08) * shrink(t, IN + 0.3, IN + 0.5); if (k <= 0) continue;
        const x = Math.cos(a) * 28 * ease.outCubic(u), y = CY - 10 + Math.sin(a) * 24 * ease.outCubic(u) + 30 * u * u, s = 4 * k;
        polyO(p, [[x, y - s * 1.4], [x + s, y], [x, y + s], [x - s * 0.8, y]], VOIDC[2], (px) => (px < x - s * 0.2 ? VOIDC[5] : 0));
      }
      for (let i = 0; i < 2; i++) { const t0 = IN + 0.1 + i * 0.1, a = t - t0; if (a < 0) continue; const k = pop(t, t0, 0.12) * shrink(t, t0 + 0.3, t0 + 0.5); if (k > 0) blob(p, (i ? 10 : -12), CY - 14 - a * 40, 5 * k, VOIDC[3], VOIDC[4]); }
      const s = pop(t, IN, 0.08) * shrink(t, IN + 0.08, IN + 0.28); if (s > 0) star(p, 0, CY - 10, 15 * s, VOIDC[5]);
    },
  };
}
