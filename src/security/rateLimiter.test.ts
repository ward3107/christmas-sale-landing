import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  checkRateLimit,
  withRateLimit,
  resetRateLimit,
  clearAllRateLimits,
  getRateLimitStatus,
} from './rateLimiter'

describe('Rate Limiter', () => {
  beforeEach(() => {
    clearAllRateLimits()
  })

  afterEach(() => {
    clearAllRateLimits()
  })

  describe('checkRateLimit', () => {
    it('should allow requests within limit', () => {
      const result = checkRateLimit('contactForm')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4) // 5 - 1
      expect(result.retryAfter).toBe(0)
    })

    it('should allow multiple requests up to limit', () => {
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit('contactForm')
        expect(result.allowed).toBe(true)
      }
    })

    it('should block requests exceeding limit', () => {
      // Submit 6 requests (limit is 5)
      for (let i = 0; i < 6; i++) {
        checkRateLimit('contactForm')
      }

      const result = checkRateLimit('contactForm')
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.retryAfter).toBeGreaterThan(0)
    })

    it('should use default config for unknown endpoints', () => {
      const result = checkRateLimit('unknownEndpoint')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(99) // 100 - 1
    })

    it('should reset after window expires', () => {
      // Use a custom endpoint with 1ms window for testing
      vi.setSystemTime(Date.now())

      checkRateLimit('submitForm')

      // Fast forward past the window (60s + 1ms)
      vi.setSystemTime(Date.now() + 60 * 1000 + 1)

      const result = checkRateLimit('submitForm')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(9) // 10 - 1 for submitForm
    })

    it('should track different endpoints independently', () => {
      checkRateLimit('login')
      checkRateLimit('login')

      const resetResult = checkRateLimit('resetPassword')
      expect(resetResult.allowed).toBe(true)
      expect(resetResult.remaining).toBe(2) // 3 - 1
    })
  })

  describe('withRateLimit', () => {
    it('should execute API call when within limit', async () => {
      const apiCall = vi.fn().mockResolvedValue({ data: 'success' })

      const result = await withRateLimit('contactForm', apiCall)

      expect(result).toEqual({ data: 'success' })
      expect(apiCall).toHaveBeenCalledTimes(1)
    })

    it('should throw error when rate limit exceeded', async () => {
      const apiCall = vi.fn().mockResolvedValue({ data: 'success' })

      // Exhaust the limit
      for (let i = 0; i < 5; i++) {
        await withRateLimit('contactForm', apiCall)
      }

      // Next call should fail
      await expect(withRateLimit('contactForm', apiCall)).rejects.toThrow(
        'חריגה ממגבלת הבקשות'
      )
    })

    it('should not call API when rate limited', async () => {
      const apiCall = vi.fn().mockResolvedValue({ data: 'success' })

      // Exhaust the limit
      for (let i = 0; i < 5; i++) {
        await withRateLimit('contactForm', apiCall)
      }

      // Reset the mock to count calls after exhaustion
      apiCall.mockClear()

      await expect(withRateLimit('contactForm', apiCall)).rejects.toThrow()
      expect(apiCall).not.toHaveBeenCalled()
    })

    it('should include retryAfter in error', async () => {
      const apiCall = vi.fn().mockResolvedValue({ data: 'success' })

      // Exhaust the limit
      for (let i = 0; i < 6; i++) {
        checkRateLimit('contactForm')
      }

      try {
        await withRateLimit('contactForm', apiCall)
        expect.fail('Should have thrown')
      } catch (error: any) {
        expect(error.code).toBe('RATE_LIMIT_EXCEEDED')
        expect(error.retryAfter).toBeGreaterThan(0)
      }
    })
  })

  describe('resetRateLimit', () => {
    it('should reset specific endpoint', () => {
      // Exhaust limit
      for (let i = 0; i < 6; i++) {
        checkRateLimit('contactForm')
      }

      expect(checkRateLimit('contactForm').allowed).toBe(false)

      resetRateLimit('contactForm')

      const result = checkRateLimit('contactForm')
      expect(result.allowed).toBe(true)
    })

    it('should not affect other endpoints', () => {
      checkRateLimit('login')
      checkRateLimit('login')

      resetRateLimit('contactForm')

      const loginResult = checkRateLimit('login')
      expect(loginResult.remaining).toBeLessThan(5)
    })
  })

  describe('clearAllRateLimits', () => {
    it('should clear all rate limits', () => {
      checkRateLimit('login')
      checkRateLimit('contactForm')
      checkRateLimit('submitForm')

      clearAllRateLimits()

      expect(checkRateLimit('login').allowed).toBe(true)
      expect(checkRateLimit('contactForm').allowed).toBe(true)
      expect(checkRateLimit('submitForm').allowed).toBe(true)
    })
  })

  describe('getRateLimitStatus', () => {
    it('should return status for all active endpoints', () => {
      checkRateLimit('login')
      checkRateLimit('login')

      const status = getRateLimitStatus()

      expect(status.login).toBeDefined()
      expect(status.login.remaining).toBeLessThan(5)
    })

    it('should exclude expired entries', () => {
      checkRateLimit('submitForm')

      // Fast forward past expiration
      vi.setSystemTime(Date.now() + 60 * 1000 + 1)

      const status = getRateLimitStatus()

      expect(status.submitForm).toBeUndefined()
    })

    it('should return empty object when no active limits', () => {
      const status = getRateLimitStatus()
      expect(status).toEqual({})
    })
  })
})
