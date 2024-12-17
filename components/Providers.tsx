"use client";

import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeProvider";
import { Header } from "./Header";
import { SubscriptionProvider } from "@/app/contexts/SubscriptionContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <SubscriptionProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main>{children}</main>
          </div>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
