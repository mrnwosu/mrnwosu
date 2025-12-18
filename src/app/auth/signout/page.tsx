import { auth, signOut } from "@server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function SignOutPage() {
  const session = await auth();

  // If not signed in, redirect to home
  if (!session?.user) {
    redirect("/");
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h1 className="font-gravitas text-2xl text-warm-100 sm:text-3xl">
              Sign Out
            </h1>
            <p className="mt-2 text-sm text-warm-400">
              Are you sure you want to sign out?
            </p>
          </div>

          {/* User Info */}
          <div className="mb-6 flex items-center gap-4 rounded-xl bg-warm-900/50 p-4">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warm-700">
                <span className="text-lg font-medium text-warm-200">
                  {session.user.name?.[0] ?? session.user.email?.[0] ?? "?"}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-warm-100">
                {session.user.name ?? "User"}
              </p>
              <p className="truncate text-sm text-warm-400">
                {session.user.email}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-900/50 px-4 py-3.5 font-medium text-red-200 transition-all hover:bg-red-800/50 hover:shadow-lg hover:shadow-red-900/30"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </button>
          </form>

          {/* Cancel Link */}
          <Link
            href="/admin"
            className="mt-4 block text-center text-sm text-warm-400 transition-colors hover:text-warm-300"
          >
            Cancel and go back
          </Link>
        </div>

        {/* Home Link */}
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
