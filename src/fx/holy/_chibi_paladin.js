// The 용사 학원 팔라딘 데포르메(-d) effects' shapes and colours — the shared chunky shapes (../arcane/_chibi_wizard.js) plus paladin gold and heal green.
// Files starting with _ are helpers, not effects.
import { hex } from "../../core/index.js";
export * from "../arcane/_chibi_wizard.js";
/** Paladin gold, dark to bright. */
export const PGOLD = ["#3b1d2a", "#7a3a2c", "#c4652e", "#f0a040", "#ffd25e", "#fff0a0", "#fffbe0", "#ffffff"].map(hex);
/** Heal green, dark to bright. */
export const PGREEN = ["#0e2a24", "#1d6e3a", "#2f9a45", "#5cc654", "#a0e46c", "#dcffb4"].map(hex);
/** Ward steel blue, dark to bright. */
export const STEEL = ["#1a2236", "#2e3c5c", "#4a6088", "#7090b8", "#a4c0e0", "#dcecff"].map(hex);
