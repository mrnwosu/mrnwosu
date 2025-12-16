"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FloatingOrbs } from "@components/FloatingOrbs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative min-h-screen bg-warm-950 overflow-hidden">
      <FloatingOrbs />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <motion.h1
            className="font-gravitas text-5xl text-warm-100 sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Oops!
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
            Something went wrong
          </motion.h2>
          <motion.p
            className="mx-auto mb-6 max-w-sm text-sm text-warm-300 sm:mb-8 sm:max-w-md sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            An unexpected error occurred. Don&apos;t worry, these things happen.
          </motion.p>
          <motion.div
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.button
              onClick={reset}
              className="w-full rounded-lg bg-warm-500 px-5 py-2 text-sm font-medium text-warm-950 transition hover:bg-warm-400 sm:w-auto sm:px-6 sm:py-2.5 sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="inline-block w-full rounded-lg border border-warm-500 px-5 py-2 text-sm font-medium text-warm-100 transition hover:bg-warm-500/10 sm:w-auto sm:px-6 sm:py-2.5 sm:text-base"
              >
                Go Home
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
