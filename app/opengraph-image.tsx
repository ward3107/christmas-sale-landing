import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site-config";

export const runtime = "edge";
export const alt = "משרד עורכי דין מסחרי לעסקים וסטארטאפים";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)",
          color: "white",
          fontFamily: "sans-serif",
          direction: "rtl",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#d4922a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            ⚖
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, opacity: 0.9 }}>
            משרד עורכי דין מוביל
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {siteConfig.hero.title}
          </h1>
          <p
            style={{
              fontSize: 30,
              opacity: 0.85,
              margin: 0,
              maxWidth: "85%",
              lineHeight: 1.4,
            }}
          >
            15+ שנות ניסיון · 500+ לקוחות · ייעוץ ראשון חינם
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span style={{ fontSize: 22, opacity: 0.7 }}>cohen-law.co.il</span>
          <span style={{ fontSize: 22, opacity: 0.7 }}>
            {siteConfig.contact.phone}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
