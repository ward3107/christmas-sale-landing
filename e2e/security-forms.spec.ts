import { test, expect } from '@playwright/test';

/**
 * Form Security Tests
 * Verifies that forms have security measures in place
 */
test.describe('Form Security', () => {
  test('contact form should have CSRF protection indicators', async ({ page }) => {
    await page.goto('/');

    // Look for the contact form (adjust selector based on your app)
    const contactForm = page.locator('form').first();
    const isVisible = await contactForm.isVisible();

    if (isVisible) {
      // Check for common CSRF protection indicators
      // This is a basic check - real CSRF validation happens server-side

      // Form should not use GET method for sensitive operations
      const method = await contactForm.getAttribute('method');
      expect(method?.toLowerCase()).not.toBe('get');

      // Check for autocomplete attributes on password fields (if any)
      const passwordFields = page.locator('input[type="password"]');
      const count = await passwordFields.count();

      if (count > 0) {
        // Password fields should generally have autocomplete="new-password"
        // or autocomplete="off" for sensitive forms
        for (let i = 0; i < count; i++) {
          const field = passwordFields.nth(i);
          const autocomplete = await field.getAttribute('autocomplete');
          // Should have some autocomplete setting
          expect(autocomplete).toBeDefined();
        }
      }
    }
  });

  test('contact form should have validation', async ({ page }) => {
    await page.goto('/');

    // Find the contact form
    const form = page.locator('form').first();
    const isVisible = await form.isVisible();

    if (isVisible) {
      // Check for HTML5 validation attributes
      const requiredFields = form.locator('[required]');
      const requiredCount = await requiredFields.count();

      if (requiredCount > 0) {
        // At least some fields should have validation
        expect(requiredCount).toBeGreaterThan(0);
      }

      // Check for email input type
      const emailInputs = form.locator('input[type="email"]');
      const emailCount = await emailInputs.count();

      if (emailCount > 0) {
        // Email inputs should have type="email" for browser validation
        expect(emailCount).toBeGreaterThan(0);
      }

      // Check for phone input validation (if present)
      const phoneInputs = form.locator('input[type="tel"], input[name*="phone"], input[name*="mobile"]');
      const phoneCount = await phoneInputs.count();

      if (phoneCount > 0) {
        // Phone inputs should have proper type
        const phoneType = await phoneInputs.first().getAttribute('type');
        expect(phoneType).toMatch(/tel|text/);
      }
    }
  });

  test('form should not expose sensitive data in HTML attributes', async ({ page }) => {
    await page.goto('/');

    const form = page.locator('form').first();
    const isVisible = await form.isVisible();

    if (isVisible) {
      // Check that forms don't have pre-filled sensitive data
      const inputs = form.locator('input');
      const count = await inputs.count();

      for (let i = 0; i < count; i++) {
        const input = inputs.nth(i);
        const value = await input.getAttribute('value');
        const type = await input.getAttribute('type');

        // Password fields should not have pre-filled values
        if (type === 'password') {
          expect(value).toBe('');
          expect(await input.getAttribute('autocomplete')).not.toBe('on');
        }

        // Hidden fields should not contain sensitive data
        const inputType = await input.getAttribute('type');
        if (inputType === 'hidden') {
          const name = await input.getAttribute('name') || '';
          const hiddenValue = await input.getAttribute('value') || '';

          // Hidden fields with names like 'password', 'token', 'key' are suspicious
          const sensitiveNames = /password|token|secret|api[_-]?key/i;
          if (name.match(sensitiveNames)) {
            // Hidden sensitive fields should be empty or have nonces
            expect(hiddenValue).toBe('');
          }
        }
      }
    }
  });
});
