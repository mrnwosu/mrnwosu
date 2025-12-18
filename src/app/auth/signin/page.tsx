import { auth, signIn } from "@server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SignInPage() {
  const session = await auth();

  // If already signed in, redirect to admin
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-950 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-warm-700/30 bg-warm-800/50 p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-warm-700/50">
              <svg
                className="h-8 w-8 text-warm-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="font-gravitas text-2xl text-warm-100 sm:text-3xl">
              Admin Sign In
            </h1>
            <p className="mt-2 text-sm text-warm-400">
              Sign in with your authorized Google account
            </p>
          </div>

          {/* Sign In Button */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/admin" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-warm-700 px-4 py-3.5 font-medium text-warm-100 transition-all hover:bg-warm-600 hover:shadow-lg hover:shadow-warm-900/50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-warm-700/50" />
            <span className="text-xs text-warm-500">Authorized access only</span>
            <div className="h-px flex-1 bg-warm-700/50" />
          </div>

          {/* Info */}
          <p className="text-center text-xs text-warm-500">
            Only whitelisted email addresses can access the admin dashboard.
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-warm-400 transition-colors hover:text-warm-300"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
