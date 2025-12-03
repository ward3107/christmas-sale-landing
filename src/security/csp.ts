// =============================================================================
// CONTENT SECURITY POLICY (CSP)
// =============================================================================
// Implements CSP headers to prevent XSS, clickjacking, and other attacks.
// Configurable directives with violation reporting.
// =============================================================================

// CSP Directives for production
const CSP_DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'", // Required for Next.js
    "'unsafe-eval'", // Required for Next.js development
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind and CSS-in-JS
    "https://fonts.googleapis.com",
  ],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https:",
  ],
  "font-src": [
    "'self'",
    "data:",
    "https://fonts.gstatic.com",
  ],
  "connect-src": [
    "'self'",
    "https://firestore.googleapis.com",
    "https://firebase.googleapis.com",
    "https://www.google-analytics.com",
    "https://identitytoolkit.googleapis.com",
  ],
  "media-src": ["'self'"],
  "object-src": ["'none'"],
  "frame-src": ["'none'"],
  "frame-ancestors": ["'none'"], // Prevents clickjacking
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "upgrade-insecure-requests": [],
};

// Storage key for violations
const VIOLATIONS_KEY = "csp_violations";
const MAX_VIOLATIONS = 50;

export interface CSPViolation {
  blockedURI: string;
  violatedDirective: string;
  originalPolicy: string;
  timestamp: string;
  sourceFile?: string;
  lineNumber?: number;
}

/**
 * Build CSP string from directives
 */
function buildCSPString(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(" ")}`;
    })
    .join("; ");
}

/**
 * Handle CSP violation events
 */
function handleCSPViolation(event: SecurityPolicyViolationEvent): void {
  const violation: CSPViolation = {
    blockedURI: event.blockedURI,
    violatedDirective: event.violatedDirective,
    originalPolicy: event.originalPolicy,
    timestamp: new Date().toISOString(),
    sourceFile: event.sourceFile || undefined,
    lineNumber: event.lineNumber || undefined,
  };

  // Store violations (max 50)
  try {
    const stored = JSON.parse(localStorage.getItem(VIOLATIONS_KEY) || "[]");
    stored.push(violation);
    if (stored.length > MAX_VIOLATIONS) stored.shift();
    localStorage.setItem(VIOLATIONS_KEY, JSON.stringify(stored));
  } catch (e) {
    console.warn("Failed to store CSP violation:", e);
  }

  // Log in development
  if (process.env.NODE_ENV !== "production") {
    console.warn("[CSP Violation]", violation);
  }
}

/**
 * Initialize Content Security Policy
 */
export function initializeCSP(): void {
  // Only apply in production via meta tag
  // In development, we need more permissive settings
  if (typeof window === "undefined") return;

  // For client-side, we primarily rely on server-side headers
  // This is a fallback meta tag approach
  if (process.env.NODE_ENV === "production") {
    const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');

    if (!existingMeta) {
      const meta = document.createElement("meta");
      meta.httpEquiv = "Content-Security-Policy";
      meta.content = buildCSPString(CSP_DIRECTIVES);
      document.head.appendChild(meta);
    }
  }

  // Set up violation reporting
  document.addEventListener("securitypolicyviolation", handleCSPViolation);

  if (process.env.NODE_ENV !== "production") {
    console.log("[CSP] Security policy initialized");
  }
}

/**
 * Get stored CSP violations
 */
export function getCSPViolations(): CSPViolation[] {
  try {
    return JSON.parse(localStorage.getItem(VIOLATIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Clear stored CSP violations
 */
export function clearCSPViolations(): void {
  localStorage.removeItem(VIOLATIONS_KEY);
}

/**
 * Get CSP directives for server-side headers (Next.js)
 */
export function getCSPHeaders(): string {
  return buildCSPString(CSP_DIRECTIVES);
}

export default initializeCSP;
