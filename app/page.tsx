import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { RocketIcon, SearchIcon, BriefcaseIcon, GlobeIcon, StarIcon } from 'lucide-react';

const featuredJobs = [
  { id: 1, title: 'Senior React Developer', company: 'TechInnovate', location: 'Remote', salary: '$120k - $160k' },
  { id: 2, title: 'Product Marketing Manager', company: 'GrowthCo', location: 'Remote (US)', salary: '$90k - $120k' },
  { id: 3, title: 'UX/UI Designer', company: 'DesignMasters', location: 'Remote (Worldwide)', salary: '$80k - $110k' },
  { id: 4, title: 'Data Scientist', company: 'DataDriven', location: 'Remote (Europe)', salary: '$100k - $140k' },
];

const testimonials = [
  {
    name: 'Jason Cannon',
    title: 'Senior Software Engineer',
    image: 'https://source.unsplash.com/random/100x100?face=1',
    rating: 5,
    review: 'Remote Launchpad makes it easy to find remote jobs in my field, and their smooth easy UI makes managing and applying for them a breeze. Easily worth the investment for finding your next job.',
    date: 'Oct 7, 2024',
  },
  {
    name: 'Christopher Netten',
    title: 'Frontend Engineer',
    image: 'https://source.unsplash.com/random/100x100?face=2',
    rating: 5,
    review: 'Navigating job boards and company websites can be challenging, but Remote Launchpad simplifies the process of finding the right roles. I highly recommend it!',
    date: 'Oct 7, 2024',
  },
  {
    name: 'Greg West',
    title: 'HR Director',
    image: 'https://source.unsplash.com/random/100x100?face=3',
    rating: 5,
    review: 'Outstanding remote job board for professionals! Very detailed listing updated daily.',
    date: 'Oct 4, 2024',
  },
  {
    name: 'Christina Romero',
    title: 'Bookkeeper',
    image: 'https://source.unsplash.com/random/100x100?face=4',
    rating: 4,
    review: 'This is my first week with Remote Launchpad, and though I haven\'t landed a job yet, I\'m impressed with the variety of opportunities available.',
    date: 'Oct 5, 2024',
  },
  {
    name: 'Hossam Zaher',
    title: 'Software Engineer',
    image: 'https://source.unsplash.com/random/100x100?face=5',
    rating: 5,
    review: 'I\'ve been using Remote Launchpad for a few weeks, and it\'s already become my go-to platform for finding remote work opportunities.',
    date: 'Oct 3, 2024',
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* ... (previous sections remain unchanged) ... */}

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Why Choose Remote Launchpad?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <RocketIcon className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Launch Your Career</h3>
            <p className="text-muted-foreground">Find the perfect remote job to take your career to new heights</p>
          </div>
          <div className="text-center">
            <GlobeIcon className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Work from Anywhere</h3>
            <p className="text-muted-foreground">Enjoy the flexibility of working from home or anywhere in the world</p>
          </div>
          <div className="text-center">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quality Opportunities</h3>
            <p className="text-muted-foreground">Access top remote jobs from leading companies worldwide</p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Wall of Love</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm mb-2">{testimonial.review}</p>
                <p className="text-xs text-muted-foreground">{testimonial.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-8">Ready to Launch Your Remote Career?</h2>
        <Button size="lg" asChild>
          <Link href="/jobs">
            <RocketIcon className="mr-2 h-4 w-4" /> Explore All Jobs
          </Link>
        </Button>
      </section>
    </div>
  );
}