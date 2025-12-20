import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { generateSlug, ensureUniqueSlug } from "@utils/slug";
import { generateExcerpt } from "@utils/excerpt";

// Slug validation regex: lowercase letters, numbers, and hyphens only
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const adminBlogRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        slug: z
          .string()
          .regex(slugRegex, "Slug must be lowercase letters, numbers, and hyphens only")
          .optional(),
        description: z.string().min(1, "Description is required"),
        content: z.string().min(1, "Content is required"),
        excerpt: z.string().optional(),
        // Accept full URLs or relative paths (for local uploads in dev)
        featuredImage: z.string().optional().nullable(),
        tagIds: z.array(z.string()).default([]),
        newTagNames: z.array(z.string()).default([]), // New tags to create
        published: z.boolean().default(false),
        createdAt: z.string().datetime().optional(), // Optional custom publish date
        scheduledAt: z.string().datetime().optional().nullable(), // Schedule for future auto-publish
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate slug from title if not provided
      let slug = input.slug || generateSlug(input.title);
      slug = await ensureUniqueSlug(slug, ctx.prisma);

      // Auto-generate excerpt if not provided
      const excerpt = input.excerpt || generateExcerpt(input.content);

      try {
        // Create new tags and collect their IDs
        const newTagIds: string[] = [];
        if (input.newTagNames.length > 0) {
          for (const tagName of input.newTagNames) {
            const tagSlug = generateSlug(tagName);
            // Check if tag already exists (by slug)
            const existingTag = await ctx.prisma.tag.findUnique({
              where: { slug: tagSlug },
            });

            if (existingTag) {
              newTagIds.push(existingTag.id);
            } else {
              const newTag = await ctx.prisma.tag.create({
                data: { name: tagName, slug: tagSlug },
              });
              newTagIds.push(newTag.id);
            }
          }
        }

        // Combine existing tag IDs with newly created tag IDs
        const allTagIds = [...input.tagIds, ...newTagIds];

        // If scheduling for future, force published to false
        const scheduledDate = input.scheduledAt ? new Date(input.scheduledAt) : null;
        const isScheduledForFuture = scheduledDate && scheduledDate > new Date();
        const published = isScheduledForFuture ? false : input.published;

        const post = await ctx.prisma.blogPost.create({
          data: {
            title: input.title,
            slug,
            description: input.description,
            content: input.content,
            excerpt,
            featuredImage: input.featuredImage,
            published,
            scheduledAt: scheduledDate,
            createdAt: input.createdAt ? new Date(input.createdAt) : undefined,
            tags: {
              connect: allTagIds.map((id) => ({ id })),
            },
          },
          include: {
            tags: true,
          },
        });
        return post;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "A post with this slug already exists",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post",
        });
      }
    }),

  getAll: adminProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        tags: true,
      },
    });
    return posts;
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findUnique({
        where: { id: input.id },
        include: {
          tags: true,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      return post;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        slug: z
          .string()
          .min(1)
          .regex(slugRegex, "Slug must be lowercase letters, numbers, and hyphens only")
          .optional(),
        description: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().optional().nullable(),
        // Accept full URLs or relative paths (for local uploads in dev)
        featuredImage: z.string().optional().nullable(),
        tagIds: z.array(z.string()).optional(),
        newTagNames: z.array(z.string()).default([]), // New tags to create
        published: z.boolean().optional(),
        createdAt: z.string().datetime().optional(), // Optional custom publish date
        scheduledAt: z.string().datetime().optional().nullable(), // Schedule for future auto-publish
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Build update data object
        const updateData: Prisma.BlogPostUpdateInput = {};

        if (input.title !== undefined) updateData.title = input.title;
        if (input.slug !== undefined) {
          // Ensure unique slug excluding current post
          updateData.slug = await ensureUniqueSlug(input.slug, ctx.prisma, input.id);
        }
        if (input.description !== undefined) updateData.description = input.description;
        if (input.content !== undefined) {
          updateData.content = input.content;
          // Auto-regenerate excerpt if content changes and no explicit excerpt provided
          if (input.excerpt === undefined) {
            updateData.excerpt = generateExcerpt(input.content);
          }
        }
        if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
        if (input.featuredImage !== undefined) updateData.featuredImage = input.featuredImage;
        if (input.published !== undefined) updateData.published = input.published;
        if (input.createdAt !== undefined) updateData.createdAt = new Date(input.createdAt);

        // Handle scheduledAt updates
        if (input.scheduledAt !== undefined) {
          if (input.scheduledAt === null) {
            updateData.scheduledAt = null;
          } else {
            const scheduledDate = new Date(input.scheduledAt);
            updateData.scheduledAt = scheduledDate;
            // If scheduling for future, force published to false
            if (scheduledDate > new Date()) {
              updateData.published = false;
            }
          }
        }

        // Handle tag updates (including new tags)
        if (input.tagIds !== undefined || input.newTagNames.length > 0) {
          // Create new tags and collect their IDs
          const newTagIds: string[] = [];
          if (input.newTagNames.length > 0) {
            for (const tagName of input.newTagNames) {
              const tagSlug = generateSlug(tagName);
              // Check if tag already exists (by slug)
              const existingTag = await ctx.prisma.tag.findUnique({
                where: { slug: tagSlug },
              });

              if (existingTag) {
                newTagIds.push(existingTag.id);
              } else {
                const newTag = await ctx.prisma.tag.create({
                  data: { name: tagName, slug: tagSlug },
                });
                newTagIds.push(newTag.id);
              }
            }
          }

          // Combine existing tag IDs with newly created tag IDs
          const allTagIds = [...(input.tagIds ?? []), ...newTagIds];
          updateData.tags = {
            set: allTagIds.map((id) => ({ id })),
          };
        }

        const post = await ctx.prisma.blogPost.update({
          where: { id: input.id },
          data: updateData,
          include: {
            tags: true,
          },
        });
        return post;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "A post with this slug already exists",
            });
          }
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Post not found",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update post",
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.blogPost.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Post not found",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete post",
        });
      }
    }),

  getStats: adminProcedure.query(async ({ ctx }) => {
    const [total, published, scheduled, drafts] = await Promise.all([
      ctx.prisma.blogPost.count(),
      ctx.prisma.blogPost.count({ where: { published: true } }),
      ctx.prisma.blogPost.count({
        where: { published: false, scheduledAt: { not: null } },
      }),
      ctx.prisma.blogPost.count({
        where: { published: false, scheduledAt: null },
      }),
    ]);

    return { total, published, scheduled, drafts };
  }),

  // Combined dashboard stats - single query for all admin dashboard data
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const [
      blogStats,
      tags,
      contactCount,
      apiKey,
    ] = await Promise.all([
      // Blog stats
      Promise.all([
        ctx.prisma.blogPost.count(),
        ctx.prisma.blogPost.count({ where: { published: true } }),
        ctx.prisma.blogPost.count({
          where: { published: false, scheduledAt: { not: null } },
        }),
        ctx.prisma.blogPost.count({
          where: { published: false, scheduledAt: null },
        }),
      ]),
      // Tags with post counts
      ctx.prisma.tag.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { posts: true },
          },
        },
      }),
      // Contact submission count
      ctx.prisma.contactSubmission.count(),
      // Current API key
      ctx.prisma.apiKey.findFirst({
        where: { createdById: ctx.session.user.id },
        select: {
          id: true,
          name: true,
          prefix: true,
          lastUsedAt: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      blog: {
        total: blogStats[0],
        published: blogStats[1],
        scheduled: blogStats[2],
        drafts: blogStats[3],
      },
      tags,
      contactCount,
      apiKey,
    };
  }),

  // Publish a scheduled/draft post immediately (updates createdAt to now)
  publishNow: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.blogPost.findUnique({
        where: { id: input.id },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const updatedPost = await ctx.prisma.blogPost.update({
        where: { id: input.id },
        data: {
          published: true,
          scheduledAt: null, // Clear schedule
          createdAt: new Date(), // Update publish date to now
        },
        include: { tags: true },
      });

      return updatedPost;
    }),
});
