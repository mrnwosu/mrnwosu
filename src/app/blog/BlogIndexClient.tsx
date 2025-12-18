"use client";

import { useState, useMemo } from "react";
import type { BlogPostMetadata, BlogTag } from "@utils/blog";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

interface BlogIndexClientProps {
  posts: BlogPostMetadata[];
  tags: BlogTag[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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
      ease: "easeOut" as const,
    },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

export default function BlogIndexClient({ posts, tags }: BlogIndexClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((post) =>
      post.tags.some((t) => t.slug === selectedTag)
    );
  }, [posts, selectedTag]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-warm-950 px-4 py-16 sm:px-6 sm:py-24 md:py-32 lg:px-8">
      {/* Hero Section */}
      <motion.div
        className="mb-12 text-center sm:mb-16 md:mb-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl mb-3 sm:mb-4">
          Blog
        </h1>
        <div className="mx-auto h-0.5 w-16 rounded-full bg-warm-500 mb-4 sm:h-1 sm:w-24 sm:mb-6" />
        <p className="text-base text-warm-300 sm:text-lg">
          Thoughts, ideas, and stories from the code.
        </p>
      </motion.div>

      {/* Tags Filter */}
      {tags.length > 0 && (
        <motion.div
          className="mb-8 flex flex-wrap justify-center gap-2 sm:mb-12 sm:gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            variants={tagVariants}
            onClick={() => setSelectedTag(null)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 sm:px-4 sm:py-2 sm:text-base ${
              selectedTag === null
                ? "bg-warm-500 text-warm-950 shadow-lg shadow-warm-500/30"
                : "border border-warm-600 text-warm-300 hover:border-warm-400 hover:text-warm-200"
            }`}
          >
            All
          </motion.button>
          {tags.map((tag) => (
            <motion.button
              key={tag.id}
              variants={tagVariants}
              onClick={() => setSelectedTag(tag.slug)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 sm:px-4 sm:py-2 sm:text-base ${
                selectedTag === tag.slug
                  ? "bg-warm-400 text-warm-950 shadow-lg shadow-warm-400/30"
                  : "border border-warm-600 text-warm-300 hover:border-warm-400 hover:text-warm-200"
              }`}
            >
              {tag.name}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Blog Posts Grid */}
      <motion.div
        className="mx-auto max-w-4xl space-y-4 sm:space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <motion.article
              key={post.slug}
              variants={itemVariants}
              whileHover={{ x: 4 }}
              className="group relative overflow-hidden rounded-xl border border-warm-700/30 bg-warm-800/50 transition-all duration-300 hover:border-warm-500/50 hover:bg-warm-800/70 sm:rounded-2xl"
            >
              <Link href={`/blog/${post.slug}`} className="relative block">
                {/* Featured Image */}
                {post.featuredImage && (
                  <div className="relative aspect-[2.5/1] w-full overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 768px, 896px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-warm-900/80 to-transparent" />
                  </div>
                )}

                <div className={`p-5 sm:p-6 ${post.featuredImage ? "-mt-12 relative z-10" : ""}`}>
                  <div className="mb-2 flex items-start justify-between sm:mb-3">
                    <h2 className="flex-1 text-lg font-semibold text-warm-100 transition-colors duration-300 group-hover:text-warm-50 sm:text-xl md:text-2xl">
                      {post.title}
                    </h2>
                  </div>

                  <p className="mb-3 text-sm text-warm-300 sm:mb-4 sm:text-base">
                    {post.excerpt || post.description}
                  </p>

                  {post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5 sm:mb-4 sm:gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-block rounded-full bg-warm-700/50 px-2.5 py-1 text-xs font-medium text-warm-200 transition-colors duration-300 group-hover:bg-warm-600/50 sm:px-3 sm:text-sm"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-warm-400 sm:text-sm">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span className="text-warm-400 transition-colors duration-300 group-hover:text-warm-300">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))
        ) : (
          <motion.div
            className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-8 text-center sm:rounded-2xl sm:p-12"
            variants={itemVariants}
          >
            <p className="text-warm-300">
              No posts found for this tag. Check back soon!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
