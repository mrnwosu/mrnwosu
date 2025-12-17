"use client";

import { memo } from "react";

interface TechBadgeProps {
  tech: string;
  index: number;
}

// Use CSS animations instead of motion.span with whileInView for each badge
// This reduces JavaScript overhead significantly
function TechBadgeComponent({ tech, index }: TechBadgeProps) {
  return (
    <span
      className="tech-badge px-2.5 py-1 text-xs rounded-full bg-warm-700/50 text-warm-200 sm:px-3 sm:text-sm opacity-0 animate-fade-in-scale hover:scale-110 hover:bg-warm-600/50 transition-transform"
      style={{ animationDelay: `${0.3 + index * 0.1}s` }}
    >
      {tech}
    </span>
  );
}

export const TechBadge = memo(TechBadgeComponent);
