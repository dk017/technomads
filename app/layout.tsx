import { Providers } from "@/components/Providers";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { EmailCaptureWrapper } from "@/components/EmailCaptureWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechNomads",
  description: "Your site description",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
