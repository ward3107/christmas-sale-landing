import { NextResponse } from "next/server";
import { CSRF_COOKIE, csrfCookieOptions, generateCsrfToken } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = generateCsrfToken();
  const response = NextResponse.json({ token }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(CSRF_COOKIE, token, csrfCookieOptions());
  return response;
}
