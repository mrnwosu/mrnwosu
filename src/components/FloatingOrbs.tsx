"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface Orb {
  id: number;
  size: number;
  mobileSize: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  showOnMobile: boolean;
}

const orbs: Orb[] = [
  { id: 1, size: 300, mobileSize: 150, x: 10, y: 20, duration: 20, delay: 0, showOnMobile: true },
  { id: 2, size: 200, mobileSize: 120, x: 80, y: 60, duration: 25, delay: 2, showOnMobile: true },
  { id: 3, size: 250, mobileSize: 130, x: 50, y: 80, duration: 22, delay: 4, showOnMobile: false },
  { id: 4, size: 180, mobileSize: 100, x: 20, y: 70, duration: 28, delay: 1, showOnMobile: false },
  { id: 5, size: 220, mobileSize: 110, x: 70, y: 30, duration: 24, delay: 3, showOnMobile: true },
];

export function FloatingOrbs() {
  const prefersReducedMotion: boolean = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  const visibleOrbs = isMobile ? orbs.filter((orb) => orb.showOnMobile) : orbs;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {visibleOrbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: isMobile ? orb.mobileSize : orb.size,
            height: isMobile ? orb.mobileSize : orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, rgba(168, 131, 100, 0.4) 0%, rgba(168, 131, 100, 0) 70%)`,
          }}
          animate={{
            x: isMobile ? [0, 15, -10, 5, 0] : [0, 30, -20, 10, 0],
            y: isMobile ? [0, -10, 15, -5, 0] : [0, -20, 30, -10, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
