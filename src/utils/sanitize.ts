import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify to clean potentially dangerous HTML
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "hr",
      "strong", "em", "u", "s", "code", "pre",
      "a", "img",
      "ul", "ol", "li",
      "blockquote",
      "table", "thead", "tbody", "tr", "th", "td",
      "div", "span",
    ],
    ALLOWED_ATTR: [
      "href", "title", "target", "rel",
      "src", "alt", "width", "height",
      "class", "id",
    ],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize markdown content before rendering
 * Note: This should be used in combination with a markdown parser
 */
export function sanitizeMarkdown(markdown: string): string {
  // Basic sanitization - remove potentially dangerous patterns
  return markdown
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}
