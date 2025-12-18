import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { generateApiKey, hashApiKey, getKeyPrefix } from "@utils/apiKey";

export const apiKeyRouter = createTRPCRouter({
  generate: adminProcedure
    .input(
      z.object({
        name: z.string().default("Default API Key"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Delete any existing API keys for this user (single key policy)
      await ctx.prisma.apiKey.deleteMany({
        where: { createdById: ctx.session.user.id },
      });

      // Generate new key
      const plainKey = generateApiKey();
      const hashedKey = hashApiKey(plainKey);
      const prefix = getKeyPrefix(plainKey);

      await ctx.prisma.apiKey.create({
        data: {
          name: input.name,
          hashedKey,
          prefix,
          createdById: ctx.session.user.id,
        },
      });

      // Return the plain key - this is the only time it will be visible
      return {
        key: plainKey,
        prefix,
        message: "Save this key now. It will not be shown again.",
      };
    }),

  getCurrent: adminProcedure.query(async ({ ctx }) => {
    const apiKey = await ctx.prisma.apiKey.findFirst({
      where: { createdById: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        prefix: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });

    return apiKey;
  }),

  revoke: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const apiKey = await ctx.prisma.apiKey.findUnique({
        where: { id: input.id },
        select: { createdById: true },
      });

      if (!apiKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "API key not found",
        });
      }

      // Ensure the key belongs to the current user
      if (apiKey.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only revoke your own API keys",
        });
      }

      await ctx.prisma.apiKey.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});
