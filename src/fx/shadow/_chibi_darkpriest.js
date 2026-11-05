// The 용사 학원 암흑사제 데포르메(-d) effects' shapes and colours — the shared chunky shapes (../arcane/_chibi_wizard.js) plus void violet and blood.
// Files starting with _ are helpers, not effects.
import { hex } from "../../core/index.js";
export * from "../arcane/_chibi_wizard.js";
/** Void violet, dark to bright. */
export const VOIDC = ["#06040b", "#150c26", "#2a1150", "#461a84", "#6f2cc0", "#9d5cec", "#cfa6ff", "#f6eaff"].map(hex);
/** Blood, dark to bright. */
export const BLOODC = ["#2a0810", "#5a1020", "#9a1a2c", "#d0283a", "#f05a5a", "#ffa8a0", "#ffe0dc"].map(hex);
