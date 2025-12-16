import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@server/auth";

export default async function AdminDashboard() {
  // Server-side session is guaranteed by layout.tsx
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-warm-950 py-16 px-4 sm:py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="font-gravitas text-3xl text-warm-100 sm:text-4xl md:text-5xl lg:text-6xl">
            Admin Dashboard
          </h1>
          <div className="my-3 h-0.5 w-16 rounded-full bg-warm-500 sm:my-4 sm:h-1 sm:w-24" />
          <p className="text-base text-warm-300 sm:text-lg">
            Welcome back, {session?.user?.name ?? "Admin"}
          </p>
        </div>

        {/* Admin Sections */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {/* Contact Submissions */}
          <Link href="/admin/contact">
            <div className="cursor-pointer rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 transition hover:bg-warm-800/70 hover:border-warm-500/50 sm:rounded-2xl sm:p-6">
              <h2 className="text-lg font-semibold text-warm-100 sm:text-xl">Contact Messages</h2>
              <p className="mt-2 text-sm text-warm-300 sm:text-base">
                View and manage contact form submissions
              </p>
              <p className="mt-4 text-warm-400 hover:text-warm-300 transition-colors">Browse Messages →</p>
            </div>
          </Link>

          {/* Blog Management */}
          <Link href="/admin/blog">
            <div className="cursor-pointer rounded-xl border border-warm-700/30 bg-warm-800/50 p-5 transition hover:bg-warm-800/70 hover:border-warm-500/50 sm:rounded-2xl sm:p-6">
              <h2 className="text-lg font-semibold text-warm-100 sm:text-xl">Blog Posts</h2>
              <p className="mt-2 text-sm text-warm-300 sm:text-base">
                Create, edit, and publish blog posts
              </p>
              <p className="mt-4 text-warm-400 hover:text-warm-300 transition-colors">Manage Posts →</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
