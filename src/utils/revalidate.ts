/**
 * Trigger on-demand revalidation for blog pages.
 * Call this after create/update/delete operations.
 */
export async function revalidateBlog(slug?: string): Promise<void> {
  const paths = ["/blog", "/sitemap.xml"];

  // Also revalidate the specific post page if slug is provided
  if (slug) {
    paths.push(`/blog/${slug}`);
  }

  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // Silently fail - revalidation is best-effort
    console.warn("Failed to trigger blog revalidation");
  }
}
