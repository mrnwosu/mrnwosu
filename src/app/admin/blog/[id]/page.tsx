"use client";

import { use } from "react";
import Link from "next/link";
import { BlogEditor } from "@components/admin/BlogEditor";
import { api } from "@utils/api";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = use(params);

  const { data: post, isLoading, error } = api.adminBlog.getById.useQuery({ id });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-warm-500 border-t-transparent" />
          <span className="text-warm-400">Loading post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-warm-950 px-4">
        <h1 className="mb-4 text-2xl font-semibold text-warm-100">Post Not Found</h1>
        <p className="mb-6 text-warm-400">
          {error?.message || "The post you're looking for doesn't exist."}
        </p>
        <Link
          href="/admin/blog"
          className="rounded-lg bg-warm-700 px-6 py-2 text-sm font-medium text-warm-100 transition-colors hover:bg-warm-600"
        >
          Back to Posts
        </Link>
      </div>
    );
  }

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
            Edit Post
          </h1>
          <p className="mt-1 text-warm-400">
            {post.published ? "Published" : "Draft"} • Last updated{" "}
            {new Date(post.updatedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Editor */}
        <div className="rounded-xl border border-warm-700/30 bg-warm-900/50 p-6 sm:rounded-2xl sm:p-8">
          <BlogEditor
            mode="edit"
            postId={post.id}
            initialData={{
              title: post.title,
              slug: post.slug,
              description: post.description,
              content: post.content,
              featuredImage: post.featuredImage,
              tagIds: post.tags.map((tag) => tag.id),
              published: post.published,
              createdAt: post.createdAt,
            }}
          />
        </div>
      </div>
    </div>
  );
}
