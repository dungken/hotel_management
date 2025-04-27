import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from '@/components/ui/toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "A modern hotel management system built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
} 