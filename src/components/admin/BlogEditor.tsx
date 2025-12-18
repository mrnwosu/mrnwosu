"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@utils/trpc-provider";
import { useState, useCallback } from "react";
import { generateSlug } from "@utils/slug";
import { ImageUploader } from "./ImageUploader";
import { MarkdownEditor } from "./MarkdownEditor";
import { TagSelector } from "./TagSelector";

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url().optional().nullable(),
  tagIds: z.array(z.string()),
});

type BlogFormData = z.infer<typeof blogFormSchema>;

interface BlogEditorProps {
  mode: "create" | "edit";
  postId?: string;
  initialData?: {
    title: string;
    slug: string;
    description: string;
    content: string;
    featuredImage: string | null;
    tagIds: string[];
    published: boolean;
  };
}

export function BlogEditor({ mode, postId, initialData }: BlogEditorProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      content: initialData?.content ?? "",
      featuredImage: initialData?.featuredImage ?? null,
      tagIds: initialData?.tagIds ?? [],
    },
  });

  const content = watch("content");
  const featuredImage = watch("featuredImage");
  const tagIds = watch("tagIds");

  const createMutation = api.adminBlog.create.useMutation({
    onSuccess: () => {
      void utils.adminBlog.getAll.invalidate();
      void utils.adminBlog.getStats.invalidate();
      router.push("/admin/blog");
    },
  });

  const updateMutation = api.adminBlog.update.useMutation({
    onSuccess: () => {
      void utils.adminBlog.getAll.invalidate();
      void utils.adminBlog.getById.invalidate({ id: postId });
      router.push("/admin/blog");
    },
  });

  const mutation = mode === "create" ? createMutation : updateMutation;

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setValue("title", newTitle);
      // Auto-generate slug from title if creating new post
      if (mode === "create") {
        setValue("slug", generateSlug(newTitle));
      }
    },
    [mode, setValue]
  );

  const onSubmit = (data: BlogFormData, published: boolean) => {
    setIsPublishing(published);

    if (mode === "create") {
      createMutation.mutate({
        ...data,
        featuredImage: data.featuredImage || undefined,
        published,
      });
    } else if (postId) {
      updateMutation.mutate({
        id: postId,
        ...data,
        featuredImage: data.featuredImage,
        published,
      });
    }
  };

  return (
    <form className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-warm-200">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          onChange={handleTitleChange}
          className="w-full rounded-lg border border-warm-700/30 bg-warm-900/50 px-4 py-3 text-warm-100 placeholder-warm-500 focus:border-warm-500 focus:outline-none"
          placeholder="Enter post title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="mb-2 block text-sm font-medium text-warm-200">
          Slug
        </label>
        <div className="flex items-center gap-2">
          <span className="text-warm-500">/blog/</span>
          <input
            id="slug"
            type="text"
            {...register("slug")}
            className="flex-1 rounded-lg border border-warm-700/30 bg-warm-900/50 px-4 py-3 text-warm-100 placeholder-warm-500 focus:border-warm-500 focus:outline-none"
            placeholder="post-slug"
          />
        </div>
        {errors.slug && <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-warm-200">
          Description
        </label>
        <input
          id="description"
          type="text"
          {...register("description")}
          className="w-full rounded-lg border border-warm-700/30 bg-warm-900/50 px-4 py-3 text-warm-100 placeholder-warm-500 focus:border-warm-500 focus:outline-none"
          placeholder="Brief description for SEO and previews"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Featured Image */}
      <div>
        <label className="mb-2 block text-sm font-medium text-warm-200">
          Featured Image (optional)
        </label>
        <ImageUploader
          value={featuredImage}
          onChange={(url) => setValue("featuredImage", url)}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-warm-200">Tags</label>
        <TagSelector
          selectedIds={tagIds}
          onChange={(ids) => setValue("tagIds", ids)}
        />
      </div>

      {/* Content */}
      <div>
        <label className="mb-2 block text-sm font-medium text-warm-200">Content (Markdown)</label>
        <MarkdownEditor
          value={content}
          onChange={(value) => setValue("content", value)}
        />
        {errors.content && <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t border-warm-700/30 pt-6">
        <button
          type="button"
          onClick={() => void handleSubmit((data) => onSubmit(data, false))()}
          disabled={mutation.isPending}
          className="rounded-lg border border-warm-600 px-6 py-2 text-sm font-medium text-warm-300 transition-colors hover:bg-warm-700 disabled:opacity-50"
        >
          {mutation.isPending && !isPublishing ? "Saving..." : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => void handleSubmit((data) => onSubmit(data, true))()}
          disabled={mutation.isPending}
          className="rounded-lg bg-warm-600 px-6 py-2 text-sm font-medium text-warm-100 transition-colors hover:bg-warm-500 disabled:opacity-50"
        >
          {mutation.isPending && isPublishing ? "Publishing..." : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="rounded-lg px-6 py-2 text-sm font-medium text-warm-400 transition-colors hover:text-warm-300"
        >
          Cancel
        </button>
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-400">{mutation.error.message}</p>
      )}
    </form>
  );
}
