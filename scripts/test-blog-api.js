/**
 * Test script for Blog API - Creates 5 random blog posts
 *
 * Usage:
 *   node scripts/test-blog-api.js YOUR_API_KEY
 *
 * Or set API_KEY environment variable:
 *   API_KEY=mrnw_xxx node scripts/test-blog-api.js
 */

const API_KEY = process.argv[2] || process.env.API_KEY;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

if (!API_KEY) {
  console.error("❌ Error: API key required");
  console.error("Usage: node scripts/test-blog-api.js YOUR_API_KEY");
  process.exit(1);
}

const blogPosts = [
  {
    title: "Getting Started with TypeScript in 2025",
    content: `# Getting Started with TypeScript in 2025

TypeScript has become the de facto standard for modern JavaScript development. Here's why you should adopt it.

## Why TypeScript?

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: IntelliSense and autocompletion
- **Refactoring**: Safely rename and restructure code

## Quick Setup

\`\`\`bash
npm install -D typescript
npx tsc --init
\`\`\`

## Basic Types

\`\`\`typescript
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
\`\`\`

Happy coding!`,
    tags: ["typescript", "programming", "tutorial"],
    draft: false,
  },
  {
    title: "Building REST APIs with Next.js App Router",
    content: `# Building REST APIs with Next.js App Router

Next.js 13+ introduced the App Router with a new way to build APIs.

## Route Handlers

Create a \`route.ts\` file in your app directory:

\`\`\`typescript
// app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ created: body });
}
\`\`\`

## Best Practices

1. Validate input with Zod
2. Use proper HTTP status codes
3. Handle errors gracefully
4. Add rate limiting for production`,
    tags: ["nextjs", "api", "webdev"],
    draft: false,
  },
  {
    title: "My Journey into Fitness: 6 Month Update",
    content: `# My Journey into Fitness: 6 Month Update

It's been six months since I started taking fitness seriously. Here's what I've learned.

## The Beginning

Like many developers, I spent most of my day sitting. My back hurt, my energy was low, and I knew something had to change.

## What Worked

- **Consistency over intensity**: 3-4 sessions per week
- **Progressive overload**: Gradually increasing weights
- **Proper nutrition**: Protein intake and meal timing

## Current Stats

| Metric | Start | Now |
|--------|-------|-----|
| Weight | 185 lbs | 175 lbs |
| Bench | 135 lbs | 185 lbs |
| Squat | 185 lbs | 275 lbs |

## Next Goals

Aiming for a 315 squat by year end!`,
    tags: ["fitness", "lifestyle", "personal"],
    draft: false,
  },
  {
    title: "Prisma ORM: Tips and Tricks",
    content: `# Prisma ORM: Tips and Tricks

After using Prisma for several projects, here are some tips I wish I knew earlier.

## 1. Use Select for Performance

\`\`\`typescript
// Instead of fetching everything
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    // Only what you need
  },
});
\`\`\`

## 2. Transactions for Data Integrity

\`\`\`typescript
await prisma.$transaction([
  prisma.account.update({ ... }),
  prisma.log.create({ ... }),
]);
\`\`\`

## 3. Middleware for Logging

\`\`\`typescript
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  console.log(\`Query took \${Date.now() - before}ms\`);
  return result;
});
\`\`\`

These tips should help you write better Prisma code!`,
    tags: ["prisma", "database", "tutorial"],
    draft: false,
  },
  {
    title: "Scheduled Post: Testing the Cron Feature",
    content: `# Scheduled Post: Testing the Cron Feature

This post was created to test the scheduled publishing feature.

## How It Works

1. Set a \`scheduledAt\` date in the future
2. Post is saved as unpublished
3. Vercel cron runs daily at 8 AM EST
4. Posts with past \`scheduledAt\` dates get published

## Implementation Details

The cron job queries:
\`\`\`sql
SELECT * FROM BlogPost
WHERE published = false
AND scheduledAt <= NOW()
\`\`\`

Then updates each to \`published = true\`.

Simple and effective!`,
    tags: ["testing", "features"],
    // Schedule for tomorrow
    scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
];

async function createPost(post) {
  const response = await fetch(`${BASE_URL}/api/blog`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(post),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to create post: ${JSON.stringify(data)}`);
  }

  return data;
}

async function main() {
  console.log("🚀 Creating 5 test blog posts...\n");

  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    try {
      const result = await createPost(post);
      const status = result.post.scheduledAt ? "📅 Scheduled" : result.post.published ? "✅ Published" : "📝 Draft";
      console.log(`${i + 1}. ${status} - "${result.post.title}"`);
      console.log(`   Slug: ${result.post.slug}`);
      if (result.post.scheduledAt) {
        console.log(`   Scheduled for: ${new Date(result.post.scheduledAt).toLocaleString()}`);
      }
      console.log("");
    } catch (error) {
      console.error(`❌ Failed to create "${post.title}": ${error.message}\n`);
    }
  }

  console.log("✨ Done!");
}

main().catch(console.error);
