import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";

/**
 * Parse the ADMIN_EMAILS environment variable (CSV of allowed emails)
 */
function getAdminEmails(): string[] {
  const adminEmails = process.env.ADMIN_EMAILS ?? "";
  return adminEmails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

/**
 * Check if an email is in the admin whitelist
 */
function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    /**
     * Control who can sign in - only allow whitelisted emails
     */
    signIn({ user }) {
      const allowed = isAdminEmail(user.email);
      if (!allowed) {
        // Returning false blocks the sign-in
        return false;
      }
      return true;
    },
    /**
     * Add isAdmin to the session
     */
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // User is admin if their email is in the whitelist
        session.user.isAdmin = isAdminEmail(session.user.email);
      }
      return session;
    },
  },
  events: {
    /**
     * When a user is created, set isAdmin based on email whitelist
     */
    async createUser({ user }) {
      if (isAdminEmail(user.email)) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isAdmin: true },
        });
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

// Type augmentation for next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    isAdmin?: boolean;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    isAdmin?: boolean;
  }
}
