"use client";

import Image from "next/image";
import { useParallax } from "../hooks/useParallax";
import { useState, useEffect, useCallback, memo } from "react";
import { isLoadingCompleted } from "@utils/uiHelpers";

const titles = [
  "Software Engineer",
  "Brogrammer",
  "Gym Rat",
  "Code Whisperer",
  "Obstacle Crusher",
  "Bug Exterminator",
  "Iron Addict",
  "Stack Overflow Survivor",
  "Protein Enthusiast",
  "Keyboard Warrior",
] as const;

function HeroSectionComponent() {
  const parallaxOffset = useParallax(0.4);
  const textOffset = parallaxOffset * 0.5; // Derive text parallax from hero (saves a hook)

  const [titleIndex, setTitleIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollCtaBounce, setScrollCtaBounce] = useState(false);
  const [skipLoadingAnimation] = useState(() => isLoadingCompleted());

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll CTA bounce timer
  useEffect(() => {
    const bounceTimer = setTimeout(() => {
      setScrollCtaBounce(true);
      setTimeout(() => setScrollCtaBounce(false), 600);
    }, 2800);
    return () => clearTimeout(bounceTimer);
  }, []);

  // Title cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % titles.length);
        setIsAnimating(false);
      }, 300);
    }, 1750);
    return () => clearInterval(interval);
  }, []);

  const handleScrollClick = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  const heroTransform = `translateY(${parallaxOffset - 50}px)`;
  const textTransform = `translateY(${textOffset}px)`;
  const scaleClass = isAnimating ? "scale-[1.01]" : "scale-100";
  const slideInClass = skipLoadingAnimation ? "" : "-translate-x-24 opacity-0";
  const ctaSlideClass = skipLoadingAnimation ? "" : "-translate-y-8 opacity-0";

  return (
    <section className="relative h-[100svh] min-h-[500px] w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute -inset-4 sm:-inset-8 md:-inset-12"
        style={{ transform: heroTransform, willChange: "transform" }}
      >
        <Image
          src="/winner.webp"
          alt="Mr. Nwosu"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-950/50 via-warm-950/20 to-warm-950 sm:from-warm-950/30 sm:via-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-warm-950 to-transparent sm:h-40" />
      </div>

      {/* Hero Text with Parallax */}
      <div
        className="absolute inset-0 flex items-end pb-24 sm:items-center sm:pb-0"
        style={{ transform: textTransform, willChange: "transform" }}
      >
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
            <div className={`slide-in-right transition duration-1500 ${slideInClass}`}>
              <p className={`font-gravitas text-4xl text-warm-100 sm:text-5xl md:text-7xl lg:text-8xl transition-transform duration-300 ${scaleClass}`}>
                Mr.
              </p>
              <p className={`font-gravitas text-4xl bg-gradient-to-r from-warm-100 via-warm-300 to-warm-100 bg-clip-text text-transparent sm:text-5xl md:text-7xl lg:text-8xl transition-transform duration-300 ${scaleClass}`}>
                Nwosu
              </p>
              <div className="my-2 h-0.5 w-24 rounded-full bg-gradient-to-r from-warm-600 via-warm-400 to-warm-500 sm:my-3 sm:h-1 sm:w-32 md:w-48 lg:w-64" />
              <div className="h-7 overflow-hidden sm:h-8 md:h-10 lg:h-12">
                <p
                  className={`text-sm tracking-wider text-warm-300 sm:text-lg sm:tracking-widest md:text-xl lg:text-2xl transition-all duration-300 ${
                    isAnimating
                      ? "translate-y-4 opacity-0 blur-sm"
                      : "translate-y-0 opacity-100 blur-0"
                  }`}
                >
                  {titles[titleIndex]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll CTA */}
      <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 slide-in-right transition duration-1500 delay-700 sm:bottom-8 ${ctaSlideClass}`}>
        <button
          onClick={handleScrollClick}
          className={`group flex flex-col items-center gap-2 text-warm-300 hover:text-warm-100 transition-all cursor-pointer ${
            scrollCtaBounce ? "scale-125" : "scale-100"
          }`}
          style={{ transition: scrollCtaBounce ? "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" : "transform 0.2s ease-out, color 0.15s" }}
        >
          <span className="text-xs tracking-widest uppercase sm:text-sm">Scroll</span>
          <div className={`relative h-10 w-6 rounded-full border border-warm-400 group-hover:border-warm-300 transition-colors sm:h-12 sm:w-7 ${
            scrollCtaBounce ? "border-warm-200" : ""
          }`}>
            <div className="absolute left-1/2 top-2 h-2 w-0.5 -translate-x-1/2 rounded-full bg-warm-400 animate-bounce group-hover:bg-warm-300 transition-colors" />
          </div>
        </button>
      </div>
    </section>
  );
}

export const HeroSection = memo(HeroSectionComponent);
