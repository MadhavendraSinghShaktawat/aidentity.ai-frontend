"use client";

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { useState, useEffect } from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <title>rikuu.ai | AI Content Creation Platform</title>
        <meta name="description" content="AI-powered platform that creates, researches, shoots, edits, and posts content for you" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`min-h-screen bg-background font-sans antialiased ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
