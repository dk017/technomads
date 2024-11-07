import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import "../../../mdx.css";

interface BlogPost {
  title: string;
  author: string;
  date: string;
  content: string;
}

async function getPost(slug: string[]): Promise<BlogPost | null> {
  const blogDir = path.join(process.cwd(), "content/blog");

  // Join the slug array with forward slashes
  const fullPath = path.join(blogDir, `${slug.join("/")}.mdx`);
  console.log("Attempting to read:", fullPath);

  if (fs.existsSync(fullPath)) {
    const source = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(source);
    return { ...(data as BlogPost), content };
  }

  // If not found, return null
  console.log("File not found:", fullPath);
  return null;
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string[] };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <span>{post.author}</span>
          <span>•</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span>•</span>
        </div>
      </header>

      <div className="mdx-article prose prose-lg max-w-none">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
