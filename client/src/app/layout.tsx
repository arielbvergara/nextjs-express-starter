import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basic Website Boilerplate",
  description: "Next.js + Express with Google services integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
