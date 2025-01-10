"use client";

import { ThemeProvider } from "./ThemeProvider";
import { Header } from "./Header";
import { EmailCaptureWrapper } from "./EmailCaptureWrapper";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Toaster />
      <div className="min-h-screen bg-background">
        <Header />
        <main>{children}</main>
        <EmailCaptureWrapper />
      </div>
    </ThemeProvider>
  );
}
