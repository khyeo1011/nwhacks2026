"use client"

import { Geist, Geist_Mono, Inter, Jacquard_12, Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const jacquard = Jacquard_12({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jacquard.variable} ${pixelifySans.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
