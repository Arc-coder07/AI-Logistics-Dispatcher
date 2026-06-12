import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Logistics Dispatcher — Autonomous Operations Control Tower",
  description:
    "AI-powered logistics operations dashboard with autonomous dispatch, real-time fleet tracking, human-in-the-loop approval workflows, and intelligent disruption management.",
  keywords: [
    "logistics",
    "AI dispatch",
    "fleet management",
    "autonomous operations",
    "real-time tracking",
  ],
  openGraph: {
    title: "AI Logistics Dispatcher",
    description: "Human-in-the-Loop Autonomous Operations Control Tower",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#09090b] text-zinc-100 antialiased">
        {/* Background gradient orbs */}
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />

        {/* Main content */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
