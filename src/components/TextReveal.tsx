"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotionContext } from "../contexts/ReducedMotionContext";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export function TextReveal({
  children,
  className = "",
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotionContext();

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  const words = children.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
              delay: delay / 1000 + index * 0.05,
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}
