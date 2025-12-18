import { prisma } from "@server/db";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPostMetadata {
  id: string;
  title: string;
  description: string;
  excerpt: string | null;
  featuredImage: string | null;
  date: string;
  tags: BlogTag[];
  slug: string;
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
  html: string;
  readingTime: number;
}

/**
 * Calculate reading time in minutes
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Convert markdown content to HTML
 */
async function markdownToHtml(content: string): Promise<string> {
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(content);
  return processedContent.toString();
}

/**
 * Get all published blog posts metadata (for listing)
 */
export async function getAllBlogPosts(): Promise<BlogPostMetadata[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    date: post.createdAt.toISOString(),
    tags: post.tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
    slug: post.slug,
  }));
}

/**
 * Get all blog post slugs for static generation
 */
export async function getBlogSlugs(): Promise<string[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => post.slug);
}

/**
 * Get full blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      published: true,
    },
    include: { tags: true },
  });

  if (!post) {
    return null;
  }

  const html = await markdownToHtml(post.content);
  const readingTime = calculateReadingTime(post.content);

  return {
    id: post.id,
    title: post.title,
    description: post.description,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    date: post.createdAt.toISOString(),
    tags: post.tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
    slug: post.slug,
    content: post.content,
    html,
    readingTime,
  };
}

/**
 * Get all unique tags from published blog posts
 */
export async function getAllBlogTags(): Promise<BlogTag[]> {
  const tags = await prisma.tag.findMany({
    where: {
      posts: {
        some: {
          published: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  }));
}

/**
 * Get blog posts by tag slug
 */
export async function getBlogPostsByTag(
  tagSlug: string
): Promise<BlogPostMetadata[]> {
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      tags: {
        some: {
          slug: tagSlug,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    date: post.createdAt.toISOString(),
    tags: post.tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
    slug: post.slug,
  }));
}
