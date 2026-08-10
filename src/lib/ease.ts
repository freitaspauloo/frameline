import type { Transition, Variants } from "motion/react";

// Shared motion tokens from beUI (https://beui.dev/docs/motion-patterns).
// Easing curves mirror the CSS custom properties in globals.css.

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

/** CSS string form of EASE_OUT for inline style / Tailwind transitions. */
export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";
export const EASE_IN_OUT_CSS = "cubic-bezier(0.77, 0, 0.175, 1)";
export const EASE_DRAWER_CSS = "cubic-bezier(0.32, 0.72, 0, 1)";

/** Press feedback on buttons and other tappable surfaces. */
export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const satisfies Transition;

/** Content swaps — label/icon slots trading places inside a control. */
export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const satisfies Transition;

/** Overlay panel entrances — modals and sheets summoned by pointer. */
export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const satisfies Transition;

/** Shared-layout glides — pills, indicators and panels morphing between positions. */
export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const satisfies Transition;

/** Expanding compact controls that keep surface identity (layout continuity). */
export const CONTINUITY_SPRING = {
  type: "spring",
  stiffness: 220,
  damping: 17,
  mass: 0.85,
} as const satisfies Transition;

/** Label enter/exit while a continuity surface expands. */
export const CONTINUITY_LABEL = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
} as const satisfies Variants;

/** Cursor-follow physics for decorative mouse tracking (magnetic, tilt, dock). */
export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

/** Dragged handles and fills — critically damped, no rebound. */
export const SPRING_GLIDE = {
  stiffness: 700,
  damping: 50,
  mass: 0.5,
} as const;

/** Duration tokens (seconds) aligned to beUI interaction ranges. */
export const DURATION = {
  press: 0.14,
  tooltip: 0.16,
  dropdown: 0.2,
  modal: 0.28,
  reveal: 0.22,
  swapIn: 0.18,
  swapOut: 0.12,
  icon: 0.28,
} as const;

export const REVEAL_TRANSITION = {
  duration: DURATION.reveal,
  ease: EASE_OUT,
} as const satisfies Transition;

export const SWAP_TRANSITION = {
  duration: DURATION.swapIn,
  ease: EASE_OUT,
} as const satisfies Transition;

export const SWAP_EXIT_TRANSITION = {
  duration: DURATION.swapOut,
  ease: EASE_OUT,
} as const satisfies Transition;
