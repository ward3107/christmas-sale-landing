import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock crypto.randomUUID if not available
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = (() => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }) as () => `${string}-${string}-${string}-${string}-${string}`
}

// Mock crypto.getRandomValues for SecurityManager
Object.defineProperty(global.crypto, 'getRandomValues', {
  value: (arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256)
    }
    return arr
  },
  writable: true,
})

// Mock crypto.subtle.digest for hashing
Object.defineProperty(global.crypto, 'subtle', {
  value: {
    digest: vi.fn().mockResolvedValue(
      new Uint8Array([
        159, 134, 208, 129, 136, 76, 125, 101, 154, 47, 234, 170, 197, 90, 173, 21,
        163, 191, 79, 27, 178, 176, 178, 34, 205, 21, 108, 21, 240, 0, 168,
      ])
    ),
  },
  writable: true,
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
})) as any

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any

// Suppress console warnings for tests (like unknown icon warnings)
const originalWarn = console.warn
console.warn = vi.fn((...args) => {
  // Only show certain warnings
  if (typeof args[0] === 'string' && !args[0].includes('Icon')) {
    originalWarn(...args)
  }
})
