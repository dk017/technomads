import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background border-t ">
      <div className="container mx-auto px-4 py-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Jobs By Country</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/jobs?location=United+States"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in the United States
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?location=India"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in India
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?location=Canada"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Canada
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?location=Mexico"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Mexico
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?location=Germany"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Germany
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?location=United+Kingdom"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in the United Kingdom
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?location=Australia"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Australia
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?location=Spain"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Spain
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?location=France"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in France
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?location=Brazil"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Brazil
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Remote Jobs By Title</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/jobs?title=developer"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Software Developer Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?title=sales"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Sales Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?title=analyst"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Analyst Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/obs?title=product"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Product Manager Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?title=customer+support"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Customer Support Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs?title=design"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Design Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/obs?title=marketing"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Marketing Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/obs?title=devops"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote DevOps Jobs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resources/remote-job-tips"
                  className="text-muted-foreground hover:text-primary"
                >
                  Tips for Finding Remote Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/interview-questions"
                  className="text-muted-foreground hover:text-primary"
                >
                  Interview Questions and Answers
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/resume-examples"
                  className="text-muted-foreground hover:text-primary"
                >
                  Resume Examples
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/cover-letter-examples"
                  className="text-muted-foreground hover:text-primary"
                >
                  Cover Letter Examples
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
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
