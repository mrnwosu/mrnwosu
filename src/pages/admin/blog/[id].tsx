import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@utils/api";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  slug: z.string().min(1, "Slug is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  tags: z.string().optional(),
  published: z.boolean().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const EditBlogPost: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
  });

  const { data: post, isLoading } = api.adminBlog.getById.useQuery(
    { id: id as string },
    { enabled: status === "authenticated" && session?.user?.isAdmin && !!id }
  );

  const updateMutation = api.adminBlog.update.useMutation({
    onSuccess: () => {
      void router.push("/admin/blog");
    },
    onError: (error) => {
      setError(error.message || "Failed to update post");
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    } else if (status === "authenticated" && !session?.user?.isAdmin) {
      void router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        description: post.description,
        content: post.content,
        tags: post.tags,
        published: post.published,
      });
    }
  }, [post, reset]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session?.user?.isAdmin || !post) {
    return null;
  }

  const onSubmit = async (data: BlogPostFormData) => {
    setError(null);
    await updateMutation.mutateAsync({ id: post.id, ...data });
  };

  return (
    <>
      <Head>
        <title>Edit Blog Post - Admin</title>
        <meta name="description" content="Edit blog post" />
      </Head>
      <main className="min-h-screen bg-black py-20 px-4 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/admin/blog" className="text-cyan-400 hover:text-cyan-300">
              ← Back to Posts
            </Link>
            <h1 className="mt-2 font-gravitas text-5xl font-bold text-white">
              Edit Post
            </h1>
          </div>

          <form
            onSubmit={(e) => {
              void handleSubmit(onSubmit)(e);
            }}
            className="space-y-6 rounded-lg border border-white/10 bg-white/5 p-8"
          >
            {error && (
              <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white">
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register("title")}
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Post title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-white">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                {...register("slug")}
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="post-url-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white">
                Description
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={2}
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Brief description of the post"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-white">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                {...register("tags")}
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-white/40 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="react, typescript, web"
              />
              {errors.tags && (
                <p className="mt-1 text-sm text-red-400">{errors.tags.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-white">
                Content (Markdown)
              </label>
              <textarea
                id="content"
                {...register("content")}
                rows={12}
                className="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-mono text-white placeholder-white/40 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Write your post in Markdown format..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
              )}
            </div>

            {/* Published */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                {...register("published")}
                className="h-4 w-4 rounded border-white/20 bg-white/5"
              />
              <label htmlFor="published" className="text-sm font-medium text-white">
                Published
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || updateMutation.isLoading}
                className="flex-1 rounded-lg bg-cyan-600 px-6 py-2 font-medium text-white transition hover:bg-cyan-700 disabled:opacity-50"
              >
                {isSubmitting || updateMutation.isLoading ? "Saving..." : "Save Changes"}
              </button>
              <Link href="/admin/blog">
                <button
                  type="button"
                  className="rounded-lg bg-white/10 px-6 py-2 font-medium text-white transition hover:bg-white/20"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default EditBlogPost;
