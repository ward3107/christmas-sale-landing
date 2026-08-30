import { z } from "zod";

/**
 * Lead form schema — shared between client (useLeadForm) and the API route.
 * Hebrew error messages match the existing UX strings.
 */

const israeliPhoneRegex = /^(\+972|972|0)?[-\s]?[5][0-9][-\s]?\d{7}$/;

export const leadSchema = z.object({
  name: z
    .string({ error: "נא למלא את כל השדות הנדרשים" })
    .trim()
    .min(2, "שם קצר מדי")
    .max(80, "שם ארוך מדי"),

  phone: z
    .string({ error: "נא למלא את כל השדות הנדרשים" })
    .trim()
    .refine(
      (val) => israeliPhoneRegex.test(val.replace(/[\s-]/g, "")),
      "מספר טלפון לא תקין"
    ),

  email: z
    .string({ error: "נא למלא את כל השדות הנדרשים" })
    .trim()
    .email("כתובת אימייל לא תקינה")
    .max(120, "אימייל ארוך מדי"),

  message: z.string().trim().max(2000, "ההודעה ארוכה מדי").optional(),

  termsAccepted: z.literal(true, { error: "יש לאשר את תנאי השימוש" }),

  marketingConsent: z.boolean().optional().default(false),

  honeypot: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
