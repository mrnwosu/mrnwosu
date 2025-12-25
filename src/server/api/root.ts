import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { contactRouter } from "./routers/contact";
import { adminBlogRouter } from "./routers/adminBlog";
import { blogRouter } from "./routers/blog";
import { tagRouter } from "./routers/tag";
import { apiKeyRouter } from "./routers/apiKey";
import { analyticsRouter } from "./routers/analytics";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  contact: contactRouter,
  adminBlog: adminBlogRouter,
  blog: blogRouter,
  tag: tagRouter,
  apiKey: apiKeyRouter,
  analytics: analyticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
