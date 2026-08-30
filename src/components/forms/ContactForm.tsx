"use client";

// =============================================================================
// CONTACT FORM COMPONENT
// =============================================================================
// Clean, accessible contact form with validation.
// Uses useLeadForm hook for Firestore submission.
// =============================================================================

import { useState, FormEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import { useLeadForm, LeadData } from "@/hooks/useLeadForm";
import { Icon } from "@/components/ui/Icon";

interface ConsentState {
  termsAccepted: boolean;
  marketingConsent: boolean;
}

interface FormDataWithSecurity extends LeadData {
  termsAccepted: boolean;
  marketingConsent: boolean;
  honeypot?: string;
}

export function ContactForm() {
  const { contact } = siteConfig;
  const { isLoading, isSuccess, isError, errorMessage, submitLead, reset } =
    useLeadForm();

  const [formData, setFormData] = useState<FormDataWithSecurity>({
    name: "",
    phone: "",
    email: "",
    message: "",
    termsAccepted: false,
    marketingConsent: false,
    honeypot: "",
  });

  const [consent, setConsent] = useState<ConsentState>({
    termsAccepted: false,
    marketingConsent: false,
  });

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Also sync consent state for checkboxes
    if (type === "checkbox") {
      if (name === "termsAccepted" || name === "marketingConsent") {
        setConsent((prev) => ({ ...prev, [name]: checked }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await submitLead(formData);
    if (success) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        termsAccepted: false,
        marketingConsent: false,
        honeypot: "",
      });
      setConsent({ termsAccepted: false, marketingConsent: false });
    }
  };

  // Reset form and state
  const handleReset = () => {
    reset();
    setFormData({
      name: "",
      phone: "",
      email: "",
      message: "",
      termsAccepted: false,
      marketingConsent: false,
      honeypot: "",
    });
    setConsent({ termsAccepted: false, marketingConsent: false });
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 md:py-28 bg-slate-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Info */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
              צרו קשר
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              נשמח לשמוע מכם
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              השאירו פרטים ונציג מטעמנו יחזור אליכם בהקדם האפשרי, או התקשרו
              ישירות לקביעת פגישת ייעוץ.
            </p>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Phone */}
              <a
                href={`tel:${contact.phone.replace(/-/g, "")}`}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon name="Phone" className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">טלפון</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {contact.phone}
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon name="Mail" className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">אימייל</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {contact.email}
                  </div>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Icon name="MapPin" className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">כתובת</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {contact.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
              {/* Success State */}
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-green-600 mb-6">
                    <Icon name="Check" className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    תודה על פנייתך!
                  </h3>
                  <p className="text-slate-600 mb-6">
                    נציג מטעמנו יחזור אליך בהקדם.
                  </p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <span>שליחת פנייה נוספת</span>
                    <Icon name="ArrowRight" className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field - hidden from users but accessible to bots */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot || ""}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    style={{
                      position: "absolute",
                      left: "-5000px",
                      width: "0",
                      height: "0",
                      opacity: "0",
                      pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  />

                  {/* Error Message */}
                  {isError && (
                    <div
                      role="alert"
                      className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-400 rounded-xl text-red-700"
                      aria-live="polite"
                    >
                      <Icon name="AlertCircle" className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span className="font-medium">
                        <span className="sr-only">שגיאה: </span>
                        {errorMessage}
                      </span>
                    </div>
                  )}

                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      שם מלא <span className="text-red-500" aria-hidden="true">*</span>
                      <span className="sr-only">(חובה)</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                      placeholder="הזינו את שמכם"
                    />
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      טלפון <span className="text-red-500" aria-hidden="true">*</span>
                      <span className="sr-only">(חובה)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                      placeholder="050-1234567"
                      dir="ltr"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      אימייל <span className="text-red-500" aria-hidden="true">*</span>
                      <span className="sr-only">(חובה)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      aria-required="true"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                      placeholder="your@email.com"
                      dir="ltr"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      הודעה
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-slate-900"
                      placeholder="ספרו לנו כיצד נוכל לעזור..."
                    />
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="space-y-3 pt-2">
                    {/* Terms Acceptance - Required */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        required
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600 leading-relaxed">
                        קראתי ואני מסכים/ה ל
                        <Link href="/terms" target="_blank" className="text-blue-600 hover:underline mx-1">
                          תקנון תנאי השימוש
                        </Link>
                        ול
                        <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline mx-1">
                          מדיניות הפרטיות
                        </Link>
                        <span className="text-red-500 mr-1">*</span>
                      </span>
                    </label>

                    {/* Marketing Consent - Optional */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="marketingConsent"
                        checked={formData.marketingConsent}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600 leading-relaxed">
                        אני מאשר/ת לקבל עדכונים ומידע שיווקי באמצעות דוא״ל, SMS ו/או וואטסאפ.
                        ניתן לבטל בכל עת.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Icon name="Loader2" className="w-5 h-5 animate-spin" aria-hidden="true" />
                        <span>שולח...</span>
                      </>
                    ) : (
                      <>
                        <span>שליחת פנייה</span>
                        <Icon name="Send" className="w-5 h-5" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  {/* Trust Badges — directly under the CTA */}
                  <ul
                    className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-600"
                    aria-label="התחייבויות השירות"
                  >
                    <li className="inline-flex items-center gap-1.5">
                      <Icon name="ShieldCheck" className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                      <span>100% סודיות</span>
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <Icon name="Clock" className="w-4 h-4 text-blue-600" aria-hidden="true" />
                      <span>מענה תוך 24 שעות</span>
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <Icon name="Sparkles" className="w-4 h-4 text-gold-500" aria-hidden="true" />
                      <span>ייעוץ ראשון חינם</span>
                    </li>
                  </ul>

                  {/* Privacy Notice */}
                  <p className="text-xs text-slate-500 text-center">
                    בשליחת הטופס הנך מסכים/ה ל
                    <a href="/privacy" className="text-blue-600 hover:underline">
                      מדיניות הפרטיות
                    </a>{" "}
                    שלנו
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
