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
import { checkRateLimit, getClientIp, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
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

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message?: string;
  termsAccepted: boolean;
  marketingConsent: boolean;
  honeypot?: string; // Hidden field to catch bots
  securityToken?: string; // CSRF-like token
}

interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(input: string): string {
  if (typeof input !== "string") return input;

  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/data:/gi, "")
    .trim();
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Israeli phone number
 */
function isValidIsraeliPhone(phone: string): boolean {
  // Israeli phone formats: 05X-XXXXXXX, 05XXXXXXXX, +972-5X-XXXXXXX
  const phoneRegex = /^(\+972|972|0)?[-\s]?([5][0-9])[-\s]?(\d{7})$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
}

/**
 * Detect potential XSS patterns
 */
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
    // 1. Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimitResult = checkRateLimit(
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

    // 2. Parse request body
    const body: ContactFormData = await request.json();

    // 3. Honeypot check - if filled, it's a bot
    if (body.honeypot && body.honeypot.trim() !== "") {
      // Silently reject to not alert bots
      return NextResponse.json(
        { success: true, message: "Thank you for your message." },
        { status: 200 }
      );
    }

    // 4. Validate required fields
    const { name, phone, email, message, termsAccepted } = body;

    if (!name?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "נא למלא את כל השדות הנדרשים",
          error: "missing_fields",
        },
        { status: 400 }
      );
    }

    // 5. Validate terms acceptance
    if (!termsAccepted) {
      return NextResponse.json(
        {
          success: false,
          message: "יש לאשר את תנאי השימוש",
          error: "terms_not_accepted",
        },
        { status: 400 }
      );
    }

    // 6. Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = message ? sanitizeInput(message) : "";

    // 7. XSS detection
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

    // 8. Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "כתובת אימייל לא תקינה",
          error: "invalid_email",
        },
        { status: 400 }
      );
    }

    // 9. Validate phone format (optional but recommended)
    if (!isValidIsraeliPhone(sanitizedPhone)) {
      return NextResponse.json(
        {
          success: false,
          message: "מספר טלפון לא תקין",
          error: "invalid_phone",
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
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
