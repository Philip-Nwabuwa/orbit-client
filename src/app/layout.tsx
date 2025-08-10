import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import AppDock from "@/components/AppDock/AppDock";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orbit - Team Collaboration",
  description:
    "Modern team collaboration platform for seamless communication and project management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
