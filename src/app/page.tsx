"use client";

import Image from "next/image";
import { useParallax } from "../hooks/useParallax";
import { FadeInSection } from "@components/FadeInSection";
import { useState, useEffect } from "react";

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
];

export default function Home() {
  const heroParallax = useParallax(0.4);
  const textParallax = useParallax(0.2);
  const [titleIndex, setTitleIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setIsBouncing(true);
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % titles.length);
        setIsAnimating(false);
      }, 300);
      setTimeout(() => {
        setIsBouncing(false);
      }, 400);
    }, 1750);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative bg-warm-950">
      {/* Hero Section */}
      <section className="relative h-[100svh] min-h-[500px] w-full overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          className="absolute -inset-4 sm:-inset-8 md:-inset-12"
          style={{ transform: `translateY(${heroParallax - 50}px)` }}
        >
          <Image
            src="/winner.webp"
            alt="Mr. Nwosu"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
          {/* Gradient Overlay - stronger on mobile for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-warm-950/50 via-warm-950/20 to-warm-950 sm:from-warm-950/30 sm:via-transparent" />
          {/* Bottom fade into next section */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-warm-950 to-transparent sm:h-40" />
        </div>

        {/* Hero Text with Parallax */}
        <div
          className="absolute inset-0 flex items-end pb-24 sm:items-center sm:pb-0"
          style={{ transform: `translateY(${textParallax}px)` }}
        >
          <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="flex items-center gap-4 sm:gap-8 md:gap-12">
              {/* Text to the left */}
              <div className="slide-in-right -translate-x-24 opacity-0 transition duration-1500">
                <p
                  className={`font-gravitas text-4xl text-warm-100 sm:text-5xl md:text-7xl lg:text-8xl transition-all duration-200 ${
                    isBouncing ? "brightness-110" : "brightness-100"
                  }`}
                >
                  Mr.
                </p>
                <p
                  className={`font-gravitas text-4xl text-warm-100 sm:text-5xl md:text-7xl lg:text-8xl transition-all duration-200 ${
                    isBouncing ? "brightness-110" : "brightness-100"
                  }`}
                >
                  Nwosu
                </p>
                <div className="my-2 h-0.5 w-24 rounded-full bg-warm-400 sm:my-3 sm:h-1 sm:w-32 md:w-48 lg:w-64" />
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 slide-in-right -translate-y-8 opacity-0 transition duration-1500 delay-700 sm:bottom-8">
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            className="group flex flex-col items-center gap-2 text-warm-300 hover:text-warm-100 transition-colors cursor-pointer"
          >
            <span className="text-xs tracking-widest uppercase sm:text-sm">Scroll</span>
            <div className="relative h-10 w-6 rounded-full border border-warm-400 group-hover:border-warm-300 transition-colors sm:h-12 sm:w-7">
              <div className="absolute left-1/2 top-2 h-2 w-0.5 -translate-x-1/2 rounded-full bg-warm-400 animate-bounce group-hover:bg-warm-300 transition-colors" />
            </div>
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-16 sm:py-24 md:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
          <FadeInSection direction="up">
            <h2 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4">
              About Me
            </h2>
            <div className="h-0.5 w-16 rounded-full bg-warm-500 mb-8 sm:h-1 sm:w-24 sm:mb-12" />
          </FadeInSection>

          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-24">
            <FadeInSection direction="left" delay={100}>
              <p className="text-base text-warm-200 leading-relaxed sm:text-lg md:text-xl">
                A passionate software engineer with over a decade of experience building
                robust, scalable applications. I thrive at the intersection of clean code
                and practical solutions, always seeking to create software that makes a
                real impact.
              </p>
            </FadeInSection>

            <FadeInSection direction="right" delay={200}>
              <p className="text-base text-warm-200 leading-relaxed sm:text-lg md:text-xl">
                Beyond the keyboard, I believe in pushing limits—both mentally and
                physically. Whether it&apos;s architecting complex systems or training for
                the next race, I bring the same discipline and determination to
                everything I do.
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Software Engineering Section */}
      <section className="relative py-16 sm:py-24 md:py-32 lg:py-40 bg-warm-900/50">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
          <FadeInSection direction="right">
            <h2 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4">
              Engineering
            </h2>
            <div className="h-0.5 w-16 rounded-full bg-warm-500 mb-8 sm:h-1 sm:w-24 sm:mb-12" />
          </FadeInSection>

          <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FadeInSection direction="left" delay={100}>
              <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-warm-800/50 border border-warm-700/30 h-full">
                <h3 className="text-lg font-semibold text-warm-100 mb-3 sm:text-xl sm:mb-4">
                  Backend Development
                </h3>
                <p className="text-sm text-warm-300 mb-3 sm:text-base sm:mb-4">
                  Building scalable APIs and services with a focus on performance and maintainability.
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[".NET", "C#", "Azure", "SQL"].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs rounded-full bg-warm-700/50 text-warm-200 sm:px-3 sm:text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInSection>

            <FadeInSection direction="up" delay={200}>
              <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-warm-800/50 border border-warm-700/30 h-full">
                <h3 className="text-lg font-semibold text-warm-100 mb-3 sm:text-xl sm:mb-4">
                  Frontend Development
                </h3>
                <p className="text-sm text-warm-300 mb-3 sm:text-base sm:mb-4">
                  Crafting responsive, intuitive user interfaces that delight users.
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {["React", "Angular", "TypeScript", "JavaScript"].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs rounded-full bg-warm-700/50 text-warm-200 sm:px-3 sm:text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInSection>

            <FadeInSection direction="right" delay={300}>
              <div className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-warm-800/50 border border-warm-700/30 h-full sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-semibold text-warm-100 mb-3 sm:text-xl sm:mb-4">
                  Cloud & Infrastructure
                </h3>
                <p className="text-sm text-warm-300 mb-3 sm:text-base sm:mb-4">
                  Designing and deploying cloud-native solutions that scale with business needs.
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {["Azure", "GCP", "CI/CD", "DevOps"].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs rounded-full bg-warm-700/50 text-warm-200 sm:px-3 sm:text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </div>

          <FadeInSection direction="up" delay={400}>
            <div className="mt-10 sm:mt-16 text-center">
              <p className="text-warm-400 text-base sm:text-lg">
                10+ years of building software that matters
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Fitness Section */}
      <section className="relative py-16 sm:py-24 md:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
          <FadeInSection direction="left">
            <h2 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4">
              Fitness
            </h2>
            <div className="h-0.5 w-16 rounded-full bg-warm-500 mb-8 sm:h-1 sm:w-24 sm:mb-12" />
          </FadeInSection>

          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeInSection direction="left" delay={100}>
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl font-semibold text-warm-100 sm:text-2xl md:text-3xl">
                  Functional Strength
                </h3>
                <p className="text-base text-warm-200 leading-relaxed sm:text-lg">
                  I believe in being as strong as you can be while still being functional
                  enough to run, jump, and move freely. Fitness isn&apos;t about aesthetics
                  alone—it&apos;s about building a body that can handle whatever life throws at it.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection direction="right" delay={200}>
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl font-semibold text-warm-100 sm:text-2xl md:text-3xl">
                  Racing & Endurance
                </h3>
                <p className="text-base text-warm-200 leading-relaxed sm:text-lg">
                  From Savage Races and Spartan events to 5Ks, 8Ks, and 10Ks—I&apos;ve pushed
                  through obstacles and distances that test both body and mind. Next goal?
                  Running a marathon.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {["Savage Race", "Spartan Race", "5K", "8K", "10K", "Marathon (2025)"].map(
                    (race) => (
                      <span
                        key={race}
                        className="px-3 py-1.5 text-xs rounded-full border border-warm-500/50 text-warm-300 sm:px-4 sm:py-2 sm:text-sm"
                      >
                        {race}
                      </span>
                    )
                  )}
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-warm-800">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
          <FadeInSection direction="up">
            <div className="flex flex-col items-center gap-3 text-center sm:gap-4">
              <p className="font-gravitas text-xl text-warm-100 sm:text-2xl">Mr. Nwosu</p>
              <p className="text-sm text-warm-400 sm:text-base">Software Engineer • Athlete</p>
            </div>
          </FadeInSection>
        </div>
      </footer>
    </main>
  );
}
