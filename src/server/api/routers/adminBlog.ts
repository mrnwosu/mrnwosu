import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const adminBlogRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        slug: z.string().min(1, "Slug is required"),
        description: z.string().min(1, "Description is required"),
        content: z.string().min(1, "Content is required"),
        tags: z.string().default(""),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only admins can create posts
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can create posts",
        });
      }

      try {
        const post = await ctx.prisma.blogPost.create({
          data: {
            title: input.title,
            slug: input.slug,
            description: input.description,
            content: input.content,
            tags: input.tags,
            published: input.published,
          },
        });
        return post;
      } catch (error) {
        const err = error as Record<string, string>;
        if (err.code === "P2002") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A post with this slug already exists",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create post",
        });
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    // Only admins can view all posts
    if (!ctx.session.user.isAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can view posts",
      });
    }

    try {
      const posts = await ctx.prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
      });
      return posts;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch posts",
      });
    }
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Only admins can view individual posts
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can view posts",
        });
      }

      try {
        const post = await ctx.prisma.blogPost.findUnique({
          where: { id: input.id },
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        tags: z.string().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only admins can update posts
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can update posts",
        });
      }

      try {
        const post = await ctx.prisma.blogPost.update({
          where: { id: input.id },
          data: {
            ...(input.title && { title: input.title }),
            ...(input.slug && { slug: input.slug }),
            ...(input.description && { description: input.description }),
            ...(input.content && { content: input.content }),
            ...(input.tags !== undefined && { tags: input.tags }),
            ...(input.published !== undefined && { published: input.published }),
          },
        });
        return post;
      } catch (error) {
        const err = error as Record<string, string>;
        if (err.code === "P2002") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A post with this slug already exists",
          });
        }
        if (err.code === "P2025") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update post",
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Only admins can delete posts
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete posts",
        });
      }

      try {
        await ctx.prisma.blogPost.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        const err = error as Record<string, string>;
        if (err.code === "P2025") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete post",
        });
      }
    }),
});
