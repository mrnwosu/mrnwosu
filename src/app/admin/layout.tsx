import { redirect } from "next/navigation";
import { auth } from "@server/auth";
import { env } from "../../env.mjs";

const isDev = env.APP_ENV === "development";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If not authenticated, redirect to login route
  if (!session?.user) {
    redirect("/api/auth/login");
  }

  // Server-side admin authorization check
  if (!session.user.isAdmin) {
    redirect("/");
  }

  return (
    <>
      {isDev && (
        <div className="bg-amber-600 px-4 py-1 text-center text-xs font-medium text-black">
          DEV MODE — Uploads save locally to public/uploads
        </div>
      )}
      {children}
    </>
  );
}
