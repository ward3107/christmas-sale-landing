// =============================================================================
// SECURITY MANAGER
// =============================================================================
// Centralized security utilities: CSRF tokens, login tracking,
// input sanitization, XSS detection, and violation logging.
// =============================================================================

const VIOLATIONS_KEY = "security_violations";
const MAX_VIOLATIONS = 100;

export interface SecurityViolation {
  type: string;
  details: string;
  timestamp: string;
  sessionId: string;
  url: string;
  userAgent: string;
}

interface LockoutStatus {
  locked: boolean;
  remainingMinutes?: number;
}

interface LoginAttemptResult {
  allowed: boolean;
  lockoutMinutes?: number;
  attemptsRemaining?: number;
  message?: string;
}

class SecurityManager {
  private static instance: SecurityManager | null = null;

  public sessionId: string;
  private csrfToken: string;
  private loginAttempts: number;
  private lastLoginAttempt: number;
  private lockoutUntil: number;

  private constructor() {
    this.sessionId = this.generateSecureId();
    this.csrfToken = this.generateSecureId();
    this.loginAttempts = 0;
    this.lastLoginAttempt = 0;
    this.lockoutUntil = 0;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  /**
   * Generate cryptographically secure random ID
   */
  public generateSecureId(length: number = 32): string {
    if (typeof window === "undefined") {
      // Server-side fallback
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  /**
   * Get current CSRF token
   */
  public getCSRFToken(): string {
    return this.csrfToken;
  }

  /**
   * Validate CSRF token
   */
  public validateCSRFToken(token: string): boolean {
    const isValid = token === this.csrfToken;
    if (!isValid) {
      this.logViolation("csrf_mismatch", "CSRF token validation failed");
    }
    return isValid;
  }

  /**
   * Refresh CSRF token
   */
  public refreshCSRFToken(): string {
    this.csrfToken = this.generateSecureId();
    return this.csrfToken;
  }

  /**
   * Record login attempt
   */
  public recordLoginAttempt(success: boolean): LoginAttemptResult {
    const now = Date.now();

    if (success) {
      this.loginAttempts = 0;
      this.lockoutUntil = 0;
      return { allowed: true };
    }

    this.loginAttempts++;
    this.lastLoginAttempt = now;

    // Lockout after 5 failed attempts
    if (this.loginAttempts >= 5) {
      this.lockoutUntil = now + 15 * 60 * 1000; // 15 minutes
      this.logViolation(
        "login_lockout",
        `Account locked after ${this.loginAttempts} failed attempts`
      );
      return {
        allowed: false,
        lockoutMinutes: 15,
        message: "יותר מדי ניסיונות כושלים. נסה שוב בעוד 15 דקות.",
      };
    }

    return {
      allowed: true,
      attemptsRemaining: 5 - this.loginAttempts,
    };
  }

  /**
   * Check if currently locked out
   */
  public isLockedOut(): LockoutStatus {
    if (this.lockoutUntil && Date.now() < this.lockoutUntil) {
      const remainingMs = this.lockoutUntil - Date.now();
      return {
        locked: true,
        remainingMinutes: Math.ceil(remainingMs / 60000),
      };
    }
    return { locked: false };
  }

  /**
   * Reset lockout status
   */
  public resetLockout(): void {
    this.loginAttempts = 0;
    this.lockoutUntil = 0;
  }

  /**
   * Sanitize input to prevent XSS
   */
  public sanitizeInput(input: string): string {
    if (typeof input !== "string") return input;

    return input
      .replace(/[<>]/g, "") // Remove angle brackets
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove event handlers
      .replace(/data:/gi, "") // Remove data: URIs
      .trim();
  }

  /**
   * Sanitize HTML content (allows safe tags)
   */
  public sanitizeHTML(html: string): string {
    if (typeof html !== "string") return html;

    // Remove dangerous patterns
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed[^>]*>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/data:/gi, "");
  }

  /**
   * Detect potential XSS attack patterns
   */
  public detectXSS(input: string): boolean {
    if (typeof input !== "string") return false;

    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /expression\s*\(/gi,
      /vbscript:/gi,
    ];

    const detected = xssPatterns.some((pattern) => pattern.test(input));

    if (detected) {
      this.logViolation("xss_attempt", `XSS pattern detected in input`);
    }

    return detected;
  }

  /**
   * Validate email format
   */
  public isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate Israeli phone number
   */
  public isValidIsraeliPhone(phone: string): boolean {
    // Israeli phone formats: 05X-XXXXXXX, 05XXXXXXXX, +972-5X-XXXXXXX
    const phoneRegex = /^(\+972|972|0)?[-\s]?([5][0-9])[-\s]?(\d{7})$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ""));
  }

  /**
   * Log security violation
   */
  public logViolation(type: string, details: string): void {
    if (typeof window === "undefined") return;

    const violation: SecurityViolation = {
      type,
      details,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Store locally (max 100)
    try {
      const stored = JSON.parse(
        localStorage.getItem(VIOLATIONS_KEY) || "[]"
      );
      stored.push(violation);
      if (stored.length > MAX_VIOLATIONS) stored.shift();
      localStorage.setItem(VIOLATIONS_KEY, JSON.stringify(stored));
    } catch (e) {
      console.warn("Failed to store security violation:", e);
    }

    // Log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Security Violation]", violation);
    }
  }

  /**
   * Get stored security violations
   */
  public getViolations(): SecurityViolation[] {
    if (typeof window === "undefined") return [];

    try {
      return JSON.parse(localStorage.getItem(VIOLATIONS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  /**
   * Clear stored violations
   */
  public clearViolations(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(VIOLATIONS_KEY);
    }
  }

  /**
   * Hash a string (for non-cryptographic purposes)
   */
  public async hashString(str: string): Promise<string> {
    if (typeof window === "undefined") {
      // Server-side fallback
      return Buffer.from(str).toString("base64");
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Generate a nonce for CSP
   */
  public generateNonce(): string {
    return this.generateSecureId(16);
  }
}

// Export singleton instance
export const securityManager = SecurityManager.getInstance();

export default SecurityManager;
