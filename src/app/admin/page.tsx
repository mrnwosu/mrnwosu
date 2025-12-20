"use client";

import Link from "next/link";
import { api } from "@utils/trpc-provider";
import { useState, memo, useCallback } from "react";

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex h-20 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-warm-500 border-t-transparent" />
    </div>
  );
}

// Memoized card components to prevent unnecessary re-renders
const PostStatsCard = memo(function PostStatsCard({
  stats,
}: {
  stats: { total: number; published: number; scheduled: number; drafts: number };
}) {
  return (
    <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 sm:rounded-2xl sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-warm-100 sm:text-xl">
        Blog Posts
      </h2>

      <div className="mb-4 grid grid-cols-4 gap-2 sm:gap-4">
        <div className="text-center">
          <div className="text-xl font-bold text-warm-100 sm:text-2xl">{stats.total}</div>
          <div className="text-xs text-warm-400">Total</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-green-400 sm:text-2xl">{stats.published}</div>
          <div className="text-xs text-warm-400">Published</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-blue-400 sm:text-2xl">{stats.scheduled}</div>
          <div className="text-xs text-warm-400">Scheduled</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-yellow-400 sm:text-2xl">{stats.drafts}</div>
          <div className="text-xs text-warm-400">Drafts</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-warm-400 transition-colors hover:text-warm-300"
        >
          Manage Posts
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-warm-600 px-3 py-1.5 text-sm font-medium text-warm-100 transition-colors hover:bg-warm-500"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>
    </div>
  );
});

type Tag = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  _count: { posts: number };
};

const TagManagementCard = memo(function TagManagementCard({
  initialTags,
}: {
  initialTags: Tag[];
}) {
  const [newTagName, setNewTagName] = useState("");

  const utils = api.useUtils();
  const { data: tags } = api.tag.getAll.useQuery(undefined, {
    initialData: initialTags,
  });

  const createMutation = api.tag.create.useMutation({
    onSuccess: () => {
      setNewTagName("");
      void utils.tag.getAll.invalidate();
      void utils.adminBlog.getDashboardStats.invalidate();
    },
  });

  const deleteMutation = api.tag.delete.useMutation({
    onSuccess: () => {
      void utils.tag.getAll.invalidate();
      void utils.adminBlog.getDashboardStats.invalidate();
    },
  });

  const handleCreateTag = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newTagName.trim()) {
        createMutation.mutate({ name: newTagName.trim() });
      }
    },
    [newTagName, createMutation]
  );

  return (
    <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 sm:rounded-2xl sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-warm-100 sm:text-xl">Tags</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {tags?.length === 0 ? (
          <p className="text-sm text-warm-500">No tags yet</p>
        ) : (
          tags?.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 rounded-full bg-warm-700/50 px-3 py-1 text-sm text-warm-200"
            >
              {tag.name}
              <span className="text-warm-500">({tag._count.posts})</span>
              {tag._count.posts === 0 && (
                <button
                  onClick={() => deleteMutation.mutate({ id: tag.id })}
                  disabled={deleteMutation.isPending}
                  className="ml-1 text-warm-500 hover:text-red-400"
                  title="Delete tag"
                >
                  ×
                </button>
              )}
            </span>
          ))
        )}
      </div>

      <form onSubmit={handleCreateTag} className="flex gap-2">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name"
          className="flex-1 rounded-lg border border-warm-700/30 bg-warm-900/50 px-3 py-2 text-sm text-warm-100 placeholder-warm-500 focus:border-warm-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newTagName.trim() || createMutation.isPending}
          className="rounded-lg bg-warm-600 px-4 py-2 text-sm font-medium text-warm-100 transition-colors hover:bg-warm-500 disabled:opacity-50"
        >
          {createMutation.isPending ? "..." : "Add"}
        </button>
      </form>

      {createMutation.isError && (
        <p className="mt-2 text-sm text-red-400">{createMutation.error.message}</p>
      )}
    </div>
  );
});

const ContactStatsCard = memo(function ContactStatsCard({
  count,
}: {
  count: number;
}) {
  return (
    <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 sm:rounded-2xl sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-warm-100 sm:text-xl">
        Contact Messages
      </h2>

      <div className="mb-4">
        <div className="text-3xl font-bold text-warm-100">{count}</div>
        <div className="text-sm text-warm-400">Total submissions</div>
      </div>

      <Link
        href="/admin/contact"
        className="inline-flex items-center gap-2 text-warm-400 transition-colors hover:text-warm-300"
      >
        View All
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
});

type ApiKeyData = {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: Date | null;
  createdAt: Date;
} | null;

const ApiDocsCard = memo(function ApiDocsCard() {
  return (
    <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 sm:rounded-2xl sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-warm-100 sm:text-xl">
        API Documentation
      </h2>

      <p className="mb-4 text-sm text-warm-400">
        Interactive API docs for programmatic blog posting.
      </p>

      <Link
        href="/api-docs"
        target="_blank"
        className="inline-flex items-center gap-2 text-warm-400 transition-colors hover:text-warm-300"
      >
        Open Swagger UI
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </Link>
    </div>
  );
});

const ApiKeyCard = memo(function ApiKeyCard({
  initialKey,
}: {
  initialKey: ApiKeyData;
}) {
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const utils = api.useUtils();
  const { data: currentKey } = api.apiKey.getCurrent.useQuery(undefined, {
    initialData: initialKey,
  });

  const generateMutation = api.apiKey.generate.useMutation({
    onSuccess: (data) => {
      setShowKey(data.key);
      setCopied(false);
      void utils.apiKey.getCurrent.invalidate();
      void utils.adminBlog.getDashboardStats.invalidate();
    },
  });

  const revokeMutation = api.apiKey.revoke.useMutation({
    onSuccess: () => {
      void utils.apiKey.getCurrent.invalidate();
      void utils.adminBlog.getDashboardStats.invalidate();
    },
  });

  const handleGenerate = useCallback(() => {
    if (currentKey) {
      if (!confirm("This will invalidate your existing API key. Continue?")) {
        return;
      }
    }
    generateMutation.mutate({ name: "Blog API Key" });
  }, [currentKey, generateMutation]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for when document is not focused
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 sm:rounded-2xl sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-warm-100 sm:text-xl">API Key</h2>

      {showKey ? (
        <div className="space-y-3">
          <div className="rounded-lg bg-warm-900 p-3">
            <p className="mb-2 text-xs text-yellow-400">
              Click the key to copy. It will not be shown again.
            </p>
            <button
              onClick={() => void copyToClipboard(showKey)}
              className="group w-full text-left"
            >
              <code className={`block break-all rounded px-2 py-1 text-sm transition-colors ${
                copied
                  ? "bg-green-900/50 text-green-400"
                  : "bg-warm-800 text-warm-100 hover:bg-warm-700 cursor-pointer"
              }`}>
                {copied ? "Copied!" : showKey}
              </code>
            </button>
          </div>
          <button
            onClick={() => setShowKey(null)}
            className="w-full rounded-lg border border-warm-600 px-4 py-2 text-sm font-medium text-warm-300 transition-colors hover:bg-warm-700"
          >
            Done
          </button>
        </div>
      ) : currentKey ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
            <span className="text-sm text-warm-300">Active</span>
          </div>
          <p className="text-sm text-warm-400">
            Key: <code className="text-warm-300">{currentKey.prefix}...</code>
          </p>
          {currentKey.lastUsedAt && (
            <p className="text-xs text-warm-500">
              Last used: {new Date(currentKey.lastUsedAt).toLocaleDateString()}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="flex-1 rounded-lg bg-warm-600 px-4 py-2 text-sm font-medium text-warm-100 transition-colors hover:bg-warm-500 disabled:opacity-50"
            >
              {generateMutation.isPending ? "Generating..." : "Regenerate"}
            </button>
            <button
              onClick={() => revokeMutation.mutate({ id: currentKey.id })}
              disabled={revokeMutation.isPending}
              className="rounded-lg border border-red-600/50 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/30 disabled:opacity-50"
            >
              Revoke
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-warm-400">No API key generated yet.</p>
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="w-full rounded-lg bg-warm-600 px-4 py-2 text-sm font-medium text-warm-100 transition-colors hover:bg-warm-500 disabled:opacity-50"
          >
            {generateMutation.isPending ? "Generating..." : "Generate API Key"}
          </button>
        </div>
      )}

      {generateMutation.isError && (
        <p className="mt-2 text-sm text-red-400">{generateMutation.error.message}</p>
      )}
    </div>
  );
});

export default function AdminDashboard() {
  // Single combined query fetches all dashboard data at once
  const { data, isLoading } = api.adminBlog.getDashboardStats.useQuery();

  return (
    <main className="min-h-screen bg-warm-950 px-4 py-16 sm:py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl">
            Admin Dashboard
          </h1>
          <div className="my-3 h-0.5 w-16 rounded-full bg-warm-500 sm:my-4 sm:h-1 sm:w-24" />
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 sm:rounded-2xl sm:p-6"
              >
                <LoadingSpinner />
              </div>
            ))}
          </div>
        ) : data ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <PostStatsCard stats={data.blog} />
            <TagManagementCard initialTags={data.tags} />
            <ContactStatsCard count={data.contactCount} />
            <ApiKeyCard initialKey={data.apiKey} />
            <ApiDocsCard />
          </div>
        ) : null}
      </div>
    </main>
  );
}
