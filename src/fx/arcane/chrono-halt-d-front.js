// chrono-halt-d 의 몸 앞 절반 (1103 스물여덟째 — 데포르메 판 표시 순서) — 게임은 유닛 위 층에 놓는다.
import * as B from "./chrono-halt-d.js";

export const meta = { ...B.meta, name: "Chrono halt (chunky) — front", desc: "The front half of chrono-halt-d (see that effect): what is drawn in front of the units, so the host can layer it.", tags: [...B.meta.tags, "front"], options: { ...B.meta.options, part: "front" } };
export const create = (o) => B.create(o);
