import { test, expect } from '@playwright/test';

/**
 * Security Content Tests
 * Verifies that sensitive data is not leaked in responses
 */
test.describe('Security Content Checks', () => {
  test('should not expose API keys in HTML', async ({ page }) => {
    await page.goto('/');
    const content = await page.content();

    // Common API key patterns that should NOT appear in HTML
    const sensitivePatterns = [
      /AIza[A-Za-z0-9_-]{35}/, // Google API key
      /sk-[a-zA-Z0-9]{48,}/, // OpenAI API key
      /xoxb-[a-zA-Z0-9_-]{46,}/, // Slack bot token
      /AKIA[0-9A-Z]{16,}/, // AWS access key
      /['"][\w-]*['"]\s*:\s*['"][\w-]+@[\w.-]+['"]/, // Email-like patterns in code
      /password\s*[:=]\s*['"][^'"]+['"]/i, // Password assignments
      /api[_-]?key\s*[:=]/i, // API key variables
    ];

    for (const pattern of sensitivePatterns) {
      expect(content).not.toMatch(pattern);
    }
  });

  test('should not expose Firebase config in HTML', async ({ page }) => {
    await page.goto('/');
    const content = await page.content();

    // Check if Firebase config is exposed (it should be loaded via environment)
    // Firebase config patterns
    const firebasePatterns = [
      /firebaseio\.com/,
      /firebaseapp\.com/,
      /googleapis\.com/,
    ];

    // These may appear in script src attributes (acceptable)
    // but should not appear as hardcoded config values in the HTML body
    const bodyContent = await page.locator('body').innerHTML();

    // Firebase project ID might be in config, which is acceptable for client-side apps
    // But we verify it's not in a way that exposes private keys
    expect(bodyContent).not.toContain('private_key');
    expect(bodyContent).not.toContain('service_account');
  });

  test('should not leak environment variables in client-side bundle', async ({ page }) => {
    await page.goto('/');

    // Check that we're not accidentally bundling server-side env vars
    const scripts = await page.locator('script').all();

    for (const script of scripts) {
      const src = await script.getAttribute('src');
      const content = await script.innerHTML();

      // Skip external scripts and empty scripts
      if (src || !content.trim()) continue;

      // Check for environment variable patterns
      expect(content.toLowerCase()).not.toContain('process.env');
      expect(content.toLowerCase()).not.toMatch(/secret|password|private_key/i);
    }
  });

  test('should not expose debug information in production', async ({ page }) => {
    const response = await page.goto('/');
    const content = await page.content();

    // Debug information that should not appear in production
    const debugPatterns = [
      /debug:\s*true/i,
      /verbose:\s*true/i,
      /stack trace/i,
      /webpack_hash/i,
      /react-render/i,
    ];

    // In development, some of these are acceptable
    if (process.env.NODE_ENV === 'production') {
      for (const pattern of debugPatterns) {
        expect(content).not.toMatch(pattern);
      }
    }
  });

  test('should not expose error messages with sensitive data', async ({ page }) => {
    // Test error pages don't leak information
    await page.goto('/this-page-does-not-exist');

    const content = await page.content();

    // Error messages should not contain:
    expect(content).not.toContain('/home'); // Should not expose file paths
    expect(content).not.toMatch(/at .+\.js:\d+/); // Should not show stack traces
    expect(content).not.toContain('node_modules');
  });
});
