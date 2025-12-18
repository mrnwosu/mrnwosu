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
        featuredImage: z.string().url().optional().nullable(),
        tagIds: z.array(z.string()).default([]),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate slug from title if not provided
      let slug = input.slug || generateSlug(input.title);
      slug = await ensureUniqueSlug(slug, ctx.prisma);

      // Auto-generate excerpt if not provided
      const excerpt = input.excerpt || generateExcerpt(input.content);

      try {
        const post = await ctx.prisma.blogPost.create({
          data: {
            title: input.title,
            slug,
            description: input.description,
            content: input.content,
            excerpt,
            featuredImage: input.featuredImage,
            published: input.published,
            tags: {
              connect: input.tagIds.map((id) => ({ id })),
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
        featuredImage: z.string().url().optional().nullable(),
        tagIds: z.array(z.string()).optional(),
        published: z.boolean().optional(),
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

        // Handle tag updates
        if (input.tagIds !== undefined) {
          updateData.tags = {
            set: input.tagIds.map((id) => ({ id })),
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
    const [total, published, drafts] = await Promise.all([
      ctx.prisma.blogPost.count(),
      ctx.prisma.blogPost.count({ where: { published: true } }),
      ctx.prisma.blogPost.count({ where: { published: false } }),
    ]);

    return { total, published, drafts };
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
        ctx.prisma.blogPost.count({ where: { published: false } }),
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
        drafts: blogStats[2],
      },
      tags,
      contactCount,
      apiKey,
    };
  }),
});
