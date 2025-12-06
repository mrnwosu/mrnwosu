import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@server/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Server-side authentication check
  if (!session?.user) {
    redirect("/");
  }

  // Server-side admin authorization check
  if (!session.user.isAdmin) {
    redirect("/");
  }

  return <>{children}</>;
}
