"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";

import { useHoverCapable } from "@/hooks/use-hover-capable";
import {
  CONTINUITY_LABEL,
  CONTINUITY_SPRING,
  DURATION,
  EASE_OUT,
  REVEAL_TRANSITION,
  SPRING_PRESS,
  SWAP_EXIT_TRANSITION,
  SWAP_TRANSITION,
} from "@/lib/ease";
import { cn } from "@/lib/utils";

type MotionDivProps = HTMLMotionProps<"div">;
type MotionSpanProps = HTMLMotionProps<"span">;
type MotionButtonProps = HTMLMotionProps<"button">;

/** Press feedback — small scale with SPRING_PRESS. */
export function Pressable({
  className,
  pressScale = 0.97,
  hoverScale = 1.02,
  children,
  ...props
}: MotionButtonProps & {
  pressScale?: number;
  hoverScale?: number;
}) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();

  return (
    <motion.button
      type="button"
      whileTap={reduce ? undefined : { scale: pressScale }}
      whileHover={reduce || !canHover ? undefined : { scale: hoverScale }}
      transition={SPRING_PRESS}
      className={cn("select-none", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Content reveal — short lift + restrained blur. */
export function ContentReveal({
  className,
  children,
  delay = 0,
  ...props
}: MotionDivProps & { delay?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: reduce ? 0 : 8,
        filter: reduce ? "none" : "blur(4px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{ ...REVEAL_TRANSITION, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Content swap — old content leaves faster than the new arrives. */
export function ContentSwap({
  id,
  className,
  children,
  mode = "wait",
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
  mode?: "sync" | "wait" | "popLayout";
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode={mode} initial={false}>
      <motion.div
        key={id}
        className={className}
        initial={{
          opacity: 0,
          y: reduce ? 0 : 4,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: reduce ? 0 : -4,
          transition: SWAP_EXIT_TRANSITION,
        }}
        transition={SWAP_TRANSITION}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Layout continuity shell — shared surface that expands/contracts. */
export function ContinuityRoot({
  className,
  children,
  ...props
}: MotionDivProps) {
  return (
    <motion.div
      layout
      transition={CONTINUITY_SPRING}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ContinuityButton({
  className,
  children,
  ...props
}: MotionButtonProps) {
  return (
    <motion.button
      type="button"
      layout
      transition={CONTINUITY_SPRING}
      className={cn("inline-flex items-center gap-2 select-none", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function ContinuityLabel({
  className,
  children,
  show,
  ...props
}: MotionSpanProps & { show: boolean }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {show ? (
        <motion.span
          layout
          variants={CONTINUITY_LABEL}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={CONTINUITY_SPRING}
          className={className}
          {...props}
        >
          {children}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

/** Semantic icon motion — imitate the action (hover-only, reduced-motion safe). */
export function SemanticIcon({
  className,
  active = false,
  origin = "top center",
  keyframes = [0, 12, -8, 4, 0],
  children,
  ...props
}: MotionSpanProps & {
  active?: boolean;
  origin?: string;
  keyframes?: number[];
}) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();

  return (
    <motion.span
      style={{ transformOrigin: origin }}
      animate={
        active && canHover && !reduce
          ? { rotate: keyframes }
          : { rotate: 0 }
      }
      transition={{ duration: DURATION.icon, ease: EASE_OUT }}
      className={cn("inline-flex", className)}
      {...props}
    >
      {children}
    </motion.span>
  );
}
