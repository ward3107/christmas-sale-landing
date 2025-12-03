"use client";

// =============================================================================
// COOKIE CONSENT COMPONENT
// =============================================================================
// GDPR/CCPA compliant cookie consent banner with granular preferences.
// Appears after 1 second delay on first visit, stores choice in localStorage.
// =============================================================================

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

// Storage keys
const STORAGE_KEYS = {
  COOKIE_CONSENT: "cohen-law-cookie-consent",
  COOKIE_PREFERENCES: "cohen-law-cookie-preferences",
};

// Cookie categories with descriptions
const COOKIE_CATEGORIES = {
  necessary: {
    label: "עוגיות הכרחיות",
    description: "נדרשות לתפקוד בסיסי של האתר. לא ניתן לכבות.",
    required: true,
  },
  functional: {
    label: "עוגיות פונקציונליות",
    description: "שומרות העדפות והגדרות אישיות.",
    required: false,
  },
  analytics: {
    label: "עוגיות אנליטיקה",
    description: "עוזרות לנו להבין כיצד משתמשים באתר.",
    required: false,
  },
  marketing: {
    label: "עוגיות שיווק",
    description: "תוכן מותאם אישית והמלצות.",
    required: false,
  },
  advertising: {
    label: "עוגיות פרסום",
    description: "פרסומות ממוקדות ורימרקטינג.",
    required: false,
  },
};

type CookieCategory = keyof typeof COOKIE_CATEGORIES;

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  advertising: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  functional: true,
  analytics: false,
  marketing: false,
  advertising: false,
};

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Check consent status on mount
  useEffect(() => {
    const hasConsent = localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT);

    if (!hasConsent) {
      // Delay showing banner by 1 second
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const saved = localStorage.getItem(STORAGE_KEYS.COOKIE_PREFERENCES);
      if (saved) {
        try {
          setPreferences(JSON.parse(saved));
        } catch (e) {
          console.warn("Failed to parse cookie preferences:", e);
        }
      }
    }
  }, []);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showSettings) {
        // Don't allow escape to close main banner - user must make a choice
        return;
      }

      if (e.key === "Escape" && showSettings) {
        setShowSettings(false);
        return;
      }

      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, showSettings]);

  // Focus first element when modal opens
  useEffect(() => {
    if (isVisible && firstFocusableRef.current) {
      setTimeout(() => firstFocusableRef.current?.focus(), 100);
    }
  }, [isVisible]);

  // Save preferences and close banner
  const savePreferences = useCallback((prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, "true");
    localStorage.setItem(STORAGE_KEYS.COOKIE_PREFERENCES, JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);

    // Dispatch event for other parts of app to react
    window.dispatchEvent(
      new CustomEvent("cookieConsentChanged", { detail: prefs })
    );

    // Announce to screen readers
    announceToScreenReader("העדפות העוגיות נשמרו");
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const allEnabled: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      advertising: true,
    };
    savePreferences(allEnabled);
  }, [savePreferences]);

  // Decline all (only necessary)
  const declineAll = useCallback(() => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      advertising: false,
    };
    savePreferences(onlyNecessary);
  }, [savePreferences]);

  // Toggle individual preference
  const togglePreference = useCallback((category: CookieCategory) => {
    if (COOKIE_CATEGORIES[category].required) return;
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  // Announce to screen readers
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="הסכמה לעוגיות"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-2xl mx-4 mb-4 sm:mb-0 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all ${
          showSettings ? "max-h-[90vh]" : ""
        }`}
      >
        {!showSettings ? (
          // Main Banner
          <div className="p-6 sm:p-8">
            {/* Icon and Title */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  אנחנו משתמשים בעוגיות
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mt-1">
                  כדי לשפר את חוויית הגלישה שלך
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              אתר זה משתמש בעוגיות לשיפור הביצועים, ניתוח תנועה והתאמה אישית.
              באפשרותך לקבל את כולן, לדחות את אלו שאינן הכרחיות, או להתאים
              אישית את ההעדפות שלך.{" "}
              <Link
                href="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                קרא את מדיניות הפרטיות המלאה
              </Link>
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                ref={firstFocusableRef}
                onClick={acceptAll}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                קבל הכל
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 py-3 px-6 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
              >
                התאמה אישית
              </button>
              <button
                onClick={declineAll}
                className="flex-1 py-3 px-6 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
              >
                דחה הכל
              </button>
            </div>
          </div>
        ) : (
          // Settings Panel
          <div className="flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                הגדרות עוגיות
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="חזור"
              >
                <Icon name="X" className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            {/* Cookie Categories */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {(Object.keys(COOKIE_CATEGORIES) as CookieCategory[]).map((category) => {
                const { label, description, required } = COOKIE_CATEGORIES[category];
                const isEnabled = preferences[category];

                return (
                  <div
                    key={category}
                    className="flex items-start justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {label}
                        </span>
                        {required && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                            הכרחי
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {description}
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference(category)}
                      disabled={required}
                      className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors ${
                        isEnabled
                          ? "bg-blue-600"
                          : "bg-slate-300 dark:bg-slate-600"
                      } ${required ? "opacity-50 cursor-not-allowed" : ""}`}
                      role="switch"
                      aria-checked={isEnabled}
                      aria-label={label}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          isEnabled ? "right-1" : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => savePreferences(preferences)}
                  className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                >
                  שמור העדפות
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 py-3 px-6 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-colors"
                >
                  קבל הכל
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CookieConsent;
