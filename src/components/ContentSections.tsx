"use client";

import dynamic from "next/dynamic";
import { memo, useState, useEffect } from "react";
import { FadeInSection } from "@components/FadeInSection";
import { TechBadge } from "@components/TechBadge";

// Dynamic imports for components that are below the fold
const TiltCard = dynamic(() => import("@components/TiltCard").then((m) => ({ default: m.TiltCard })), {
  ssr: true,
});

const TextReveal = dynamic(() => import("@components/TextReveal").then((m) => ({ default: m.TextReveal })), {
  ssr: true,
});

const AnimatedUnderline = dynamic(
  () => import("@components/AnimatedUnderline").then((m) => ({ default: m.AnimatedUnderline })),
  { ssr: true }
);

const AnimatedCounter = dynamic(
  () => import("@components/AnimatedCounter").then((m) => ({ default: m.AnimatedCounter })),
  { ssr: true }
);

const GlowingBadge = dynamic(() => import("@components/GlowingBadge").then((m) => ({ default: m.GlowingBadge })), {
  ssr: true,
});

// Static data - defined once, never re-created
const techBadges = {
  backend: [".NET", "C#", "Azure", "SQL"],
  frontend: ["React", "Angular", "TypeScript", "JavaScript"],
  cloud: ["Azure", "GCP", "CI/CD", "DevOps"],
} as const;

const raceBadges = ["Savage Race", "Spartan Race", "5K", "8K", "10K", "Marathon (2025)"] as const;

const cyclingWords = ["tinkering", "learning", "building"] as const;

function CyclingWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % cyclingWords.length);
        setIsAnimating(false);
      }, 300);
    }, 1750);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        isAnimating
          ? "translate-y-1 opacity-0 blur-sm"
          : "translate-y-0 opacity-100 blur-0"
      }`}
    >
      {cyclingWords[wordIndex]}
    </span>
  );
}

function ContentSectionsComponent() {
  return (
    <>
      {/* About Section */}
      <section className="relative py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 relative z-10">
          <FadeInSection direction="up">
            <h2 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4">
              <TextReveal>About Me</TextReveal>
            </h2>
            <AnimatedUnderline className="w-16 mb-8 sm:w-24 sm:mb-12" />
          </FadeInSection>

          <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-24">
            <FadeInSection direction="left" delay={100}>
              <p className="text-base text-warm-200 leading-relaxed sm:text-lg md:text-xl">
                I love building things with code. There&apos;s something deeply satisfying
                about turning an idea into something real—whether it&apos;s a side project,
                a tool that solves a problem, or just experimenting with new tech to see
                what&apos;s possible.
              </p>
            </FadeInSection>

            <FadeInSection direction="right" delay={200}>
              <p className="text-base text-warm-200 leading-relaxed sm:text-lg md:text-xl">
                Beyond the keyboard, I believe in pushing limits—both mentally and
                physically. Whether it&apos;s diving deep into a coding problem or training
                for the next race, I bring the same curiosity and determination to
                everything I do.
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Software Engineering Section */}
      <section className="relative py-16 sm:py-24 md:py-32 lg:py-40 bg-warm-900/50 overflow-hidden content-auto">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 relative z-10">
          <FadeInSection direction="right">
            <h2 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4">
              <TextReveal>Engineering</TextReveal>
            </h2>
            <AnimatedUnderline className="w-16 mb-8 sm:w-24 sm:mb-12" delay={200} />
          </FadeInSection>

          <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1000px" }}>
            <FadeInSection direction="left" delay={100}>
              <TiltCard className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-warm-800/50 border border-warm-700/30 h-full backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-warm-100 mb-3 sm:text-xl sm:mb-4">
                  Backend Development
                </h3>
                <p className="text-sm text-warm-300 mb-3 sm:text-base sm:mb-4">
                  I enjoy building APIs and backend systems—there&apos;s a certain elegance to well-structured server code.
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {techBadges.backend.map((tech, index) => (
                    <TechBadge key={tech} tech={tech} index={index} />
                  ))}
                </div>
              </TiltCard>
            </FadeInSection>

            <FadeInSection direction="up" delay={200}>
              <TiltCard className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-warm-800/50 border border-warm-700/30 h-full backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-warm-100 mb-3 sm:text-xl sm:mb-4">
                  Frontend Development
                </h3>
                <p className="text-sm text-warm-300 mb-3 sm:text-base sm:mb-4">
                  I love bringing ideas to life visually—making interfaces that feel good to use.
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {techBadges.frontend.map((tech, index) => (
                    <TechBadge key={tech} tech={tech} index={index} />
                  ))}
                </div>
              </TiltCard>
            </FadeInSection>

            <FadeInSection direction="right" delay={300}>
              <TiltCard className="p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-warm-800/50 border border-warm-700/30 h-full sm:col-span-2 lg:col-span-1 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-warm-100 mb-3 sm:text-xl sm:mb-4">
                  Cloud & Infrastructure
                </h3>
                <p className="text-sm text-warm-300 mb-3 sm:text-base sm:mb-4">
                  Cloud platforms and DevOps fascinate me—I like understanding how things run at scale.
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {techBadges.cloud.map((tech, index) => (
                    <TechBadge key={tech} tech={tech} index={index} />
                  ))}
                </div>
              </TiltCard>
            </FadeInSection>
          </div>

          <FadeInSection direction="up" delay={400}>
            <div className="mt-10 sm:mt-16 text-center">
              <p className="text-warm-400 text-base sm:text-lg">
                <AnimatedCounter value={10} suffix="+" /> years of <CyclingWord />.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Fitness Section */}
      <section className="relative py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden content-auto">
        <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 relative z-10">
          <FadeInSection direction="left">
            <h2 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4">
              <TextReveal>Fitness</TextReveal>
            </h2>
            <AnimatedUnderline className="w-16 mb-8 sm:w-24 sm:mb-12" delay={200} />
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
                  {raceBadges.map((race, index) => (
                    <GlowingBadge key={race} delay={index * 100}>
                      {race}
                    </GlowingBadge>
                  ))}
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
              <p className="font-gravitas text-xl text-warm-100 sm:text-2xl hover:scale-105 transition-transform">
                Mr. Nwosu
              </p>
              <p className="text-sm text-warm-400 sm:text-base">Software Engineer • Athlete</p>
            </div>
          </FadeInSection>
        </div>
      </footer>
    </>
  );
}

export const ContentSections = memo(ContentSectionsComponent);
