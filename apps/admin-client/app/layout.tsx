import { Geist, Geist_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Toaster } from "@workspace/ui/components/sonner";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "LabelChain Admin - Web3 Labeling Platform",
  description: "Create and manage labeling tasks with Solana rewards",
  icons: {
    icon: "/logo.png"
  }
};

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          {children}
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
