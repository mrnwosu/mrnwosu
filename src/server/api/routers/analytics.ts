import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../trpc";

export const analyticsRouter = createTRPCRouter({
  /**
   * Get overall analytics stats
   */
  getStats: adminProcedure
    .input(
      z
        .object({
          days: z.number().min(1).max(365).default(30), // Last N days
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const days = input?.days ?? 30;
      const since = new Date();
      since.setDate(since.getDate() - days);

      const [totalViews, uniqueVisitors, viewsSince] = await Promise.all([
        // Total page views (all time)
        ctx.prisma.pageView.count(),
        // Unique visitors (all time) - count distinct IP hashes
        ctx.prisma.pageView.findMany({
          select: { ipHash: true },
          distinct: ["ipHash"],
        }),
        // Views in selected period
        ctx.prisma.pageView.count({
          where: {
            createdAt: {
              gte: since,
            },
          },
        }),
      ]);

      return {
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        viewsSince,
        days,
      };
    }),

  /**
   * Get geographic distribution for heatmap
   */
  getGeographicData: adminProcedure.query(async ({ ctx }) => {
    // Get all page views with location data
    const pageViews = await ctx.prisma.pageView.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        countryCode: { not: null },
      },
      select: {
        latitude: true,
        longitude: true,
        country: true,
        countryCode: true,
        city: true,
      },
    });

    // Group by country and count
    const countryStats: Record<
      string,
      {
        country: string;
        countryCode: string;
        count: number;
        latitude: number;
        longitude: number;
      }
    > = {};

    pageViews.forEach((view) => {
      const code = view.countryCode!;
      if (!countryStats[code]) {
        countryStats[code] = {
          country: view.country || code,
          countryCode: code,
          count: 0,
          latitude: view.latitude || 0,
          longitude: view.longitude || 0,
        };
      }
      countryStats[code].count++;
    });

    return Object.values(countryStats);
  }),

  /**
   * Get popular pages
   */
  getPopularPages: adminProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(10),
          days: z.number().min(1).max(365).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 10;
      const days = input?.days;

      const where = days
        ? {
            createdAt: {
              gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
            },
          }
        : {};

      const pageViews = await ctx.prisma.pageView.groupBy({
        by: ["pathname"],
        where,
        _count: {
          pathname: true,
        },
        orderBy: {
          _count: {
            pathname: "desc",
          },
        },
        take: limit,
      });

      return pageViews.map((pv) => ({
        pathname: pv.pathname,
        views: pv._count.pathname,
      }));
    }),

  /**
   * Get views over time (for charts)
   */
  getViewsOverTime: adminProcedure
    .input(
      z
        .object({
          days: z.number().min(1).max(365).default(30),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const days = input?.days ?? 30;
      const since = new Date();
      since.setDate(since.getDate() - days);

      const pageViews = await ctx.prisma.pageView.findMany({
        where: {
          createdAt: {
            gte: since,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Group by date
      const viewsByDate: Record<string, number> = {};
      pageViews.forEach((view) => {
        const date = view.createdAt.toISOString().split("T")[0];
        if (!date) return;
        viewsByDate[date] = (viewsByDate[date] || 0) + 1;
      });

      return Object.entries(viewsByDate).map(([date, count]) => ({
        date,
        views: count,
      }));
    }),

  /**
   * Get top countries by visitor count
   */
  getTopCountries: adminProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).default(10),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 10;

      const countries = await ctx.prisma.pageView.groupBy({
        by: ["countryCode", "country"],
        where: {
          countryCode: { not: null },
        },
        _count: {
          countryCode: true,
        },
        orderBy: {
          _count: {
            countryCode: "desc",
          },
        },
        take: limit,
      });

      return countries.map((c) => ({
        countryCode: c.countryCode,
        country: c.country || c.countryCode,
        views: c._count.countryCode,
      }));
    }),
});
