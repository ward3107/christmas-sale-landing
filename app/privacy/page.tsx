// =============================================================================
// PRIVACY POLICY PAGE (מדיניות פרטיות ואבטחת מידע)
// =============================================================================

import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site-config";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | " + siteConfig.metadata.title,
  description: "מדיניות הפרטיות ואבטחת המידע של " + siteConfig.metadata.title,
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold">מדיניות פרטיות ואבטחת מידע</h1>
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
                לפני שימוש רשמי, יש להתייעץ עם עורך דין מוסמך.
              </p>
            </div>

            {/* 1. מבוא */}
            <h2>1. מבוא</h2>
            <p>
              <strong>משרד עורכי דין מוביל</strong> מכבד את פרטיות
              המשתמשים באתר ומחויב להגן על המידע האישי שנאסף.
            </p>
            <p>
              מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים, שומרים ומגנים על המידע שלך,
              בהתאם לחוק הגנת הפרטיות, התשמ״א-1981, תקנות הגנת הפרטיות (אבטחת מידע), התשע״ז-2017
              (תיקון 13), ובהשראת עקרונות ה-GDPR האירופי.
            </p>
            <p>
              <strong>כתובתנו:</strong> מגדלי ב.ס.ר 4, קומה 25, רמת גן<br />
              <strong>דוא״ל:</strong> <a href="mailto:wasya92@gmail.com">wasya92@gmail.com</a><br />
              <strong>דוא״ל לפניות פרטיות:</strong> <a href="mailto:wasya92@gmail.com">wasya92@gmail.com</a>
            </p>

            {/* 2. סוגי מידע שנאסף */}
            <h2>2. סוגי מידע שנאסף</h2>

            <h3>2.1 מידע שנמסר על ידי המשתמש</h3>
            <p>בעת מילוי טופס יצירת קשר או פנייה אלינו, אנו עשויים לאסוף:</p>
            <ul>
              <li>שם מלא</li>
              <li>כתובת דוא״ל</li>
              <li>מספר טלפון</li>
              <li>תוכן ההודעה או הפנייה</li>
            </ul>

            <h3>2.2 מידע שנאסף באופן אוטומטי</h3>
            <p>בעת גלישה באתר, אנו עשויים לאסוף:</p>
            <ul>
              <li>כתובת IP</li>
              <li>סוג הדפדפן ומערכת ההפעלה</li>
              <li>סוג המכשיר (מחשב, טלפון, טאבלט)</li>
              <li>דפים שנצפו ומשך הביקור</li>
              <li>מקור ההגעה לאתר</li>
              <li>נתוני עוגיות (Cookies) - ראה סעיף 5</li>
            </ul>

            {/* 3. מטרות עיבוד המידע */}
            <h2>3. מטרות עיבוד המידע והבסיס המשפטי</h2>
            <table className="min-w-full border-collapse border border-slate-300 not-prose mb-6">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 px-4 py-2 text-right">מטרה</th>
                  <th className="border border-slate-300 px-4 py-2 text-right">בסיס משפטי</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">מענה לפניות ובקשות</td>
                  <td className="border border-slate-300 px-4 py-2">הסכמה / אינטרס לגיטימי</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">שיפור האתר והשירות</td>
                  <td className="border border-slate-300 px-4 py-2">אינטרס לגיטימי</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">שליחת עדכונים ותכנים שיווקיים</td>
                  <td className="border border-slate-300 px-4 py-2">הסכמה מפורשת (Opt-in)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">עמידה בדרישות החוק</td>
                  <td className="border border-slate-300 px-4 py-2">חובה חוקית</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">הגנה על זכויות משפטיות</td>
                  <td className="border border-slate-300 px-4 py-2">אינטרס לגיטימי</td>
                </tr>
              </tbody>
            </table>

            {/* 4. שמירת מידע */}
            <h2>4. תקופות שמירת המידע</h2>
            <p>
              אנו שומרים מידע אישי רק למשך הזמן הנדרש למימוש המטרות שלשמן נאסף,
              או כנדרש על פי דין:
            </p>
            <ul>
              <li><strong>פרטי פנייה:</strong> עד 5 שנים מהפנייה האחרונה</li>
              <li><strong>מסמכים חשבונאיים:</strong> 7 שנים (כנדרש בפקודת מס הכנסה)</li>
              <li><strong>לוגים טכניים:</strong> עד 12 חודשים</li>
            </ul>
            <p>
              בתום תקופת השמירה, המידע יימחק או יופך לאנונימי.
            </p>

            {/* 5. עוגיות */}
            <h2>5. עוגיות (Cookies) וטכנולוגיות מעקב</h2>
            <p>האתר משתמש בעוגיות למטרות הבאות:</p>

            <h3>5.1 עוגיות חיוניות</h3>
            <p>נדרשות לתפעול בסיסי של האתר (שמירת העדפות, אבטחה).</p>

            <h3>5.2 עוגיות אנליטיקה</h3>
            <p>
              אנו עשויים להשתמש ב-Google Analytics ובכלים דומים לניתוח דפוסי גלישה.
              מידע זה מסייע לנו לשפר את חוויית המשתמש.
            </p>

            <h3>5.3 ניהול עוגיות</h3>
            <p>
              ניתן לנהל את העדפות העוגיות דרך הגדרות הדפדפן. שימו לב שחסימת עוגיות
              מסוימות עלולה להשפיע על תפקוד האתר.
            </p>

            {/* 6. שיתוף מידע */}
            <h2>6. שיתוף מידע עם צדדים שלישיים</h2>
            <p>אנו עשויים לשתף מידע עם:</p>
            <ul>
              <li>
                <strong>ספקי שירות:</strong> חברות אחסון, שירותי דוא״ל, כלי אנליטיקה –
                בכפוף להסכמי סודיות ועיבוד מידע.
              </li>
              <li>
                <strong>רשויות:</strong> כאשר נדרש על פי דין או צו בית משפט.
              </li>
              <li>
                <strong>עסקאות תאגידיות:</strong> במקרה של מיזוג או רכישה, בכפוף להמשך
                תחולת מדיניות זו או מדיניות מחמירה יותר.
              </li>
            </ul>
            <p>איננו מוכרים מידע אישי לצדדים שלישיים.</p>

            {/* 7. העברת מידע לחו״ל */}
            <h2>7. העברת מידע מחוץ לישראל</h2>
            <p>
              חלק משירותי הענן והאחסון שלנו מופעלים על ידי ספקים בינלאומיים
              (כגון Google, Vercel, Firebase) ששרתיהם עשויים להיות ממוקמים מחוץ לישראל
              או לאזור הכלכלי האירופי.
            </p>
            <p>
              אנו מקפידים לעבוד עם ספקים שמחויבים לאמצעי הגנה מתאימים
              (כגון Standard Contractual Clauses).
            </p>

            {/* 8. זכויות */}
            <h2>8. זכויות נושאי המידע</h2>
            <p>בהתאם לחוק הגנת הפרטיות ותיקון 13, עומדות לך הזכויות הבאות:</p>
            <ul>
              <li><strong>זכות לעיון:</strong> לקבל מידע על המידע האישי שאנו מחזיקים עליך.</li>
              <li><strong>זכות לתיקון:</strong> לבקש תיקון מידע שגוי או לא מדויק.</li>
              <li><strong>זכות למחיקה:</strong> לבקש מחיקת מידע, בכפוף לחובות חוקיות.</li>
              <li><strong>זכות להגבלת עיבוד:</strong> לבקש הגבלת השימוש במידע מסוים.</li>
              <li><strong>זכות להתנגד לדיוור:</strong> לבטל הסכמה לקבלת חומרים שיווקיים בכל עת.</li>
              <li><strong>זכות לניוד:</strong> לקבל את המידע בפורמט מובנה (בכפוף להיתכנות טכנית).</li>
              <li><strong>זכות לביטול הסכמה:</strong> לחזור בך מהסכמה שנתת, מבלי שהדבר יפגע בחוקיות העיבוד שנעשה עד לביטול.</li>
              <li><strong>זכות להגיש תלונה:</strong> לרשות להגנת הפרטיות.</li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 not-prose my-6">
              <p className="text-blue-900">
                <strong>למימוש זכויותיך:</strong><br />
                שלח/י בקשה ל-
                <a href="mailto:wasya92@gmail.com" className="text-blue-600 hover:underline mx-1">
                  wasya92@gmail.com
                </a>
                <br />
                נשיב תוך 30 יום כנדרש בחוק.
              </p>
            </div>

            {/* 9. אבטחת מידע */}
            <h2>9. אבטחת מידע</h2>
            <p>
              אנו נוקטים באמצעי אבטחה טכניים וארגוניים סבירים להגנה על המידע,
              לרבות הצפנת תעבורה (SSL/TLS), הגבלת גישה למורשים בלבד, וניטור חריגות.
            </p>
            <p>
              עם זאת, אין מערכת שמאובטחת ב-100%. במקרה של אירוע אבטחה מהותי,
              נפעל בהתאם לחוק, לרבות דיווח לרשות להגנת הפרטיות ו/או לנפגעים, ככל שנדרש.
            </p>

            {/* 10. קטינים */}
            <h2>10. קטינים</h2>
            <p>
              האתר אינו מיועד לקטינים מתחת לגיל 18. איננו אוספים ביודעין מידע אישי
              מקטינים. אם נודע לנו שנאסף מידע כזה, נמחק אותו בהקדם.
            </p>

            {/* 11. שינויים */}
            <h2>11. שינויים במדיניות</h2>
            <p>
              אנו עשויים לעדכן מדיניות זו מעת לעת. תאריך העדכון האחרון מופיע
              בראש המסמך. במקרה של שינויים מהותיים, נודיע באמצעות האתר או בדוא״ל.
            </p>

            {/* 12. יצירת קשר */}
            <h2>12. יצירת קשר</h2>
            <p>לשאלות בנושא פרטיות, ניתן לפנות:</p>
            <ul>
              <li>דוא״ל: <a href="mailto:wasya92@gmail.com" className="text-blue-600 hover:underline">wasya92@gmail.com</a></li>
              <li>טלפון: 053-4260632</li>
              <li>כתובת: מגדלי ב.ס.ר 4, קומה 25, רמת גן</li>
            </ul>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} משרד עורכי דין מוביל. כל הזכויות שמורות.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/terms" className="hover:text-white transition-colors">תקנון</Link>
            <Link href="/accessibility" className="hover:text-white transition-colors">הצהרת נגישות</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
