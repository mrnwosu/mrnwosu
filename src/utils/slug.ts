import type { PrismaClient } from "@prisma/client";

/**
 * Generates a URL-safe slug from a title
 * - Converts to lowercase
 * - Replaces spaces and special chars with hyphens
 * - Removes consecutive hyphens
 * - Trims hyphens from start/end
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Ensures a slug is unique by appending a number if necessary
 * Returns the original slug if unique, or slug-2, slug-3, etc.
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  prisma: PrismaClient,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });

    // Slug is available if no post found, or if it's the post we're editing
    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

/**
 * Validates that a slug matches the required format
 * Only lowercase letters, numbers, and hyphens allowed
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
