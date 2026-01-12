import type { Metadata } from "next";
import { Anta, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const anta = Anta({
  weight: "400",
});

export const metadata: Metadata = {
  title: "KeyLess",
  description: "KeyLess",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${anta.className} antialiased`}>{children}</body>
    </html>
  );
}
