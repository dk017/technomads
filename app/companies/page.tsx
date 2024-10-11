import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const companies = [
  { id: 1, name: 'TechCorp', industry: 'Software Development', jobCount: 15 },
  { id: 2, name: 'InnovateCo', industry: 'Product Management', jobCount: 8 },
  { id: 3, name: 'DesignHub', industry: 'Design', jobCount: 12 },
  // Add more companies as needed
];

export default function CompaniesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Companies Hiring Remotely</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
          <Card key={company.id}>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{company.name}</h2>
              <p className="text-muted-foreground mb-4">{company.industry}</p>
              <p className="mb-4">{company.jobCount} open positions</p>
              <Button asChild>
                <Link href={`/companies/${company.id}`}>View Jobs</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}