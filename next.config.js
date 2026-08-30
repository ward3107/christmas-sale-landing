/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Serve the cinematic static landing page (public/cinematic/) at the site root.
  // beforeFiles runs before the filesystem/route check, so it overrides app/page.tsx
  // while keeping /cinematic/index.html reachable directly.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/cinematic/index.html" }],
    };
  },

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ["lucide-react"],
  },

  // HTTP Headers for Security
  async headers() {
    const isProd = process.env.NODE_ENV === "production";

    // Enforced CSP for production. 'unsafe-inline' is required by Next.js
    // hydration; 'unsafe-eval' is dev-only.
    const CSP_PROD = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://*.firebaseio.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://firestore.googleapis.com https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://www.google-analytics.com https://api.emailjs.com",
      // blob: allows the cinematic hero video, which is streamed via XHR and played
      // from an object URL (URL.createObjectURL).
      "media-src 'self' blob:",
      "object-src 'none'",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      "report-uri /api/csp-report",
    ].join("; ");

    // Looser policy for dev (HMR + eval) — still report-only there.
    const CSP_DEV = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' ws: https:",
      "media-src 'self' blob:",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          // Phase 2: enforcing CSP in production; report-only in dev
          {
            key: isProd ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
            value: isProd ? CSP_PROD : CSP_DEV,
          },
          // HSTS (only in production, requires HTTPS)
          isProd
            ? {
                key: "Strict-Transport-Security",
                value: "max-age=31536000; includeSubDomains; preload",
              }
            : null,
          // Other security headers
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
          },
        ].filter(Boolean),
      },
    ];
  },
};

module.exports = nextConfig;
