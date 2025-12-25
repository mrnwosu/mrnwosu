import crypto from "crypto";

export interface GeolocationData {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

interface IpApiResponse {
  status: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  lat?: number;
  lon?: number;
  message?: string;
}

/**
 * Hash IP address for privacy (SHA-256)
 */
export function hashIpAddress(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex");
}

/**
 * Get geolocation data from IP address using ip-api.com
 * Free tier: 45 requests/minute
 */
export async function getGeolocationFromIp(
  ip: string
): Promise<GeolocationData> {
  try {
    // Skip geolocation for localhost/private IPs
    if (
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.")
    ) {
      return {
        country: "Local",
        countryCode: "LOCAL",
        region: "Local",
        city: "Development",
        latitude: 0,
        longitude: 0,
      };
    }

    const response = await fetch(`http://ip-api.com/json/${ip}`, {
      headers: {
        "User-Agent": "mrnwosu-analytics/1.0",
      },
    });

    if (!response.ok) {
      console.error("IP-API request failed:", response.statusText);
      return {};
    }

    const data = (await response.json()) as IpApiResponse;

    if (data.status === "fail") {
      console.error("IP-API returned failure:", data.message);
      return {};
    }

    return {
      country: data.country,
      countryCode: data.countryCode,
      region: data.regionName || data.region,
      city: data.city,
      latitude: data.lat,
      longitude: data.lon,
    };
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return {};
  }
}

/**
 * Extract IP address from request headers (handles proxies/CDNs)
 */
export function getClientIp(headers: Headers): string {
  // Check common headers in order of reliability
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list, take the first one
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get("cf-connecting-ip"); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return "unknown";
}
