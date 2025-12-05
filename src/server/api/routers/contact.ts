import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_SUBMISSIONS_PER_HOUR = 3;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_SUBMISSIONS_PER_HOUR) {
    return false;
  }

  record.count++;
  return true;
}

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
      // Rate limit check using email as identifier
      if (!checkRateLimit(input.email)) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Too many submissions. Please try again later.`,
        });
      }

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

  getAll: adminProcedure.query(async ({ ctx }) => {
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

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
