import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Job = {
  id: number;
  title: string;
  company: string;
  description: string;
};

type JobListProps = {
  jobs: Job[];
};

export default function JobList({ jobs }: JobListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{job.company}</p>
            <p className="mt-2">{job.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}