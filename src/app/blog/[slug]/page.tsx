import { getBlogPost, getBlogSlugs } from "@utils/blog";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found - Mr. Nwosu",
    };
  }

  return {
    title: `${post.title} - Mr. Nwosu`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
