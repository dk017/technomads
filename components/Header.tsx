"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/dist/client/components/navigation";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { SubscriptionUpgrade } from "./SubscriptionUpgrade";
export function Header() {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const [userName, setUserName] = useState<string | null>(null);
  const { tier, expiresAt, canUpgrade } = useSubscriptionStatus();

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

  const getSubscriptionBadge = () => {
    if (!user) return null;

    switch (tier) {
      case "trial":
        const daysLeft = Math.ceil(
          (new Date(expiresAt!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return `Trial (${daysLeft} days left)`;
      case "monthly":
        return "Monthly Plan";
      case "annual":
        return "Annual Plan";
      default:
        return null;
    }
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Only Remote Jobs
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
              <Link href="/blog" className="text-foreground hover:text-primary">
                Blog
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="mr-4">Welcome, {userName}</span>
              {getSubscriptionBadge() && (
                <span className="text-sm text-muted-foreground mr-4">
                  {getSubscriptionBadge()}
                </span>
              )}
              {canUpgrade && tier !== "annual" && (
                <Button
                  variant="outline"
                  className="bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  <SubscriptionUpgrade />
                </Button>
              )}
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
}

export default Header;
