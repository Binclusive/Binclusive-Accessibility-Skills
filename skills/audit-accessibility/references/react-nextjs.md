# React / Next.js Accessibility Audit Notes

Use this reference only for React or Next.js web projects.

## Framework-Specific Areas

- Next.js App Router: audit `app/**/page.*`, `layout.*`, `template.*`, route groups, dynamic segments, loading/error/not-found files, and `[locale]` segments.
- Next.js Pages Router: audit `pages/**` except API routes; include `_app`, `_document`, and layout wrappers for lang, landmarks, providers, and page title behavior.
- React Router/Vite: audit route config, `<Routes>`, lazy route boundaries, layout components, and SPA route focus management.

## High-Risk React Patterns

- non-semantic click targets: `div/span` with `onClick`
- icon-only buttons without accessible names
- custom controls without role/name/state and keyboard support
- modals/drawers/popovers without focus management and accessible name
- forms missing label/id pairing, error association, required/autocomplete signals
- route changes without focus reset or announcement
- hardcoded `aria-label`, `placeholder`, `title`, `alt`, and visible strings outside i18n
- animation without reduced-motion handling
- Suspense/loading/toast states without live region strategy

## Next.js Checks

- `<html lang>` and locale-specific `dir` handling in root layout or document
- page titles and metadata per route
- skip-to-content link and stable `<main id="main-content">`
- server/client component boundaries that hide interactive behavior in client wrappers
- image `alt` for `next/image`; decorative images use empty alt
- Link usage: navigational links must have href and meaningful text

## Runtime-Only Checks

Mark as `RUNTIME-CHECK` when not statically provable:

- color contrast and dark mode contrast
- focus trap/restore inside third-party dialogs
- actual screen-reader announcement order
- browser zoom/reflow at 200%/400%
- touch target measurements
- route transition focus behavior
- carousel autoplay pause behavior
