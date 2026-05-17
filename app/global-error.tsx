"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="he" dir="rtl">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          padding: "1rem",
        }}
      >
        <div
          role="alert"
          style={{
            maxWidth: 28 * 16,
            width: "100%",
            background: "white",
            borderRadius: "1rem",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem" }}>
            שגיאה קריטית
          </h1>
          <p style={{ color: "#475569", margin: "0 0 1.5rem" }}>
            לא הצלחנו לטעון את הדף. אנא רעננו את הדף או נסו שוב מאוחר יותר.
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
              Ref: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            נסה שוב
          </button>
        </div>
      </body>
    </html>
  );
}
