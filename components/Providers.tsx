"use client";

import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeProvider";
import { Header } from "./Header";
import { SubscriptionProvider } from "@/app/contexts/SubscriptionContext";
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
      <AuthProvider>
        <SubscriptionProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main>{children}</main>
            <EmailCaptureWrapper />
          </div>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
