import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost } from '../components/types'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export async function getAllPosts(): Promise<BlogPost[]> {
  const categories = fs.readdirSync(BLOG_DIR)

  const posts = categories.flatMap(category => {
    const categoryPath = path.join(BLOG_DIR, category)
    const files = fs.readdirSync(categoryPath)

    return files.map(filename => {
      const filePath = path.join(categoryPath, filename)
      const source = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(source)

      return {
        ...data,
        slug: filename.replace('.mdx', ''),
        category,
      } as unknown as BlogPost
    })
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.category === category)
}