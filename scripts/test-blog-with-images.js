const API_KEY = process.argv[2] || process.env.API_KEY;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

if (!API_KEY) {
  console.error("Usage: node scripts/test-blog-with-images.js YOUR_API_KEY");
  process.exit(1);
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(12, 0, 0, 0);

const blogPosts = [
  {
    title: "The Art of Clean Code Architecture",
    content: "# The Art of Clean Code Architecture\n\nWriting clean code is more than syntax rules.\n\n## Core Principles\n\n- Single Responsibility\n- Dependency Inversion\n- Keep It Simple",
    tags: ["programming", "architecture"],
    featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
    draft: false,
  },
  {
    title: "Modern CSS Beyond Flexbox",
    content: "# Modern CSS Beyond Flexbox\n\nCSS has evolved. Container queries, nesting, and :has() are game changers.\n\n## New Features\n\n- Container Queries\n- CSS Nesting\n- :has() Selector",
    tags: ["css", "webdev"],
    featuredImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=630&fit=crop",
    draft: false,
  },
  {
    title: "Building a Home Gym on a Budget",
    content: "# Building a Home Gym on a Budget\n\nYou don't need a commercial gym.\n\n## Essentials\n\n- Adjustable dumbbells\n- Pull-up bar\n- Resistance bands",
    tags: ["fitness", "lifestyle"],
    featuredImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=630&fit=crop",
    draft: false,
  },
  {
    title: "React Server Components Explained",
    content: "# React Server Components Explained\n\nServer Components render on the server and send HTML.\n\n## Benefits\n\n- Smaller bundles\n- Direct database access\n- Better SEO",
    tags: ["react", "nextjs"],
    featuredImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop",
    scheduledAt: tomorrow.toISOString(),
  },
  {
    title: "PostgreSQL Performance Tuning",
    content: "# PostgreSQL Performance Tuning\n\nYour queries are slow? Fix that.\n\n## Tips\n\n- Use EXPLAIN ANALYZE\n- Create proper indexes\n- Connection pooling",
    tags: ["postgresql", "database"],
    featuredImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=630&fit=crop",
    scheduledAt: tomorrow.toISOString(),
  },
  {
    title: "Mastering the Deadlift",
    content: "# Mastering the Deadlift\n\nThe king of all exercises.\n\n## Setup\n\n- Feet hip-width apart\n- Bar over mid-foot\n- Hips back, chest up",
    tags: ["fitness", "strength"],
    featuredImage: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1200&h=630&fit=crop",
    scheduledAt: tomorrow.toISOString(),
  },
];

async function createPost(post) {
  const response = await fetch(`${BASE_URL}/api/blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
    body: JSON.stringify(post),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}

async function main() {
  console.log("Creating 6 blog posts (3 published, 3 scheduled)...\n");
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    try {
      const result = await createPost(post);
      const status = result.post.scheduledAt ? "Scheduled" : "Published";
      console.log(`${i + 1}. [${status}] ${result.post.title}`);
      console.log(`   Slug: ${result.post.slug}`);
      if (result.post.scheduledAt) {
        console.log(`   For: ${new Date(result.post.scheduledAt).toLocaleString()}`);
      }
    } catch (error) {
      console.error(`Failed: ${post.title} - ${error.message}`);
    }
  }
  console.log("\nDone!");
}

main().catch(console.error);
