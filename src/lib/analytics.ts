/**
 * GA4 / GTM-friendly event tracker.
 *
 * Pushes into window.dataLayer when present (covers GTM Consent Mode), and
 * falls back to window.gtag if loaded directly. Safe no-op on the server and
 * when nothing is configured.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

// Window.dataLayer / gtag types come from CookieConsent's global declaration.

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;

  try {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...params });
    } else if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
  } catch {
    // Swallow — analytics failures must never break UX.
  }
}
