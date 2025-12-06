import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@utils/api";

const AdminContact: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: submissions = [], isLoading, refetch } = api.contact.getAll.useQuery(
    undefined,
    { enabled: status === "authenticated" && session?.user?.isAdmin }
  );

  const deleteMutation = api.contact.delete.useMutation({
    onSuccess: () => {
      setDeleteConfirm(null);
      void refetch();
    },
  });

  useEffect(() => {
    // Redirect if not authenticated or not admin
    if (status === "unauthenticated") {
      void router.push("/");
    } else if (status === "authenticated" && !session?.user?.isAdmin) {
      void router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Contact Submissions - Admin</title>
        <meta name="description" content="Admin contact submissions" />
      </Head>
      <main className="min-h-screen bg-black py-20 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-cyan-400 hover:text-cyan-300">
                ← Back to Admin
              </Link>
              <h1 className="mt-2 font-gravitas text-5xl font-bold text-white">
                Contact Messages
              </h1>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white/60">No contact messages yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{submission.name}</h3>
                      <p className="text-sm text-cyan-400">{submission.email}</p>
                      <p className="mt-2 text-white/80">{submission.message}</p>
                      <p className="mt-2 text-xs text-white/40">
                        {new Date(submission.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(submission.id)}
                      className="ml-4 rounded-lg bg-red-600/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-600/30"
                    >
                      Delete
                    </button>
                  </div>

                  {deleteConfirm === submission.id && (
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="text-sm text-white/60">
                        Are you sure you want to delete this message?
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            deleteMutation.mutate({ id: submission.id });
                          }}
                          disabled={deleteMutation.isLoading}
                          className="rounded bg-red-600 px-4 py-1 text-sm text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                          {deleteMutation.isLoading ? "Deleting..." : "Confirm Delete"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded bg-white/10 px-4 py-1 text-sm text-white transition hover:bg-white/20"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminContact;

// Disable static generation for admin pages (requires session)
export function getServerSideProps() {
  return { props: {} };
}
