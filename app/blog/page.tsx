import type { Metadata } from "next";
import Link from "next/link";
import { InterfaceExplorer } from "@/components/interface-explorer";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and insights on web development",
};

export default async function BlogPage() {
  const posts = getBlogPosts();
  
  return (
    <InterfaceExplorer initialView="blog">
      <div className="container py-20">
        <h1 className="mb-4 text-4xl font-bold">Blog</h1>
        <p className="mb-12 text-muted-foreground">
          Thoughts, tutorials, and insights on web development and technology.
        </p>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet. Check back soon!</p>
        ) : (
          <div className="grid gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="rounded-lg border p-6 transition-colors hover:border-primary"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="mb-2 text-2xl font-semibold transition-colors hover:text-primary">
                    {post.title}
                  </h2>
                </Link>
                <p className="mb-3 text-sm text-muted-foreground">{post.date}</p>
                <p className="text-muted-foreground">{post.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </InterfaceExplorer>
  );
}
