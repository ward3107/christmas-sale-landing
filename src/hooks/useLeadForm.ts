"use client";

// =============================================================================
// LEAD FORM HOOK
// =============================================================================
// Custom React hook for handling contact form submissions.
// Submits to secure server-side API route with rate limiting and validation.
// =============================================================================

import { useState, useCallback } from "react";

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
      // Validate required fields on client side (quick check before API call)
      if (!data.name?.trim() || !data.phone?.trim() || !data.email?.trim()) {
        throw new Error("נא למלא את כל השדות הנדרשים");
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("כתובת אימייל לא תקינה");
      }

      // Call the secure API endpoint
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "אירעה שגיאה בשליחת הטופס. נא לנסות שוב.");
      }

      // Success state
      setState({
        isLoading: false,
        isSuccess: true,
        isError: false,
        errorMessage: null,
      });

      return true;
    } catch (error) {
      // Error state
      const errorMessage =
        error instanceof Error
          ? error.message
          : "אירעה שגיאה בשליחת הטופס. נא לנסות שוב.";

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
