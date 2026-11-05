// beast-form-d 의 몸 앞 (고리 · 할퀴기 · 잎) (1103 스물여덟째 — 데포르메 표시 순서) — 게임은 유닛 위 층에 놓는다.
import * as B from "./beast-form-d.js";

export const meta = { ...B.meta, name: "Beast form (chunky) — front", desc: "The front half of beast-form-d (see that effect): what is drawn in front of the body, so the host can layer it.", tags: [...B.meta.tags, "front"], options: { ...B.meta.options, part: "front" } };
export const create = (o) => B.create(o);
