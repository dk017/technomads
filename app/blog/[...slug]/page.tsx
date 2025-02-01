import { MDXRemote } from "next-mdx-remote/rsc";
import "../../../mdx.css";
import Link from "next/link";

export const runtime = "edge";

interface BlogPost {
  title: string;
  author: string;
  date: string;
  content: string;
}

async function getPost(slug: string[]): Promise<BlogPost | null> {
  try {
    // Instead of reading from filesystem, fetch from public URL
    const response = await fetch(
      `https://raw.githubusercontent.com/dk017/technomads/main/content/blog/${slug.join(
        "/"
      )}.mdx`
    );

    if (!response.ok) {
      return null;
    }

    const source = await response.text();

    // Simple frontmatter parsing since we can't use gray-matter in Edge
    const frontMatterRegex = /---\n([\s\S]*?)\n---/;
    const match = source.match(frontMatterRegex);

    if (!match) {
      return null;
    }

    const frontMatter = match[1];
    const content = source.replace(frontMatterRegex, "").trim();

    // Parse frontmatter manually
    const data: any = {};
    frontMatter.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length) {
        data[key.trim()] = valueParts.join(":").trim();
      }
    });

    return {
      title: data.title || "",
      author: data.author || "",
      date: data.date || "",
      content,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Create a Button component
const BrowseJobsButton = () => (
  <Link
    href="/"
    className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    Browse Remote Jobs
  </Link>
);

// Add it to your MDX components
const components = {
  BrowseJobsButton,
};

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
        <MDXRemote source={post.content} components={components} />
      </div>
    </article>
  );
}
