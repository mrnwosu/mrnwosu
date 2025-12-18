"use client";

import Link from "next/link";
import { BlogEditor } from "@components/admin/BlogEditor";

export default function NewBlogPostPage() {
  return (
    <div className="min-h-screen bg-warm-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="mb-4 inline-flex items-center gap-2 text-warm-400 transition-colors hover:text-warm-300"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Posts
          </Link>
          <h1 className="text-2xl font-semibold text-warm-100 sm:text-3xl">
            Create New Post
          </h1>
        </div>

        {/* Editor */}
        <div className="rounded-xl border border-warm-700/30 bg-warm-900/50 p-6 sm:rounded-2xl sm:p-8">
          <BlogEditor mode="create" />
        </div>
      </div>
    </div>
  );
}
