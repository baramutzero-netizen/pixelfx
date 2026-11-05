// benediction-d 의 몸 앞 절반 (1103 스물여덟째 — 사용자 '데포르메는 각 효과의 표시 순서가 좀 바뀌어야할듯') — 게임은 유닛 위 층에 놓는다.
import * as B from "./benediction-d.js";

export const meta = { ...B.meta, name: "Benediction (chunky) — front", desc: "The front half of benediction-d (see that effect): what is drawn in front of the body, so the host can layer it.", tags: [...B.meta.tags, "front"], options: { ...B.meta.options, part: "front" } };
export const create = (o) => B.create(o);
