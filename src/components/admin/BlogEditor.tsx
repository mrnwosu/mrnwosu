"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@utils/trpc-provider";
import { useState, useCallback } from "react";
import { generateSlug } from "@utils/slug";
import { revalidateBlog } from "@utils/revalidate";
import { ImageUploader } from "./ImageUploader";
import { MarkdownEditor } from "./MarkdownEditor";
import { TagSelector, type PendingTag } from "./TagSelector";
import { DateTimePicker } from "./DateTimePicker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  // Accept null, empty string, or valid URL - skip URL validation since ImageUploader handles it
  featuredImage: z.union([z.string(), z.null()]).optional().transform((val) => val || null),
  tagIds: z.array(z.string()),
  publishDate: z.date().optional(),
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
    createdAt?: Date;
  };
}

export function BlogEditor({ mode, postId, initialData }: BlogEditorProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [pendingTags, setPendingTags] = useState<PendingTag[]>([]);

  const utils = api.useUtils();

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      content: initialData?.content ?? "",
      featuredImage: initialData?.featuredImage ?? null,
      tagIds: initialData?.tagIds ?? [],
      publishDate: initialData?.createdAt ? new Date(initialData.createdAt) : undefined,
    },
  });

  const createMutation = api.adminBlog.create.useMutation({
    onSuccess: (data) => {
      void utils.adminBlog.getAll.invalidate();
      void utils.adminBlog.getStats.invalidate();
      void revalidateBlog(data.slug);
      router.push("/admin/blog");
    },
  });

  const updateMutation = api.adminBlog.update.useMutation({
    onSuccess: (data) => {
      void utils.adminBlog.getAll.invalidate();
      void utils.adminBlog.getById.invalidate({ id: postId });
      void revalidateBlog(data.slug);
      router.push("/admin/blog");
    },
  });

  const mutation = mode === "create" ? createMutation : updateMutation;

  const handleTitleChange = useCallback(
    (value: string) => {
      form.setValue("title", value);
      // Auto-generate slug from title if creating new post
      if (mode === "create") {
        form.setValue("slug", generateSlug(value));
      }
    },
    [mode, form]
  );

  const onSubmit = (data: BlogFormData, published: boolean) => {
    setIsPublishing(published);

    // Convert Date to ISO string if provided
    const createdAt = data.publishDate
      ? data.publishDate.toISOString()
      : undefined;

    // Separate existing tag IDs from pending tag temp IDs
    const existingTagIds = data.tagIds.filter((id) => !id.startsWith("pending_"));

    // Get the names of pending tags that are selected
    const newTagNames = pendingTags
      .filter((t) => data.tagIds.includes(t.tempId))
      .map((t) => t.name);

    if (mode === "create") {
      createMutation.mutate({
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        featuredImage: data.featuredImage || undefined,
        tagIds: existingTagIds,
        newTagNames,
        published,
        createdAt,
      });
    } else if (postId) {
      updateMutation.mutate({
        id: postId,
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        featuredImage: data.featuredImage,
        tagIds: existingTagIds,
        newTagNames,
        published,
        createdAt,
      });
    }
  };

  const handlePublish = (published: boolean) => {
    void form.handleSubmit((data) => onSubmit(data, published))();
  };

  return (
    <Form {...form}>
      <form className="relative space-y-6">
        {/* Loading Overlay */}
        {mutation.isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-warm-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="h-8 w-8 animate-spin text-warm-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-sm font-medium text-warm-200">
                {isPublishing ? "Publishing post..." : "Saving draft..."}
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-warm-200">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter post title"
                  className="border-warm-700/30 bg-warm-900/50 text-warm-100 placeholder-warm-500 focus:border-warm-500"
                  {...field}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-warm-200">Slug</FormLabel>
              <div className="flex items-center gap-2">
                <span className="text-warm-500">/blog/</span>
                <FormControl>
                  <Input
                    placeholder="post-slug"
                    className="flex-1 border-warm-700/30 bg-warm-900/50 text-warm-100 placeholder-warm-500 focus:border-warm-500"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-warm-200">Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description for SEO and previews"
                  className="border-warm-700/30 bg-warm-900/50 text-warm-100 placeholder-warm-500 focus:border-warm-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Featured Image */}
        <FormField
          control={form.control}
          name="featuredImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-warm-200">Featured Image (optional)</FormLabel>
              <ImageUploader
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags and Publish Date - Side by Side */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Tags */}
          <FormField
            control={form.control}
            name="tagIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-warm-200">Tags</FormLabel>
                <TagSelector
                  selectedIds={field.value}
                  onChange={field.onChange}
                  pendingTags={pendingTags}
                  onPendingTagsChange={setPendingTags}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Publish Date */}
          <FormField
            control={form.control}
            name="publishDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-warm-200">Publish Date (optional)</FormLabel>
                <DateTimePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select date and time"
                />
                <FormDescription className="text-warm-500">
                  Leave empty to use current date/time
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-warm-200">Content (Markdown)</FormLabel>
              <MarkdownEditor
                value={field.value}
                onChange={field.onChange}
                hasError={!!fieldState.error}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex flex-wrap gap-3 border-t border-warm-700/30 pt-6">
          <button
            type="button"
            onClick={() => handlePublish(false)}
            disabled={mutation.isPending}
            className="rounded-lg border border-warm-600 px-6 py-2 text-sm font-medium text-warm-300 transition-colors hover:bg-warm-700 disabled:opacity-50"
          >
            {mutation.isPending && !isPublishing ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={() => handlePublish(true)}
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
    </Form>
  );
}
