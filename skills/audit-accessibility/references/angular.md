# Angular Accessibility Audit Notes

Use this reference only for native Angular (2+) web projects. Angular renders standard HTML in the browser, so the shared web rules in `auditor-web-a11y.md` apply in full — this file adds the Angular-specific framework concerns layered on top (attribute binding, Angular CDK a11y, structural directives, host bindings, and the Angular router). React/Next.js web apps use `react-nextjs.md`; React Native uses `react-native.md`.

## Framework-Specific Areas

- Templates: most accessibility lives in `*.component.html` (or inline `template`). Audit the rendered markup, the attribute bindings, the structural directives, and the host element configured in `@Component`.
- Routing: audit `Routes` config, lazy `loadComponent`/`loadChildren` boundaries, route `title`/`TitleStrategy`, guards/resolvers, named `<router-outlet>`s, and SPA route focus/announcement on navigation.
- Standalone vs `NgModule`: behavior is the same for a11y, but confirm shared a11y directives (e.g. `A11yModule`, `RouterModule`) are actually imported by the component/module that uses them, or the binding silently no-ops.

## Angular Attribute Binding (the model that trips audits)

Angular distinguishes DOM **properties** from HTML **attributes**. Most ARIA hooks are attributes with no matching DOM property, so they must be bound with the `attr.` prefix:

- `[attr.aria-label]`, `[attr.aria-labelledby]`, `[attr.aria-describedby]`, `[attr.aria-expanded]`, `[attr.aria-controls]`, `[attr.aria-hidden]`, `[attr.aria-current]`, `[attr.aria-selected]`, `[attr.role]`, `[attr.alt]`, and `[attr.tabindex]` (where `tabindex` is dynamic).
- A **bare** `[aria-label]="..."` / `[role]="..."` (no `attr.`) binds to a non-existent DOM property and **silently fails to set the attribute** — the accessible name/role never lands. Flag bare ARIA property bindings as a real defect (the value is computed but never reaches assistive tech).
- A **static** `aria-label="Close"` / `role="button"` (no brackets) is fine and renders as written, but is not localized.
- Conditional ARIA (`[attr.aria-expanded]="isOpen"`) must reflect actual state; verify the bound expression tracks the real open/checked/selected/busy state, and that `false`/`null` is intended (binding `null` removes the attribute).

## Angular CDK Accessibility (`@angular/cdk/a11y`)

When the project depends on `@angular/cdk`, prefer and verify the CDK a11y primitives over hand-rolled equivalents:

- **`LiveAnnouncer`** (injected service, `announce(message, politeness)`): use for transient/imperative announcements (validation results, async completion, route changes). Verify the message is meaningful and localized.
- **`cdkAriaLive`** (directive): marks a region as an `aria-live` region (`polite` by default). Use for in-place status text. Verify politeness and that the region actually updates.
- **`cdkTrapFocus`** / `FocusTrap` / `ConfigurableFocusTrapFactory`: traps focus inside dialogs/overlays/menus. Verify dialogs and custom overlays trap focus while open and restore it to the trigger on close. `MatDialog` and CDK `Overlay`/`Dialog` apply a focus trap by default — verify custom overlays do too.
- **`cdkFocusInitial`**: marks the element to receive focus when a focus trap activates. Verify dialogs/overlays move focus to a sensible first element (not lost on `<body>`).
- **`FocusMonitor`** / `cdkMonitorElementFocus` / `cdkMonitorSubtreeFocus`: exposes focus origin (keyboard vs mouse vs program) for visible focus styling; verify keyboard focus remains visible.
- **`A11yModule`** (or the standalone CDK a11y directives) must be imported by the component/`NgModule` that uses `cdkTrapFocus`/`cdkAriaLive`/`cdkFocusInitial`, or the directive does nothing.
- **`cdkAriaDescriber`** / `AriaDescriber`: associates descriptive text via `aria-describedby` without duplicating DOM; verify the description is intended and localized.

## High-Risk Angular Patterns

- non-semantic click targets: `(click)` on `<div>`/`<span>` (or `<a>` without `href`/`routerLink`) without `role`, `tabindex`, a keyboard handler (`(keydown.enter)`/`(keydown.space)`), and an accessible name.
- icon-only buttons (`<button>` with only `<mat-icon>`/SVG) without `aria-label`/`[attr.aria-label]`; decorative `mat-icon`/SVG not hidden (`aria-hidden="true"`).
- bare ARIA property bindings (`[aria-label]`/`[role]` without `attr.`) that never reach the DOM.
- custom controls without role/name/state and keyboard support; reimplemented widgets where a CDK/Material primitive (with built-in a11y) exists.
- dialogs/drawers/menus/overlays without focus trap (`cdkTrapFocus`), initial focus (`cdkFocusInitial`), focus restore on close, and an accessible name (`aria-labelledby`/`aria-label` / `MatDialogConfig`'s `ariaLabel`).
- forms missing `<label for>`/`id` pairing, error association (`aria-describedby`/`mat-error` linkage), required/`aria-required`, and autocomplete signals; reactive-form validation rendered visually only with no programmatic association.
- structural directives that hide/show content with no announcement: `*ngIf`/`@if` toggled status, `[hidden]`/`[style.display]` used where content should be removed, and `*ngFor`/`@for` lists whose item semantics or order are unclear.
- route changes (`Router`/`routerLink`) without focus reset or announcement, and missing per-route page `title` (`TitleStrategy`/route `title`).
- hardcoded `aria-label`/`[attr.aria-label]`, `placeholder`, `title`, `alt`, and visible template text outside `@angular/localize`/`ngx-translate`/`transloco`.
- Angular animations (`@angular/animations`/`[@trigger]`) without a reduced-motion strategy (`prefers-reduced-motion`).
- async/loading/toast states (`| async`, spinners, `MatSnackBar`) without a live-region strategy (`cdkAriaLive`/`LiveAnnouncer`/`aria-live`).
- tables rendered with `<div>` grids or `cdk-table`/`mat-table` missing a programmatic name, `scope`/header relationships, or `<caption>`.

## Angular Table Checks

- Audit `<table>`, `mat-table`/`cdk-table`, and inline data tables for a programmatic table name: prefer a visible `<caption>`, or `aria-labelledby`/`[attr.aria-labelledby]` when no visible caption is intended.
- Verify header cells are real `<th>` (or `mat-header-cell`/`cdk-header-cell` rendering `<th>`), not styled `<td>`/`<div>`; verify `scope="col"`/`scope="row"` for simple relationships.
- For `mat-table`/`cdk-table`, confirm each `matColumnDef`/`cdkColumnDef` has a header cell with meaningful text (icon-only headers need an accessible name), and that sortable headers (`matSort`/`mat-sort-header`) expose `aria-sort` and keyboard support.
- For virtualized (`cdk-virtual-scroll`) or third-party grids, mark rendered header relationships and reading order as `RUNTIME-CHECK` when they cannot be proven statically.

## Angular Routing / App-Shell Checks

- `<html lang>` set (often in `index.html`) and locale `dir`/RTL handling (`@angular/cdk/bidi`) when localized.
- per-route page title via `TitleStrategy` or route `title` (Angular 14+); otherwise a manual `Title` service call on navigation.
- skip-to-content link and a stable `<main>` landmark in the app shell (`app.component.html`).
- route-change focus management: focus moved to the new view's heading/`<main>` (or announced) after navigation, since the SPA does not reload the page.
- `routerLink` navigational links have meaningful text and resolve to a real route; `<a>` used for navigation (not `<button>`), `<button>` used for actions.
- SSR/hydration (`@angular/ssr`): verify focus/announcement behavior is a `RUNTIME-CHECK` (server markup vs hydrated client behavior can differ).

## Runtime-Only Checks

Mark as `RUNTIME-CHECK` when not statically provable:

- color contrast and dark/Material-theme contrast
- focus trap/restore inside dialogs, CDK overlays, and third-party UI-kit widgets
- actual screen-reader announcement order, and whether `cdkAriaLive`/`LiveAnnouncer` messages fire
- browser zoom/reflow at 200%/400% and large font scale
- touch target measurements
- route transition focus behavior and `@defer`/lazy-boundary timing
- carousel/animation autoplay and `prefers-reduced-motion` behavior
- responsive or virtualized (`cdk-virtual-scroll`) table header relationships and reading order
