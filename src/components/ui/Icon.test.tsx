import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon Component', () => {
  beforeEach(() => {
    // Mock console.warn
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering known icons', () => {
    it('should render Phone icon', () => {
      render(<Icon name="Phone" data-testid="icon" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should render Mail icon', () => {
      render(<Icon name="Mail" data-testid="icon" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should render Shield icon', () => {
      render(<Icon name="Shield" data-testid="icon" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should render Star icon', () => {
      render(<Icon name="Star" data-testid="icon" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should render Menu icon', () => {
      render(<Icon name="Menu" data-testid="icon" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should render Check icon', () => {
      render(<Icon name="Check" data-testid="icon" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should render all social media icons', () => {
      const { container, rerender } = render(<Icon name="Facebook" data-testid="facebook" />)
      expect(container.querySelector('svg')).toBeInTheDocument()

      rerender(<Icon name="Twitter" data-testid="twitter" />)
      expect(container.querySelector('svg')).toBeInTheDocument()

      rerender(<Icon name="Linkedin" data-testid="linkedin" />)
      expect(container.querySelector('svg')).toBeInTheDocument()

      rerender(<Icon name="Instagram" data-testid="instagram" />)
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('backward compatibility alias', () => {
    it('should render Users icon for Handshake alias', () => {
      render(<Icon name="Handshake" data-testid="icon" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
  })

  describe('unknown icon', () => {
    it('should return null for unknown icon', () => {
      const { container } = render(<Icon name="UnknownIcon" />)
      expect(container.firstChild).toBeNull()
    })

    it('should warn about unknown icon', () => {
      render(<Icon name="UnknownIcon" />)
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('UnknownIcon')
      )
    })
  })

  describe('props forwarding', () => {
    it('should pass className to icon', () => {
      const { container } = render(<Icon name="Phone" className="test-class" data-testid="phone-icon" />)
      const icon = container.querySelector('svg')
      expect(icon).toHaveClass('test-class')
    })

    it('should pass size prop to icon', () => {
      const { container } = render(<Icon name="Phone" size={32} data-testid="phone-icon" />)
      const icon = container.querySelector('svg')
      expect(icon?.getAttribute('width')).toBe('32')
      expect(icon?.getAttribute('height')).toBe('32')
    })

    it('should pass color prop as stroke color', () => {
      const { container } = render(<Icon name="Phone" color="red" data-testid="phone-icon" />)
      const icon = container.querySelector('svg')
      expect(icon?.getAttribute('stroke')).toBe('red')
    })

    it('should pass custom data attributes', () => {
      render(<Icon name="Phone" data-custom="value" data-testid="phone-icon" />)
      expect(screen.getByTestId('phone-icon')).toHaveAttribute('data-custom', 'value')
    })
  })

  describe('aria attributes', () => {
    it('should have implicit img role', () => {
      const { container } = render(<Icon name="Phone" data-testid="phone-icon" />)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should pass aria-label', () => {
      const { container } = render(<Icon name="Phone" aria-label="Phone icon" data-testid="phone-icon" />)
      const icon = container.querySelector('svg')
      expect(icon?.getAttribute('aria-label')).toBe('Phone icon')
    })

    it('should pass aria-hidden', () => {
      const { container } = render(<Icon name="Phone" aria-hidden={true} data-testid="phone-icon" />)
      const icon = container.querySelector('svg')
      expect(icon?.getAttribute('aria-hidden')).toBe('true')
    })
  })
})
