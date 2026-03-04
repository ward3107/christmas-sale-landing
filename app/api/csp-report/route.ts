import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';

/**
 * CSP Violation Report Endpoint
 * Collects CSP violation reports for monitoring and analysis
 *
 * This endpoint receives CSP violation reports sent by browsers
 * when the Content-Security-Policy-Report-Only header is active.
 *
 * Reports are logged to console. In production, you should:
 * - Store reports in a database
 * - Send to error tracking (Sentry, DataDog, etc.)
 * - Set up alerts for high-severity violations
 *
 * Rate limited to prevent abuse from malicious actors or bugs
 */

export const runtime = 'nodejs';

// Disable body parsing for CSP reports (they use specific content type)
export const dynamic = 'force-dynamic';

interface CSPViolationReport {
  'csp-report': {
    'document-uri': string;
    'referrer': string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    'disposition': string;
    'blocked-uri': string;
    'line-number': number;
    'column-number': number;
    'source-file': string;
    'status-code': number;
    'script-sample': string;
  };
}

async function POST(request: NextRequest) {
  // Rate limiting: Check IP-based limit
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`csp-report:${clientIp}`, RATE_LIMIT_CONFIGS.cspReport);

  if (!rateLimit.allowed) {
    // Return 429 Too Many Requests with retry-after header
    const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        success: false,
        message: 'Too many CSP violation reports. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': RATE_LIMIT_CONFIGS.cspReport.requests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
        },
      }
    );
  }

  try {
    // CSP reports are sent as JSON with Content-Type: application/csp-report
    const report: CSPViolationReport = await request.json();

    // Log the violation for monitoring
    console.error('[CSP Violation]', {
      timestamp: new Date().toISOString(),
      clientIp,
      documentUri: report['csp-report']['document-uri'],
      violatedDirective: report['csp-report']['violated-directive'],
      blockedUri: report['csp-report']['blocked-uri'],
      sourceFile: report['csp-report']['source-file'],
      originalPolicy: report['csp-report']['original-policy'],
      effectiveDirective: report['csp-report']['effective-directive'],
      statusCode: report['csp-report']['status-code'],
    });

    // In production, store the violation
    if (process.env.NODE_ENV === 'production') {
      // TODO: Store in database or send to monitoring service
      // - Database: await db.cspViolations.create({ data: { ...report, clientIp, timestamp: new Date() } })
      // - Sentry: Sentry.captureMessage('CSP Violation', { extra: { report, clientIp } })
      // - DataDog: ddLog.warn('CSP Violation', { report, clientIp })
      // - CloudWatch: putMetricData({ MetricName: 'CSPViolations', Value: 1, Unit: 'Count' })
    }

    // Return 201 with rate limit headers
    return NextResponse.json(
      { success: true, message: 'Violation report received' },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_CONFIGS.cspReport.requests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('[CSP Report Error]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process report' },
      { status: 400 }
    );
  }
}

// Only POST is allowed for CSP reports
export { POST };
