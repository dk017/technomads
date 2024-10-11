"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const jobListings = [
  { id: 1, title: 'Senior Software Engineer', company: 'TechCorp', location: 'Remote', salary: '$120,000 - $160,000', posted: '2 hours ago' },
  { id: 2, title: 'Product Manager', company: 'InnovateCo', location: 'Remote', salary: '$100,000 - $130,000', posted: '1 day ago' },
  { id: 3, title: 'UX Designer', company: 'DesignHub', location: 'Remote', salary: '$80,000 - $110,000', posted: '3 days ago' },
  // Add more job listings as needed
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const filteredJobs = jobListings.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterLocation === '' || job.location === filterLocation)
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Remote Jobs</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select onValueChange={setFilterLocation}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="Europe">Europe</SelectItem>
          </SelectContent>
        </Select>
        <Button>Search</Button>
      </div>

      <div className="space-y-6">
        {filteredJobs.map(job => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-muted-foreground mb-2">{job.company} • {job.location}</p>
                  <p className="text-muted-foreground mb-4">{job.salary}</p>
                </div>
                <Button>Apply Now</Button>
              </div>
              <p className="text-sm text-muted-foreground">Posted {job.posted}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}