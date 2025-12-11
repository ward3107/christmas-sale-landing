"use client";

// =============================================================================
// LEAD FORM HOOK
// =============================================================================
// Custom React hook for handling contact form submissions.
// Manages form state, submits data to Firebase Firestore, and sends email
// notifications via EmailJS (free tier: 200 emails/month).
// =============================================================================

import { useState, useCallback } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendLeadNotification } from "@/lib/emailjs";

// Types for the lead data
export interface LeadData {
  name: string;
  phone: string;
  email: string;
  message?: string;
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

const COLLECTION_NAME = "leads";

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

  // Submit lead data to Firestore
  const submitLead = useCallback(async (data: LeadData): Promise<boolean> => {
    // Reset previous state
    setState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      errorMessage: null,
    });

    try {
      // Validate required fields
      if (!data.name?.trim() || !data.phone?.trim() || !data.email?.trim()) {
        throw new Error("נא למלא את כל השדות הנדרשים");
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error("כתובת אימייל לא תקינה");
      }

      // Prepare the document data
      const leadDocument = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim().toLowerCase(),
        message: data.message?.trim() || "",
        createdAt: serverTimestamp(),
        source: typeof window !== "undefined" ? window.location.href : "",
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "",
        status: "new", // For lead management
      };

      // Try to add document to Firestore (non-blocking - don't fail if Firebase fails)
      // Skip Firebase if not configured
      if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        try {
          await addDoc(collection(db, COLLECTION_NAME), leadDocument);
        } catch (firebaseError) {
          console.warn("Firebase save failed (continuing with email):", firebaseError);
        }
      }

      // Send email via EmailJS (free tier: 200 emails/month)
      try {
        await sendLeadNotification({
          from_name: data.name.trim(),
          from_email: data.email.trim(),
          from_phone: data.phone.trim(),
          message: data.message?.trim() || "לא צוינה הודעה",
        });
      } catch (emailError) {
        console.error("EmailJS send failed:", emailError);
        throw new Error("שליחת האימייל נכשלה. נא לנסות שוב.");
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
