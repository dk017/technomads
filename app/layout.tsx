import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthContext";
import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LoadingSpinner } from "@/components/loading-spinner";
import { TrialBanner } from "@/components/TrialBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Remote Launchpad - Find Your Dream Remote Job",
  description:
    "Discover and apply to the best remote jobs from around the world.",
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <LoadingSpinner />
                </div>
              }
            >
              <TrialBanner />
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Toaster />
            </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
