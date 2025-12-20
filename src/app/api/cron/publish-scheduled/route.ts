import { NextResponse } from "next/server";
import { prisma } from "@server/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/cron/publish-scheduled
 *
 * Vercel Cron job to publish scheduled blog posts.
 * Runs daily at 8 AM EST (13:00 UTC during EST).
 *
 * Security: Vercel automatically authorizes cron requests.
 */
export async function GET() {
  try {
    const now = new Date();

    // Find all posts that are:
    // 1. Not published
    // 2. Have a scheduledAt date that is in the past or now
    const postsToPublish = await prisma.blogPost.findMany({
      where: {
        published: false,
        scheduledAt: {
          lte: now,
          not: null,
        },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        scheduledAt: true,
      },
    });

    if (postsToPublish.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No posts to publish",
        publishedCount: 0,
        timestamp: now.toISOString(),
      });
    }

    // Publish all scheduled posts in a transaction
    await prisma.$transaction(
      postsToPublish.map((post) =>
        prisma.blogPost.update({
          where: { id: post.id },
          data: {
            published: true,
          },
        })
      )
    );

    // Revalidate blog pages
    revalidatePath("/blog");
    for (const post of postsToPublish) {
      revalidatePath(`/blog/${post.slug}`);
    }

    console.log(
      `[Cron] Published ${postsToPublish.length} post(s):`,
      postsToPublish.map((p) => p.title)
    );

    return NextResponse.json({
      success: true,
      message: `Published ${postsToPublish.length} post(s)`,
      publishedCount: postsToPublish.length,
      posts: postsToPublish.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
      })),
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish scheduled posts" },
      { status: 500 }
    );
  }
}
