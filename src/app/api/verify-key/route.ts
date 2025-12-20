import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@server/db";
import { hashApiKey, isValidApiKeyFormat } from "@utils/apiKey";

/**
 * POST /api/verify-key
 * Verifies that an API key is valid without using it.
 * Useful for testing API key validity before making requests.
 *
 * Headers:
 *   x-api-key: mrnw_xxxxx...
 *
 * Response (200):
 *   { valid: true, name: "Key Name", createdAt: "2024-01-01T00:00:00Z" }
 *
 * Response (401):
 *   { valid: false, error: "Invalid API key" }
 */
export async function POST(request: NextRequest) {
  try {
    const apiKeyHeader = request.headers.get("x-api-key");

    if (!apiKeyHeader) {
      return NextResponse.json(
        { valid: false, error: "Missing API key. Include x-api-key header." },
        { status: 401 }
      );
    }

    if (!isValidApiKeyFormat(apiKeyHeader)) {
      return NextResponse.json(
        { valid: false, error: "Invalid API key format" },
        { status: 401 }
      );
    }

    // Hash the provided key and look it up
    const hashedKey = hashApiKey(apiKeyHeader);
    const apiKey = await prisma.apiKey.findUnique({
      where: { hashedKey },
      select: {
        name: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, error: "Invalid API key" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      name: apiKey.name,
      createdAt: apiKey.createdAt.toISOString(),
      lastUsedAt: apiKey.lastUsedAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("Verify key API error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
