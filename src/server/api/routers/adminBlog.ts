import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

// Slug validation regex: lowercase letters, numbers, and hyphens only
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const adminBlogRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        slug: z
          .string()
          .min(1, "Slug is required")
          .regex(slugRegex, "Slug must be lowercase letters, numbers, and hyphens only"),
        description: z.string().min(1, "Description is required"),
        content: z.string().min(1, "Content is required"),
        tags: z.string().default(""),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {

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

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
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
        tags: z.string().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const updateData: Record<string, unknown> = {};
        if (input.title !== undefined) updateData.title = input.title;
        if (input.slug !== undefined) updateData.slug = input.slug;
        if (input.description !== undefined) updateData.description = input.description;
        if (input.content !== undefined) updateData.content = input.content;
        if (input.tags !== undefined) updateData.tags = input.tags;
        if (input.published !== undefined) updateData.published = input.published;

        const post = await ctx.prisma.blogPost.update({
          where: { id: input.id },
          data: updateData,
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
});
