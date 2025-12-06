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
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      id: "contact",
      title: "Get in Touch",
      description: "Let's collaborate or just say hello",
      icon: "💬",
      href: "#contact",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "github",
      title: "GitHub",
      description: "Check out my projects and contributions",
      icon: "🐙",
      href: "https://github.com",
      target: "_blank",
      gradient: "from-gray-600 to-gray-800",
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      description: "Professional profile and experience",
      icon: "💼",
      href: "https://linkedin.com",
      target: "_blank",
      gradient: "from-blue-600 to-blue-800",
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
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Floating background elements */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-20 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="mx-auto mb-20 max-w-4xl text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Profile Image */}
          <motion.div
            className="mb-8 flex justify-center"
            animate={{
              y: Math.sin(mousePosition.x * 10) * 10,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-cyan-500/50 shadow-2xl shadow-cyan-500/20">
              <Image
                src="/IkeBday-5-transparent.png"
                alt="Ike Nwosu"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent" />
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            className="mb-2 text-5xl font-bold text-white sm:text-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Ike Nwosu
          </motion.h1>

          {/* Title */}
          <motion.p
            className="mb-6 text-xl text-cyan-400 sm:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Software Engineer & Creative Developer
          </motion.p>

          {/* Bio */}
          <motion.p
            className="mx-auto max-w-2xl text-gray-300 sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Crafting elegant solutions with modern web technologies. Passionate
            about building beautiful interfaces and meaningful user experiences.
          </motion.p>

          {/* Scroll Indicator */}
          <motion.div
            className="mt-12 flex justify-center"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-gray-500">
              <svg
                className="h-6 w-6"
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
          className="mx-auto mb-20 max-w-6xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
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
              className="group relative h-64 overflow-hidden rounded-xl"
            >
              {/* Card Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-20`}
              />

              {/* Card Border */}
              <div className="absolute inset-0 rounded-xl border border-gray-700 transition-colors duration-300 group-hover:border-cyan-500/50" />

              {/* Card Content */}
              <div className="relative flex h-full flex-col justify-between bg-gradient-to-br from-gray-900/80 to-black/80 p-6 backdrop-blur-sm">
                {/* Icon */}
                <motion.div
                  className="text-4xl"
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
                  <h3 className="mb-2 text-xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-400">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                    {card.description}
                  </p>
                </div>

                {/* Link Arrow */}
                <motion.div
                  className="absolute top-4 right-4 text-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  animate={{
                    x: isHoveringCard === card.id ? 4 : 0,
                  }}
                >
                  →
                </motion.div>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 rounded-xl" />
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
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
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
                className="group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
                whileHover={{ x: 4 }}
              >
                <h3 className="mb-2 font-bold text-white group-hover:text-cyan-400">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm text-gray-400">{post.excerpt}</p>
                <time className="text-xs text-gray-500">{post.date}</time>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-block rounded-lg border border-cyan-500 px-6 py-3 font-medium text-cyan-400 transition-all hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              Read all articles →
            </Link>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="mx-auto mt-20 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
            {[
              { label: "Years Coding", value: "5+" },
              { label: "Projects Built", value: "20+" },
              { label: "Coffee Consumed", value: "∞" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-cyan-400">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 sm:text-sm">
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
          className="pointer-events-none fixed h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl"
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
