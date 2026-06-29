# Mapper Angular Reference

Use this reference when `map-project` is triggered for an Angular web application (Angular 2+, detected by `angular.json` and/or `@angular/core` in `package.json`). The mapper observes and documents only; it never edits source code.

This reference is for native Angular framework apps (components, templates, the Angular router, Angular CDK). React/Next.js web apps use `mapper-web.md`; React Native/Expo apps use `mapper-react-native.md`. AngularJS (1.x, the `angular` package with `ng-` directives) is a different framework — if the project is AngularJS rather than Angular 2+, record that honestly and treat the modern-Angular guidance below as best-effort.

## Privacy Boundary

User-provided audit documents may be read as inspiration during skill creation only. Do not copy customer data into skill resources. Do not persist real customer names, project names, domains, internal URLs, proprietary component/selector names, ticket IDs, business copy, screenshots, or exact source paths from customer artifacts.

## Step 0: Establish Context

First, run the read-only project inspector if available:

```bash
node map-project/scripts/inspect-project.mjs /path/to/project
```

The inspector returns platform and manifest signals as JSON, including an `angular` section (Angular version, `angular.json`, standalone vs `NgModule` signals, routing files, component/template counts, Angular CDK a11y signals, `[attr.aria-*]` template bindings, and i18n signals). Treat the inspector JSON as discovery input, not as proof. Verify Angular signals by reading `angular.json`, `package.json`, routing configuration, and actual component/template source.

Determine these facts from the repository before asking the user:

- Application model: standalone-components app (`bootstrapApplication`, `provideRouter`), classic `NgModule` app (`AppModule`, `RouterModule.forRoot`), Nx/monorepo workspace with multiple apps/libs, or a library package.
- Angular version and build system: Angular CLI / esbuild (`@angular/build` or `@angular-devkit/build-angular`), and whether server-side rendering / hydration (`@angular/ssr`, `@angular/platform-server`) is configured (route focus and announcement differ under SSR).
- Routing model: `Routes` config with `provideRouter`/`RouterModule.forRoot`/`forChild`, lazy `loadComponent`/`loadChildren`, route guards/resolvers, named outlets, and any custom navigation. Note router focus/scroll behavior (`withInMemoryScrolling`, `scrollPositionRestoration`, custom `Router` events handling).
- Language: TypeScript (Angular is TS-first); note any decorators-vs-standalone mix.
- Styling: component-scoped styles (`ViewEncapsulation`), global styles, Angular Material/CDK theming, Tailwind, SCSS, or mixed.
- Localization: Angular's built-in `@angular/localize` (`i18n` attributes, `$localize`), or third-party `@ngx-translate/core`/`@jsverse/transloco`/`transloco`; translation file locations; locale/`LOCALE_ID` setup; `dir`/RTL handling.
- Primary feature/pages directory and shared component/UI-library directory.

If application model, routing, or component roots remain ambiguous after inspection, ask the user for the entry app and the primary feature/component folders.

## User Scope Questions

Ask these when the user did not already provide scope:

1. Should I map the whole Angular app, selected routes/feature areas, selected components, a folder path, or a free-form target list?
2. Should localization/hardcoded string hotspots be included? Default: yes.
3. For an Nx/monorepo workspace, which app(s) and shared lib(s) are in scope? Default: the primary app plus shared UI libs it consumes.
4. Should the output be optimized for an accessibility-only audit, or accessibility plus localization? Default: accessibility plus localization signals.

## Project and Dependency Analysis

Read relevant manifests and configuration files when present:

- `angular.json` (projects, build targets, `assets`, `styles`, `i18n` config, SSR target), `package.json`, lockfiles, `nx.json`/`project.json` for Nx, `tsconfig*.json`.
- Bootstrap entry: `main.ts` (`bootstrapApplication` vs `platformBrowserDynamic().bootstrapModule`), `app.config.ts`, `app.module.ts`, `app.routes.ts`.

Classify dependencies as:

- `A11Y-RELEVANT`: `@angular/cdk` (especially `@angular/cdk/a11y`), `@angular/material`, component/UI kits (`primeng`, `ng-zorro-antd`, `@ng-bootstrap/ng-bootstrap`, `@ngx-bootstrap`, `@ng-select/ng-select`, `@swimlane/ngx-datatable`), overlay/dialog/menu/tooltip libraries, carousels, charts (`ngx-charts`, `highcharts-angular`), maps, drag-and-drop (`@angular/cdk/drag-drop`), virtual scroll (`@angular/cdk/scrolling`), forms (`@angular/forms` reactive/template-driven), date pickers, rich-text editors, and animation (`@angular/animations`).
- `L10N-RELEVANT`: `@angular/localize`, `@ngx-translate/core` and loaders, `@jsverse/transloco`/`transloco`, ICU/`$localize` usage, date/number/currency pipes and locale data (`@angular/common/locales`), and RTL/bidi helpers (`@angular/cdk/bidi`).
- `NEUTRAL`: unrelated data, networking, state (NgRx/NGXS unless they drive UI text), persistence, analytics, build, or utility packages.

For relevant packages, record name, version when inferable, role, likely accessibility/localization concerns, and runtime checks they imply.

## Localization Detection

Look for:

- Built-in i18n: `@angular/localize`, `i18n`/`i18n-*` attributes in templates, `$localize` tagged strings, `angular.json` `i18n` locales, and per-locale build configurations or `messages.*.xlf`/`.xtb` translation files.
- Third-party i18n: `@ngx-translate/core` (`TranslateModule`, `translate` pipe/directive, `instant`/`get`), `@jsverse/transloco`/`transloco` (`transloco` pipe/structural directive), and JSON/PO/XLIFF catalogs under `assets/i18n/`, `src/locale/`, `i18n/`, or `translations/`.
- Formatting usage: Angular pipes (`date`, `number`, `currency`, `percent`, `i18nPlural`, `i18nSelect`), `LOCALE_ID`/`registerLocaleData`, and `Intl.*`.
- RTL/bidi: `@angular/cdk/bidi` (`Directionality`, `dir` attribute), CDK overlay direction, and directional styles.

If no localization setup is found, record `NONE - strings appear hardcoded` and flag user-facing literals and accessibility strings (template text, `aria-label`/`[attr.aria-label]`, `alt`/`[alt]`, `title`, `placeholder`) for later review.

## Route and Component Detection

Enumerate the mapped scope:

- Routing: `Routes` arrays (`app.routes.ts`, `*-routing.module.ts`, `*.routes.ts`), `provideRouter(...)`, `RouterModule.forRoot/forChild`, lazy `loadComponent`/`loadChildren`, route `data`/`title` (and `TitleStrategy`), guards/resolvers, named/secondary `<router-outlet name>`, and `routerLink`/`routerLinkActive` usage.
- Components: `@Component({ selector, templateUrl|template, styleUrls })` classes. Record whether each is `standalone: true` or declared in an `NgModule`, the selector, and the template source (external `.html` vs inline `template`).
- Templates: the `.component.html` (or inline) markup is where most accessibility lives — interactive elements, attribute bindings, structural directives, and content projection.

If no route system is discoverable and no path was provided, ask the user for the feature/components folder.

## Shared Component / UI Inventory

Find likely component roots such as `src/app/`, `src/app/shared/`, `src/app/components/`, `src/app/ui/`, `libs/*/ui` (Nx), `projects/*/src` (workspace libraries), and feature folders (`src/app/features/*`).

For each relevant component/control, record:

- Component name, `selector`, and verified file path (both `.component.ts` and its template).
- Component type: Button, Link (`routerLink`/`<a href>`), Input/`FormControl`, Select/Autocomplete, Checkbox, Radio, Switch/Toggle, Slider, Dialog/`MatDialog`/CDK overlay, Drawer/`MatSidenav`, Menu, Tabs, Accordion/Expansion, Stepper, Carousel, List/`cdk-virtual-scroll`, Table/`MatTable`/`cdk-table`, Card/Row, Image/Icon (`mat-icon`/SVG), Chart, Map, Toast/Snackbar, Tooltip, custom directive-driven control.
- Whether it renders native HTML, wraps an Angular Material/CDK primitive, wraps a third-party UI-kit primitive, or is fully custom markup.
- Accessibility surface used in the template/host: static ARIA (`role`, `aria-*`), Angular attribute bindings (`[attr.aria-label]`, `[attr.aria-expanded]`, `[attr.aria-controls]`, `[attr.role]`, `[attr.aria-hidden]`), `[attr.alt]`/`alt`, host bindings (`@HostBinding('attr.role')`, `host: { ... }` in `@Component`), `@HostListener` keyboard handlers, CDK a11y usage (`cdkTrapFocus`, `cdkAriaLive`, `cdkFocusInitial`, `cdkMonitorElementFocus`, `LiveAnnouncer`, `FocusMonitor`, `A11yModule`, `cdkAriaDescriber`), and Material accessibility inputs.
- Structural directives that change what is announced or focusable: `*ngIf`/`@if`, `*ngFor`/`@for`, `*ngSwitch`/`@switch`, `<ng-container>`, `<ng-template>`, content projection (`<ng-content>`), and `@defer` blocks.
- Whether it renders user-facing text directly or receives strings via `@Input()`/i18n/translation pipes.
- Which mapped routes/feature areas use it (by selector), when statically discoverable.

## Inline UI Inventory

For each mapped route/template, record inline template markup that bypasses shared components:

- Interactive elements and handlers: `(click)`/`(keydown)`/`(keyup.enter)` on `<div>`/`<span>`/`<a>` without href, custom `(cdkClick)`-style directives, native `<button>`/`<a>`, and gesture/drag (`cdkDrag`).
- Forms and validation UI: template-driven (`ngModel`) and reactive (`formControlName`/`formGroup`) inputs, `<label for>`/`<label>` association, error containers, `aria-describedby`/`[attr.aria-describedby]`, required/`aria-required`, and Material form fields (`mat-form-field`, `mat-error`, `mat-hint`).
- Navigation and overlays: `routerLink` links, `<router-outlet>`, dialogs/`MatDialog`, CDK overlays, menus, tooltips, custom close/back buttons, and focus movement after navigation or overlay open/close.
- Structural directives and dynamic rendering: `*ngIf`/`@if`, `*ngFor`/`@for` (and `trackBy`), `*ngSwitch`/`@switch`, `@defer`, `[hidden]`, conditional `[attr.aria-*]`, and `[class]`/`[ngClass]` that toggle visible-only state.
- Images, icons, SVG, charts, maps, media, canvas: `<img alt>`/`[alt]`, `mat-icon`, inline SVG, and decorative vs informative usage.
- Dynamic content: loading/spinners, toasts/snackbars, inline validation, async pipe results (`| async`), and live status — note whether `cdkAriaLive`/`LiveAnnouncer`/`aria-live` is present.
- Hardcoded visible text and hardcoded `aria-label`/`[attr.aria-label]`, `title`, `placeholder`, `alt` outside i18n/translation.
- Locale-sensitive formatting (`date`/`number`/`currency` pipes) and RTL-sensitive layout.

Record file path (template and component), approximate line range when verified, element/control type, interactivity, existing accessibility surface (static ARIA, `[attr.aria-*]` bindings, host bindings, CDK a11y), localization status, and runtime-only concerns.

## Output File

Write one file in project-root `Binclusive-auditing/` named `<project-name>_<YYYY-MM-DD>_project-map.md`.

Required sections:

1. Header: app, date, mapper, scope, Angular version, application model (standalone vs NgModule), build/SSR, language, routing model, styling, i18n, directories, totals.
2. Dependencies: table of relevant packages and concerns (call out `@angular/cdk/a11y` and Material explicitly).
3. Localization setup: library (`@angular/localize` vs ngx-translate vs transloco), config, catalogs, locales, fallback, `LOCALE_ID`, RTL/bidi, lookup mechanism.
4. Routes / Views: route inventory (path, component, lazy vs eager, guards, `title`/`TitleStrategy`, named outlets) and file paths.
5. Shared Components: component inventory (selector, standalone vs module, template path, accessibility surface).
6. Inline UI Inventory: per-route/template inline UI table.
7. Coverage and Blind Spots: unresolved components, third-party UI-kit internals, runtime-only concerns (router focus, overlay focus trap/restore, announcements), excluded paths.
8. How to Use This File: instructions for `audit-accessibility`.

## Non-Negotiable Rules

- Do not modify source files.
- Do not install dependencies or run builds unless the user explicitly asks.
- Do not invent routes, selectors, components, paths, line numbers, rendered accessibility tree output, or runtime behavior.
- Mark router focus/announcement behavior, CDK focus trap/restore, screen-reader output, contrast, font-scale/zoom reflow, third-party UI-kit internals, and `@defer`/SSR-hydration timing as `needs runtime verification` unless directly verified.
- Keep customer-provided examples out of the skill package unless they have been anonymized into generic patterns.
