import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Search</h3>
            <ul className="space-y-2">
              <li><Link href="/jobs/by-country" className="text-muted-foreground hover:text-primary">Search Jobs by Country</Link></li>
              <li><Link href="/jobs/by-city" className="text-muted-foreground hover:text-primary">Search Jobs by City</Link></li>
              <li><Link href="/jobs/by-title" className="text-muted-foreground hover:text-primary">Search Jobs by Title</Link></li>
              <li><Link href="/jobs/entry-level" className="text-muted-foreground hover:text-primary">Search Entry-level Jobs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Remote Jobs</h3>
            <ul className="space-y-2">
              <li><Link href="/jobs" className="text-muted-foreground hover:text-primary">All Remote Jobs</Link></li>
              <li><Link href="/companies" className="text-muted-foreground hover:text-primary">Companies Hiring Remotely</Link></li>
              <li><Link href="/jobs/sales" className="text-muted-foreground hover:text-primary">Remote Sales Jobs</Link></li>
              <li><Link href="/jobs/software-engineering" className="text-muted-foreground hover:text-primary">Remote Software Engineering Jobs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/resources/remote-job-tips" className="text-muted-foreground hover:text-primary">Tips for Finding Remote Jobs</Link></li>
              <li><Link href="/resources/interview-questions" className="text-muted-foreground hover:text-primary">Interview Questions and Answers</Link></li>
              <li><Link href="/resources/resume-examples" className="text-muted-foreground hover:text-primary">Resume Examples</Link></li>
              <li><Link href="/resources/cover-letter-examples" className="text-muted-foreground hover:text-primary">Cover Letter Examples</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-muted-foreground">
          <p>&copy; 2024 Remote Launchpad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;