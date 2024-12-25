import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { EmailCaptureWrapper } from "@/components/EmailCaptureWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
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
