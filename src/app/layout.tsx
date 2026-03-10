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
          <div className="flex items-center justify-center gap-1.5">
            <span>
              Built by{" "}
              <a href="https://rohan.sh" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors no-underline">
                Rohan
              </a>
              {" "}using{" "}
              <a href="https://bolna.ai" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors no-underline">
                Bolna AI
              </a>
            </span>
            <span className="text-[var(--color-border)]">·</span>
            <a
              href="https://github.com/rohansx/leadvox-bolna"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors no-underline"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
