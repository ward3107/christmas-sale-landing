/**
 * Contact Form API Route
 *
 * Security features:
 * - Server-side rate limiting (5 submissions per 5 minutes per IP)
 * - Honeypot field validation
 * - Input sanitization
 * - Email/phone validation
 * - CSRF-like token validation
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimitAsync, getClientIp, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { verifyCsrfToken, verifyOrigin } from "@/lib/csrf";
import { leadSchema } from "@/lib/validation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import emailjs from "@emailjs/browser";

// EmailJS config
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

// Initialize EmailJS on server side
if (EMAILJS_PUBLIC_KEY) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

function sanitizeInput(input: string): string {
  if (typeof input !== "string") return input;
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/data:/gi, "")
    .trim();
}

function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];
  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * POST /api/contact
 * Handle contact form submissions
 */
export async function POST(request: NextRequest): Promise<NextResponse<ContactResponse>> {
  try {
    // 1a. Origin check — blocks cross-origin form posts
    if (!verifyOrigin(request)) {
      return NextResponse.json(
        { success: false, message: "Forbidden", error: "invalid_origin" },
        { status: 403 }
      );
    }

    // 1b. CSRF double-submit token check
    if (!verifyCsrfToken(request)) {
      return NextResponse.json(
        { success: false, message: "Forbidden", error: "invalid_csrf" },
        { status: 403 }
      );
    }

    // 1c. Rate limiting check (durable via Upstash when configured)
    const clientIp = getClientIp(request);
    const rateLimitResult = await checkRateLimitAsync(
      clientIp,
      RATE_LIMIT_CONFIGS.contactForm
    );

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many submissions. Please try again later.",
          error: "rate_limit_exceeded",
        },
        { status: 429 }
      );
    }

    // 2. Parse + schema-validate the body in one pass (zod)
    const raw = await request.json().catch(() => null);
    const parsed = leadSchema.safeParse(raw);

    // 3. Honeypot — silently 200 to not alert bots
    if (raw?.honeypot && String(raw.honeypot).trim() !== "") {
      return NextResponse.json(
        { success: true, message: "Thank you for your message." },
        { status: 200 }
      );
    }

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          message: firstError?.message ?? "נא למלא את כל השדות הנדרשים",
          error: "validation_failed",
        },
        { status: 400 }
      );
    }

    const { name, phone, email, message } = parsed.data;
    const body = parsed.data;

    // 4. Sanitize after validation
    const sanitizedName = sanitizeInput(name);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = message ? sanitizeInput(message) : "";

    // 5. XSS detection on sanitized values
    if (
      detectXSS(sanitizedName) ||
      detectXSS(sanitizedPhone) ||
      detectXSS(sanitizedEmail) ||
      detectXSS(sanitizedMessage)
    ) {
      console.warn("XSS attempt detected in contact form:", { clientIp });
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input detected",
          error: "invalid_input",
        },
        { status: 400 }
      );
    }

    // 10. Prepare lead document
    const leadDocument = {
      name: sanitizedName,
      phone: sanitizedPhone,
      email: sanitizedEmail.toLowerCase(),
      message: sanitizedMessage,
      marketingConsent: !!body.marketingConsent,
      termsAccepted: true,
      createdAt: serverTimestamp(),
      source: request.headers.get("referer") || "",
      userAgent: request.headers.get("user-agent") || "",
      ip: clientIp,
      status: "new",
    };

    // 11. Save to Firebase (non-blocking)
    let firebaseSaved = false;
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      try {
        await addDoc(collection(db, "leads"), leadDocument);
        firebaseSaved = true;
      } catch (firebaseError) {
        console.warn("Firebase save failed (continuing with email):", firebaseError);
      }
    }

    // 12. Send email via EmailJS
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.warn("EmailJS not configured");
      return NextResponse.json(
        {
          success: false,
          message: "Email service not configured",
          error: "service_unavailable",
        },
        { status: 500 }
      );
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: sanitizedName,
          from_email: sanitizedEmail,
          from_phone: sanitizedPhone,
          message: sanitizedMessage || "לא צוינה הודעה",
          marketing_consent: body.marketingConsent ? "Yes" : "No",
        }
      );
    } catch (emailError) {
      console.error("EmailJS send failed:", emailError);

      // If Firebase saved but email failed, still return success
      if (!firebaseSaved) {
        return NextResponse.json(
          {
            success: false,
            message: "שליחת האימייל נכשלה. נא לנסות שוב.",
            error: "email_failed",
          },
          { status: 500 }
        );
      }
    }

    // 13. Success response
    return NextResponse.json(
      {
        success: true,
        message: "תודה על פנייתך! נציג מטעמנו יחזור אליך בהקדם.",
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": new Date(rateLimitResult.resetAt).toISOString(),
        },
      }
    );

  } catch (error) {
    console.error("Contact form API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "אירעה שגיאה בשליחת הטופס. נא לנסות שוב.",
        error: "server_error",
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight.
 * Echoes Origin only if it's in the allowlist — never wildcard.
 */
export async function OPTIONS(request: NextRequest) {
  const { getAllowedOrigins } = await import("@/lib/csrf");
  const origin = request.headers.get("origin");
  const allowed = getAllowedOrigins();
  const allowOrigin = origin && allowed.includes(origin) ? origin : "";

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token",
      "Access-Control-Allow-Credentials": "true",
      Vary: "Origin",
    },
  });
}
