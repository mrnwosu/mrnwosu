import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { env } from "../env.mjs";

export interface BlobResult {
  url: string;
  pathname: string;
}

interface BlobStorage {
  upload(filename: string, file: File): Promise<BlobResult>;
}

/**
 * Local file storage - saves to public/uploads
 */
const localStorage: BlobStorage = {
  async upload(filename: string, file: File): Promise<BlobResult> {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const fullDir = path.join(uploadsDir, path.dirname(filename));
    await mkdir(fullDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const localPath = path.join(uploadsDir, filename);
    await writeFile(localPath, buffer);

    return {
      url: `/uploads/${filename}`,
      pathname: filename,
    };
  },
};

/**
 * Vercel Blob storage - uploads to Vercel's CDN
 */
const vercelBlobStorage: BlobStorage = {
  async upload(filename: string, file: File): Promise<BlobResult> {
    if (!env.MRNWOSU_READ_WRITE_TOKEN) {
      throw new Error(
        "Image upload not configured. MRNWOSU_READ_WRITE_TOKEN is missing."
      );
    }

    const blob = await put(filename, file, {
      access: "public",
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
    };
  },
};

/**
 * Get the appropriate blob storage based on environment
 */
export function getBlobStorage(): BlobStorage {
  if (env.APP_ENV === "development") {
    return localStorage;
  }
  return vercelBlobStorage;
}
