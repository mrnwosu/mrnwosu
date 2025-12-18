/**
 * Generates an excerpt from markdown content
 * - Strips markdown formatting
 * - Truncates to maxLength characters
 * - Truncates at word boundary with ellipsis
 */
export function generateExcerpt(content: string, maxLength = 150): string {
  // Strip common markdown syntax
  const plainText = content
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code
    .replace(/`[^`]+`/g, "")
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, "")
    // Remove bold/italic markers
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    // Remove blockquotes
    .replace(/^>\s+/gm, "")
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    // Collapse multiple whitespace/newlines
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated + "...";
}
