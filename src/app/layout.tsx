import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Grow CRM — CSV Importer",
  description: "AI-powered CRM contact import",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
