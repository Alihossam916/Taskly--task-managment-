import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// providers
import ToastProvider from "../providers/toastProvider";

// components
import RecoveryHandler from "../components/common/auth/RecoveryHandler";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskly",
  description: "Manage your tasks easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ToastProvider />
        <RecoveryHandler />
        {children}
      </body>
    </html>
  );
}
