"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import superjson from "superjson";

import { type AppRouter } from "@server/api/root";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.NEXT_PUBLIC_PORT ?? 3000}`; // dev SSR should use localhost
};

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const isDevelopment = typeof window === "undefined"
    ? process.env.NODE_ENV === "development"
    : window.location.hostname === "localhost";

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [trpcClient] = useState(() =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    api.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            isDevelopment ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <SessionProvider>
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </api.Provider>
    </SessionProvider>
  );
}
