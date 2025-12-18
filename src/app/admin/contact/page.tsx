"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@utils/trpc-provider";

export default function AdminContactPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: submissions, isLoading, refetch } = api.contact.getAll.useQuery();

  const deleteMutation = api.contact.delete.useMutation({
    onSuccess: () => {
      void refetch();
      setDeletingId(null);
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      setDeletingId(id);
      await deleteMutation.mutateAsync({ id });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
          <h1 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl">
            Contact Messages
          </h1>
          <div className="my-3 h-0.5 w-16 rounded-full bg-warm-500 sm:my-4 sm:h-1 sm:w-24" />
          <p className="text-base text-warm-300 sm:text-lg">
            View and manage contact form submissions
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-warm-500 border-t-transparent" />
          </div>
        ) : submissions?.length === 0 ? (
          <div className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-8 text-center sm:rounded-2xl">
            <div className="mb-4 text-4xl">📭</div>
            <p className="text-warm-400">No contact submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions?.map((submission) => (
              <div
                key={submission.id}
                className="rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 sm:rounded-2xl sm:p-6"
              >
                {/* Header */}
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-warm-100">{submission.name}</h3>
                    <a
                      href={`mailto:${submission.email}`}
                      className="text-sm text-warm-400 hover:text-warm-300"
                    >
                      {submission.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-warm-500">
                      {formatDate(submission.createdAt)}
                    </span>
                    <button
                      onClick={() => void handleDelete(submission.id)}
                      disabled={deletingId === submission.id}
                      className="rounded-lg p-2 text-warm-400 transition-colors hover:bg-red-900/30 hover:text-red-400 disabled:opacity-50"
                      title="Delete submission"
                    >
                      {deletingId === submission.id ? (
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

                {/* Message */}
                <p className="whitespace-pre-wrap text-sm text-warm-300">
                  {submission.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
