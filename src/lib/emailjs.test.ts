import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock @emailjs/browser
const mockEmailjs = {
  init: vi.fn(),
  send: vi.fn(),
}
vi.mock('@emailjs/browser', () => ({
  default: mockEmailjs,
}))

describe('EmailJS Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset environment variables
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = 'test-service'
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = 'test-template'
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = 'test-key'
    // Reset module cache to get fresh imports
    vi.resetModules()
  })

  describe('initEmailJS', () => {
    it('should initialize EmailJS with public key', async () => {
      const { initEmailJS } = await import('./emailjs')
      initEmailJS()
      expect(mockEmailjs.init).toHaveBeenCalledWith('test-key')
    })

    it('should not reinitialize if already initialized', async () => {
      const { initEmailJS } = await import('./emailjs')
      initEmailJS()
      initEmailJS()
      expect(mockEmailjs.init).toHaveBeenCalledTimes(1)
    })

    it('should not initialize without public key', async () => {
      delete process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      const { initEmailJS } = await import('./emailjs')
      initEmailJS()
      expect(mockEmailjs.init).not.toHaveBeenCalled()
    })
  })

  describe('sendLeadNotification', () => {
    it('should send email with correct parameters', async () => {
      mockEmailjs.send.mockResolvedValue({ status: 200 })

      const { sendLeadNotification } = await import('./emailjs')
      const params = {
        from_name: 'John Doe',
        from_email: 'john@example.com',
        from_phone: '0501234567',
        message: 'Test message',
      }

      const result = await sendLeadNotification(params)

      expect(result).toBe(true)
      expect(mockEmailjs.send).toHaveBeenCalledWith(
        'test-service',
        'test-template',
        expect.objectContaining({
          from_name: 'John Doe',
          from_email: 'john@example.com',
          from_phone: '0501234567',
          message: 'Test message',
        })
      )
    })

    it('should use default message when not provided', async () => {
      mockEmailjs.send.mockResolvedValue({ status: 200 })

      const { sendLeadNotification } = await import('./emailjs')
      const params = {
        from_name: 'John Doe',
        from_email: 'john@example.com',
        from_phone: '0501234567',
        message: '',
      }

      await sendLeadNotification(params)

      expect(mockEmailjs.send).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          message: 'לא צוינה הודעה',
        })
      )
    })

    it('should include to_email when provided', async () => {
      mockEmailjs.send.mockResolvedValue({ status: 200 })

      const { sendLeadNotification } = await import('./emailjs')
      const params = {
        from_name: 'John Doe',
        from_email: 'john@example.com',
        from_phone: '0501234567',
        message: 'Test',
        to_email: 'recipient@example.com',
      }

      await sendLeadNotification(params)

      expect(mockEmailjs.send).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          to_email: 'recipient@example.com',
        })
      )
    })

    it('should return false when EmailJS is not configured', async () => {
      delete process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const { sendLeadNotification } = await import('./emailjs')

      const result = await sendLeadNotification({
        from_name: 'Test',
        from_email: 'test@example.com',
        from_phone: '0501234567',
        message: 'Test',
      })

      expect(result).toBe(false)
      expect(mockEmailjs.send).not.toHaveBeenCalled()
    })

    it('should return false on send failure', async () => {
      mockEmailjs.send.mockRejectedValue(new Error('Send failed'))

      const { sendLeadNotification } = await import('./emailjs')
      const result = await sendLeadNotification({
        from_name: 'Test',
        from_email: 'test@example.com',
        from_phone: '0501234567',
        message: 'Test',
      })

      expect(result).toBe(false)
    })

    it('should handle all missing config values', async () => {
      delete process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      delete process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      delete process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      const { sendLeadNotification } = await import('./emailjs')

      const result = await sendLeadNotification({
        from_name: 'Test',
        from_email: 'test@example.com',
        from_phone: '0501234567',
        message: 'Test',
      })

      expect(result).toBe(false)
    })
  })
})
