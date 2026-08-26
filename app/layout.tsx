import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexTravel Holidays — Explore the World",
  description:
    "Discover beautiful destinations, unforgettable adventures and curated holiday packages with NexTravel Holidays.",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-black font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
