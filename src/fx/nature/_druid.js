// Shared by the 용사 학원 드루이드 effects: the forest, amber and spore ramps.
// Files starting with _ are helpers, not effects.
/** Forest green, dark to bright: pine shadow, moss, leaf, spring green, lime, pale lime, cream. */
export const FOREST = ["#0a1a10", "#123420", "#1e5428", "#2f7a32", "#4ea23c", "#86cc52", "#c6ee88", "#f4ffd6"];
/** Amber of the beast spirit, dark to bright. */
export const AMBER = ["#2a1606", "#5a300c", "#94561a", "#d08a2a", "#f4b64a", "#ffdc8a", "#fff4d0", "#ffffff"];
/** Poison spores: deep violet-green to sickly lime. */
export const SPORE = ["#1a1024", "#2e1a3a", "#4a2a52", "#5e4a3a", "#7a8a2a", "#a8c83a", "#d8f070"];
/** Bark and root, dark to light. */
export const BARK = ["#140c08", "#2a180e", "#4a2c16", "#6a4220", "#8e5c2e", "#b47e44", "#d8a868"];
/** Leaf colours for drawLeaf: [dark, shade, body, light]. */
export const LEAF = (C) => [C[1], C[2], C[4], C[5]];
