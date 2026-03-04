import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkRateLimit, getClientIp, RATE_LIMIT_CONFIGS, clearRateLimitStore } from './rate-limit'

describe('Rate Limit Utility', () => {
  beforeEach(() => {
    // Clear the rate limit store before each test
    clearRateLimitStore()
    vi.clearAllMocks()
  })

  describe('checkRateLimit', () => {
    it('should allow requests within limit', () => {
      const result = checkRateLimit('test-client', { requests: 5, window: 60 })
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('should block requests exceeding limit', () => {
      for (let i = 0; i < 6; i++) {
        checkRateLimit('test-client', { requests: 5, window: 60 })
      }

      const result = checkRateLimit('test-client', { requests: 5, window: 60 })
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after window expires', () => {
      const startTime = Date.now()
      vi.setSystemTime(startTime)

      checkRateLimit('test-client', { requests: 5, window: 1 })

      // Fast forward past the window
      vi.setSystemTime(startTime + 1001)

      const result = checkRateLimit('test-client', { requests: 5, window: 1 })
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it('should track different clients independently', () => {
      checkRateLimit('client-a', { requests: 3, window: 60 })
      checkRateLimit('client-a', { requests: 3, window: 60 })

      const resultB = checkRateLimit('client-b', { requests: 3, window: 60 })
      expect(resultB.allowed).toBe(true)
      expect(resultB.remaining).toBe(2)
    })

    it('should use default config when not specified', () => {
      const result = checkRateLimit('test-client')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(9) // Default: 10 requests
    })
  })

  describe('getClientIp', () => {
    it('should extract IP from CF-Connecting-IP header', () => {
      const request = new Request('https://example.com', {
        headers: { 'cf-connecting-ip': '1.2.3.4' },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('1.2.3.4')
    })

    it('should extract IP from X-Real-IP header', () => {
      const request = new Request('https://example.com', {
        headers: { 'x-real-ip': '5.6.7.8' },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('5.6.7.8')
    })

    it('should extract IP from X-Forwarded-For header', () => {
      const request = new Request('https://example.com', {
        headers: { 'x-forwarded-for': '9.9.9.9, 8.8.8.8' },
      })

      const ip = getClientIp(request)
      expect(ip).toBe('9.9.9.9')
    })

    it('should fallback to fingerprint when no IP headers', () => {
      const request = new Request('https://example.com', {
        headers: {
          'user-agent': 'TestAgent/1.0',
          accept: 'text/html',
          'accept-language': 'en-US',
        },
      })

      const ip = getClientIp(request)
      expect(ip).toMatch(/^ip-/)
      expect(ip).not.toBe('9.9.9.9')
    })
  })

  describe('RATE_LIMIT_CONFIGS', () => {
    it('should have CSP report config', () => {
      expect(RATE_LIMIT_CONFIGS.cspReport).toBeDefined()
      expect(RATE_LIMIT_CONFIGS.cspReport.requests).toBe(10)
      expect(RATE_LIMIT_CONFIGS.cspReport.window).toBe(60)
    })

    it('should have contact form config', () => {
      expect(RATE_LIMIT_CONFIGS.contactForm).toBeDefined()
      expect(RATE_LIMIT_CONFIGS.contactForm.requests).toBe(5)
      expect(RATE_LIMIT_CONFIGS.contactForm.window).toBe(300)
    })

    it('should have login config', () => {
      expect(RATE_LIMIT_CONFIGS.login).toBeDefined()
      expect(RATE_LIMIT_CONFIGS.login.requests).toBe(3)
      expect(RATE_LIMIT_CONFIGS.login.window).toBe(300)
    })
  })
})
