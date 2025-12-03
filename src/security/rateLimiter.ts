// =============================================================================
// RATE LIMITER
// =============================================================================
// Client-side rate limiting to prevent abuse and protect API endpoints.
// Uses in-memory store with automatic cleanup.
// =============================================================================

// Rate limit configurations per endpoint type
const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
  // Authentication
  login: { maxRequests: 5, windowMs: 5 * 60 * 1000 }, // 5 per 5 minutes
  resetPassword: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour

  // API endpoints
  submitForm: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
  contactForm: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
  exportData: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
  uploadFile: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 per minute

  // Default fallback
  default: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 per minute
};

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter: number;
}

// In-memory store
const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Check if a request is allowed under rate limits
 */
export function checkRateLimit(endpoint: string): RateLimitResult {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  const now = Date.now();

  let record = rateLimitStore.get(endpoint);

  // Reset if window expired
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }

  record.count++;
  rateLimitStore.set(endpoint, record);

  const isAllowed = record.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - record.count);
  const retryAfter = isAllowed ? 0 : Math.ceil((record.resetTime - now) / 1000);

  return {
    allowed: isAllowed,
    remaining,
    resetTime: record.resetTime,
    retryAfter,
  };
}

/**
 * Wrapper for API calls with rate limiting
 */
export async function withRateLimit<T>(
  endpoint: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const result = checkRateLimit(endpoint);

  if (!result.allowed) {
    const error = new Error(
      `חריגה ממגבלת הבקשות. נסה שוב בעוד ${result.retryAfter} שניות.`
    ) as Error & { code: string; retryAfter: number };
    error.code = "RATE_LIMIT_EXCEEDED";
    error.retryAfter = result.retryAfter;
    throw error;
  }

  return apiCall();
}

/**
 * React hook for rate limiting
 */
export function useRateLimit(endpoint: string) {
  return {
    checkLimit: () => checkRateLimit(endpoint),
    withLimit: <T>(apiCall: () => Promise<T>) => withRateLimit(endpoint, apiCall),
  };
}

/**
 * Reset rate limit for an endpoint
 */
export function resetRateLimit(endpoint: string): void {
  rateLimitStore.delete(endpoint);
}

/**
 * Clear all rate limits
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Get current rate limit status for all endpoints
 */
export function getRateLimitStatus(): Record<string, RateLimitResult> {
  const status: Record<string, RateLimitResult> = {};
  const now = Date.now();

  for (const [endpoint, record] of rateLimitStore.entries()) {
    const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
    const isExpired = now > record.resetTime;

    if (!isExpired) {
      status[endpoint] = {
        allowed: record.count < config.maxRequests,
        remaining: Math.max(0, config.maxRequests - record.count),
        resetTime: record.resetTime,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      };
    }
  }

  return status;
}

// Cleanup expired entries periodically
if (typeof window !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 1000); // Every minute
}

export default checkRateLimit;
