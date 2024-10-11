"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

const Header = () => {
  const { setTheme, theme } = useTheme();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Remote Launchpad
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/jobs" className="text-foreground hover:text-primary">Jobs</Link></li>
            <li><Link href="/companies" className="text-foreground hover:text-primary">Companies</Link></li>
            <li><Link href="/resources" className="text-foreground hover:text-primary">Resources</Link></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
          <Button asChild>
            <Link href="/post-job">Post a Job</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;