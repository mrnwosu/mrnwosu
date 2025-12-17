"use client";

import { useState, useEffect, memo } from "react";
import { useReducedMotionContext } from "../contexts/ReducedMotionContext";

// Static orb configurations
const orbs = [
  { id: 1, size: 300, mobileSize: 150, x: 10, y: 20, duration: 20, delay: 0, showOnMobile: true },
  { id: 2, size: 200, mobileSize: 120, x: 80, y: 60, duration: 25, delay: 2, showOnMobile: true },
  { id: 3, size: 250, mobileSize: 130, x: 50, y: 80, duration: 22, delay: 4, showOnMobile: false },
  { id: 4, size: 180, mobileSize: 100, x: 20, y: 70, duration: 28, delay: 1, showOnMobile: false },
  { id: 5, size: 220, mobileSize: 110, x: 70, y: 30, duration: 24, delay: 3, showOnMobile: true },
] as const;

// Pure CSS animations - no motion library needed for simple infinite loops
function FloatingOrbsBackgroundComponent() {
  const prefersReducedMotion = useReducedMotionContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  const visibleOrbs = isMobile ? orbs.filter((orb) => orb.showOnMobile) : orbs;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {visibleOrbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full blur-3xl opacity-20 animate-float-orb"
          style={{
            width: isMobile ? orb.mobileSize : orb.size,
            height: isMobile ? orb.mobileSize : orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, rgba(168, 131, 100, 0.4) 0%, rgba(168, 131, 100, 0) 70%)`,
            animationDuration: `${orb.duration}s`,
            animationDelay: `${orb.delay}s`,
            // Vary animation slightly per orb using custom properties
            "--float-x": isMobile ? "15px" : "30px",
            "--float-y": isMobile ? "15px" : "30px",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export const FloatingOrbsBackground = memo(FloatingOrbsBackgroundComponent);
