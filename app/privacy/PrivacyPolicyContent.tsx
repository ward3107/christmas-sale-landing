"use client";

// =============================================================================
// PRIVACY POLICY CONTENT
// =============================================================================
// Full Amendment 13 compliance with 4 languages (HE, AR, EN, RU)
// 13 required sections with sticky TOC sidebar
// =============================================================================

import { useState, useEffect } from "react";
import Link from "next/link";

// =============================================================================
// CONFIGURATION
// =============================================================================
const PRIVACY_CONFIG = {
  businessName: "משרד עורכי דין מוביל",
  businessNameEn: "Leading Law Firm",
  ownerName: "עו״ד כהן",
  address: "רחוב הדוגמה 1, תל אביב, ישראל",
  addressEn: "1 Example Street, Tel Aviv, Israel",
  email: "info@example.com",
  phone: "050-000-0000",
  website: "https://cohen-law.co.il",
  hostingProvider: "Vercel",
  hostingCountry: "ארה״ב / גרמניה",
  lastUpdated: "4 במרץ 2026",
  lastUpdatedEn: "March 4, 2026",
  primaryColor: "#2563eb",
  tools: {
    googleAnalytics: true,
    googleAds: false,
    facebookPixel: false,
    gtm: false,
    mailchimp: false,
    whatsapp: true,
    contactForm: true,
  },
};

type LanguageCode = "he" | "ar" | "en" | "ru";

// =============================================================================
// TRANSLATIONS
// =============================================================================
const translations = {
  he: {
    title: "מדיניות פרטיות",
    subtitle: "בהתאם לחוק הגנת הפרטיות (תיקון 13)",
    lastUpdated: "עודכן לאחרונה:",
    readTime: "זמן קריאה: כ-4 דקות",
    backToHome: "חזרה לדף הבית",
    toc: "תוכן עניינים",
    sections: [
      { id: "intro", title: "1. מבוא וזהות בעל המאגר" },
      { id: "collect", title: "2. אילו נתונים אנו אוספים" },
      { id: "purpose", title: "3. מטרות ובסיס משפטי" },
      { id: "recipients", title: "4. מי מקבל את הנתונים שלך" },
      { id: "transfers", title: "5. העברת נתונים לחו״ל" },
      { id: "retention", title: "6. תקופות שמירת הנתונים" },
      { id: "consequences", title: "7. השלכות אי-מסירת נתונים" },
      { id: "rights", title: "8. זכויותיך על פי חוק" },
      { id: "complaint", title: "9. זכות התלונה לרשות הפרטיות" },
      { id: "cookies", title: "10. עוגיות" },
      { id: "ai", title: "11. קבלת החלטות אוטומטית ו-AI" },
      { id: "security", title: "12. אבטחת מידע" },
      { id: "updates", title: "13. עדכוני מדיניות" },
    ],
    content: {
      intro: {
        title: "1. מבוא וזהות בעל המאגר",
        body: `
<p><strong>בעל המאגר:</strong> ${PRIVACY_CONFIG.businessName}</p>
<p><strong>בעלים:</strong> ${PRIVACY_CONFIG.ownerName}</p>
<p><strong>כתובת:</strong> ${PRIVACY_CONFIG.address}</p>
<p><strong>דוא״ל לפניות פרטיות:</strong> <a href="mailto:${PRIVACY_CONFIG.email}">${PRIVACY_CONFIG.email}</a></p>
<p><strong>אתר:</strong> <a href="${PRIVACY_CONFIG.website}" target="_blank" rel="noopener">${PRIVACY_CONFIG.website}</a></p>
<p style="margin-top: 1.5rem;">מדיניות פרטיות זו נכתבה בהתאם ל<strong>חוק הגנת הפרטיות, התשמ״א-1981</strong> ו<strong>תיקון 13</strong> (בתוקף מ-14 באוגוסט 2025), וכן בהתאם להנחיות רשות הגנת הפרטיות מיולי 2022.</p>
`,
      },
      collect: {
        title: "2. אילו נתונים אנו אוספים",
        subsections: [
          {
            title: "2.1 נתונים שאת/ה מוסר/ה ישירות",
            body: `<ul>
<li><strong>שם מלא, דוא״ל, טלפון</strong> — דרך טופס יצירת קשר או פנייה ישירה</li>
<li><strong>תוכן הודעות ופניות</strong> — כאשר את/ה יוצר/ת קשר עמנו</li>
</ul>`,
          },
          {
            title: "2.2 נתונים שנאספים באופן אוטומטי",
            body: `<ul>
<li><strong>כתובת IP</strong> — מוגדרת כיום כמידע אישי על פי תיקון 13</li>
<li><strong>סוג דפדפן וגרסה</strong></li>
<li><strong>סוג מכשיר</strong> (מחשב/טלפון/טאבלט)</li>
<li><strong>דפים שביקרת בהם ומשך השהייה</strong></li>
<li><strong>כתובת האתר המפנה</strong> (Referrer)</li>
</ul>`,
          },
          {
            title: "2.3 נתונים מכלי צד שלישי",
            body: `<ul>
<li><strong>Google Analytics 4:</strong> נתוני סשן, צפיות בדפים, מידע על המכשיר</li>
<li><strong>WhatsApp Business:</strong> הודעות ומספר טלפון בעת יצירת קשר דרך WhatsApp</li>
</ul>`,
          },
        ],
      },
      purpose: {
        title: "3. מטרות עיבוד הנתונים והבסיס המשפטי",
        table: [
          { purpose: "מענה לפניות ובקשות יצירת קשר", basis: "אינטרס לגיטימי" },
          { purpose: "אנליטיקה ושיפור האתר", basis: "הסכמה" },
          { purpose: "שיווק ופרסום", basis: "הסכמה" },
          { purpose: "אבטחת האתר ומניעת הונאה", basis: "אינטרס לגיטימי" },
        ],
      },
      recipients: {
        title: "4. מי מקבל את הנתונים שלך",
        body: `
<ul>
<li><strong>Google LLC (ארה״ב)</strong> — שירותי Analytics</li>
<li><strong>Meta Platforms Inc. (ארה״ב)</strong> — Facebook Pixel (אם מאופשר)</li>
<li><strong>${PRIVACY_CONFIG.hostingProvider} (${PRIVACY_CONFIG.hostingCountry})</strong> — תשתית אחסון האתר</li>
<li><strong>Firebase / Google (ארה״ב)</strong> — שמירת פניות מטפסים</li>
</ul>
<p style="margin-top: 1rem;"><strong>איננו מוכרים את המידע האישי שלך לשום צד שלישי.</strong></p>
`,
      },
      transfers: {
        title: "5. העברת נתונים לחו״ל",
        body: `
<p>חלק מספקי השירות שלנו נמצאים בארה״ב, שאינה מוגדרת כמדינה בעלת רמת הגנה מספקת לפי החוק הישראלי.</p>
<p style="margin-top: 1rem;"><strong>אמצעי ההגנה:</strong></p>
<ul>
<li>ספקינו חתומים על <strong>Standard Contractual Clauses (SCC)</strong> — סעיפים חוזיים סטנדרטיים להעברת נתונים</li>
<li>חלק מהספקים מחזיקים באישורי פרטיות בינלאומיים</li>
<li>אנו בוחרים ספקים המחויבים לרמת אבטחה גבוהה</li>
</ul>
`,
      },
      retention: {
        title: "6. תקופות שמירת הנתונים",
        items: [
          { type: "נתוני טפסי יצירת קשר", period: "24 חודשים או עד בקשת מחיקה" },
          { type: "נתוני Analytics", period: "בהתאם למדיניות Google (14 חודשים כברירת מחדל)" },
          { type: "נתוני שיווק", period: "עד ביטול הסכמה או בקשת מחיקה" },
          { type: "לוגים שרת (כתובות IP)", period: "90 יום" },
        ],
      },
      consequences: {
        title: "7. השלכות אי-מסירת נתונים (חובה על פי סעיף 11)",
        body: `
<p><strong>טופס יצירת קשר:</strong></p>
<p>מסירת שמך והדוא״ל בטופס יצירת הקשר הינה התנדבותית. עם זאת, אם לא תמסור אותם, לא נוכל להשיב לפנייתך.</p>
<p style="margin-top: 1rem;"><strong>עוגיות אנליטיקה ושיווק:</strong></p>
<p>את/ה יכול/ה לסרב לעוגיות אנליטיקה ושיווק. האתר ימשיך לתפקד במלואו — רק יכולות המעקב יושבתו.</p>
`,
      },
      rights: {
        title: "8. זכויותיך על פי החוק הישראלי",
        rights: [
          { name: "זכות עיון", desc: "ניתן לבקש עותק של המידע האישי שלך" },
          { name: "זכות תיקון", desc: "ניתן לבקש לתקן מידע שגוי" },
          { name: "זכות מחיקה", desc: "ניתן לבקש מחיקה כשהמידע אינו נדרש עוד" },
          { name: "זכות התנגדות", desc: "ניתן להתנגד לעיבוד למטרות דיוור ישיר" },
          { name: "זכות ביטול הסכמה", desc: "בכל עת, מבלי לפגוע בעיבוד שנעשה עד כה" },
        ],
        howTo: {
          title: "כיצד לממש את זכויותיך",
          body: `שלח/י דוא״ל ל-<a href="mailto:${PRIVACY_CONFIG.email}?subject=בקשת זכויות פרטיות">${PRIVACY_CONFIG.email}</a> עם הנושא: "בקשת זכויות פרטיות"`,
          response: "זמן תגובה: עד 30 יום מקבלת הבקשה",
        },
      },
      complaint: {
        title: "9. זכות התלונה לרשות הגנת הפרטיות",
        body: `
<p>אם את/ה סבור/ה שזכויות הפרטיות שלך הופרו, עומדת לך הזכות להגיש תלונה לרשות להגנת הפרטיות:</p>
<div style="background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
<p><strong>כתובת:</strong> רח׳ כנפי נשרים 66, ירושלים</p>
<p><strong>אתר:</strong> <a href="https://gov.il/en/departments/the_privacy_protection_authority" target="_blank" rel="noopener">gov.il/en/departments/the_privacy_protection_authority</a></p>
</div>
`,
      },
      cookies: {
        title: "10. עוגיות",
        categories: [
          {
            name: "עוגיות הכרחיות",
            desc: "נדרשות לתפקוד האתר. לא ניתן לכבות אותן.",
            required: true,
          },
          {
            name: "עוגיות אנליטיקה",
            desc: "Google Analytics — צפיות בדפים, משך ביקור. משמשות לשיפור האתר.",
            required: false,
          },
          {
            name: "עוגיות שיווקיות",
            desc: "Facebook Pixel, Google Ads — משמשות להצגת פרסומות רלוונטיות.",
            required: false,
          },
        ],
        manageLink: "ניתן לשנות את העדפות העוגיות בכל עת בתחתית האתר או בלחיצה עאן ",
        manageLinkText: "ניהול עוגיות",
      },
      ai: {
        title: "11. קבלת החלטות אוטומטית ובינה מלאכותית",
        body: `<p><strong>איננו מקבלים החלטות אוטומטיות שמשפיעות עליך באופן משמעותי על בסיס הנתונים האישיים שלך.</strong></p>`,
      },
      security: {
        title: "12. אבטחת מידע",
        items: [
          "הצפנת תעבורה (HTTPS/SSL) לכל התקשורת",
          "בקרת גישה — גישה למידע מוגבלת למורשים בלבד",
          "ניטור ואיתור חריגות",
        ],
        breach: "במקרה של פרצת אבטחה מהותית, נודיע למשתמשים המושפעים ולרשות הפרטיות תוך 72 שעות מגילוי האירוע.",
      },
      updates: {
        title: "13. עדכוני מדיניות",
        body: `<p>אנו עשויים לעדכן מדיניות זו מעת לעת. תאריך העדכון האחרון מוצג בראש המסמך.</p>
<p>במקרה של שינויים מהותיים, נודיע על כך באמצעות האתר או בדוא״ל.</p>`,
      },
    },
    disclaimer: "מסמך זה מיועד להדגמה ואינו מהווה ייעוץ משפטי. יש להתייעץ עם עו״ד לפני שימוש רשמי.",
  },
  en: {
    title: "Privacy Policy",
    subtitle: "In accordance with the Privacy Protection Law (Amendment 13)",
    lastUpdated: "Last Updated:",
    readTime: "Reading time: ~4 minutes",
    backToHome: "Back to Home",
    toc: "Table of Contents",
    sections: [
      { id: "intro", title: "1. Introduction & Data Controller Identity" },
      { id: "collect", title: "2. What Data We Collect" },
      { id: "purpose", title: "3. Purpose and Legal Basis" },
      { id: "recipients", title: "4. Who Receives Your Data" },
      { id: "transfers", title: "5. International Data Transfers" },
      { id: "retention", title: "6. Data Retention Periods" },
      { id: "consequences", title: "7. Consequences of Not Providing Data" },
      { id: "rights", title: "8. Your Rights Under Israeli Law" },
      { id: "complaint", title: "9. Right to Complain to the PPA" },
      { id: "cookies", title: "10. Cookies" },
      { id: "ai", title: "11. Automated Decision-Making and AI" },
      { id: "security", title: "12. Data Security" },
      { id: "updates", title: "13. Policy Updates" },
    ],
    content: {
      intro: {
        title: "1. Introduction & Data Controller Identity",
        body: `
<p><strong>Data Controller:</strong> ${PRIVACY_CONFIG.businessNameEn}</p>
<p><strong>Owner:</strong> ${PRIVACY_CONFIG.ownerName}</p>
<p><strong>Address:</strong> ${PRIVACY_CONFIG.addressEn}</p>
<p><strong>Privacy Contact Email:</strong> <a href="mailto:${PRIVACY_CONFIG.email}">${PRIVACY_CONFIG.email}</a></p>
<p><strong>Website:</strong> <a href="${PRIVACY_CONFIG.website}" target="_blank" rel="noopener">${PRIVACY_CONFIG.website}</a></p>
<p style="margin-top: 1.5rem;">This privacy policy is written in accordance with the <strong>Protection of Privacy Law (PPL) 5741-1981</strong> and <strong>Amendment 13</strong> (effective August 14, 2025), and the PPA's July 2022 official notification guidelines.</p>
`,
      },
      collect: {
        title: "2. What Data We Collect",
        subsections: [
          {
            title: "2.1 Data You Provide Directly",
            body: `<ul>
<li><strong>Name, email, phone</strong> — via contact form or direct inquiry</li>
<li><strong>Message content</strong> — when you contact us</li>
</ul>`,
          },
          {
            title: "2.2 Data Collected Automatically",
            body: `<ul>
<li><strong>IP address</strong> — now classified as personal data under Amendment 13</li>
<li><strong>Browser type and version</strong></li>
<li><strong>Device type</strong> (mobile/desktop/tablet)</li>
<li><strong>Pages visited and time spent</strong></li>
<li><strong>Referring website URL</strong></li>
</ul>`,
          },
          {
            title: "2.3 Data from Third-Party Tools",
            body: `<ul>
<li><strong>Google Analytics 4:</strong> session data, page views, device info</li>
<li><strong>WhatsApp Business:</strong> messages and phone number when contacting via WhatsApp</li>
</ul>`,
          },
        ],
      },
      purpose: {
        title: "3. Purpose and Legal Basis",
        table: [
          { purpose: "Responding to contact form submissions", basis: "Legitimate Interest" },
          { purpose: "Analytics and website improvement", basis: "Consent" },
          { purpose: "Marketing and advertising", basis: "Consent" },
          { purpose: "Website security and fraud prevention", basis: "Legitimate Interest" },
        ],
      },
      recipients: {
        title: "4. Who Receives Your Data",
        body: `
<ul>
<li><strong>Google LLC (USA)</strong> — Analytics services</li>
<li><strong>Meta Platforms Inc. (USA)</strong> — Facebook Pixel (if enabled)</li>
<li><strong>${PRIVACY_CONFIG.hostingProvider} (USA/Germany)</strong> — Website hosting infrastructure</li>
<li><strong>Firebase / Google (USA)</strong> — Form submission storage</li>
</ul>
<p style="margin-top: 1rem;"><strong>We do not sell your personal data to any third party.</strong></p>
`,
      },
      transfers: {
        title: "5. International Data Transfers",
        body: `
<p>Some of our service providers are located in the USA, which is not automatically considered a country with adequate protection under Israeli law.</p>
<p style="margin-top: 1rem;"><strong>Safeguards:</strong></p>
<ul>
<li>Our providers are signed on <strong>Standard Contractual Clauses (SCC)</strong></li>
<li>Some providers hold international privacy certifications</li>
<li>We select providers committed to high security standards</li>
</ul>
`,
      },
      retention: {
        title: "6. Data Retention Periods",
        items: [
          { type: "Contact form data", period: "24 months or until deletion request" },
          { type: "Analytics data", period: "Per Google's policy (14 months default)" },
          { type: "Marketing data", period: "Until unsubscribe or deletion request" },
          { type: "Server logs (IP addresses)", period: "90 days" },
        ],
      },
      consequences: {
        title: "7. Consequences of Not Providing Data (Required under Section 11)",
        body: `
<p><strong>Contact Form:</strong></p>
<p>Providing your name and email in the contact form is voluntary. However, if you do not provide them, we cannot respond to your inquiry.</p>
<p style="margin-top: 1rem;"><strong>Analytics and Marketing Cookies:</strong></p>
<p>You can decline analytics and marketing cookies. The website will still function fully — only tracking features will be disabled.</p>
`,
      },
      rights: {
        title: "8. Your Rights Under Israeli Law",
        rights: [
          { name: "Right of Access", desc: "You can request a copy of your personal data" },
          { name: "Right of Correction", desc: "You can request correction of inaccurate data" },
          { name: "Right of Deletion", desc: "You can request deletion when data is no longer needed" },
          { name: "Right to Object", desc: "You can object to processing for direct marketing" },
          { name: "Right to Withdraw Consent", desc: "At any time, without affecting prior processing" },
        ],
        howTo: {
          title: "How to Exercise Your Rights",
          body: `Send an email to <a href="mailto:${PRIVACY_CONFIG.email}?subject=Privacy Rights Request">${PRIVACY_CONFIG.email}</a> with subject: "Privacy Rights Request"`,
          response: "Response time: within 30 days of receiving the request",
        },
      },
      complaint: {
        title: "9. Right to Complain to the PPA",
        body: `
<p>If you believe your privacy rights have been violated, you have the right to file a complaint with the Privacy Protection Authority:</p>
<div style="background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
<p><strong>Address:</strong> 66 Kanfei Nesharim St., Jerusalem, Israel</p>
<p><strong>Website:</strong> <a href="https://gov.il/en/departments/the_privacy_protection_authority" target="_blank" rel="noopener">gov.il/en/departments/the_privacy_protection_authority</a></p>
</div>
`,
      },
      cookies: {
        title: "10. Cookies",
        categories: [
          {
            name: "Necessary Cookies",
            desc: "Required for the site to function. Cannot be disabled.",
            required: true,
          },
          {
            name: "Analytics Cookies",
            desc: "Google Analytics — page views, session duration. Used to improve the site.",
            required: false,
          },
          {
            name: "Marketing Cookies",
            desc: "Facebook Pixel, Google Ads — used to show relevant ads.",
            required: false,
          },
        ],
        manageLink: "You can change your cookie preferences at any time at the bottom of the site or by clicking ",
        manageLinkText: "Manage Cookies",
      },
      ai: {
        title: "11. Automated Decision-Making and AI",
        body: `<p><strong>We do not make automated decisions that significantly affect you based on your personal data.</strong></p>`,
      },
      security: {
        title: "12. Data Security",
        items: [
          "HTTPS/SSL encryption for all communications",
          "Access controls — data access limited to authorized personnel only",
          "Monitoring and anomaly detection",
        ],
        breach: "In case of a significant data breach, we will notify affected users and the PPA within 72 hours of discovery.",
      },
      updates: {
        title: "13. Policy Updates",
        body: `<p>We may update this policy from time to time. The last updated date is shown at the top of this document.</p>
<p>For material changes, we will notify you via the website or email.</p>`,
      },
    },
    disclaimer: "This document is for demonstration purposes and does not constitute legal advice. Please consult with a lawyer before official use.",
  },
  ar: {
    title: "سياسة الخصوصية",
    subtitle: "وفقًا لقانون حماية الخصوصية (التعديل 13)",
    lastUpdated: "آخر تحديث:",
    readTime: "وقت القراءة: ~4 دقائق",
    backToHome: "العودة للصفحة الرئيسية",
    toc: "فهرس المحتويات",
    sections: [
      { id: "intro", title: "1. المقدمة وهوية وحدة التحكم في البيانات" },
      { id: "collect", title: "2. ما هي البيانات التي نجمعها" },
      { id: "purpose", title: "3. الغرض والأساس القانوني" },
      { id: "recipients", title: "4. من يتلقى بياناتك" },
      { id: "transfers", title: "5. نقل البيانات الدولي" },
      { id: "retention", title: "6. فترات الاحتفاظ بالبيانات" },
      { id: "consequences", title: "7. عواقب عدم تقديم البيانات" },
      { id: "rights", title: "8. حقوقك بموجب القانون الإسرائيلي" },
      { id: "complaint", title: "9. الحق في تقديم شكوى لسلطة الخصوصية" },
      { id: "cookies", title: "10. ملفات تعريف الارتباط" },
      { id: "ai", title: "11. اتخاذ القرارات الآلية والذكاء الاصطناعي" },
      { id: "security", title: "12. أمن البيانات" },
      { id: "updates", title: "13. تحديثات السياسة" },
    ],
    content: {
      intro: {
        title: "1. المقدمة وهوية وحدة التحكم في البيانات",
        body: `<p>هذه سياسة خصوصية مختصرة. للإصدار الكامل، يرجى التبديل إلى العبرية أو الإنجليزية.</p>`,
      },
      collect: { title: "2. ما هي البيانات التي نجمعها", subsections: [] },
      purpose: { title: "3. الغرض والأساس القانوني", table: [] },
      recipients: { title: "4. من يتلقى بياناتك", body: "" },
      transfers: { title: "5. نقل البيانات الدولي", body: "" },
      retention: { title: "6. فترات الاحتفاظ بالبيانات", items: [] },
      consequences: { title: "7. عواقب عدم تقديم البيانات", body: "" },
      rights: { title: "8. حقوقك بموجب القانون الإسرائيلي", rights: [], howTo: { title: "", body: "", response: "" } },
      complaint: { title: "9. الحق في تقديم شكوى لسلطة الخصوصية", body: "" },
      cookies: { title: "10. ملفات تعريف الارتباط", categories: [], manageLink: "", manageLinkText: "" },
      ai: { title: "11. اتخاذ القرارات الآلية والذكاء الاصطناعي", body: "" },
      security: { title: "12. أمن البيانات", items: [], breach: "" },
      updates: { title: "13. تحديثات السياسة", body: "" },
    },
    disclaimer: "هذه وثيقة للأغراض التوضيحية فقط. يرجى استشارة محام قبل الاستخدام الرسمي.",
  },
  ru: {
    title: "Политика конфиденциальности",
    subtitle: "В соответствии с Законом о защите конфиденциальности (Поправка 13)",
    lastUpdated: "Последнее обновление:",
    readTime: "Время чтения: ~4 минуты",
    backToHome: "Вернуться на главную",
    toc: "Содержание",
    sections: [
      { id: "intro", title: "1. Введение и идентификация контролера данных" },
      { id: "collect", title: "2. Какие данные мы собираем" },
      { id: "purpose", title: "3. Цели и правовые основания" },
      { id: "recipients", title: "4. Кто получает ваши данные" },
      { id: "transfers", title: "5. Международная передача данных" },
      { id: "retention", title: "6. Сроки хранения данных" },
      { id: "consequences", title: "7. Последствия непредоставления данных" },
      { id: "rights", title: "8. Ваши права по израильскому законодательству" },
      { id: "complaint", title: "9. Право на жалобу в АВЗК" },
      { id: "cookies", title: "10. Файлы cookie" },
      { id: "ai", title: "11. Автоматическое принятие решений и ИИ" },
      { id: "security", title: "12. Безопасность данных" },
      { id: "updates", title: "13. Обновления политики" },
    ],
    content: {
      intro: {
        title: "1. Введение и идентификация контролера данных",
        body: `<p>Это краткая версия политики конфиденциальности. Для полной версии переключитесь на иврит или английский.</p>`,
      },
      collect: { title: "2. Какие данные мы собираем", subsections: [] },
      purpose: { title: "3. Цели и правовые основания", table: [] },
      recipients: { title: "4. Кто получает ваши данные", body: "" },
      transfers: { title: "5. Международная передача данных", body: "" },
      retention: { title: "6. Сроки хранения данных", items: [] },
      consequences: { title: "7. Последствия непредоставления данных", body: "" },
      rights: { title: "8. Ваши права по израильскому законодательству", rights: [], howTo: { title: "", body: "", response: "" } },
      complaint: { title: "9. Право на жалобу в АВЗК", body: "" },
      cookies: { title: "10. Файлы cookie", categories: [], manageLink: "", manageLinkText: "" },
      ai: { title: "11. Автоматическое принятие решений и ИИ", body: "" },
      security: { title: "12. Безопасность данных", items: [], breach: "" },
      updates: { title: "13. Обновления политики", body: "" },
    },
    disclaimer: "Этот документ предназначен для демонстрационных целей. Перед официальным использованием проконсультируйтесь с юристом.",
  },
};

const RTL_LANGUAGES: LanguageCode[] = ["he", "ar"];

// =============================================================================
// COMPONENT
// =============================================================================
export function PrivacyPolicyContent() {
  const [language, setLanguage] = useState<LanguageCode>("he");
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const t = translations[language];
  const isRTL = RTL_LANGUAGES.includes(language);

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    t.sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [t.sections]);

  // Scroll to section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsTocOpen(false);
    }
  };

  // Open cookie preferences
  const openCookiePreferences = () => {
    localStorage.removeItem("cookieConsent");
    window.location.reload();
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 font-sans text-slate-900"
      lang={language}
      style={{ fontFamily: 'var(--font-rubik), "Rubik", system-ui, sans-serif', color: '#0f172a' }}
    >
      {/* Header */}
      <header className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              aria-label={t.backToHome}
            >
              <span aria-hidden="true">{isRTL ? "←" : "→"}</span>
              <span>{t.backToHome}</span>
            </Link>

            {/* Language Switcher */}
            <div className="flex gap-2" role="group" aria-label="בחירת שפה / Language selection">
              {Object.keys(translations).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as LanguageCode)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    language === lang
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                  aria-label={`Switch to ${lang.toUpperCase()}`}
                  aria-pressed={language === lang}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">{t.title}</h1>
          <p className="text-slate-400 mt-2">{t.subtitle}</p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
            <span>
              {t.lastUpdated} {isRTL ? PRIVACY_CONFIG.lastUpdated : PRIVACY_CONFIG.lastUpdatedEn}
            </span>
            <span>•</span>
            <span>{t.readTime}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar TOC - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-8">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">{t.toc}</h2>
              <nav className="space-y-1">
                {t.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-right text-sm py-2 px-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    style={{ textAlign: isRTL ? "right" : "left" }}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile TOC Dropdown */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsTocOpen(!isTocOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-200"
            >
              <span className="font-medium text-slate-900">{t.toc}</span>
              <svg
                className={`w-5 h-5 text-slate-500 transition-transform ${isTocOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isTocOpen && (
              <div className="mt-2 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                {t.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`block w-full text-right text-sm py-3 px-4 transition-colors border-b border-slate-100 last:border-0 ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    style={{ textAlign: isRTL ? "right" : "left" }}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 lg:p-12">
              <div
                className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-a:text-blue-600"
                style={{ direction: isRTL ? "rtl" : "ltr", fontFamily: 'var(--font-rubik), "Rubik", system-ui, sans-serif', color: '#334155' }}
              >
                {/* Section 1: Intro */}
                <section id="intro">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.intro.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: t.content.intro.body }} />
                </section>

                {/* Section 2: What Data We Collect */}
                <section id="collect">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.collect.title}</h2>
                  {t.content.collect.subsections?.map((sub, i) => (
                    <div key={i}>
                      <h3>{sub.title}</h3>
                      <div dangerouslySetInnerHTML={{ __html: sub.body }} />
                    </div>
                  ))}
                </section>

                {/* Section 3: Purpose and Legal Basis */}
                <section id="purpose">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.purpose.title}</h2>
                  {t.content.purpose.table && t.content.purpose.table.length > 0 && (
                    <table className="min-w-full border-collapse border border-slate-300">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="border border-slate-300 px-4 py-2 text-right">
                            {isRTL ? "מטרה" : "Purpose"}
                          </th>
                          <th className="border border-slate-300 px-4 py-2 text-right">
                            {isRTL ? "בסיס משפטי" : "Legal Basis"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.content.purpose.table.map((row, i) => (
                          <tr key={i}>
                            <td className="border border-slate-300 px-4 py-2">{row.purpose}</td>
                            <td className="border border-slate-300 px-4 py-2">{row.basis}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>

                {/* Section 4: Recipients */}
                <section id="recipients">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.recipients.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: t.content.recipients.body }} />
                </section>

                {/* Section 5: International Transfers */}
                <section id="transfers">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.transfers.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: t.content.transfers.body }} />
                </section>

                {/* Section 6: Retention */}
                <section id="retention">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.retention.title}</h2>
                  {t.content.retention.items && t.content.retention.items.length > 0 && (
                    <table className="min-w-full border-collapse border border-slate-300">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="border border-slate-300 px-4 py-2 text-right">
                            {isRTL ? "סוג מידע" : "Data Type"}
                          </th>
                          <th className="border border-slate-300 px-4 py-2 text-right">
                            {isRTL ? "תקופת שמירה" : "Retention Period"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.content.retention.items.map((item, i) => (
                          <tr key={i}>
                            <td className="border border-slate-300 px-4 py-2">{item.type}</td>
                            <td className="border border-slate-300 px-4 py-2">{item.period}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>

                {/* Section 7: Consequences */}
                <section id="consequences">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.consequences.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: t.content.consequences.body }} />
                </section>

                {/* Section 8: Rights */}
                <section id="rights">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.rights.title}</h2>
                  {t.content.rights.rights && t.content.rights.rights.length > 0 && (
                    <ul>
                      {t.content.rights.rights.map((right, i) => (
                        <li key={i}>
                          <strong>{right.name}:</strong> {right.desc}
                        </li>
                      ))}
                    </ul>
                  )}
                  {t.content.rights.howTo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 my-6 not-prose">
                      <p className="font-medium text-blue-900 mb-2">{t.content.rights.howTo.title}</p>
                      <p className="text-blue-800" dangerouslySetInnerHTML={{ __html: t.content.rights.howTo.body }} />
                      <p className="text-blue-700 text-sm mt-2">{t.content.rights.howTo.response}</p>
                    </div>
                  )}
                </section>

                {/* Section 9: Complaint */}
                <section id="complaint">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.complaint.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: t.content.complaint.body }} />
                </section>

                {/* Section 10: Cookies */}
                <section id="cookies">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.cookies.title}</h2>
                  {t.content.cookies.categories && t.content.cookies.categories.length > 0 && (
                    <>
                      <table className="min-w-full border-collapse border border-slate-300">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="border border-slate-300 px-4 py-2 text-right">
                              {isRTL ? "סוג" : "Type"}
                            </th>
                            <th className="border border-slate-300 px-4 py-2 text-right">
                              {isRTL ? "תיאור" : "Description"}
                            </th>
                            <th className="border border-slate-300 px-4 py-2 text-right">
                              {isRTL ? "חובה" : "Required"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {t.content.cookies.categories.map((cat, i) => (
                            <tr key={i}>
                              <td className="border border-slate-300 px-4 py-2 font-medium">{cat.name}</td>
                              <td className="border border-slate-300 px-4 py-2">{cat.desc}</td>
                              <td className="border border-slate-300 px-4 py-2">
                                {cat.required ? (isRTL ? "כן" : "Yes") : (isRTL ? "לא" : "No")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="mt-4">
                        {t.content.cookies.manageLink}
                        <button onClick={openCookiePreferences} className="text-blue-600 hover:underline font-medium">
                          {t.content.cookies.manageLinkText}
                        </button>
                      </p>
                    </>
                  )}
                </section>

                {/* Section 11: AI */}
                <section id="ai">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.ai.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: t.content.ai.body }} />
                </section>

                {/* Section 12: Security */}
                <section id="security">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.security.title}</h2>
                  {t.content.security.items && t.content.security.items.length > 0 && (
                    <ul>
                      {t.content.security.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {t.content.security.breach && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6 not-prose">
                      <p className="text-amber-800">
                        <strong>{isRTL ? "פרצת אבטחה:" : "Data Breach:"}</strong> {t.content.security.breach}
                      </p>
                    </div>
                  )}
                </section>

                {/* Section 13: Updates */}
                <section id="updates">
                  <h2 style={{ color: PRIVACY_CONFIG.primaryColor }}>{t.content.updates.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: t.content.updates.body }} />
                </section>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-8 not-prose">
                  <p className="text-amber-800 text-sm">
                    ⚠️ {t.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} {PRIVACY_CONFIG.businessName}. {isRTL ? "כל הזכויות שמורות." : "All rights reserved."}</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/terms" className="hover:text-white hover:underline transition-colors">
              {isRTL ? "תנאי שימוש" : "Terms of Use"}
            </Link>
            <Link href="/accessibility" className="hover:text-white hover:underline transition-colors">
              {isRTL ? "נגישות" : "Accessibility"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
