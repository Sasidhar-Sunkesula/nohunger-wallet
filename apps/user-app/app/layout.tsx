import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "../provider";
import { AppbarClient } from "../components/AppbarClient";
import { Toaster } from 'react-hot-toast';

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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <Providers>
        <body className={inter.className}>
          <div className="min-w-screen dark:bg-gray-800 dark:text-white min-h-screen">
            <AppbarClient />
            <div className="mt-16 px-4 md:px-6 lg:px-8">{children}</div>
            <Toaster position="top-center" reverseOrder={false} />
          </div>
        </body>
      </Providers>
    </html>
  );
}
