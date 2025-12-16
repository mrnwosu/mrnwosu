"use client";

import { useScrollAnimation } from "../hooks/useScrollAnimation";
import type { ReactNode } from "react";

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}

export function FadeInSection({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: FadeInSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.15 });

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";
    switch (direction) {
      case "left":
        return "translate3d(48px, 0, 0)";
      case "right":
        return "translate3d(-48px, 0, 0)";
      case "up":
        return "translate3d(0, 48px, 0)";
      case "down":
        return "translate3d(0, -48px, 0)";
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
