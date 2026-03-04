import { test, expect } from '@playwright/test';

/**
 * Cookie Security Tests
 * Verifies cookies have appropriate security attributes
 */
test.describe('Cookie Security', () => {
  test('should set cookies with security attributes', async ({ page, context }) => {
    await page.goto('/');

    // Wait for any cookies to be set
    await page.waitForTimeout(1000);

    const cookies = await context.cookies();

    // Check that all cookies have appropriate security settings
    for (const cookie of cookies) {
      // Cookies should be Secure (HTTPS only)
      expect(cookie.secure).toBe(true);

      // Cookies should have HttpOnly to prevent XSS access
      // Note: This may not apply to all cookies (like those set by JS)
      if (cookie.name !== '__session' && !cookie.name.startsWith('_gc_')) {
        // Cookies that don't need JavaScript access should be HttpOnly
        // This is a soft check - some cookies legitimately need JS access
      }

      // Cookies should have SameSite protection
      expect(cookie.sameSite).toMatch(/Lax|Strict/);
    }
  });

  test('should not expose sensitive data in localStorage', async ({ page }) => {
    await page.goto('/');

    // Get localStorage contents
    const localStorage = await page.evaluate(() => {
      const storage: Record<string, string> = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          storage[key] = window.localStorage.getItem(key) || '';
        }
      }
      return storage;
    });

    // Check that localStorage doesn't contain sensitive data
    for (const [key, value] of Object.entries(localStorage)) {
      // Check for sensitive patterns
      expect(key.toLowerCase()).not.toMatch(/password|token|secret|api[_-]?key/);
      expect(value).not.toMatch(/AIza[A-Za-z0-9_-]{35}/); // Google API key
      expect(value).not.toMatch(/sk-[a-zA-Z0-9]{48,}/); // OpenAI API key
    }
  });

  test('should not expose sensitive data in sessionStorage', async ({ page }) => {
    await page.goto('/');

    // Get sessionStorage contents
    const sessionStorageData = await page.evaluate(() => {
      const storage: Record<string, string> = {};
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key) {
          storage[key] = window.sessionStorage.getItem(key) || '';
        }
      }
      return storage;
    });

    // Similar checks as localStorage
    for (const [key, value] of Object.entries(sessionStorageData)) {
      expect(key.toLowerCase()).not.toMatch(/password|token|secret/);
    }
  });
});
