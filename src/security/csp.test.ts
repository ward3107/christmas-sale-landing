import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initializeCSP, getCSPViolations, clearCSPViolations, getCSPHeaders } from './csp'

describe('CSP Module', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Set up window mock
    global.window = {
      location: { href: 'http://localhost:3000' },
    } as Window & typeof globalThis
    vi.clearAllMocks()
  })

  describe('getCSPViolations', () => {
    it('should return empty array when no violations', () => {
      const violations = getCSPViolations()
      expect(violations).toEqual([])
    })

    it('should return stored violations', () => {
      const mockViolation = {
        blockedURI: 'https://evil.com/script.js',
        violatedDirective: 'script-src',
        originalPolicy: 'default-src \'self\'',
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem('csp_violations', JSON.stringify([mockViolation]))

      const violations = getCSPViolations()
      expect(violations).toHaveLength(1)
      expect(violations[0]).toMatchObject(mockViolation)
    })

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('csp_violations', 'invalid json')
      const violations = getCSPViolations()
      expect(violations).toEqual([])
    })
  })

  describe('clearCSPViolations', () => {
    it('should clear all stored violations', () => {
      const mockViolation = {
        blockedURI: 'https://evil.com/script.js',
        violatedDirective: 'script-src',
        originalPolicy: 'default-src \'self\'',
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem('csp_violations', JSON.stringify([mockViolation]))

      clearCSPViolations()

      expect(localStorage.getItem('csp_violations')).toBeNull()
      expect(getCSPViolations()).toEqual([])
    })
  })

  describe('getCSPHeaders', () => {
    it('should return CSP string for server headers', () => {
      const headers = getCSPHeaders()
      expect(headers).toContain("default-src 'self'")
      expect(headers).toContain('script-src')
      expect(headers).toContain('style-src')
    })

    it('should include multiple directives separated by semicolon', () => {
      const headers = getCSPHeaders()
      const directives = headers.split('; ')
      expect(directives.length).toBeGreaterThan(5)
    })

    it('should include frame-ancestors none for clickjacking prevention', () => {
      const headers = getCSPHeaders()
      expect(headers).toContain("frame-ancestors 'none'")
    })

    it('should include upgrade-insecure-requests', () => {
      const headers = getCSPHeaders()
      expect(headers).toContain('upgrade-insecure-requests')
    })
  })

  describe('initializeCSP', () => {
    it('should set up violation reporting event listener', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      initializeCSP()

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'securitypolicyviolation',
        expect.any(Function)
      )
    })

    it('should return early when called on server', () => {
      // Save original window
      const originalWindow = global.window

      // @ts-ignore - Remove window to simulate SSR
      delete global.window

      expect(() => initializeCSP()).not.toThrow()

      // Restore window
      global.window = originalWindow
    })

    it('should not throw in happy-dom environment', () => {
      expect(() => initializeCSP()).not.toThrow()
    })
  })
})
