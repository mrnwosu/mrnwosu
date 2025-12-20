import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * POST /api/revalidate
 * Triggers on-demand revalidation for blog pages.
 * Called internally after blog post create/update/delete operations.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { paths?: string[] };
    const { paths } = body;

    // Default to revalidating the blog index
    const pathsToRevalidate = paths ?? ["/blog"];

    for (const path of pathsToRevalidate) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      paths: pathsToRevalidate,
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json(
      { revalidated: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
