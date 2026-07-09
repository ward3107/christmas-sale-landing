# Hebrew Law Firm Landing Page — Next.js Template

A production-ready, fully responsive landing page template for a Hebrew / RTL commercial law firm, built with Next.js 15 (App Router), Tailwind CSS, and Firebase. All content is data-driven from a single config file, so you can launch a customized site in minutes without touching component code.

## Features

- **Next.js 15 App Router** — modern React server components, fast builds, SEO-friendly.
- **RTL / Hebrew support** — root layout set to `lang="he" dir="rtl"`, Rubik font with Hebrew subset, all components styled for right-to-left layout.
- **Data-driven content** — every piece of copy, contact detail, theme color, and section lives in a single file: `src/config/site-config.ts`.
- **Firebase Firestore lead capture** — contact form submissions are stored in Firestore via the `useLeadForm` hook, with local emulator support for development.
- **EmailJS notifications** — get an email each time a lead submits the form (free tier: 200 emails/month, no credit card).
- **Accessibility widget** — floating accessibility controls (font sizing, contrast, etc.).
- **Cookie consent** — GDPR-style cookie banner with configurable policy link.
- **Legal pages** — ready-made Hebrew Privacy Policy, Terms of Service, and Accessibility Statement pages.
- **SEO** — configurable metadata, title, description, and keywords driven from the config file.
- **Security layer** — client-side CSP initialization, form rate limiting, and violation tracking.
- **Floating social widget** — call / WhatsApp / social buttons (`public/social-widget/`).

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3 + `@tailwindcss/typography`
- **Backend / data:** Firebase Firestore
- **Email:** EmailJS
- **Icons:** lucide-react
- **Testing:** Vitest (unit) + Playwright (e2e)

## Quick Start

```bash
npm install                          # Install dependencies
cp .env.local.example .env.local     # Create your local env file
# ...then fill in your Firebase and EmailJS credentials in .env.local
npm run dev                          # Start the dev server at http://localhost:3000
```

## How to Customize

Almost all customization happens in **one file**: `src/config/site-config.ts`.

- **Content** — edit `site-config.ts` to change metadata/SEO, contact info, and all section content (hero, features, services, about, testimonials, footer). This single file controls the whole site; you rarely need to edit components.
- **Theme colors** — change the Tailwind classes in the `theme` block of `site-config.ts` (`primary`, `primaryHover`, `primaryLight`, `accent`).
- **Contact details** — update the `contact` block (phone, whatsapp, email, address). Also update the floating widget in `public/social-widget/social-widget.js`.
- **Legal pages** — edit the constants at the top of `app/privacy/PrivacyPolicyContent.tsx`, `app/terms/page.tsx`, and `app/accessibility/page.tsx`.
- **Icons** — icons render dynamically via `src/components/ui/Icon.tsx`. Add a new Lucide icon to the `iconMap` there to reference it by name from the config.
- **Firebase & EmailJS** — configured entirely through environment variables (see `.env.local.example`). No code changes required.

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_FIREBASE_*` — your Firebase project credentials (API key, auth domain, project ID, storage bucket, messaging sender ID, app ID, measurement ID).
- `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` — optional, set to `true` to use the local Firestore emulator in development.
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` — your EmailJS credentials.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking (`tsc --noEmit`) |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:ui` | Vitest interactive UI |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Unit tests with coverage |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:debug` | Playwright debug mode |
| `npm run test:e2e:headed` | Playwright headed mode |
| `npm run snyk-test` | Snyk security scan (high severity threshold) |
| `npm run snyk-monitor` | Snyk continuous monitoring |

## Deployment

The template is optimized for **Vercel**:

1. Push the repository to your Git provider.
2. Import the project into Vercel.
3. Add all `NEXT_PUBLIC_*` environment variables in the Vercel project settings.
4. Deploy — Vercel auto-detects Next.js and builds it for you.

Any Node.js host that supports Next.js 15 will also work (`npm run build` then `npm run start`).

## Handoff & License

This template is sold as a customizable starter. After purchase it is yours to use and modify for your own or your client's projects. You are responsible for providing your own Firebase project and EmailJS account (see `WHATS_INCLUDED.md`). The legal pages (privacy, terms, accessibility) are provided as editable Hebrew boilerplate and should be reviewed by a qualified professional before going live.
