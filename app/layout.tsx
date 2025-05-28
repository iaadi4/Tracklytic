import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "Tracklytic",
  description: "Tracklytic is a habit, expense, budget and attendance tracker",
  icons: {
    icon: "/images/tracklytic.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <Toaster />
          {children}
      </body>
    </html>
  );
}
