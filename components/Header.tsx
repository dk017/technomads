"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <ul className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
