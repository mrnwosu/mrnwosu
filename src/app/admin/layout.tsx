import { redirect } from "next/navigation";
import { auth } from "@server/auth";

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

  return <>{children}</>;
}
