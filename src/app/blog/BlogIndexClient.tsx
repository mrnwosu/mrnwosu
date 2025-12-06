"use client";

import { useState, useMemo } from "react";
import type { BlogPostMetadata } from "@utils/blog";
import { motion } from "motion/react";
import Link from "next/link";

interface BlogIndexClientProps {
  posts: BlogPostMetadata[];
  tags: string[];
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
      ease: "easeOut",
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
      ease: "easeOut",
    },
  },
};

export default function BlogIndexClient({ posts, tags }: BlogIndexClientProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((post) =>
      post.tags.map((t) => t.toLowerCase()).includes(selectedTag.toLowerCase())
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
    <div className="min-h-screen bg-black px-4 py-20 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        className="mb-20 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
          Blog
        </h1>
        <p className="text-lg text-gray-400">
          Thoughts, ideas, and stories from the code.
        </p>
      </motion.div>

      {/* Tags Filter */}
      {tags.length > 0 && (
        <motion.div
          className="mb-12 flex flex-wrap justify-center gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.button
            variants={tagVariants}
            onClick={() => setSelectedTag(null)}
            className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
              selectedTag === null
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/50"
                : "border border-gray-600 text-gray-300 hover:border-cyan-500 hover:text-cyan-400"
            }`}
          >
            All
          </motion.button>
          {tags.map((tag) => (
            <motion.button
              key={tag}
              variants={tagVariants}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
                selectedTag === tag
                  ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/50"
                  : "border border-gray-600 text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Blog Posts Grid */}
      <motion.div
        className="mx-auto max-w-4xl space-y-6"
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
              className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gradient-to-r from-gray-900 to-black p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              {/* Animated gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

              <Link href={`/blog/${post.slug}`} className="relative block">
                <div className="mb-3 flex items-start justify-between">
                  <h2 className="flex-1 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-400">
                    {post.title}
                  </h2>
                </div>

                <p className="mb-4 text-gray-400">{post.description}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300 transition-colors duration-300 group-hover:bg-cyan-900/50 group-hover:text-cyan-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="text-cyan-400/70 transition-colors duration-300 group-hover:text-cyan-400">
                    Read more →
                  </span>
                </div>
              </Link>
            </motion.article>
          ))
        ) : (
          <motion.div
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-12 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-400">
              No posts found for this tag. Check back soon!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
