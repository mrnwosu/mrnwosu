import { getAllBlogPosts, getAllBlogTags } from "@utils/blog";
import BlogIndexClient from "./BlogIndexClient";

export const metadata = {
  title: "Blog - Mr. Nwosu",
  description: "Thoughts, ideas, and stories from the code.",
};

export const revalidate = 3600; // Revalidate every hour

export default function BlogIndex() {
  const posts = getAllBlogPosts();
  const tags = getAllBlogTags();

  return <BlogIndexClient posts={posts} tags={tags} />;
}
