import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Package } from "lucide-react";
import Providers from "@/lib/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const today = new Date().toDateString();
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <header className="bg-gray-900 h-14 text-white flex justify-between items-center px-4 lg:px-12 border-b border-white">
          <a href="/">
            <Package className="inline" />
            Hammoud Inc
          </a>

          <nav className="flex gap-x-6">
            <a href="/product/add">Add Product</a>
            <a href={`/work_days?date=${encodeURI(today)}`}>
              Work Days
            </a>
            <a href="#home">Home</a>
            <a href="/api/auth/signin">Login</a>
          </nav>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
