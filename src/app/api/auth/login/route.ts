import { signIn } from "@server/auth";

export async function GET() {
  await signIn("google", { redirectTo: "/admin" });
}
