/**
 * CSRF protection: Origin verification + double-submit cookie pattern.
 *
 * Threat model: cross-origin form posts. We mitigate with two independent checks:
 *  1. Origin/Referer header must match the deployment URL.
 *  2. Token in cookie must match token sent in X-CSRF-Token header (attackers
 *     on another origin cannot read the cookie, so cannot forge the header).
 */
import type { NextRequest } from "next/server";

export const CSRF_COOKIE = "csrf-token";
export const CSRF_HEADER = "x-csrf-token";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 24h

export function generateCsrfToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getAllowedOrigins(): string[] {
  const allowed = new Set<string>();
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) allowed.add(site.replace(/\/$/, ""));

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) allowed.add(`https://${vercelUrl}`);

  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }
  return Array.from(allowed);
}

export function verifyOrigin(request: NextRequest): boolean {
  const allowed = getAllowedOrigins();
  if (allowed.length === 0) return true; // unconfigured deployments: don't block

  const origin = request.headers.get("origin");
  if (origin) return allowed.includes(origin);

  const referer = request.headers.get("referer");
  if (referer) return allowed.some((o) => referer.startsWith(o + "/") || referer === o);

  return false;
}

export function verifyCsrfToken(request: NextRequest): boolean {
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);
  if (!cookieToken || !headerToken) return false;
  if (cookieToken.length !== headerToken.length) return false;

  let mismatch = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    mismatch |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }
  return mismatch === 0;
}

export function csrfCookieOptions() {
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  };
}
