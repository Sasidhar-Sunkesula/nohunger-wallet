import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../provider";
import { AppbarClient } from "../components/AppbarClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoHunger",
  description: "Food Ordering App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <div className="min-w-screen dark:bg-gray-800 dark:text-white min-h-screen">
            <AppbarClient />
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}
