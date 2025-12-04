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
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";
import "@/styles/accessibility.css";

// Site URL for metadata and schema
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cohen-law.co.il";

// Hebrew-optimized font
const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  display: "swap",
  variable: "--font-rubik",
});

// Metadata from config
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteConfig.metadata.title,
  description: siteConfig.metadata.description,
  keywords: siteConfig.metadata.keywords,
  authors: [{ name: "Cohen Law Office" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.metadata.title,
    description: siteConfig.metadata.description,
    type: "website",
    locale: "he_IL",
    url: siteUrl,
    siteName: "משרד עו״ד כהן ושות׳",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "משרד עו״ד כהן ושות׳ - עורך דין מסחרי לעסקים",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.metadata.title,
    description: siteConfig.metadata.description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when available
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={rubik.variable}>
      <head>
        {/* JSON-LD Structured Data */}
        <JsonLd url={siteUrl} />
      </head>
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
