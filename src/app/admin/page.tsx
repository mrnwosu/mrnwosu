import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@server/auth";

export default async function AdminDashboard() {
  // Server-side session is guaranteed by layout.tsx
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-black py-20 px-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="font-gravitas text-5xl font-bold text-white md:text-6xl">
            Admin Dashboard
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Welcome back, {session?.user?.name ?? "Admin"}
          </p>
        </div>

        {/* Admin Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Submissions */}
          <Link href="/admin/contact">
            <div className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-6 transition hover:bg-white/10 hover:border-cyan-500/50">
              <h2 className="text-xl font-bold text-white">Contact Messages</h2>
              <p className="mt-2 text-white/60">
                View and manage contact form submissions
              </p>
              <p className="mt-4 text-cyan-400">Browse Messages →</p>
            </div>
          </Link>

          {/* Blog Management */}
          <Link href="/admin/blog">
            <div className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-6 transition hover:bg-white/10 hover:border-cyan-500/50">
              <h2 className="text-xl font-bold text-white">Blog Posts</h2>
              <p className="mt-2 text-white/60">
                Create, edit, and publish blog posts
              </p>
              <p className="mt-4 text-cyan-400">Manage Posts →</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
