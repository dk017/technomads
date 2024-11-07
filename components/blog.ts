export type BlogCategory =
  | 'interview-questions'
  | 'career-guides'
  | 'how-to';

export interface BlogPost {
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: string;
  featured?: boolean;
}