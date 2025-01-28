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
                  href="/remote-jobs-in-the-united-states"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in the United States
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-jobs-in-india"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in India
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-jobs-in-canada"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Canada
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-jobs-in-mexico"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Mexico
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-jobs-in-germany"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Germany
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-jobs-in-the-united-kingdom"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in the United Kingdom
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-jobs-in-australia"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Australia
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-jobs-in-spain"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in Spain
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-jobs-in-france"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Jobs in France
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-jobs-in-brazil"
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
                  href="/remote-developer-jobs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Software Developer Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-sales-jobs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Sales Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-analyst-jobs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Analyst Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-product-manager-jobs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Product Manager Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-customer-support-jobs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Customer Support Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-design-jobs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Design Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-marketing-jobs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Remote Marketing Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/remote-devops-jobs"
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
          <p>&copy; 2025 Only Remote Jobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
