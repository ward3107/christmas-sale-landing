"use client";

// =============================================================================
// ACCESSIBILITY WIDGET COMPONENT
// =============================================================================
// Floating accessibility settings panel with WCAG 2.1 AA compliance.
// Provides font size, contrast, motion, and keyboard navigation controls.
// =============================================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "./Icon";

// Storage key for accessibility settings
const STORAGE_KEY = "cohen-law-accessibility-settings";
const HIDDEN_KEY = "cohen-law-accessibility-hidden";

// Default accessibility settings
const DEFAULT_SETTINGS = {
  fontSize: 100,
  highContrast: false,
  darkMode: false,
  reducedMotion: false,
  keyboardNav: true,
  lineHeight: "normal" as "normal" | "relaxed" | "loose",
};

type AccessibilitySettings = typeof DEFAULT_SETTINGS;

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Apply settings to DOM
  const applySettings = useCallback((newSettings: AccessibilitySettings) => {
    const root = document.documentElement;

    // Font size
    root.style.setProperty("--user-font-size", `${newSettings.fontSize}%`);
    root.style.fontSize = `${newSettings.fontSize}%`;

    // High contrast
    root.classList.toggle("high-contrast", newSettings.highContrast);

    // Reduced motion
    root.classList.toggle("reduce-motion", newSettings.reducedMotion);

    // Keyboard navigation
    root.classList.toggle("keyboard-nav", newSettings.keyboardNav);

    // Dark mode
    root.classList.toggle("dark", newSettings.darkMode);

    // Line height
    root.classList.remove("line-height-normal", "line-height-relaxed", "line-height-loose");
    root.classList.add(`line-height-${newSettings.lineHeight}`);
  }, []);

  // Update and save setting
  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      applySettings(newSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      announceToScreenReader(`${getSettingLabel(key)} עודכן`);
    },
    [settings, applySettings]
  );

  // Load settings on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettings(parsed);
      } catch (e) {
        console.warn("Failed to parse accessibility settings:", e);
      }
    }

    // Check if widget was hidden
    const hidden = localStorage.getItem(HIDDEN_KEY);
    if (hidden === "true") {
      setIsHidden(true);
    }

    // Check for system preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      updateSetting("reducedMotion", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    applySettings(DEFAULT_SETTINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    announceToScreenReader("הגדרות הנגישות אופסו");
  }, [applySettings]);

  // Hide widget
  const hideWidget = useCallback(() => {
    setIsHidden(true);
    setIsOpen(false);
    localStorage.setItem(HIDDEN_KEY, "true");
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

  // Get Hebrew label for setting
  const getSettingLabel = (key: keyof AccessibilitySettings): string => {
    const labels: Record<keyof AccessibilitySettings, string> = {
      fontSize: "גודל גופן",
      highContrast: "ניגודיות גבוהה",
      darkMode: "מצב כהה",
      reducedMotion: "הפחתת תנועה",
      keyboardNav: "ניווט מקלדת",
      lineHeight: "גובה שורה",
    };
    return labels[key];
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }

      // Focus trap
      if (e.key === "Tab" && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll(
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
  }, [isOpen]);

  // Focus first element when panel opens
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (isHidden) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-24 left-4 z-50 group">
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          aria-label="הגדרות נגישות"
          aria-expanded={isOpen}
          aria-controls="accessibility-panel"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <circle cx="12" cy="8" r="2" fill="currentColor" />
            <path
              strokeWidth="2"
              strokeLinecap="round"
              d="M12 10v4M9 18l3-4 3 4M7 14h10"
            />
          </svg>
          <span className="sr-only">פתח הגדרות נגישות</span>
        </button>
        {/* Close/Hide Button */}
        <button
          onClick={hideWidget}
          style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px', padding: 0 }}
          className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-sm"
          aria-label="הסתר כפתור נגישות"
        >
          <span className="text-[14px] font-bold leading-none">×</span>
        </button>
      </div>

      {/* Settings Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          id="accessibility-panel"
          role="dialog"
          aria-label="הגדרות נגישות"
          aria-modal="true"
          className="fixed bottom-40 left-4 z-50 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              הגדרות נגישות
            </h2>
            <button
              ref={firstFocusableRef}
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="סגור הגדרות נגישות"
            >
              <Icon name="X" className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          {/* Settings */}
          <div className="p-4 space-y-5 max-h-96 overflow-y-auto">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                גודל גופן ({settings.fontSize}%)
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateSetting("fontSize", Math.max(80, settings.fontSize - 10))
                  }
                  className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  aria-label="הקטן גופן"
                >
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-200">−</span>
                </button>
                <input
                  type="range"
                  min="80"
                  max="150"
                  step="10"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting("fontSize", Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  aria-label="גודל גופן"
                />
                <button
                  onClick={() =>
                    updateSetting("fontSize", Math.min(150, settings.fontSize + 10))
                  }
                  className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  aria-label="הגדל גופן"
                >
                  <span className="text-lg font-bold text-slate-700 dark:text-slate-200">+</span>
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  ניגודיות גבוהה
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  מגביר את הניגודיות לראות טובה יותר
                </span>
              </div>
              <button
                onClick={() => updateSetting("highContrast", !settings.highContrast)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.highContrast ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                }`}
                role="switch"
                aria-checked={settings.highContrast}
                aria-label="ניגודיות גבוהה"
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.highContrast ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  מצב כהה
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  מפחית עומס על העיניים
                </span>
              </div>
              <button
                onClick={() => updateSetting("darkMode", !settings.darkMode)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.darkMode ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                }`}
                role="switch"
                aria-checked={settings.darkMode}
                aria-label="מצב כהה"
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.darkMode ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  הפחתת תנועה
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  מפחית אנימציות ומעברים
                </span>
              </div>
              <button
                onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.reducedMotion ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                }`}
                role="switch"
                aria-checked={settings.reducedMotion}
                aria-label="הפחתת תנועה"
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.reducedMotion ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  ניווט מקלדת משופר
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  מדגיש אלמנטים בפוקוס
                </span>
              </div>
              <button
                onClick={() => updateSetting("keyboardNav", !settings.keyboardNav)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.keyboardNav ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
                }`}
                role="switch"
                aria-checked={settings.keyboardNav}
                aria-label="ניווט מקלדת משופר"
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.keyboardNav ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                גובה שורה
              </label>
              <div className="flex gap-2">
                {(["normal", "relaxed", "loose"] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => updateSetting("lineHeight", option)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      settings.lineHeight === option
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                    aria-pressed={settings.lineHeight === option}
                  >
                    {option === "normal" && "רגיל"}
                    {option === "relaxed" && "מרווח"}
                    {option === "loose" && "מאוד מרווח"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <button
              onClick={resetToDefaults}
              className="w-full py-2 px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors"
            >
              איפוס להגדרות ברירת מחדל
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AccessibilityWidget;
