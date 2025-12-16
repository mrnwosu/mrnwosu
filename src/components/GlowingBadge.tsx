"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface GlowingBadgeProps {
  children: React.ReactNode;
  delay?: number;
}

export function GlowingBadge({ children, delay = 0 }: GlowingBadgeProps) {
  const prefersReducedMotion: boolean = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <span className="px-3 py-1.5 text-xs rounded-full border border-warm-500/50 text-warm-300 sm:px-4 sm:py-2 sm:text-sm">
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className="relative px-3 py-1.5 text-xs rounded-full border border-warm-500/50 text-warm-300 sm:px-4 sm:py-2 sm:text-sm overflow-hidden group cursor-default"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      whileHover={{
        borderColor: "rgba(168, 131, 100, 0.8)",
        color: "rgb(245, 234, 225)",
        scale: 1.05,
      }}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-warm-500/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );
}
