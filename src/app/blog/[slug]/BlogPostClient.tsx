"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import type { BlogPost } from "@utils/blog";

interface BlogPostClientProps {
  post: BlogPost;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-warm-950">
      {/* Reading Progress Bar */}
      <div className="sticky top-0 z-50 h-1 bg-warm-800">
        <div
          className="h-full bg-gradient-to-r from-warm-500 to-warm-400 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back Link */}
      <motion.div
        className="relative z-40 border-b border-warm-800 bg-warm-950/80 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-warm-400 transition-colors hover:text-warm-300"
        >
          ← Back to blog
        </Link>
      </motion.div>

      {/* Article Container */}
      <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 sm:mb-12"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="font-gravitas text-2xl text-warm-100 sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6">
            {post.title}
          </h1>

          <div className="flex flex-col gap-3 border-b border-warm-800 pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-6">
            <div className="flex items-center gap-3 text-xs text-warm-400 sm:gap-4 sm:text-sm">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="text-warm-600">•</span>
              <span>{post.readingTime} min read</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-warm-800 px-2.5 py-1 text-xs font-medium text-warm-300 sm:px-3"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="prose prose-warm max-w-none"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div
            className="space-y-6 text-warm-200"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 border-t border-warm-800 pt-6 sm:mt-12 sm:pt-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/blog"
            className="inline-block rounded-lg border border-warm-500 px-5 py-2.5 text-sm font-medium text-warm-400 transition-all hover:bg-warm-500/10 hover:text-warm-300 sm:px-6 sm:py-3 sm:text-base"
          >
            ← Back to all posts
          </Link>
        </motion.div>
      </article>

      {/* Prose Styles - Updated for warm theme */}
      <style jsx global>{`
        .prose {
          --tw-prose-body: rgb(212, 196, 168);
          --tw-prose-headings: rgb(245, 240, 232);
          --tw-prose-links: rgb(184, 160, 122);
          --tw-prose-code: rgb(184, 160, 122);
          --tw-prose-pre-bg: rgb(35, 28, 23);
          --tw-prose-pre-code: rgb(212, 196, 168);
          --tw-prose-borders: rgb(61, 49, 41);
        }

        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          color: rgb(245, 240, 232);
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        .prose h1 {
          font-size: 2em;
        }

        .prose h2 {
          font-size: 1.5em;
          border-bottom: 1px solid rgb(61, 49, 41);
          padding-bottom: 0.5em;
        }

        .prose h3 {
          font-size: 1.25em;
        }

        .prose p {
          margin: 1em 0;
          line-height: 1.75;
        }

        .prose a {
          color: rgb(184, 160, 122);
          text-decoration: none;
          border-bottom: 1px solid rgb(184, 160, 122);
          transition: color 0.2s;
        }

        .prose a:hover {
          color: rgb(154, 130, 98);
        }

        .prose strong {
          color: rgb(245, 240, 232);
          font-weight: 700;
        }

        .prose em {
          font-style: italic;
          color: rgb(232, 220, 200);
        }

        .prose code {
          background-color: rgb(61, 49, 41);
          color: rgb(184, 160, 122);
          padding: 0.125em 0.25em;
          border-radius: 0.25em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
            Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.9em;
        }

        .prose pre {
          background-color: rgb(35, 28, 23);
          border: 1px solid rgb(61, 49, 41);
          border-radius: 0.5em;
          padding: 1em;
          overflow-x: auto;
        }

        .prose pre code {
          background: none;
          color: inherit;
          padding: 0;
          border-radius: 0;
        }

        .prose blockquote {
          border-left: 4px solid rgb(184, 160, 122);
          padding-left: 1em;
          color: rgb(154, 130, 98);
          font-style: italic;
          margin: 1.5em 0;
        }

        .prose ul,
        .prose ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        .prose li {
          margin: 0.5em 0;
          line-height: 1.75;
        }

        .prose img {
          border-radius: 0.5em;
          margin: 1.5em 0;
          max-width: 100%;
          height: auto;
        }

        .prose table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5em 0;
        }

        .prose th,
        .prose td {
          border: 1px solid rgb(61, 49, 41);
          padding: 0.75em;
          text-align: left;
        }

        .prose th {
          background-color: rgb(61, 49, 41);
          font-weight: 700;
        }

        .prose hr {
          border: none;
          border-top: 1px solid rgb(61, 49, 41);
          margin: 2em 0;
        }
      `}</style>
    </div>
  );
}
