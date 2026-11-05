// water-fang-d 의 몸 앞 절반 (1105 다섯째) — 게임은 유닛 위 층에 놓는다.
import * as B from "./water-fang-d.js";

export const meta = { ...B.meta, name: B.meta.name + " — front", desc: "The front half of water-fang-d (see that effect): what is drawn in front of the body, so the host can layer it.", tags: [...B.meta.tags, "front"], options: { ...B.meta.options, part: "front" } };
export const create = (o) => B.create(o);
