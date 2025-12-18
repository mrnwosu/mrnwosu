import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const errorConfig: Record<
    string,
    { title: string; message: string; icon: string }
  > = {
    AccessDenied: {
      title: "Access Denied",
      message:
        "Your email is not authorized to access this area. But there's still plenty to explore!",
      icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
    },
    Configuration: {
      title: "Configuration Error",
      message:
        "There is a problem with the server configuration. Please contact the administrator.",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    },
    Verification: {
      title: "Verification Failed",
      message:
        "The verification token has expired or has already been used.",
      icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    Default: {
      title: "Authentication Error",
      message: "An error occurred during authentication. Please try again.",
      icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  };

  const config = errorConfig[error ?? "Default"] ?? errorConfig.Default!;

  const navigationLinks = [
    {
      href: "/",
      label: "Home",
      description: "Back to the main page",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      href: "/blog",
      label: "Blog",
      description: "Read my latest posts",
      icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    },
    {
      href: "/contact",
      label: "Contact",
      description: "Get in touch with me",
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-950 px-4">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="rounded-2xl border border-warm-700/30 bg-warm-800/50 p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-900/30">
              <svg
                className="h-8 w-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={config.icon}
                />
              </svg>
            </div>
            <h1 className="font-gravitas text-2xl text-warm-100 sm:text-3xl">
              {config.title}
            </h1>
            <p className="mt-2 text-sm text-warm-400">{config.message}</p>
          </div>

          {/* Navigation Options */}
          <div className="space-y-3">
            <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-warm-500">
              Where would you like to go?
            </p>
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 rounded-xl border border-warm-700/30 bg-warm-900/30 p-4 transition-all hover:border-warm-600/50 hover:bg-warm-800/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warm-700/50">
                  <svg
                    className="h-5 w-5 text-warm-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={link.icon}
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-warm-100">{link.label}</p>
                  <p className="text-sm text-warm-400">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
