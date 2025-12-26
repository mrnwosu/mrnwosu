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
   * Get geographic distribution for heatmap (grouped by city)
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

    // Group by city + country combination (cities can have same name in different countries)
    const cityStats: Record<
      string,
      {
        country: string;
        countryCode: string;
        city: string;
        count: number;
        latitude: number;
        longitude: number;
      }
    > = {};

    pageViews.forEach((view) => {
      // Create unique key: "City, Country" or just "Country" if no city
      const cityName = view.city || "Unknown";
      const countryCode = view.countryCode || "Unknown";
      const key = `${cityName}, ${countryCode}`;

      if (!cityStats[key]) {
        cityStats[key] = {
          country: view.country || view.countryCode || "Unknown",
          countryCode: view.countryCode || "Unknown",
          city: cityName,
          count: 0,
          latitude: view.latitude || 0,
          longitude: view.longitude || 0,
        };
      }
      cityStats[key].count++;
    });

    return Object.values(cityStats);
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

  /**
   * Get recent page views with sorting and pagination
   */
  getRecentViews: adminProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
          sortBy: z
            .enum(["createdAt", "pathname", "country", "city"])
            .default("createdAt"),
          sortOrder: z.enum(["asc", "desc"]).default("desc"),
          groupBy: z
            .enum(["none", "pathname", "country", "city"])
            .default("none"),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;
      const sortBy = input?.sortBy ?? "createdAt";
      const sortOrder = input?.sortOrder ?? "desc";
      const groupBy = input?.groupBy ?? "none";

      // If no grouping, return individual views
      if (groupBy === "none") {
        const [views, total] = await Promise.all([
          ctx.prisma.pageView.findMany({
            take: limit,
            skip: offset,
            orderBy: {
              [sortBy]: sortOrder,
            },
            select: {
              id: true,
              pathname: true,
              country: true,
              countryCode: true,
              city: true,
              createdAt: true,
            },
          }),
          ctx.prisma.pageView.count(),
        ]);

        return {
          views: views.map((v) => ({
            id: v.id,
            pathname: v.pathname,
            country: v.country,
            countryCode: v.countryCode,
            city: v.city,
            createdAt: v.createdAt,
            count: 1,
          })),
          total,
          hasMore: offset + limit < total,
          isGrouped: false,
        };
      }

      // Grouped views
      // groupBy is guaranteed to be "pathname" | "country" | "city" here since we checked for "none" above
      const grouped = await ctx.prisma.pageView.groupBy({
        by: [groupBy],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: sortOrder,
          },
        },
        take: limit,
        skip: offset,
      });

      const total = await ctx.prisma.pageView.groupBy({
        by: [groupBy],
        _count: { id: true },
      });

      return {
        views: grouped.map((g) => ({
          id: g[groupBy] || "Unknown",
          pathname: groupBy === "pathname" ? g[groupBy] : null,
          country: groupBy === "country" ? g[groupBy] : null,
          countryCode: null,
          city: groupBy === "city" ? g[groupBy] : null,
          createdAt: null,
          count: g._count.id,
        })),
        total: total.length,
        hasMore: offset + limit < total.length,
        isGrouped: true,
      };
    }),
});
