// =============================================================================
// EMAILJS CONFIGURATION
// =============================================================================
// Email sending utility using EmailJS service.
// Configure your EmailJS account at https://www.emailjs.com/
// =============================================================================

import emailjs from "@emailjs/browser";

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

// Initialize EmailJS
let initialized = false;

export function initEmailJS() {
  if (!initialized && EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    initialized = true;
  }
}

// Email template parameters interface
export interface EmailTemplateParams {
  from_name: string;
  from_email: string;
  from_phone: string;
  message: string;
  to_email?: string;
}

// Send email notification for new lead
export async function sendLeadNotification(params: EmailTemplateParams): Promise<boolean> {
  // Check if EmailJS is configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn("EmailJS not configured. Skipping email notification.");
    return false;
  }

  try {
    // Initialize if not already done
    initEmailJS();

    // Send the email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: params.from_name,
        from_email: params.from_email,
        from_phone: params.from_phone,
        message: params.message || "לא צוינה הודעה",
        to_email: params.to_email || "",
      }
    );

    console.log("Email sent successfully:", response.status);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export default { initEmailJS, sendLeadNotification };
