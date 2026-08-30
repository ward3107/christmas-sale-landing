// =============================================================================
// PRIVACY POLICY PAGE
// =============================================================================
// Complies with Israel's Protection of Privacy Law (PPL), Section 11,
// as amended by Amendment 13 (effective August 14, 2025),
// and the PPA's July 2022 official notification guidelines.
// =============================================================================

import { Metadata } from "next";
import { PrivacyPolicyContent } from "./PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | משרד עורכי דין מוביל",
  description:
    "מדיניות הפרטיות שלנו בהתאם לחוק הגנת הפרטיות (תיקון 13) והנחיות רשות הפרטיות.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "מדיניות פרטיות",
    description:
      "מדיניות הפרטיות בהתאם לחוק הגנת הפרטיות הישראלי (תיקון 13).",
    type: "article",
    locale: "he_IL",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
