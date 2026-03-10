import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "LeadVox — AI Lead Qualification",
  description: "Voice AI agent that instantly qualifies real estate leads",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <Nav />
        <main className="mx-auto max-w-[1320px] px-6 pb-20">{children}</main>
        <footer className="border-t border-[var(--color-border-subtle)] py-5 text-center text-[12px] text-[var(--color-text-muted)]">
          Built by{" "}
          <a href="https://rohan.sh" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors no-underline">
            Rohan
          </a>
          {" "}using{" "}
          <a href="https://bolna.ai" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors no-underline">
            Bolna AI
          </a>
        </footer>
      </body>
    </html>
  );
}
