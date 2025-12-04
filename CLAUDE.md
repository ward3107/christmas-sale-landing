# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript type checking
```

## Architecture

This is a Next.js 14 landing page template for a Hebrew law firm, using the App Router with RTL support.

### Data-Driven Content

All site content is centralized in `src/config/site-config.ts`. This single file controls:
- Metadata/SEO
- Theme colors (as Tailwind classes)
- Contact info
- All section content (hero, features, services, about, testimonials, footer)

To modify site content, edit `site-config.ts` rather than individual components.

### Component Structure

- `app/` - Next.js App Router pages (main page assembles section components)
- `src/components/sections/` - Page sections (Hero, Features, Services, About, Testimonials)
- `src/components/layout/` - Navbar and Footer
- `src/components/forms/` - ContactForm with ConsentCheckboxes
- `src/components/ui/` - Reusable UI (Icon, WhatsAppButton, AccessibilityWidget, CookieConsent)
- `src/components/providers/` - SecurityProvider wraps app with security initialization

### Icon System

Icons are rendered dynamically via `src/components/ui/Icon.tsx`. The `iconMap` maps string names to Lucide React components, enabling data-driven icon rendering from site-config. To add new icons, import from lucide-react and add to the iconMap.

### Security Layer

`src/security/` provides client-side security utilities:
- CSP (Content Security Policy) initialization
- Rate limiting for form submissions
- Security manager for violation tracking

SecurityProvider initializes these on app mount and handles cookie consent events.

### Firebase Integration

Lead form submissions go to Firebase Firestore via `useLeadForm` hook (`src/hooks/useLeadForm.ts`). Firebase config uses `NEXT_PUBLIC_FIREBASE_*` environment variables. Supports Firestore emulator in development with `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`.

### Path Aliases

```
@/*            -> ./src/*
@/components/* -> ./src/components/*
@/config/*     -> ./src/config/*
@/hooks/*      -> ./src/hooks/*
@/lib/*        -> ./src/lib/*
```

### RTL/Hebrew Support

- Root layout sets `lang="he" dir="rtl"`
- Uses Rubik font with Hebrew subset
- Components are styled for RTL layout
