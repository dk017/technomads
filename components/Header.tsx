"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/dist/client/components/navigation";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { SubscriptionUpgrade } from "./SubscriptionUpgrade";
import { Menu, X } from "lucide-react"; // Import icons
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const [userName, setUserName] = useState<string | null>(null);
  const { tier, expiresAt, canUpgrade } = useSubscriptionStatus();
  const [isOpen, setIsOpen] = useState(false);

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

  const NavLinks = () => (
    <ul className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
      <li>
        <Link
          href="/jobs"
          className="text-foreground hover:text-primary block py-2 lg:py-0"
          onClick={() => setIsOpen(false)}
        >
          Jobs
        </Link>
      </li>
      <li>
        <Link
          href="/companies"
          className="text-foreground hover:text-primary block py-2 lg:py-0"
          onClick={() => setIsOpen(false)}
        >
          Companies
        </Link>
      </li>
      <li>
        <Link
          href="/blog"
          className="text-foreground hover:text-primary block py-2 lg:py-0"
          onClick={() => setIsOpen(false)}
        >
          Blog
        </Link>
      </li>
    </ul>
  );

  const AuthButtons = () => (
    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
      {user ? (
        <>
          <span className="text-sm lg:mr-4">Welcome, {userName}</span>
          {getSubscriptionBadge() && (
            <span className="text-sm text-muted-foreground lg:mr-4">
              {getSubscriptionBadge()}
            </span>
          )}
          {canUpgrade && tier !== "annual" && (
            <Button
              variant="outline"
              className="bg-primary/10 hover:bg-primary/20 text-primary w-full lg:w-auto"
            >
              <SubscriptionUpgrade />
            </Button>
          )}
          <Button onClick={handleSignOut} className="w-full lg:w-auto">
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" asChild className="w-full lg:w-auto">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="w-full lg:w-auto">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </>
      )}
    </div>
  );

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl lg:text-2xl font-bold text-primary">
            Only Remote Jobs
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <NavLinks />
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:block">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="lg:hidden p-2"
                aria-label="Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full py-6">
                <nav className="mb-8">
                  <NavLinks />
                </nav>
                <div className="mt-auto">
                  <AuthButtons />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
