import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { BlogPost, Tag } from "@prisma/client";
import { prisma } from "@server/db";
import { hashApiKey } from "@utils/apiKey";
import { generateSlug, ensureUniqueSlug } from "@utils/slug";
import { generateExcerpt } from "@utils/excerpt";

const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(), // Array of tag names
  featuredImage: z.string().url().optional(),
  draft: z.boolean().optional().default(false),
  date: z.string().datetime().optional(), // Optional custom publish date (ISO 8601)
  scheduledAt: z.string().datetime().optional(), // Schedule for future auto-publish
});

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKeyHeader = request.headers.get("x-api-key");

    if (!apiKeyHeader) {
      return NextResponse.json(
        { error: "Missing API key. Include x-api-key header." },
        { status: 401 }
      );
    }

    // Hash the provided key and look it up
    const hashedKey = hashApiKey(apiKeyHeader);
    const apiKey = await prisma.apiKey.findUnique({
      where: { hashedKey },
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    // Update lastUsedAt
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    // Parse and validate request body
    const body: unknown = await request.json();
    const result = createBlogSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { title, content, description, tags, featuredImage, draft, date, scheduledAt } = result.data;

    // Generate slug
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug, prisma);

    // Generate excerpt
    const excerpt = generateExcerpt(content);

    // Handle tags - find or create by name
    let tagConnections: { id: string }[] = [];
    if (tags && tags.length > 0) {
      const tagRecords = await Promise.all(
        tags.map(async (tagName) => {
          const tagSlug = generateSlug(tagName);
          // Find or create tag
          const existingTag = await prisma.tag.findUnique({
            where: { slug: tagSlug },
          });

          if (existingTag) {
            return existingTag;
          }

          // Create new tag
          return prisma.tag.create({
            data: {
              name: tagName,
              slug: tagSlug,
            },
          });
        })
      );
      tagConnections = tagRecords.map((t) => ({ id: t.id }));
    }

    // Determine publish state
    const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
    const isScheduledForFuture = scheduledDate && scheduledDate > new Date();
    const published = isScheduledForFuture ? false : !draft;

    // Create blog post
    const post: BlogPost & { tags: Tag[] } = await prisma.blogPost.create({
      data: {
        title,
        slug,
        description: description || title, // Use title as description if not provided
        content,
        excerpt,
        featuredImage,
        published,
        scheduledAt: scheduledDate,
        createdAt: date ? new Date(date) : undefined,
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        published: post.published,
        scheduledAt: post.scheduledAt?.toISOString() ?? null,
        createdAt: post.createdAt,
        tags: post.tags.map((t) => t.name),
      },
    });
  } catch (error) {
    console.error("Blog API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
