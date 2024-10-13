"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from './AuthContext';

const Header = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, setUser } = useAuth();
  const supabase = createClientComponentClient();
  const [userName, setUserName] = useState<string | null>(null);


  useEffect(() => {
    if (user) {
      // Access the user's name from metadata
      const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
      setUserName(name);
    } else {
      setUserName(null);
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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
            {mounted && (theme === 'dark' ? <SunIcon /> : <MoonIcon />)}
          </Button>
          {user ? (
            <>
              <span className="mr-4">Welcome,  {userName}</span>
              <Button onClick={handleSignOut}>Sign Out</Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
