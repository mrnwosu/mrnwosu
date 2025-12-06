import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { env } from "../env.mjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
