"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { FloatingOrbs } from "@components/FloatingOrbs";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-warm-950 overflow-hidden">
      <FloatingOrbs />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <motion.h1
            className="font-gravitas text-7xl text-warm-100 sm:text-8xl md:text-9xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            404
          </motion.h1>
          <motion.div
            className="mx-auto my-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-warm-600 via-warm-400 to-warm-500 sm:my-6 sm:h-1 sm:w-32"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          />
          <motion.h2
            className="mb-2 text-lg text-warm-100 sm:mb-3 sm:text-xl md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Page Not Found
          </motion.h2>
          <motion.p
            className="mx-auto mb-6 max-w-sm text-sm text-warm-300 sm:mb-8 sm:max-w-md sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/"
              className="inline-block rounded-lg bg-warm-500 px-5 py-2 text-sm font-medium text-warm-950 transition hover:bg-warm-400 sm:px-6 sm:py-2.5 sm:text-base"
            >
              Go Home
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
