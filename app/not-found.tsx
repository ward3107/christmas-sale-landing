import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הדף לא נמצא | 404",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-10">
        <p className="text-7xl font-bold text-blue-600 mb-2">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          הדף שחיפשתם לא נמצא
        </h1>
        <p className="text-slate-600 mb-8">
          ייתכן שהקישור שגוי או שהדף הוסר. נשמח לעזור לכם למצוא את הדרך חזרה.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            חזרה לדף הבית
          </Link>
          <Link
            href="/#contact"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-colors"
          >
            יצירת קשר
          </Link>
        </div>
      </div>
    </main>
  );
}
