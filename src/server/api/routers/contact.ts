import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const contactRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        message: z.string().min(10, "Message must be at least 10 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const submission = await ctx.prisma.contactSubmission.create({
          data: {
            name: input.name,
            email: input.email,
            message: input.message,
          },
        });
        return { success: true, id: submission.id };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit contact form",
        });
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    // Only admins can view all submissions
    if (!ctx.session.user.isAdmin) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admins can view submissions",
      });
    }

    try {
      const submissions = await ctx.prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
      });
      return submissions;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch submissions",
      });
    }
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Only admins can delete submissions
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admins can delete submissions",
        });
      }

      try {
        await ctx.prisma.contactSubmission.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete submission",
        });
      }
    }),
});
