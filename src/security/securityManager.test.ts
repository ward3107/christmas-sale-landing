import { describe, it, expect, beforeEach, vi } from 'vitest'
import { securityManager as sm } from './securityManager'

describe('SecurityManager', () => {
  let manager: any

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear()
    // Use the singleton instance
    manager = sm
  })

  describe('generateSecureId', () => {
    it('should generate ID with default length', () => {
      const id = manager.generateSecureId()
      expect(id).toBeTruthy()
      expect(typeof id).toBe('string')
    })

    it('should generate ID with custom length', () => {
      const id = manager.generateSecureId(16)
      expect(id).toBeTruthy()
    })

    it('should generate different IDs each time', () => {
      const id1 = manager.generateSecureId()
      const id2 = manager.generateSecureId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('CSRF Token', () => {
    it('should generate CSRF token on init', () => {
      const token = manager.getCSRFToken()
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
    })

    it('should validate correct CSRF token', () => {
      const token = manager.getCSRFToken()
      expect(manager.validateCSRFToken(token)).toBe(true)
    })

    it('should reject incorrect CSRF token', () => {
      expect(manager.validateCSRFToken('invalid-token')).toBe(false)
    })

    it('should refresh CSRF token', () => {
      const oldToken = manager.getCSRFToken()
      const newToken = manager.refreshCSRFToken()
      expect(newToken).not.toBe(oldToken)
      expect(manager.validateCSRFToken(newToken)).toBe(true)
    })
  })

  describe('Input Sanitization', () => {
    it('should remove angle brackets', () => {
      expect(manager.sanitizeInput('<script>alert("xss")</script>'))
        .toBe('scriptalert("xss")/script')
    })

    it('should trim whitespace', () => {
      expect(manager.sanitizeInput('  test  ')).toBe('test')
    })

    it('should handle non-string input', () => {
      expect(manager.sanitizeInput(null as any)).toBe(null)
      expect(manager.sanitizeInput(123 as any)).toBe(123)
    })
  })

  describe('Email Validation', () => {
    it('should validate correct email', () => {
      expect(manager.isValidEmail('test@example.com')).toBe(true)
      expect(manager.isValidEmail('user.name+tag@domain.co.il')).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(manager.isValidEmail('invalid')).toBe(false)
      expect(manager.isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('Israeli Phone Validation', () => {
    it('should validate correct Israeli phone numbers', () => {
      expect(manager.isValidIsraeliPhone('0501234567')).toBe(true)
      expect(manager.isValidIsraeliPhone('052-1234567')).toBe(true)
      expect(manager.isValidIsraeliPhone('+972501234567')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(manager.isValidIsraeliPhone('1234567')).toBe(false)
      expect(manager.isValidIsraeliPhone('abc')).toBe(false)
    })
  })

  describe('Security Violations', () => {
    it('should log security violation', () => {
      manager.logViolation('test_type', 'Test violation details')
      const violations = manager.getViolations()
      expect(violations).toHaveLength(1)
      expect(violations[0]).toMatchObject({
        type: 'test_type',
        details: 'Test violation details',
      })
    })

    it('should clear all violations', () => {
      manager.logViolation('test', 'details')
      expect(manager.getViolations().length).toBe(1)
      manager.clearViolations()
      expect(manager.getViolations()).toEqual([])
    })
  })

  describe('generateNonce', () => {
    it('should generate nonce with correct length', () => {
      const nonce = manager.generateNonce()
      expect(nonce).toBeTruthy()
      expect(typeof nonce).toBe('string')
    })

    it('should generate different nonces', () => {
      const nonce1 = manager.generateNonce()
      const nonce2 = manager.generateNonce()
      expect(nonce1).not.toBe(nonce2)
    })
  })
})
