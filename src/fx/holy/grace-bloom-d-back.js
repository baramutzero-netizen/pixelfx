// grace-bloom-d 의 몸 뒤 · 바닥 층 절반 (1103 스물여덟째 — 사용자 '데포르메는 각 효과의 표시 순서가 좀 바뀌어야할듯') — 게임은 바닥 층(유닛 아래)에 놓는다.
import * as B from "./grace-bloom-d.js";

export const meta = { ...B.meta, name: "Grace bloom (chunky) — back", desc: "The back half of grace-bloom-d (see that effect): what is drawn behind the body, so the host can layer it.", tags: [...B.meta.tags, "back"], options: { ...B.meta.options, part: "back" } };
export const create = (o) => B.create(o);
