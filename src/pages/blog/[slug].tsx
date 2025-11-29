import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { getBlogPost, getBlogSlugs } from "@utils/blog";
import type { BlogPost } from "@utils/blog";

interface BlogPostPageProps {
  post: BlogPost | null;
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

export default function BlogPostPage({ post }: BlogPostPageProps) {
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

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">Post not found</h1>
          <Link href="/blog" className="text-cyan-400 hover:text-cyan-300">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Reading Progress Bar */}
      <div className="sticky top-0 z-50 h-1 bg-gradient-to-r from-cyan-500 to-blue-500">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back Link */}
      <motion.div
        className="relative z-40 border-b border-gray-800 bg-black/80 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-cyan-400 transition-colors hover:text-cyan-300"
        >
          ← Back to blog
        </Link>
      </motion.div>

      {/* Article Container */}
      <article className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-col gap-4 border-b border-gray-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span className="text-gray-600">•</span>
              <span>{post.readingTime} min read</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-cyan-400"
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
          className="prose prose-invert max-w-none"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div
            className="space-y-6 text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 border-t border-gray-800 pt-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/blog"
            className="inline-block rounded-lg border border-cyan-500 px-6 py-3 font-medium text-cyan-400 transition-all hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/20"
          >
            ← Back to all posts
          </Link>
        </motion.div>
      </article>

      {/* Prose Styles */}
      <style jsx global>{`
        .prose {
          --tw-prose-body: rgb(209, 213, 219);
          --tw-prose-headings: rgb(255, 255, 255);
          --tw-prose-links: rgb(34, 211, 238);
          --tw-prose-code: rgb(34, 211, 238);
          --tw-prose-pre-bg: rgb(17, 24, 39);
          --tw-prose-pre-code: rgb(209, 213, 219);
          --tw-prose-borders: rgb(31, 41, 55);
        }

        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          color: rgb(255, 255, 255);
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        .prose h1 {
          font-size: 2em;
        }

        .prose h2 {
          font-size: 1.5em;
          border-bottom: 1px solid rgb(31, 41, 55);
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
          color: rgb(34, 211, 238);
          text-decoration: none;
          border-bottom: 1px solid rgb(34, 211, 238);
          transition: color 0.2s;
        }

        .prose a:hover {
          color: rgb(6, 182, 212);
        }

        .prose strong {
          color: rgb(255, 255, 255);
          font-weight: 700;
        }

        .prose em {
          font-style: italic;
          color: rgb(229, 231, 235);
        }

        .prose code {
          background-color: rgb(31, 41, 55);
          color: rgb(34, 211, 238);
          padding: 0.125em 0.25em;
          border-radius: 0.25em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
            Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.9em;
        }

        .prose pre {
          background-color: rgb(17, 24, 39);
          border: 1px solid rgb(31, 41, 55);
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
          border-left: 4px solid rgb(34, 211, 238);
          padding-left: 1em;
          color: rgb(156, 163, 175);
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
          border: 1px solid rgb(31, 41, 55);
          padding: 0.75em;
          text-align: left;
        }

        .prose th {
          background-color: rgb(31, 41, 55);
          font-weight: 700;
        }

        .prose hr {
          border: none;
          border-top: 1px solid rgb(31, 41, 55);
          margin: 2em 0;
        }
      `}</style>
    </div>
  );
}

export function getStaticPaths() {
  const slugs = getBlogSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: {
        slug: slug.replace(".md", ""),
      },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 3600,
  };
}
