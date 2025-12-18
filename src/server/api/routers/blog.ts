import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const blogRouter = createTRPCRouter({
  // Public: Get all published blog posts
  getPublished: publicProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).optional(),
          cursor: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 10;
      const cursor = input?.cursor;

      try {
        const posts = await ctx.prisma.blogPost.findMany({
          where: { published: true },
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { createdAt: "desc" },
          include: { tags: true },
        });

        let nextCursor: string | undefined = undefined;
        if (posts.length > limit) {
          const nextItem = posts.pop();
          nextCursor = nextItem?.id;
        }

        return {
          posts,
          nextCursor,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch blog posts",
        });
      }
    }),

  // Public: Get a single published blog post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.blogPost.findFirst({
          where: {
            slug: input.slug,
            published: true,
          },
          include: { tags: true },
        });

        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        return post;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch post",
        });
      }
    }),

  // Admin: Preview unpublished post by slug
  previewBySlug: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.blogPost.findUnique({
          where: { slug: input.slug },
          include: { tags: true },
        });

        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        return post;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch post",
        });
      }
    }),
});
