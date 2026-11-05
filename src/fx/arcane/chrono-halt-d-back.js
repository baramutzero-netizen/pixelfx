// chrono-halt-d 의 몸 뒤 · 바닥 층 절반 (1103 스물여덟째 — 데포르메 판 표시 순서) — 게임은 바닥 층(유닛 아래)에 놓는다.
import * as B from "./chrono-halt-d.js";

export const meta = { ...B.meta, name: "Chrono halt (chunky) — back", desc: "The back half of chrono-halt-d (see that effect): what is drawn behind the units, so the host can layer it.", tags: [...B.meta.tags, "back"], options: { ...B.meta.options, part: "back" } };
export const create = (o) => B.create(o);
