import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

const updateBlogSchema = z.object({
  slug: z.string().min(1, "Slug is required to identify the post"),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().url().nullable().optional(),
  draft: z.boolean().optional(),
  date: z.string().datetime().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
});

async function validateApiKey(request: NextRequest): Promise<
  | { valid: true; apiKeyId: string }
  | { valid: false; response: NextResponse }
> {
  const apiKeyHeader = request.headers.get("x-api-key");

  if (!apiKeyHeader) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: "Missing API key. Include x-api-key header." },
        { status: 401 }
      ),
    };
  }

  const hashedKey = hashApiKey(apiKeyHeader);
  const apiKey = await prisma.apiKey.findUnique({
    where: { hashedKey },
  });

  if (!apiKey) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      ),
    };
  }

  // Update lastUsedAt
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return { valid: true, apiKeyId: apiKey.id };
}

async function findOrCreateTags(tagNames: string[]): Promise<{ id: string }[]> {
  const tagRecords = await Promise.all(
    tagNames.map(async (tagName) => {
      const tagSlug = generateSlug(tagName);
      const existingTag = await prisma.tag.findUnique({
        where: { slug: tagSlug },
      });

      if (existingTag) {
        return existingTag;
      }

      return prisma.tag.create({
        data: {
          name: tagName,
          slug: tagSlug,
        },
      });
    })
  );
  return tagRecords.map((t) => ({ id: t.id }));
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const authResult = await validateApiKey(request);
    if (!authResult.valid) {
      return authResult.response;
    }

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
    const tagConnections = tags && tags.length > 0
      ? await findOrCreateTags(tags)
      : [];

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

    // Revalidate blog pages so the new post appears immediately
    revalidatePath("/blog");
    if (published) {
      revalidatePath(`/blog/${post.slug}`);
    }

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

export async function PUT(request: NextRequest) {
  try {
    // Validate API key
    const authResult = await validateApiKey(request);
    if (!authResult.valid) {
      return authResult.response;
    }

    // Parse and validate request body
    const body: unknown = await request.json();
    const result = updateBlogSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { slug, title, content, description, tags, featuredImage, draft, date, scheduledAt } = result.data;

    // Find existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
      include: { tags: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Parameters<typeof prisma.blogPost.update>[0]["data"] = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (content !== undefined) {
      updateData.content = content;
      updateData.excerpt = generateExcerpt(content);
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (featuredImage !== undefined) {
      updateData.featuredImage = featuredImage;
    }

    if (date !== undefined) {
      updateData.createdAt = new Date(date);
    }

    // Handle publish state
    if (scheduledAt !== undefined) {
      if (scheduledAt === null) {
        updateData.scheduledAt = null;
      } else {
        const scheduledDate = new Date(scheduledAt);
        updateData.scheduledAt = scheduledDate;
        if (scheduledDate > new Date()) {
          updateData.published = false;
        }
      }
    }

    if (draft !== undefined && scheduledAt === undefined) {
      updateData.published = !draft;
    }

    // Handle tags
    let tagUpdate: { set: { id: string }[]; connect?: { id: string }[] } | undefined;
    if (tags !== undefined) {
      const tagConnections = tags.length > 0
        ? await findOrCreateTags(tags)
        : [];
      tagUpdate = { set: tagConnections };
    }

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...updateData,
        ...(tagUpdate && { tags: tagUpdate }),
      },
      include: {
        tags: true,
      },
    });

    // Revalidate blog pages
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

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
