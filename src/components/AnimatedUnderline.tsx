"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface AnimatedUnderlineProps {
  className?: string;
  delay?: number;
}

export function AnimatedUnderline({
  className = "",
  delay = 0,
}: AnimatedUnderlineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion: boolean = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div
        ref={ref}
        className={`h-0.5 rounded-full bg-warm-500 sm:h-1 ${className}`}
      />
    );
  }

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        className={`h-0.5 rounded-full bg-gradient-to-r from-warm-600 via-warm-400 to-warm-500 sm:h-1 ${className}`}
        initial={{ scaleX: 0, originX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
          delay: delay / 1000,
        }}
      />
    </div>
  );
}
