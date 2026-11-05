// unseal-d 의 몸 뒤 · 바닥 층 절반 (1105 첫째) — 게임은 바닥 층(유닛 아래)에 놓는다.
import * as B from "./unseal-d.js";

export const meta = { ...B.meta, name: "Unseal (chunky) — back", desc: "The back half of unseal-d (see that effect): what is drawn behind the body, so the host can layer it.", tags: [...B.meta.tags, "back"], options: { ...B.meta.options, part: "back" } };
export const create = (o) => B.create(o);
