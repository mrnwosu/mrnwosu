import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@server/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request: NextRequest) {
  try {
    // Check authentication - admin only
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if blob token is configured
    if (!process.env.MRNWOSU_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Image upload not configured. MRNWOSU_READ_WRITE_TOKEN is missing." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `blog/${timestamp}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    });

    return NextResponse.json({
      url: blob.url,
      filename: blob.pathname,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
