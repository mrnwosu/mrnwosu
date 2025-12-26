import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getClientIp, hashIpAddress } from "@utils/geolocation";

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Two-tier rate limiting
const EMAIL_RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_EMAIL_SUBMISSIONS_PER_HOUR = 3;

const IP_RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_ANONYMOUS_SUBMISSIONS_PER_DAY = 2;

function checkRateLimit(identifier: string, maxCount: number, window: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + window });
    return true;
  }

  if (record.count >= maxCount) {
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
        email: z.string().email("Invalid email address").optional().or(z.literal("")),
        message: z.string().min(10, "Message must be at least 10 characters"),
        website: z.string().max(0), // Honeypot - must be empty
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Honeypot check - reject if filled
      if (input.website && input.website.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid submission detected",
        });
      }

      // Get client IP and hash it
      const ip = getClientIp(ctx.headers);
      const ipHash = hashIpAddress(ip);

      // Two-tier rate limiting
      const isAnonymous = !input.email || input.email.trim() === "";

      if (isAnonymous) {
        // Anonymous: 2 submissions per day per IP
        if (!checkRateLimit(`ip:${ipHash}`, MAX_ANONYMOUS_SUBMISSIONS_PER_DAY, IP_RATE_LIMIT_WINDOW)) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Too many anonymous submissions. Please try again in 24 hours or provide an email.`,
          });
        }
      } else {
        // With email: 3 submissions per hour per email
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        if (!checkRateLimit(`email:${input.email}`, MAX_EMAIL_SUBMISSIONS_PER_HOUR, EMAIL_RATE_LIMIT_WINDOW)) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Too many submissions. Please try again later.`,
          });
        }
      }

      try {
        const submission = await ctx.prisma.contactSubmission.create({
          data: {
            name: input.name,
            email: input.email || null,
            ipHash,
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
