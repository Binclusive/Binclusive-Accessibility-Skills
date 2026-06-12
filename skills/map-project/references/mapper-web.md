# Mapper Web Reference: React / Next.js

Use this reference when `map-project` is triggered for a React or Next.js web application. The mapper observes and documents only; it never edits source code.

## Privacy Boundary

User-provided audit documents may be read as inspiration during skill creation only. Do not copy customer data into skill resources. Do not persist real customer names, project names, domains, internal URLs, proprietary component names, ticket IDs, business copy, screenshots, or exact source paths from customer artifacts.

## Step 0: Establish Context

First, run the read-only project inspector if available:

```bash
node map-project/scripts/inspect-project.mjs /path/to/project
```

The inspector returns platform and manifest signals as JSON. Treat it as a fast discovery layer, not as a substitute for reading the actual files. If it detects Swift/iOS, use `references/mapper-ios-swift.md` for iOS mapping when it is in scope. If it detects Android/Kotlin, record those signals honestly and state that detailed Android mapping references are future work unless such references have been added.

Determine these facts from the repository before asking the user:

- Framework: Next.js App Router, Next.js Pages Router, Vite React, CRA, Remix, Gatsby, or other.
- Routing model: file-based, React Router/declarative, Remix routes, or custom.
- Language: TypeScript or JavaScript.
- Styling: Tailwind, CSS Modules, CSS-in-JS, global CSS, design tokens, or mixed.
- Localization: i18n library, translation catalog location, locale routing, default/fallback locale, RTL support.
- Primary pages/views directory and shared component directory.

If framework or routing remains ambiguous after inspection, ask the user for the framework and the pages/components locations.

## User Scope Questions

Ask these when the user did not already provide scope:

1. Should I map the whole project, selected views/routes, selected components, a folder path, or a free-form target list?
2. Should localization/hardcoded string hotspots be included? Default: yes.
3. Should the output be optimized for a later accessibility-only audit, or accessibility plus localization? Default: accessibility plus localization signals.

## Dependency Analysis

Read `package.json` and relevant config files if present. Classify dependencies as:

- `A11Y-RELEVANT`: UI kits, headless primitives, routers, modals, popovers, tooltips, forms, date pickers, carousels, charts, media players, drag-and-drop, animation, virtualization, icons.
- `L10N-RELEVANT`: i18n libraries, ICU/FormatJS, date/number/currency formatters, locale helpers, RTL/bidi helpers.
- `NEUTRAL`: unrelated build, state, data, network, or utility packages.

For relevant packages, record version, role, likely a11y/l10n concerns, and whether native browser primitives are also used.

## Localization Detection

Look for:

- i18n libraries such as `next-intl`, `react-i18next`, `i18next`, `react-intl`, `@formatjs/*`, `@lingui/*`.
- Config files and locale routing such as `[locale]`, i18n middleware, `next.config.*`, or app providers.
- Translation resources under `locales/`, `messages/`, `lang/`, `translations/`, `*.json`, `*.po`, `*.ftl`.
- Formatting usage: `Intl.*`, `toLocaleString`, date-fns/dayjs/luxon locale imports.

If no i18n setup is found, record `NONE - strings appear hardcoded` and flag user-facing literals for later review.

## Route and View Detection

Enumerate the mapped scope:

- Next.js App Router: `app/**/page.*`, `layout.*`, `template.*`, dynamic segments, route groups, loading/error/not-found files.
- Next.js Pages Router: `pages/**` excluding API routes; note `_app` and `_document` separately.
- React Router: route config and `<Routes>/<Route>` tree.
- Remix: route modules under `app/routes/`.
- Other/custom: document the mechanism and file paths.

If no route system is discoverable and no path was provided, ask the user for the views folder.

## Shared Component Inventory

Find likely component roots such as `components/`, `src/components/`, `app/components/`, `src/ui/`, `packages/ui/`, `src/shared/`, `src/common/`.

For each relevant component, record:

- Component name and verified file path.
- Component type: Button, Link, Input, Select, Dialog, Drawer, Menu, Tabs, Accordion, Carousel, Image, Icon, Table, Chart, Toast, etc.
- Whether it wraps native HTML, a third-party primitive, or custom markup.
- Whether it renders user-facing text directly or receives strings through props/i18n.
- Which mapped pages/views import or render it, when statically discoverable.

## Inline UI Inventory

For each mapped page/view, record inline JSX that bypasses shared components:

- interactive elements and handlers
- forms and validation UI
- links/navigation
- modals, popovers, tooltips, menus
- images, SVG, video/audio, canvas/charts
- loading/toast/live status regions
- hardcoded visible text and hardcoded `aria-label`, `placeholder`, `title`, `alt`
- date/number/currency formatting

Record file path, approximate line range, element type, interactivity, existing a11y props, hardcoded text status, and notes.

## Output File

Write one file in project-root `Binclusive-auditing/` named `<project-name>_<YYYY-MM-DD>_project-map.md`.

Required sections:

1. Header: app, date, mapper, scope, framework, language, routing, styling, i18n, directories, totals.
2. Dependencies: table of relevant packages and concerns.
3. Localization setup: library, config, catalogs, locales, fallback, RTL, lookup mechanism.
4. Pages / Views: route/view inventory.
5. Shared Components: component inventory.
6. Inline UI Inventory: per-page inline UI table.
7. Coverage and Blind Spots: unresolved components, runtime-only concerns, excluded paths.
8. How to Use This File: instructions for `audit-accessibility`.

## Non-Negotiable Rules

- Do not modify source files.
- Do not install dependencies.
- Do not invent paths, package names, components, line numbers, or routes.
- Mark uncertainty as `needs runtime verification` or `not statically verified`.
- Keep customer-provided examples out of the skill package unless they have been anonymized into generic patterns.

