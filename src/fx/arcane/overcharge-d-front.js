// overcharge-d 의 몸 앞 절반 (1105 둘째 — 사용자 '마력 과충전 데포르메 버전이 전체가 안보이네') — 게임은 유닛 위 층에 놓는다.
import * as B from "./overcharge-d.js";

export const meta = { ...B.meta, name: "Overcharge (chunky) — front", desc: "The front half of overcharge-d (see that effect): what is drawn in front of the body, so the host can layer it.", tags: [...B.meta.tags, "front"], options: { ...B.meta.options, part: "front" } };
export const create = (o) => B.create(o);
