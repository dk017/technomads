"use client";

import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeProvider";
import { Header } from "./Header";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main>{children}</main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
