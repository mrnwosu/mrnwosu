import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">Post not found</h1>
        <Link href="/blog" className="text-cyan-400 hover:text-cyan-300">
          Back to blog
        </Link>
      </div>
    </div>
  );
}
