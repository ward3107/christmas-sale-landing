// =============================================================================
// ROOT LAYOUT
// =============================================================================
// Next.js App Router root layout with fonts, metadata, and security providers.
// RTL support for Hebrew content.
// =============================================================================

import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import { siteConfig } from "@/config/site-config";
import { SecurityProvider } from "@/components/providers/SecurityProvider";
import "./globals.css";
import "@/styles/accessibility.css";

// Hebrew-optimized font
const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  display: "swap",
  variable: "--font-rubik",
});

// Metadata from config
export const metadata: Metadata = {
  title: siteConfig.metadata.title,
  description: siteConfig.metadata.description,
  keywords: siteConfig.metadata.keywords,
  authors: [{ name: "Cohen Law Office" }],
  openGraph: {
    title: siteConfig.metadata.title,
    description: siteConfig.metadata.description,
    type: "website",
    locale: "he_IL",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.metadata.title,
    description: siteConfig.metadata.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <body className="font-sans antialiased bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        {/* Skip Link for Accessibility */}
        <a href="#main-content" className="skip-link">
          דלג לתוכן הראשי
        </a>

        <SecurityProvider>
          <main id="main-content">
            {children}
          </main>
        </SecurityProvider>
      </body>
    </html>
  );
}
