/**
 * Rate limiting utilities for Next.js API routes
 * Edge-compatible rate limiting using IP-based tracking
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 1000);
}

/**
 * Clear the rate limit store (for testing purposes)
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Number of requests allowed */
  requests: number;
  /** Time window in seconds */
  window: number;
}

/**
 * Check if a request should be rate limited
 * Returns true if the request should be allowed, false if rate limit exceeded
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { requests: 10, window: 60 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const windowMs = config.window * 1000;

  let entry = rateLimitStore.get(identifier);

  // Create or reset entry if window has expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(identifier, entry);

    return {
      allowed: true,
      remaining: config.requests - 1,
      resetAt: entry.resetAt,
    };
  }

  // Increment count within window
  entry.count++;

  if (entry.count > config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: config.requests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Get client IP address from request headers
 * Falls back to a hash of the request fingerprint if IP not available
 */
export function getClientIp(request: Request): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  if (realIp) {
    return realIp;
  }

  if (forwardedFor) {
    // Take the first IP from the comma-separated list
    return forwardedFor.split(',')[0].trim();
  }

  // Fallback: generate a hash from request fingerprint
  // This is less reliable but works for basic rate limiting
  const userAgent = request.headers.get('user-agent') || '';
  const accept = request.headers.get('accept') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';

  const fingerprint = `${userAgent}-${accept}-${acceptLanguage}`;
  return simpleHash(fingerprint);
}

/**
 * Simple hash function for fallback IP identification
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `ip-${Math.abs(hash)}`;
}

/**
 * Rate limit configuration for different endpoints
 */
export const RATE_LIMIT_CONFIGS = {
  cspReport: { requests: 10, window: 60 }, // 10 reports per minute
  contactForm: { requests: 5, window: 300 }, // 5 submissions per 5 minutes
  login: { requests: 3, window: 300 }, // 3 login attempts per 5 minutes
  apiDefault: { requests: 100, window: 60 }, // 100 requests per minute
} as const;
