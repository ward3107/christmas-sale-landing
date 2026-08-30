"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div
      role="alert"
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
    >
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full text-red-600 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          אופס, משהו השתבש
        </h1>
        <p className="text-slate-600 mb-6">
          אירעה שגיאה לא צפויה. נסו לרענן את הדף, ואם הבעיה נמשכת — צרו איתנו
          קשר.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 mb-6 font-mono">
            Ref: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            נסה שוב
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-colors"
          >
            חזרה לעמוד הבית
          </a>
        </div>
      </div>
    </div>
  );
}
