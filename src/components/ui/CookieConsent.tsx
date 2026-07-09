"use client";

// =============================================================================
// COOKIE CONSENT BANNER
// =============================================================================
// Amendment 13 compliant — GTM Consent Mode v2
// Signals: analytics_storage, ad_storage, ad_user_data, ad_personalization
// Built: 2026-03-04
// =============================================================================
// Complies with Israel's Privacy Protection Law Amendment 13 (August 2025)
// - Explicit consent (user action required)
// - Granular controls (Necessary, Analytics, Marketing)
// - Documented consent (localStorage with timestamp)
// - Informed consent (clear descriptions per category)
// =============================================================================

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Type declarations for GTM
declare global {
  interface Window {
    dataLayer: (Record<string, unknown> | unknown[])[];
    gtag: (...args: unknown[]) => void;
  }
}

// =============================================================================
// CONFIGURATION
// =============================================================================
const COOKIE_CONFIG = {
  privacyPolicyUrl: "/privacy",
  contactEmail: "info@example.com",
  primaryColor: "#2563eb", // blue-600
  storageKey: "cookieConsent",
  consentVersion: "1.0",
  expiresMonths: 12,
  defaultLanguage: "he" as LanguageCode,
};

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
type LanguageCode = "he" | "ar" | "en" | "ru";

interface ConsentData {
  version: string;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  language: LanguageCode;
  expires: string;
}

interface Translations {
  title: string;
  description: string;
  privacyLink: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  savePreferences: string;
  necessary: string;
  necessaryDesc: string;
  analytics: string;
  analyticsDesc: string;
  marketing: string;
  marketingDesc: string;
  alwaysOn: string;
  language: string;
}

// =============================================================================
// TRANSLATIONS
// =============================================================================
const translations: Record<LanguageCode, Translations> = {
  he: {
    title: "הסכמה לשימוש בעוגיות",
    description:
      "אנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה שלך ולהציג תוכן מותאם אישית. אנא בחר/י אילו סוגי עוגיות את/ה מאשר/ת.",
    privacyLink: "מדיניות פרטיות",
    acceptAll: "אשר הכל",
    rejectAll: "דחה הכל",
    customize: "התאמה אישית",
    savePreferences: "שמור העדפות",
    necessary: "עוגיות הכרחיות",
    necessaryDesc:
      "נדרשות לתפקוד האתר. כוללות אבטחה, זיכרון העדפות וטפסים. לא משותפות עם צדדים שלישיים.",
    analytics: "עוגיות ניתוח",
    analyticsDesc:
      "Google Analytics — צפיות בדפים, משך ביקור. נשלחות לשרתי Google. ללא מידע מזהה אישי. משמשות לשיפור האתר.",
    marketing: "עוגיות שיווקיות",
    marketingDesc:
      "Facebook Pixel, Google Ads — משמשות להצגת פרסומות רלוונטיות. משותפות עם Meta ו-Google למטרות מיקוד ומעקב המרות.",
    alwaysOn: "תמיד פעיל",
    language: "עברית",
  },
  ar: {
    title: "الموافقة على ملفات تعريف الارتباط",
    description:
      "نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وعرض محتوى مخصص. يرجى اختيار أنواع ملفات تعريف الارتباط التي توافق عليها.",
    privacyLink: "سياسة الخصوصية",
    acceptAll: "قبول الكل",
    rejectAll: "رفض الكل",
    customize: "تخصيص",
    savePreferences: "حفظ التفضيلات",
    necessary: "ملفات تعريف الارتباط الضرورية",
    necessaryDesc:
      "مطلوبة لعمل الموقع. تشمل الأمان وتذكر التفضيلات والنماذج. لا تتم مشاركتها مع أطراف ثالثة.",
    analytics: "ملفات تعريف الارتباط التحليلية",
    analyticsDesc:
      "Google Analytics — مشاهدات الصفحة ومدة الزيارة. ترسل إلى خوادم Google. بدون معلومات تعريف شخصية. تستخدم لتحسين الموقع.",
    marketing: "ملفات تعريف الارتباط التسويقية",
    marketingDesc:
      "Facebook Pixel, Google Ads — تستخدم لعرض إعلانات ذات صلة. تتم مشاركتها مع Meta وGoogle لاستهداف الإعلانات وتتبع التحويلات.",
    alwaysOn: "دائمًا نشط",
    language: "العربية",
  },
  en: {
    title: "Cookie Consent",
    description:
      "We use cookies to improve your browsing experience and display personalized content. Please choose which types of cookies you consent to.",
    privacyLink: "Privacy Policy",
    acceptAll: "Accept All",
    rejectAll: "Reject All",
    customize: "Customize",
    savePreferences: "Save Preferences",
    necessary: "Necessary Cookies",
    necessaryDesc:
      "Required for the site to function. Includes security, preference memory, and forms. Not shared with third parties.",
    analytics: "Analytics Cookies",
    analyticsDesc:
      "Google Analytics — page views, session duration. Data sent to Google servers. No personally identifiable data. Used to improve the site.",
    marketing: "Marketing Cookies",
    marketingDesc:
      "Facebook Pixel, Google Ads — used to show you relevant ads. Data shared with Meta and Google for ad targeting and conversion tracking.",
    alwaysOn: "Always Active",
    language: "English",
  },
  ru: {
    title: "Согласие на использование файлов cookie",
    description:
      "Мы используем файлы cookie для улучшения вашего опыта просмотра и отображения персонализированного контента. Пожалуйста, выберите, какие типы файлов cookie вы разрешаете.",
    privacyLink: "Политика конфиденциальности",
    acceptAll: "Принять все",
    rejectAll: "Отклонить все",
    customize: "Настроить",
    savePreferences: "Сохранить настройки",
    necessary: "Необходимые файлы cookie",
    necessaryDesc:
      "Необходимы для работы сайта. Включают безопасность, сохранение предпочтений и формы. Не передаются третьим лицам.",
    analytics: "Аналитические файлы cookie",
    analyticsDesc:
      "Google Analytics — просмотры страниц, продолжительность сессии. Данные отправляются на серверы Google. Без личных данных. Используются для улучшения сайта.",
    marketing: "Маркетинговые файлы cookie",
    marketingDesc:
      "Facebook Pixel, Google Ads — используются для показа релевантной рекламы. Данные передаются Meta и Google для таргетинга и отслеживания конверсий.",
    alwaysOn: "Всегда активны",
    language: "Русский",
  },
};

// RTL languages
const RTL_LANGUAGES: LanguageCode[] = ["he", "ar"];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Detect browser language
function detectBrowserLanguage(): LanguageCode {
  if (typeof window === "undefined") return COOKIE_CONFIG.defaultLanguage;

  const browserLang = navigator.language.split("-")[0] as LanguageCode;
  return translations[browserLang] ? browserLang : COOKIE_CONFIG.defaultLanguage;
}

// Check if consent is expired
function isConsentExpired(consent: ConsentData): boolean {
  const expiresAt = new Date(consent.expires);
  return new Date() > expiresAt;
}

// Get stored consent
function getStoredConsent(): ConsentData | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(COOKIE_CONFIG.storageKey);
    if (!stored) return null;

    const consent: ConsentData = JSON.parse(stored);
    if (isConsentExpired(consent)) {
      localStorage.removeItem(COOKIE_CONFIG.storageKey);
      return null;
    }

    return consent;
  } catch {
    return null;
  }
}

// Save consent to localStorage
function saveConsent(analytics: boolean, marketing: boolean, language: LanguageCode): void {
  const now = new Date();
  const expires = new Date(now);
  expires.setMonth(expires.getMonth() + COOKIE_CONFIG.expiresMonths);

  const consent: ConsentData = {
    version: COOKIE_CONFIG.consentVersion,
    analytics,
    marketing,
    timestamp: now.toISOString(),
    language,
    expires: expires.toISOString(),
  };

  localStorage.setItem(COOKIE_CONFIG.storageKey, JSON.stringify(consent));
}

// Update GTM consent mode
function updateGTMConsent(analytics: boolean, marketing: boolean): void {
  if (typeof window === "undefined") return;

  // Initialize dataLayer if not exists
  window.dataLayer = window.dataLayer || [];

  // Define gtag function if not exists
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
  }

  // Update consent
  window.gtag("consent", "update", {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  });

  // Push event for GTM triggers
  window.dataLayer.push({
    event: "cookie_consent_update",
    consent_analytics: analytics,
    consent_marketing: marketing,
  });
}

// =============================================================================
// COMPONENT
// =============================================================================
export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>(COOKIE_CONFIG.defaultLanguage);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const t = translations[language];
  const isRTL = RTL_LANGUAGES.includes(language);

  // Initialize on mount
  useEffect(() => {
    const storedConsent = getStoredConsent();

    if (storedConsent) {
      // User already consented - update GTM and don't show banner
      setLanguage(storedConsent.language);
      setAnalytics(storedConsent.analytics);
      setMarketing(storedConsent.marketing);
      updateGTMConsent(storedConsent.analytics, storedConsent.marketing);
    } else {
      // No consent yet - show banner
      setLanguage(detectBrowserLanguage());
      // Small delay for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle accept all
  const handleAcceptAll = useCallback(() => {
    setAnalytics(true);
    setMarketing(true);
    saveConsent(true, true, language);
    updateGTMConsent(true, true);
    setIsVisible(false);
  }, [language]);

  // Handle reject all
  const handleRejectAll = useCallback(() => {
    setAnalytics(false);
    setMarketing(false);
    saveConsent(false, false, language);
    updateGTMConsent(false, false);
    setIsVisible(false);
  }, [language]);

  // Handle save preferences
  const handleSavePreferences = useCallback(() => {
    saveConsent(analytics, marketing, language);
    updateGTMConsent(analytics, marketing);
    setIsVisible(false);
  }, [analytics, marketing, language]);

  // Handle language change
  const handleLanguageChange = useCallback((lang: LanguageCode) => {
    setLanguage(lang);
  }, []);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up"
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      {/* Backdrop for mobile */}
      <div className="fixed inset-0 bg-black/20 sm:bg-transparent" />

      {/* Banner */}
      <div className="relative bg-white border-t border-slate-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-5">
          {/* Header Row */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                {t.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.description}{" "}
                <Link
                  href={COOKIE_CONFIG.privacyPolicyUrl}
                  className="underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  style={{ color: COOKIE_CONFIG.primaryColor }}
                >
                  {t.privacyLink}
                </Link>
              </p>
            </div>

            {/* Language Switcher */}
            <div className="flex gap-1 shrink-0">
              {Object.keys(translations).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang as LanguageCode)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    language === lang
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  aria-label={`Switch to ${translations[lang as LanguageCode].language}`}
                  aria-pressed={language === lang}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Main Buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              style={{ backgroundColor: COOKIE_CONFIG.primaryColor }}
            >
              {t.acceptAll}
            </button>
            <button
              onClick={handleRejectAll}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg transition-all hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              {t.rejectAll}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              aria-expanded={isExpanded}
            >
              {t.customize}
            </button>
          </div>

          {/* Expanded Preferences Panel */}
          {isExpanded && (
            <div className="border-t border-slate-200 pt-4 mt-3 animate-fade-in">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900">{t.necessary}</h3>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      {t.alwaysOn}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{t.necessaryDesc}</p>
                </div>
                <div className="shrink-0">
                  <div
                    className="w-11 h-6 bg-green-500 rounded-full flex items-center justify-center cursor-not-allowed opacity-80"
                    aria-disabled="true"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow ${isRTL ? "mr-0.5" : "ml-0.5"}`} />
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{t.analytics}</h3>
                  <p className="text-sm text-slate-500 mt-1">{t.analyticsDesc}</p>
                </div>
                <div className="shrink-0">
                  <button
                    onClick={() => setAnalytics(!analytics)}
                    className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      analytics ? "bg-blue-600" : "bg-slate-300"
                    }`}
                    role="switch"
                    aria-checked={analytics}
                    aria-label={t.analytics}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        analytics
                          ? isRTL
                            ? "right-0.5"
                            : "left-5"
                          : isRTL
                          ? "left-0.5"
                          : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between gap-4 py-3">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{t.marketing}</h3>
                  <p className="text-sm text-slate-500 mt-1">{t.marketingDesc}</p>
                </div>
                <div className="shrink-0">
                  <button
                    onClick={() => setMarketing(!marketing)}
                    className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      marketing ? "bg-blue-600" : "bg-slate-300"
                    }`}
                    role="switch"
                    aria-checked={marketing}
                    aria-label={t.marketing}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        marketing
                          ? isRTL
                            ? "right-0.5"
                            : "left-5"
                          : isRTL
                          ? "left-0.5"
                          : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <button
                  onClick={handleSavePreferences}
                  className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                  style={{ backgroundColor: COOKIE_CONFIG.primaryColor }}
                >
                  {t.savePreferences}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;

// =============================================================================
// GTM DEFAULT CONSENT SCRIPT
// =============================================================================
// Add this to your <head> BEFORE the GTM script:
//
// <script>
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('consent', 'default', {
//     analytics_storage: 'denied',
//     ad_storage: 'denied',
//     ad_user_data: 'denied',
//     ad_personalization: 'denied',
//     wait_for_update: 2000
//   });
// </script>
// <!-- Google Tag Manager -->
// <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
// new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
// j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
// 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
// })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
