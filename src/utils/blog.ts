import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

export interface BlogPostMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
  html: string;
  readingTime: number;
}

const blogDirectory = path.join(process.cwd(), "public", "blog");

/**
 * Get all blog post slugs
 */
export function getBlogSlugs(): string[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }
  return fs.readdirSync(blogDirectory).filter((file) => file.endsWith(".md"));
}

/**
 * Get blog post metadata by slug
 */
export function getBlogPostMetadata(slug: string): BlogPostMetadata | null {
  const filePath = path.join(blogDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    title: (data.title as string) || "Untitled",
    description: (data.description as string) || "",
    date: String(data.date || ""),
    tags: ((data.tags as string[]) || []),
    slug,
  };
}

/**
 * Get all blog posts metadata (for listing)
 */
export function getAllBlogPosts(): BlogPostMetadata[] {
  const slugs = getBlogSlugs();
  return slugs
    .map((file) => {
      const slug = file.replace(".md", "");
      return getBlogPostMetadata(slug);
    })
    .filter((post): post is BlogPostMetadata => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
 * Get full blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(blogDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(content);

  const html = processedContent.toString();
  const readingTime = calculateReadingTime(content);

  return {
    title: (data.title as string) || "Untitled",
    description: (data.description as string) || "",
    date: String(data.date || ""),
    tags: ((data.tags as string[]) || []),
    slug,
    content,
    html,
    readingTime,
  };
}

/**
 * Get blog posts by tag
 */
export function getBlogPostsByTag(tag: string): BlogPostMetadata[] {
  return getAllBlogPosts().filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

/**
 * Get all unique tags from all blog posts
 */
export function getAllBlogTags(): string[] {
  const allPosts = getAllBlogPosts();
  const tagsSet = new Set<string>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagsSet.add(tag);
    });
  });

  return Array.from(tagsSet).sort();
}
