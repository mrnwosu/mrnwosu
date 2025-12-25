"use client";

import { usePageTracking } from "../hooks/usePageTracking";

/**
 * Client component that tracks page views
 * Add to root layout to enable analytics tracking
 */
export function PageTracker() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  usePageTracking();
  return null;
}
