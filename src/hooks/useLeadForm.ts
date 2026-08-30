"use client";

// =============================================================================
// LEAD FORM HOOK
// =============================================================================
// Custom React hook for handling contact form submissions.
// Submits to secure server-side API route with rate limiting and validation.
// =============================================================================

import { useState, useCallback } from "react";
import { leadSchema } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";

// Types for the lead data
export interface LeadData {
  name: string;
  phone: string;
  email: string;
  message?: string;
  termsAccepted?: boolean;
  marketingConsent?: boolean;
  honeypot?: string;
}

export interface LeadFormState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export interface UseLeadFormReturn extends LeadFormState {
  submitLead: (data: LeadData) => Promise<boolean>;
  reset: () => void;
}

const API_ENDPOINT = "/api/contact";
const CSRF_ENDPOINT = "/api/csrf";

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(CSRF_ENDPOINT, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to obtain CSRF token");
  const { token } = (await res.json()) as { token: string };
  return token;
}

export function useLeadForm(): UseLeadFormReturn {
  const [state, setState] = useState<LeadFormState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: null,
  });

  // Reset the form state
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      errorMessage: null,
    });
  }, []);

  // Submit lead data to server API
  const submitLead = useCallback(async (data: LeadData): Promise<boolean> => {
    // Reset previous state
    setState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      errorMessage: null,
    });

    try {
      // Shared schema validation (matches server)
      const parsed = leadSchema.safeParse({
        ...data,
        termsAccepted: data.termsAccepted ?? false,
      });
      if (!parsed.success) {
        throw new Error(
          parsed.error.issues[0]?.message ?? "נא למלא את כל השדות הנדרשים"
        );
      }

      // Obtain CSRF token (sets cookie + returns matching header value)
      const csrfToken = await fetchCsrfToken();

      // Call the secure API endpoint
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "אירעה שגיאה בשליחת הטופס. נא לנסות שוב.");
      }

      trackEvent("form_submit", {
        form: "contact",
        marketing_consent: !!data.marketingConsent,
      });

      setState({
        isLoading: false,
        isSuccess: true,
        isError: false,
        errorMessage: null,
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "אירעה שגיאה בשליחת הטופס. נא לנסות שוב.";

      trackEvent("form_error", { form: "contact", message: errorMessage });

      setState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        errorMessage,
      });

      console.error("Lead submission error:", error);
      return false;
    }
  }, []);

  return {
    ...state,
    submitLead,
    reset,
  };
}

export default useLeadForm;
