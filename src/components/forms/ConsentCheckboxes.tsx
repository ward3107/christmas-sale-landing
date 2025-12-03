"use client";

// =============================================================================
// CONSENT CHECKBOXES COMPONENT (הסכמה לדיוור ותנאי שימוש)
// =============================================================================
// Reusable consent checkboxes for forms.
// Includes terms acceptance (required) and marketing opt-in (optional).
// =============================================================================

import { useState } from "react";
import Link from "next/link";

export interface ConsentState {
  termsAccepted: boolean;
  marketingConsent: boolean;
}

interface ConsentCheckboxesProps {
  onChange: (consent: ConsentState) => void;
  companyName?: string;
  showTermsCheckbox?: boolean;
  showMarketingCheckbox?: boolean;
  termsRequired?: boolean;
}

export function ConsentCheckboxes({
  onChange,
  companyName = "משרד עו״ד כהן ושות׳",
  showTermsCheckbox = true,
  showMarketingCheckbox = true,
  termsRequired = true,
}: ConsentCheckboxesProps) {
  const [consent, setConsent] = useState<ConsentState>({
    termsAccepted: false,
    marketingConsent: false,
  });

  const handleChange = (field: keyof ConsentState) => {
    const newConsent = {
      ...consent,
      [field]: !consent[field],
    };
    setConsent(newConsent);
    onChange(newConsent);
  };

  return (
    <div className="space-y-4">
      {/* Terms & Privacy Checkbox (Usually Required) */}
      {showTermsCheckbox && (
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={consent.termsAccepted}
            onChange={() => handleChange("termsAccepted")}
            required={termsRequired}
            className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-sm text-slate-600 leading-relaxed">
            קראתי ואני מסכים/ה ל
            <Link
              href="/terms"
              target="_blank"
              className="text-blue-600 hover:underline mx-1"
            >
              תקנון תנאי השימוש
            </Link>
            ול
            <Link
              href="/privacy"
              target="_blank"
              className="text-blue-600 hover:underline mx-1"
            >
              מדיניות הפרטיות
            </Link>
            של {companyName}.
            {termsRequired && <span className="text-red-500 mr-1">*</span>}
          </span>
        </label>
      )}

      {/* Marketing Consent Checkbox (Optional - Unchecked by Default) */}
      {showMarketingCheckbox && (
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={consent.marketingConsent}
            onChange={() => handleChange("marketingConsent")}
            className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
          />
          <span className="text-sm text-slate-600 leading-relaxed">
            אני מאשר/ת ל{companyName} לשלוח לי דברי פרסומת, עדכונים ומידע שיווקי
            באמצעות דוא״ל, SMS, וואטסאפ ו/או טלפון. ידוע לי שאוכל לבטל את הסכמתי
            בכל עת באמצעות לחיצה על &quot;הסר&quot; או פנייה לחברה.
          </span>
        </label>
      )}
    </div>
  );
}

// =============================================================================
// STANDALONE TEXT VERSIONS (For reference / copy-paste)
// =============================================================================

export const CONSENT_TEXTS = {
  // Terms acceptance - REQUIRED, checkbox unchecked by default
  terms: {
    he: `קראתי ואני מסכים/ה לתקנון תנאי השימוש ולמדיניות הפרטיות של [שם החברה].`,
    heWithLinks: `קראתי ואני מסכים/ה ל<a href="/terms">תקנון תנאי השימוש</a> ול<a href="/privacy">מדיניות הפרטיות</a> של [שם החברה].`,
  },

  // Marketing consent - OPTIONAL, checkbox unchecked by default
  marketing: {
    he: `אני מאשר/ת ל[שם החברה] לשלוח לי דברי פרסומת, עדכונים ומידע שיווקי באמצעות דוא״ל, SMS, וואטסאפ ו/או טלפון. ידוע לי שאוכל לבטל את הסכמתי בכל עת באמצעות לחיצה על "הסר" או פנייה לחברה.`,

    // Short version
    heShort: `אני מסכים/ה לקבל עדכונים ומידע שיווקי מ[שם החברה]. ניתן לבטל בכל עת.`,
  },

  // Legal reference for spam law
  legalNote: {
    he: `בהתאם לסעיף 30א לחוק התקשורת (בזק ושידורים), התשמ"ב-1982, שליחת דברי פרסומת מותנית בקבלת הסכמה מפורשת מראש. הסכמה זו ניתנת לביטול בכל עת.`,
  },
};

export default ConsentCheckboxes;
