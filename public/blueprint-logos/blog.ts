import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  tags?: string[];
}

export function getBlogPosts(): Omit<BlogPost, "content">[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  
  return files
    .map((file) => {
      const filePath = path.join(contentDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      const slug = file.replace(/\.(mdx|md)$/, "");
      const rawDate = data.date ? new Date(data.date) : null;
      return {
        slug,
        title: data.title || slug,
        date: rawDate ? rawDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "",
        description: data.description || "",
        tags: data.tags || [],
        _rawDate: rawDate ? rawDate.getTime() : 0,
      };
    })
    .sort((a, b) => b._rawDate - a._rawDate)
    .map(({ _rawDate: _, ...post }) => post);
}

export function getBlogPost(slug: string): BlogPost | null {
  if (!fs.existsSync(contentDir)) {
    return null;
  }
  
  const mdxPath = path.join(contentDir, `${slug}.mdx`);
  const mdPath = path.join(contentDir, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  
  return {
    slug,
    title: data.title || slug,
    date: data.date ? new Date(data.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "",
    description: data.description || "",
    content,
    tags: data.tags || [],
  };
}
