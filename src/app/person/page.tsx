"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

export default function PersonPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track mouse position for parallax effects
  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMounted]);

  const cards = [
    {
      id: "blog",
      title: "Blog",
      description: "Thoughts, ideas, and technical insights",
      icon: "✍️",
      href: "/blog",
    },
    {
      id: "contact",
      title: "Get in Touch",
      description: "Let's collaborate or just say hello",
      icon: "💬",
      href: "/contact",
    },
    {
      id: "github",
      title: "GitHub",
      description: "Check out my projects and contributions",
      icon: "🐙",
      href: "https://github.com",
      target: "_blank",
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      description: "Professional profile and experience",
      icon: "💼",
      href: "https://linkedin.com",
      target: "_blank",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-warm-950"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-900 via-warm-950 to-warm-900" />

      {/* Floating background elements */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(184, 160, 122, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(184, 160, 122, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(184, 160, 122, 0.05) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-16 sm:px-6 sm:py-24 md:py-32 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="mx-auto mb-12 max-w-4xl text-center sm:mb-16 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Profile Image */}
          <motion.div
            className="mb-6 flex justify-center sm:mb-8"
            animate={{
              y: Math.sin(mousePosition.x * 10) * 10,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-warm-500/50 shadow-2xl shadow-warm-500/20 sm:h-32 sm:w-32">
              <Image
                src="/IkeBday-5-transparent.png"
                alt="Ike Nwosu"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-warm-500/20 to-transparent" />
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Ike Nwosu
          </motion.h1>

          {/* Title */}
          <motion.p
            className="mb-4 text-lg text-warm-400 sm:text-xl md:text-2xl sm:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Software Engineer & Creative Developer
          </motion.p>

          {/* Bio */}
          <motion.p
            className="mx-auto max-w-2xl text-sm text-warm-300 sm:text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Crafting elegant solutions with modern web technologies. Passionate
            about building beautiful interfaces and meaningful user experiences.
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            className="mt-8 flex justify-center sm:mt-12"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-warm-500">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="mx-auto mb-12 max-w-6xl grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 sm:mb-16 md:mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              onMouseEnter={() => setIsHoveringCard(card.id)}
              onMouseLeave={() => setIsHoveringCard(null)}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative h-48 overflow-hidden rounded-xl sm:h-56 md:h-64"
            >
              {/* Card Border */}
              <div className="absolute inset-0 rounded-xl border border-warm-700/30 transition-colors duration-300 group-hover:border-warm-500/50" />

              {/* Card Content */}
              <div className="relative flex h-full flex-col justify-between bg-warm-800/50 p-5 backdrop-blur-sm sm:p-6">
                {/* Icon */}
                <motion.div
                  className="text-3xl sm:text-4xl"
                  animate={{
                    scale: isHoveringCard === card.id ? 1.2 : 1,
                    rotate: isHoveringCard === card.id ? 10 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {card.icon}
                </motion.div>

                {/* Text Content */}
                <div className="mt-auto">
                  <h3 className="mb-1 text-lg font-semibold text-warm-100 transition-colors duration-300 group-hover:text-warm-50 sm:mb-2 sm:text-xl">
                    {card.title}
                  </h3>
                  <p className="text-xs text-warm-400 transition-colors duration-300 group-hover:text-warm-300 sm:text-sm">
                    {card.description}
                  </p>
                </div>

                {/* Link Arrow */}
                <motion.div
                  className="absolute top-4 right-4 text-warm-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  animate={{
                    x: isHoveringCard === card.id ? 4 : 0,
                  }}
                >
                  →
                </motion.div>
              </div>

              {/* Card Link */}
              <Link
                href={card.href}
                target={card.target}
                rel={card.target === "_blank" ? "noopener noreferrer" : ""}
                className="absolute inset-0"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Section */}
        <motion.section
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-gravitas text-2xl text-warm-100 sm:text-3xl mb-6 text-center sm:mb-8">
            Featured on the Blog
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Getting Started with Next.js",
                excerpt:
                  "A comprehensive guide to building modern web applications with Next.js 13",
                date: "Jan 15, 2024",
              },
              {
                title: "React Hooks Deep Dive",
                excerpt:
                  "Understanding React Hooks and how to use them effectively",
                date: "Jan 20, 2024",
              },
            ].map((post, idx) => (
              <motion.article
                key={idx}
                className="group rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 transition-all hover:border-warm-500/50 hover:bg-warm-800/70 sm:rounded-2xl sm:p-6"
                whileHover={{ x: 4 }}
              >
                <h3 className="mb-2 text-base font-semibold text-warm-100 group-hover:text-warm-50 sm:text-lg">
                  {post.title}
                </h3>
                <p className="mb-3 text-xs text-warm-300 sm:mb-4 sm:text-sm">{post.excerpt}</p>
                <time className="text-xs text-warm-500">{post.date}</time>
              </motion.article>
            ))}
          </div>

          <div className="mt-6 text-center sm:mt-8">
            <Link
              href="/blog"
              className="inline-block rounded-lg border border-warm-500 px-5 py-2.5 text-sm font-medium text-warm-400 transition-all hover:bg-warm-500/10 hover:text-warm-300 sm:px-6 sm:py-3"
            >
              Read all articles →
            </Link>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="mx-auto mt-12 max-w-4xl sm:mt-16 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Years Coding", value: "10+" },
              { label: "Projects Built", value: "50+" },
              { label: "Coffee Consumed", value: "∞" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-4 text-center sm:rounded-2xl sm:p-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xl font-bold text-warm-400 sm:text-2xl">
                  {stat.value}
                </div>
                <div className="text-xs text-warm-400 sm:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Cursor glow effect */}
      {isMounted && (
        <motion.div
          className="pointer-events-none fixed h-32 w-32 rounded-full bg-warm-500/10 blur-3xl"
          animate={{
            x: mousePosition.x * window.innerWidth - 64,
            y: mousePosition.y * window.innerHeight - 64,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      )}
    </div>
  );
}
