"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Track page views for analytics
 */
export function usePageTracking(): void {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages or API routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Send tracking request (fire and forget)
    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pathname }),
    }).catch((error) => {
      // Silently fail - don't disrupt user experience
      console.debug("Failed to track page view:", error);
    });
  }, [pathname]);
}
