"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/dist/client/components/navigation";
const Header = () => {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/login");
    router.prefetch("/forgot-password");
    if (user) {
      // Access the user's name from metadata with fallbacks
      const name =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "User";
      setUserName(name);

      // Prefetch authenticated routes
    } else {
      setUserName(null);
    }
  }, [user, router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Remote Launchpad
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/jobs" className="text-foreground hover:text-primary">
                Jobs
              </Link>
            </li>
            <li>
              <Link
                href="/companies"
                className="text-foreground hover:text-primary"
              >
                Companies
              </Link>
            </li>
            <li>
              <Link
                href="/resources"
                className="text-foreground hover:text-primary"
              >
                Resources
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="mr-4">Welcome, {userName}</span>
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
