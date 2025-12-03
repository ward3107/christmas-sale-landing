// =============================================================================
// ACCESSIBILITY STATEMENT PAGE (הצהרת נגישות)
// =============================================================================

import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site-config";

export const metadata: Metadata = {
  title: "הצהרת נגישות | " + siteConfig.metadata.title,
  description: "הצהרת הנגישות של אתר " + siteConfig.metadata.title,
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
          >
            ← חזרה לדף הבית
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">הצהרת נגישות</h1>
          <p className="text-slate-400 mt-2">עדכון אחרון: דצמבר 2024</p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600">

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 not-prose">
              <p className="text-amber-800 text-sm">
                ⚠️ <strong>הבהרה:</strong> מסמך זה נוצר באמצעות מערכת אוטומטית ומיועד להדגמה בלבד.
                לפני שימוש רשמי, יש להתייעץ עם יועץ נגישות מוסמך.
              </p>
            </div>

            {/* 1. מחויבות */}
            <h2>1. מחויבותנו לנגישות</h2>
            <p>
              <strong>משרד עו״ד כהן ושות׳ בע״מ</strong> מחויב להנגיש את אתר האינטרנט שלו
              לאנשים עם מוגבלויות, בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות
              (התאמות נגישות לשירות), התשע״ג-2013.
            </p>
            <p>
              אנו שואפים לעמוד בדרישות התקן הישראלי ת&quot;י 5568 ובהנחיות הנגישות
              הבינלאומיות WCAG 2.1 ברמת AA.
            </p>

            {/* 2. מאמצי הנגשה */}
            <h2>2. פעולות ההנגשה שבוצעו</h2>
            <p>להלן הפעולות העיקריות שננקטו להנגשת האתר:</p>

            <h3>ניווט ומבנה</h3>
            <ul>
              <li>האתר ניתן לניווט מלא באמצעות מקלדת בלבד.</li>
              <li>מבנה כותרות (H1-H6) היררכי והגיוני.</li>
              <li>שימוש ב-landmarks (ראשי, צד, ניווט) לסיוע בקוראי מסך.</li>
              <li>קישורי דילוג (Skip Links) למעבר מהיר לתוכן הראשי.</li>
            </ul>

            <h3>חזותי ועיצוב</h3>
            <ul>
              <li>יחס ניגודיות (Contrast Ratio) בין טקסט לרקע העומד בדרישות רמה AA.</li>
              <li>אפשרות להגדלת טקסט עד 200% ללא אובדן תוכן או פונקציונליות.</li>
              <li>עיצוב רספונסיבי המותאם למסכים בגדלים שונים.</li>
            </ul>

            <h3>תוכן ומדיה</h3>
            <ul>
              <li>טקסט חלופי (Alt Text) לתמונות משמעותיות.</li>
              <li>תוויות (Labels) לכל שדות הטפסים.</li>
              <li>הודעות שגיאה ברורות בטפסים.</li>
            </ul>

            <h3>תאימות טכנית</h3>
            <ul>
              <li>שימוש ב-HTML5 סמנטי.</li>
              <li>תמיכה ב-ARIA attributes לשיפור הנגישות.</li>
              <li>תאימות לקוראי מסך נפוצים (NVDA, JAWS, VoiceOver).</li>
            </ul>

            {/* 3. פלטפורמות */}
            <h2>3. דפדפנים ופלטפורמות נתמכים</h2>
            <p>האתר נבדק ומותאם לעבודה בדפדפנים ובפלטפורמות הבאים:</p>
            <ul>
              <li><strong>דפדפנים:</strong> Google Chrome, Mozilla Firefox, Microsoft Edge, Safari (גרסאות עדכניות)</li>
              <li><strong>מכשירים ניידים:</strong> iOS (iPhone, iPad), Android</li>
              <li><strong>קוראי מסך:</strong> NVDA, JAWS, VoiceOver, TalkBack</li>
            </ul>

            {/* 4. מגבלות ידועות */}
            <h2>4. מגבלות ידועות</h2>
            <p>
              למרות מאמצינו, ייתכנו עדיין רכיבים שאינם נגישים במלואם:
            </p>
            <ul>
              <li>מסמכי PDF ישנים – אנו עובדים על הנגשתם.</li>
              <li>תכנים של צדדים שלישיים (Widgets חיצוניים) – תלויים בספקים החיצוניים.</li>
              <li>סרטונים ללא כתוביות – בתהליך הוספת כתוביות.</li>
            </ul>
            <p>
              אנו פועלים באופן שוטף לשיפור הנגישות ותיקון מגבלות אלו.
            </p>

            {/* 5. רכז נגישות */}
            <h2>5. רכז/ת הנגישות</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 not-prose my-6">
              <p className="text-slate-700 mb-4">
                נתקלתם בבעיית נגישות? נשמח לסייע ולטפל בפנייתכם.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>
                  <strong>שם:</strong> רכז/ת הנגישות
                </li>
                <li>
                  <strong>טלפון:</strong>{" "}
                  <a href="tel:0501234567" className="text-blue-600 hover:underline">
                    050-1234567
                  </a>
                </li>
                <li>
                  <strong>דוא״ל:</strong>{" "}
                  <a href="mailto:accessibility@cohen-law.co.il" className="text-blue-600 hover:underline">
                    accessibility@cohen-law.co.il
                  </a>
                </li>
                <li>
                  <strong>כתובת למשלוח דואר:</strong> מגדלי ב.ס.ר 4, קומה 25, רמת גן
                </li>
              </ul>
              <p className="text-slate-600 mt-4 text-sm">
                אנו מתחייבים להשיב לפניות נגישות תוך <strong>7 ימי עסקים</strong>.
              </p>
            </div>

            {/* 6. דרכי פנייה */}
            <h2>6. הגשת פנייה בנושא נגישות</h2>
            <p>
              אם נתקלתם בבעיית נגישות באתר, או שיש לכם הצעות לשיפור, נשמח לשמוע:
            </p>
            <ol>
              <li>תארו את הבעיה בקצרה.</li>
              <li>ציינו את הדף או הרכיב הבעייתי.</li>
              <li>אם רלוונטי – ציינו את הדפדפן והטכנולוגיה המסייעת שבה השתמשתם.</li>
            </ol>
            <p>
              ניתן לפנות בדוא״ל, בטלפון או בדואר – פרטי הקשר מופיעים בסעיף 5 לעיל.
            </p>

            {/* 7. נגישות המשרד */}
            <h2>7. נגישות המשרד הפיזי</h2>
            <p>משרדנו ממוקם ב:</p>
            <address className="not-italic bg-slate-50 p-4 rounded-lg">
              מגדלי ב.ס.ר 4, קומה 25<br />
              רמת גן
            </address>
            <p className="mt-4">הבניין כולל:</p>
            <ul>
              <li>חניית נכים ייעודית</li>
              <li>מעליות נגישות</li>
              <li>שירותים נגישים בקומה</li>
            </ul>
            <p>
              לתיאום ביקור והתאמות מיוחדות, אנא צרו קשר מראש.
            </p>

            {/* 8. עדכונים */}
            <h2>8. עדכון ההצהרה</h2>
            <p>
              הצהרת נגישות זו נבדקת ומתעדכנת מעת לעת. תאריך העדכון האחרון
              מצוין בראש הדף.
            </p>
            <p>
              אנו ממשיכים לעבוד על שיפור הנגישות באתר ומזמינים אתכם לפנות
              אלינו עם כל הצעה או בעיה.
            </p>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} משרד עו״ד כהן ושות׳. כל הזכויות שמורות.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/terms" className="hover:text-white transition-colors">תקנון</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">מדיניות פרטיות</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
