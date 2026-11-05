// overcharge-d 의 몸 뒤 · 바닥 층 절반 (1105 둘째 — 사용자 '마력 과충전 데포르메 버전이 전체가 안보이네') — 게임은 바닥 층(유닛 아래)에 놓는다.
import * as B from "./overcharge-d.js";

export const meta = { ...B.meta, name: "Overcharge (chunky) — back", desc: "The back half of overcharge-d (see that effect): what is drawn behind the body, so the host can layer it.", tags: [...B.meta.tags, "back"], options: { ...B.meta.options, part: "back" } };
export const create = (o) => B.create(o);
