"use client";

// =============================================================================
// SECURITY PROVIDER
// =============================================================================
// Client-side component that initializes security systems and renders
// accessibility/cookie consent widgets.
// =============================================================================

import { useEffect } from "react";
import { initializeCSP, securityManager } from "@/security";
import { AccessibilityWidget } from "@/components/ui/AccessibilityWidget";
import { CookieConsent } from "@/components/ui/CookieConsent";

interface SecurityProviderProps {
  children: React.ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  useEffect(() => {
    // Initialize CSP
    initializeCSP();

    // Set security headers via meta tags
    setSecurityMetaTags();

    // Log security status (development only)
    if (process.env.NODE_ENV !== "production") {
      console.log("[Security] Systems initialized");
      console.log("[Security] Session ID:", securityManager.sessionId);
    }

    // Listen for cookie consent changes
    const handleConsentChange = (event: CustomEvent) => {
      const preferences = event.detail;
      if (process.env.NODE_ENV !== "production") {
        console.log("[Cookies] Preferences updated:", preferences);
      }

      // Initialize analytics if consented
      if (preferences.analytics) {
        // initializeAnalytics();
      }

      // Initialize marketing tracking if consented
      if (preferences.marketing) {
        // initializeMarketing();
      }
    };

    window.addEventListener(
      "cookieConsentChanged",
      handleConsentChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "cookieConsentChanged",
        handleConsentChange as EventListener
      );
    };
  }, []);

  return (
    <>
      {children}
      <AccessibilityWidget />
      <CookieConsent />
    </>
  );
}

/**
 * Set security-related meta tags
 */
function setSecurityMetaTags() {
  if (typeof document === "undefined") return;

  // Referrer Policy
  addMetaTag("referrer", "strict-origin-when-cross-origin");

  // X-Content-Type-Options equivalent hint
  addMetaTag("x-content-type-options", "nosniff");

  // Permissions Policy hints
  // Note: Most must be set server-side, these are informational
}

/**
 * Helper to add meta tags
 */
function addMetaTag(name: string, content: string) {
  if (document.querySelector(`meta[name="${name}"]`)) return;

  const meta = document.createElement("meta");
  meta.name = name;
  meta.content = content;
  document.head.appendChild(meta);
}

export default SecurityProvider;
