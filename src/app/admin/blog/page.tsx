"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@utils/trpc-provider";
import { useState } from "react";
import { revalidateBlog } from "@utils/revalidate";

export default function AdminBlogPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "published" | "scheduled" | "drafts">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const utils = api.useUtils();
  const { data: posts, isLoading } = api.adminBlog.getAll.useQuery();

  const deleteMutation = api.adminBlog.delete.useMutation({
    onSuccess: () => {
      setDeletingId(null);
      void utils.adminBlog.getAll.invalidate();
      void utils.adminBlog.getStats.invalidate();
      void revalidateBlog();
    },
  });

  const publishNowMutation = api.adminBlog.publishNow.useMutation({
    onSuccess: (data) => {
      setPublishingId(null);
      void utils.adminBlog.getAll.invalidate();
      void utils.adminBlog.getStats.invalidate();
      void revalidateBlog(data.slug);
    },
  });

  const handleDelete = (id: string, slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setDeletingId(id);
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          void revalidateBlog(slug);
        },
      });
    }
  };

  const handlePublishNow = (id: string) => {
    if (confirm("Publish this post now? The publish date will be set to today.")) {
      setPublishingId(id);
      publishNowMutation.mutate({ id });
    }
  };

  const filteredPosts = posts?.filter((post) => {
    if (filter === "published") return post.published;
    if (filter === "scheduled") return !post.published && post.scheduledAt;
    if (filter === "drafts") return !post.published && !post.scheduledAt;
    return true;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-warm-950 px-4 py-16 sm:py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-sm text-warm-400 transition-colors hover:text-warm-300"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl">
                Blog Posts
              </h1>
              <div className="my-3 h-0.5 w-16 rounded-full bg-warm-500 sm:my-4 sm:h-1 sm:w-24" />
            </div>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 rounded-lg bg-warm-600 px-4 py-2 text-sm font-medium text-warm-100 transition-colors hover:bg-warm-500"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Link>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["all", "published", "scheduled", "drafts"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? f === "scheduled"
                    ? "bg-blue-600 text-white"
                    : "bg-warm-600 text-warm-100"
                  : "bg-warm-800/50 text-warm-400 hover:bg-warm-700/50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && posts && (
                <span className="ml-1 text-xs opacity-70">
                  (
                  {f === "published"
                    ? posts.filter((p) => p.published).length
                    : f === "scheduled"
                    ? posts.filter((p) => !p.published && p.scheduledAt).length
                    : posts.filter((p) => !p.published && !p.scheduledAt).length}
                  )
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-warm-500 border-t-transparent" />
          </div>
        ) : filteredPosts?.length === 0 ? (
          <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-8 text-center sm:rounded-2xl">
            <div className="mb-4 text-4xl">📝</div>
            <p className="text-warm-400">
              {filter === "all"
                ? "No blog posts yet. Create your first post!"
                : `No ${filter} posts.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts?.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 sm:rounded-2xl sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="font-medium text-warm-100">{post.title}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          post.published
                            ? "bg-green-900/50 text-green-400"
                            : post.scheduledAt
                            ? "bg-blue-900/50 text-blue-400"
                            : "bg-yellow-900/50 text-yellow-400"
                        }`}
                      >
                        {post.published
                          ? "Published"
                          : post.scheduledAt
                          ? `Scheduled: ${formatDate(new Date(post.scheduledAt))}`
                          : "Draft"}
                      </span>
                    </div>
                    {post.excerpt && (
                      <p className="mb-3 line-clamp-2 text-sm text-warm-400">{post.excerpt}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3">
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="rounded-full bg-warm-700/50 px-2 py-0.5 text-xs text-warm-300"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="text-xs text-warm-500">{formatDate(post.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Publish Now - only for scheduled posts */}
                    {!post.published && post.scheduledAt && (
                      <button
                        onClick={() => handlePublishNow(post.id)}
                        disabled={publishingId === post.id}
                        className="rounded-lg p-2 text-blue-400 transition-colors hover:bg-blue-900/30 hover:text-blue-300 disabled:opacity-50"
                        title="Publish Now"
                      >
                        {publishingId === post.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/admin/blog/${post.id}`)}
                      className="rounded-lg p-2 text-warm-400 transition-colors hover:bg-warm-700/50 hover:text-warm-300"
                      title="Edit"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg p-2 text-warm-400 transition-colors hover:bg-warm-700/50 hover:text-warm-300"
                      title="View"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                    <button
                      onClick={() => handleDelete(post.id, post.slug)}
                      disabled={deletingId === post.id}
                      className="rounded-lg p-2 text-warm-400 transition-colors hover:bg-red-900/30 hover:text-red-400 disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === post.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
