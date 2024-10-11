import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const resources = [
  { id: 1, title: 'Tips for Finding Remote Jobs', slug: 'remote-job-tips' },
  { id: 2, title: 'Interview Questions and Answers', slug: 'interview-questions' },
  { id: 3, title: 'Resume Examples', slug: 'resume-examples' },
  { id: 4, title: 'Cover Letter Examples', slug: 'cover-letter-examples' },
  // Add more resources as needed
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Resources</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <Card key={resource.id}>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{resource.title}</h2>
              <Link href={`/resources/${resource.slug}`} className="text-primary hover:underline">
                Read More
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}