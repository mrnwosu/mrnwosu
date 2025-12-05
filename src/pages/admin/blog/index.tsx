import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@utils/api";

const AdminBlog: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: posts = [], isLoading, refetch } = api.adminBlog.getAll.useQuery(
    undefined,
    { enabled: status === "authenticated" && session?.user?.isAdmin }
  );

  const deleteMutation = api.adminBlog.delete.useMutation({
    onSuccess: () => {
      setDeleteConfirm(null);
      void refetch();
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    } else if (status === "authenticated" && !session?.user?.isAdmin) {
      void router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Blog Management - Admin</title>
        <meta name="description" content="Admin blog management" />
      </Head>
      <main className="min-h-screen bg-black py-20 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-cyan-400 hover:text-cyan-300">
                ← Back to Admin
              </Link>
              <h1 className="mt-2 font-gravitas text-5xl font-bold text-white">
                Blog Posts
              </h1>
            </div>
            <Link href="/admin/blog/new">
              <button className="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition hover:bg-cyan-700">
                New Post
              </button>
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white/60 mb-4">No blog posts yet</p>
              <Link href="/admin/blog/new">
                <button className="rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition hover:bg-cyan-700">
                  Create First Post
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-white">{post.title}</h3>
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            post.published
                              ? "bg-green-600/20 text-green-400"
                              : "bg-yellow-600/20 text-yellow-400"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/60">/{post.slug}</p>
                      <p className="mt-2 text-white/80">{post.description}</p>
                      {post.tags && (
                        <div className="mt-2 flex gap-2">
                          {post.tags.split(",").map((tag) => (
                            <span
                              key={tag}
                              className="inline-block rounded-full bg-white/10 px-2 py-1 text-xs text-white/70"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-xs text-white/40">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Link href={`/admin/blog/${post.id}`}>
                        <button className="rounded-lg bg-blue-600/20 px-4 py-2 text-sm text-blue-400 transition hover:bg-blue-600/30">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-600/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {deleteConfirm === post.id && (
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="text-sm text-white/60">
                        Are you sure you want to delete this post?
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            deleteMutation.mutate({ id: post.id });
                          }}
                          disabled={deleteMutation.isLoading}
                          className="rounded bg-red-600 px-4 py-1 text-sm text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                          {deleteMutation.isLoading ? "Deleting..." : "Confirm Delete"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded bg-white/10 px-4 py-1 text-sm text-white transition hover:bg-white/20"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminBlog;
