import { HeroSection } from "@components/HeroSection";
import { ContentSections } from "@components/ContentSections";
import { FloatingOrbsBackground } from "@components/FloatingOrbsBackground";
import { ReducedMotionProvider } from "../contexts/ReducedMotionContext";

// Server Component - static shell with client islands
export default function Home() {
  return (
    <ReducedMotionProvider>
      <main className="relative bg-warm-950">
        {/* Single floating orbs instance for entire page (instead of 3 separate ones) */}
        <FloatingOrbsBackground />

        {/* Hero - critical, loads immediately with priority image */}
        <HeroSection />

        {/* Content sections - uses dynamic imports for below-fold components */}
        <ContentSections />
      </main>
    </ReducedMotionProvider>
  );
}
