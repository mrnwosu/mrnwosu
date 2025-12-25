import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@server/db";
import {
  getClientIp,
  getGeolocationFromIp,
  hashIpAddress,
} from "@utils/geolocation";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { pathname?: string };
    const { pathname } = body;

    if (!pathname || typeof pathname !== "string") {
      return NextResponse.json(
        { error: "Invalid pathname" },
        { status: 400 }
      );
    }

    // Get client IP
    const ip = getClientIp(request.headers);
    const ipHash = hashIpAddress(ip);

    // Get user agent
    const userAgent = request.headers.get("user-agent") || undefined;

    // Get geolocation data (async, but we don't wait for it to complete)
    const geoData = await getGeolocationFromIp(ip);

    // Store page view in database
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await prisma.pageView.create({
      data: {
        pathname,
        ipHash,
        country: geoData.country,
        countryCode: geoData.countryCode,
        region: geoData.region,
        city: geoData.city,
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking page view:", error);
    // Return success anyway to avoid blocking user experience
    return NextResponse.json({ success: true });
  }
}
