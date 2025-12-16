"use client";

import { useEffect, useRef, useState } from "react";

export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);
  const rafId = useRef<number | null>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const updateOffset = () => {
      setOffset(window.scrollY * speed);
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        rafId.current = requestAnimationFrame(updateOffset);
        ticking.current = true;
      }
    };

    // Set initial offset
    setOffset(window.scrollY * speed);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [speed]);

  return offset;
}
