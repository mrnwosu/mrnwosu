import { getAllBlogPosts, getAllBlogTags } from "@utils/blog";
import BlogIndexClient from "./BlogIndexClient";

export const metadata = {
  title: "Blog - Mr. Nwosu",
  description: "Thoughts, ideas, and stories from the code.",
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogIndex() {
  const posts = await getAllBlogPosts();
  const tags = await getAllBlogTags();

  return <BlogIndexClient posts={posts} tags={tags} />;
}
