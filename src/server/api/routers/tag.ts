import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { generateSlug } from "@utils/slug";

export const tagRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const tags = await ctx.prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    return tags;
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const tag = await ctx.prisma.tag.findUnique({
        where: { slug: input.slug },
        include: {
          posts: {
            where: { published: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!tag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      return tag;
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1, "Tag name is required").max(50, "Tag name too long"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = generateSlug(input.name);

      try {
        const tag = await ctx.prisma.tag.create({
          data: {
            name: input.name,
            slug,
          },
        });
        return tag;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "A tag with this name already exists",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create tag",
        });
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if tag has posts
        const tag = await ctx.prisma.tag.findUnique({
          where: { id: input.id },
          include: { _count: { select: { posts: true } } },
        });

        if (!tag) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tag not found",
          });
        }

        if (tag._count.posts > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Cannot delete tag with ${tag._count.posts} associated post(s). Remove the tag from posts first.`,
          });
        }

        await ctx.prisma.tag.delete({
          where: { id: input.id },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Tag not found",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete tag",
        });
      }
    }),
});
