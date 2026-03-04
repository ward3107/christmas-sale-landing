import { test, expect } from '@playwright/test';

/**
 * Security Headers Regression Tests
 * Verifies that critical security headers are present
 */
test.describe('Security Headers', () => {
  test('should have CSP Report-Only header', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response!.headers();

    // Check for CSP Report-Only header (Phase 1)
    const cspReportOnly = headers['content-security-policy-report-only'];
    expect(cspReportOnly).toBeDefined();

    // Verify key CSP directives are present
    expect(cspReportOnly).toContain("default-src 'self'");
    expect(cspReportOnly).toContain("frame-ancestors 'none'");
    expect(cspReportOnly).toContain("object-src 'none'");
    expect(cspReportOnly).toContain("upgrade-insecure-requests");
  });

  test('should have X-Content-Type-Options nosniff', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response!.headers();

    expect(headers['x-content-type-options']).toBe('nosniff');
  });

  test('should have X-Frame-Options DENY', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response!.headers();

    expect(headers['x-frame-options']).toBe('DENY');
  });

  test('should have Referrer-Policy header', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response!.headers();

    expect(headers['referrer-policy']).toMatch(/strict-origin-when-cross-origin|same-origin|strict-origin/);
  });

  test('should have Permissions-Policy header', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response!.headers();

    const permissionsPolicy = headers['permissions-policy'];
    expect(permissionsPolicy).toBeDefined();

    // Verify privacy-restrictive policies
    expect(permissionsPolicy).toContain('camera=()');
    expect(permissionsPolicy).toContain('microphone=()');
  });

  test('should have HSTS header in production', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response!.headers();

    // HSTS should only be present in production (requires HTTPS)
    // Skip this test in development
    test.skip(process.env.NODE_ENV !== 'production', 'HSTS only applies in production');

    expect(headers['strict-transport-security']).toBeDefined();
    expect(headers['strict-transport-security']).toContain('max-age=');
  });

  test('should not have exposing headers', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response!.headers();

    // These headers should NOT be present (they leak information)
    expect(headers['x-powered-by']).toBeUndefined();
    expect(headers['server']).toBeUndefined(); // Or should be minimal
  });
});
