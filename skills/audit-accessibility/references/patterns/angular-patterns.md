# Angular Pattern Catalog

This catalog contains anonymized, reusable accessibility patterns only. Do not add customer names, project names, domains, internal URLs, proprietary component/selector names, ticket IDs, business copy, screenshots, or exact customer source paths. Native Angular (2+) web only; React/Next.js patterns live in `react-nextjs-patterns.md` and React Native patterns in `react-native-patterns.md`.

## Pattern Entry Template

```md
### PATTERN-NG-001: Short title
- Platform: Web
- Framework: Angular
- Component type: Button | Input | Dialog | Table | Router | etc.
- WCAG / APG: WCAG 2.1.1, 4.1.2, APG Dialog Pattern, etc.
- Severity default: Critical | Serious | Moderate | Minor
- Fix type default: SAFE | VISUAL-IMPACT | FUNCTIONAL-RISK | RUNTIME-CHECK
- Bad shape: anonymized description of the recurring code/UX problem
- Detection hints: grep/search/static cues (template + TS)
- Correct fix: preferred Angular implementation pattern
- Verification: keyboard, screen reader, automated, runtime notes
- False positives / exceptions: when not to flag
```

## Seed Patterns

### PATTERN-NG-001: Bare ARIA property binding never reaches the DOM
- Platform: Web
- Framework: Angular
- Component type: Any element with dynamic ARIA
- WCAG / APG: WCAG 4.1.2 Name/Role/Value
- Severity default: Serious
- Fix type default: SAFE
- Bad shape: A template binds ARIA as a DOM property — `[aria-label]="x"`, `[role]="x"`, `[aria-expanded]="open"` — without the `attr.` prefix. ARIA has no matching DOM property, so Angular computes the value but never sets the attribute; the accessible name/role/state silently never lands.
- Detection hints: `\[aria-[a-z]+\]=` or `\[role\]=` in `.component.html`/inline templates (square brackets, no `attr.`). Contrast with correct `[attr.aria-...]`.
- Correct fix: Use the attribute binding form: `[attr.aria-label]="x"`, `[attr.role]="x"`, `[attr.aria-expanded]="open"`. A static value with no brackets (`aria-label="Close"`) is also valid but is not localized.
- Verification: Inspect the rendered element — the `aria-*`/`role` attribute is present with the expected value; screen reader announces name/role/state.
- False positives / exceptions: Do not flag static (no-bracket) `aria-*`/`role` attributes, or a directive/component `@Input()` literally named `ariaLabel`/`role` that maps to a host attribute binding internally.

### PATTERN-NG-002: Non-semantic click target
- Platform: Web
- Framework: Angular
- Component type: Button-like custom control
- WCAG / APG: WCAG 2.1.1 Keyboard, WCAG 4.1.2 Name/Role/Value
- Severity default: Critical
- Fix type default: FUNCTIONAL-RISK
- Bad shape: A `<div>`/`<span>` (or `<a>` without `href`/`routerLink`) has `(click)` but no `role`, `tabindex`, keyboard handler, or accessible name.
- Detection hints: `(click)=` on `<div>`/`<span>`; `<a (click)=` without `href`/`routerLink`; missing `(keydown.enter)`/`(keydown.space)`, `tabindex`, `role`.
- Correct fix: Use a native `<button type="button">` for actions or `<a routerLink>`/`<a href>` for navigation. If a custom element must stay clickable, add `role="button"`, `tabindex="0"`, `(keydown.enter)`/`(keydown.space)` handlers, and an accessible name — but prefer the native element.
- Verification: Tab reaches it, Enter/Space activates it, screen reader announces name + role.
- False positives / exceptions: Do not flag a wrapper whose inner native control is the real target and the outer click is redundant/delegated.

### PATTERN-NG-003: Icon-only control without accessible name
- Platform: Web
- Framework: Angular
- Component type: IconButton / `mat-icon-button` / toolbar action / menu trigger
- WCAG / APG: WCAG 4.1.2 Name/Role/Value
- Severity default: Serious
- Fix type default: SAFE when adding a localized name; FUNCTIONAL-RISK when changing structure.
- Bad shape: A `<button>`/`button mat-icon-button` contains only `<mat-icon>`/SVG/icon-font with no visible text, `aria-label`, or `aria-labelledby`; or a decorative icon is announced.
- Detection hints: `<mat-icon>` or `<svg>`/`<i class="...icon">` as the only child of a button; `mat-icon-button`/`mat-fab` without `aria-label`/`[attr.aria-label]`.
- Correct fix: Add a localized `aria-label`/`[attr.aria-label]` describing the action (not the glyph); set `aria-hidden="true"` (or `[attr.aria-hidden]="true"`) on a purely decorative icon backed by adjacent text. `mat-icon` font/ligature icons are decorative by default — name the button, not the glyph.
- Verification: Screen reader announces the intended action plus role.
- False positives / exceptions: Do not add a label duplicating adjacent visible text; prefer the visible label via `aria-labelledby`.

### PATTERN-NG-004: Form field label not programmatically associated
- Platform: Web
- Framework: Angular
- Component type: Input / Select / Textarea / `mat-form-field`
- WCAG / APG: WCAG 1.3.1 Info and Relationships, WCAG 3.3.2 Labels or Instructions
- Severity default: Serious
- Fix type default: SAFE
- Bad shape: A control has a visible label not tied to it (no `for`/`id`), or `placeholder` is the only label; a `mat-form-field` missing `<mat-label>`; a reactive-form control with no associated label.
- Detection hints: `<label>` without `for`; `<input formControlName>`/`[ngModel]` with no `id`/label; `placeholder=` as the only naming; `<mat-form-field>` with no `<mat-label>`.
- Correct fix: Pair `<label for="id">` with the control's `id`, or use `aria-labelledby`/`[attr.aria-label]`; inside `mat-form-field` use `<mat-label>`. Associate help/error text with `aria-describedby`/`[attr.aria-describedby]` (Material wires `mat-error`/`mat-hint` automatically — verify it renders).
- Verification: Accessibility tree exposes the intended name and description before and after entry.
- False positives / exceptions: A control may be validly named by `aria-label`/`aria-labelledby` when no visible label is appropriate (e.g. a search field with an adjacent icon button).

### PATTERN-NG-005: Dialog/overlay lacks focus trap, initial focus, or restore
- Platform: Web
- Framework: Angular
- Component type: Dialog / Drawer / Menu / CDK overlay
- WCAG / APG: WCAG 2.4.3 Focus Order, WCAG 2.1.2 No Keyboard Trap (correct trap), APG Dialog Pattern
- Severity default: Serious
- Fix type default: FUNCTIONAL-RISK
- Bad shape: A custom modal/overlay/menu opens without trapping focus, without moving focus inside on open, or without restoring focus to the trigger on close; or it has no accessible name.
- Detection hints: custom overlay built without `@angular/cdk/overlay`/`MatDialog`; `cdkConnectedOverlay`/custom panel with no `cdkTrapFocus`/`cdkFocusInitial`; missing `A11yModule` import; missing `aria-labelledby`/`ariaLabel`.
- Correct fix: Prefer `MatDialog`/CDK `Dialog` (focus trap + restore by default). For a custom overlay, wrap the panel with `cdkTrapFocus`, mark the first element `cdkFocusInitial`, restore focus to the trigger on close (`FocusMonitor`/store the trigger), import `A11yModule`, and give it `role="dialog"` + an accessible name.
- Verification: Tab cycles within the open dialog; Esc/close returns focus to the trigger; screen reader announces the dialog name and role. Focus trap/restore is a `RUNTIME-CHECK`.
- False positives / exceptions: Do not require a trap for a non-modal inline disclosure that intentionally leaves the page interactive.

### PATTERN-NG-006: Route change has no focus reset or page title
- Platform: Web
- Framework: Angular
- Component type: Router / app shell
- WCAG / APG: WCAG 2.4.2 Page Titled, WCAG 2.4.3 Focus Order
- Severity default: Serious
- Fix type default: FUNCTIONAL-RISK
- Bad shape: SPA navigation via `Router`/`routerLink` leaves focus on the old element (or `<body>`) and does not update the page `title`, so screen-reader and keyboard users get no signal a new view loaded.
- Detection hints: `Routes` with no `title` and no `TitleStrategy`; no focus management on `NavigationEnd`; no skip link / `<main>` focus target.
- Correct fix: Set a per-route `title` (Angular 14+) or a custom `TitleStrategy`; on navigation move focus to the new view's `<h1>`/`<main tabindex="-1">` or announce the view via `LiveAnnouncer`. Provide a skip-to-content link and a stable `<main>` landmark.
- Verification: After navigation the page title changes and focus/announcement reflects the new view. Actual focus timing is a `RUNTIME-CHECK`.
- False positives / exceptions: Do not flag in-page tab/segment switches that are not true route changes if focus is otherwise managed.

### PATTERN-NG-007: Conditional ARIA state does not track real state
- Platform: Web
- Framework: Angular
- Component type: Disclosure / Tabs / Accordion / Toggle button
- WCAG / APG: WCAG 4.1.2 Name/Role/Value
- Severity default: Serious
- Fix type default: SAFE
- Bad shape: A toggle/disclosure exposes a static or stale ARIA state — e.g. hardcoded `aria-expanded="false"`, or `[attr.aria-expanded]` bound to the wrong/absent expression — so assistive tech reports the wrong open/selected/checked state.
- Detection hints: static `aria-expanded`/`aria-selected`/`aria-pressed` on a control whose state changes; `[attr.aria-expanded]` bound to a constant; toggle with `*ngIf`-shown panel but no `aria-controls`/`aria-expanded`.
- Correct fix: Bind the state to the real signal: `[attr.aria-expanded]="isOpen"`, `[attr.aria-selected]="active"`, `[attr.aria-pressed]="pressed"`, and link the trigger to its panel with `[attr.aria-controls]`. Prefer Material/CDK widgets that manage these.
- Verification: Toggling updates the announced state; `aria-controls` points at the rendered panel id.
- False positives / exceptions: Do not require `aria-expanded` on a control that is not a disclosure/expander.

### PATTERN-NG-008: Structural directive hides content without removing or announcing it
- Platform: Web
- Framework: Angular
- Component type: Status / conditional region / `*ngIf`/`@if`/`[hidden]`
- WCAG / APG: WCAG 1.3.1 Info and Relationships, WCAG 4.1.3 Status Messages
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: Content is visually hidden with `[hidden]`/`[style.display]`/CSS while remaining in the accessibility tree (or vice versa), or `*ngIf`/`@if` swaps content with no announcement so the change is silent to screen readers.
- Detection hints: `[hidden]`/`[style.display]`/`[ngClass]` toggling visibility where `*ngIf`/`@if` (true removal) is intended; status text shown via `*ngIf` with no `aria-live`/`cdkAriaLive`.
- Correct fix: Use `*ngIf`/`@if` to truly add/remove content from the DOM and the a11y tree; for in-place status updates, wrap the region in `cdkAriaLive`/`aria-live="polite"` or announce via `LiveAnnouncer`.
- Verification: Hidden content is absent from the accessibility tree; status changes are announced (announcement firing is a `RUNTIME-CHECK`).
- False positives / exceptions: `[hidden]` is acceptable when the content must stay in the DOM for layout/measurement and is correctly removed from a11y (`aria-hidden`).

### PATTERN-NG-009: Decorative image exposed / informative image unnamed
- Platform: Web
- Framework: Angular
- Component type: Image / SVG / `mat-icon`
- WCAG / APG: WCAG 1.1.1 Non-text Content
- Severity default: Serious
- Fix type default: SAFE
- Bad shape: An informative `<img>` has no `alt`/`[alt]`, or a decorative image/icon is announced (non-empty `alt`, exposed SVG, named decorative `mat-icon`).
- Detection hints: `<img>` with no `alt`/`[alt]`; `<img [src]>` with `alt="{{...}}"` that may be empty; decorative inline `<svg>` without `aria-hidden`; informative `<mat-icon>` with no adjacent text or `aria-label`.
- Correct fix: Informative images get a localized `alt`/`[attr.alt]`/`[alt]`; decorative images get empty `alt=""` and `aria-hidden="true"` on decorative SVG/icons. Bind dynamic alts with `[alt]="..."` (note: `[alt]` is a real property, valid without `attr.`).
- Verification: Screen reader describes informative images and skips decorative ones.
- False positives / exceptions: Do not hide an image that is the only carrier of information; do not name background decoration.

### PATTERN-NG-010: Dynamic/async update is silent (no live region)
- Platform: Web
- Framework: Angular
- Component type: Status text / `MatSnackBar` / inline validation / async loading
- WCAG / APG: WCAG 4.1.3 Status Messages
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: Content updates in place (validation result, async `| async` result, loading-to-loaded, count) with no announcement, so screen-reader users are not notified.
- Detection hints: status `<div>`/`<span>` that changes on state with no `cdkAriaLive`/`aria-live`; `| async` swapping content silently; `MatSnackBar`/custom toast with no announcement; absence of `LiveAnnouncer.announce(...)` for transient messages.
- Correct fix: Mark the updating region with `cdkAriaLive="polite"` (or `aria-live="polite"`), or announce transient messages via `LiveAnnouncer`. Verify `MatSnackBar` content is meaningful (it announces by default).
- Verification: With a screen reader on, the update is announced without moving focus; whether it fires is a `RUNTIME-CHECK`.
- False positives / exceptions: Do not mark high-frequency/non-essential updates as live regions; that creates announcement spam.

### PATTERN-NG-011: Hardcoded visible/accessibility text not localized
- Platform: Web
- Framework: Angular
- Component type: Any labeled element
- WCAG / APG: Localization, WCAG 3.1.x context
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: Visible template text, `aria-label`, `title`, `placeholder`, or `alt` is a literal string in a project that otherwise localizes, so it never translates.
- Detection hints: literal template text / `aria-label="..."` / `placeholder="..."` where the project uses `@angular/localize` (`i18n` attributes/`$localize`), `@ngx-translate/core` (`| translate`), or `transloco` (`| transloco`/`*transloco`).
- Correct fix: Mark text with `i18n`/`$localize` (built-in) or move it to the translation catalog and reference via the `translate`/`transloco` pipe; for ARIA/placeholder, bind the translated value (`[attr.aria-label]="'key' | translate"` / `i18n-aria-label`). Use ICU/`i18nPlural` for counts.
- Verification: Switch locale and confirm visible and accessible text both change.
- False positives / exceptions: Single-locale apps with no i18n setup — record as a localization-readiness note instead of a defect; do not flag test fixtures or comment strings.

### PATTERN-NG-012: Reimplemented widget where a CDK/Material primitive exists
- Platform: Web
- Framework: Angular
- Component type: Tabs / Menu / Listbox / Combobox / Tooltip / custom widget
- WCAG / APG: WCAG 2.1.1 Keyboard, WCAG 4.1.2 Name/Role/Value, relevant APG pattern
- Severity default: Serious
- Fix type default: FUNCTIONAL-RISK
- Bad shape: A custom tabs/menu/listbox/combobox/tooltip is hand-built with click handlers and `*ngFor` but lacks roles, keyboard navigation (arrow keys, Home/End, type-ahead), `aria-activedescendant`/roving tabindex, and state — reimplementing an APG widget incorrectly.
- Detection hints: `*ngFor` + `(click)` building tab/menu/option lists without `role="tablist"`/`menu`/`listbox`; no `(keydown.arrow*)` handling; no `cdk-menu`/`cdkListbox`/`MatTabGroup`/`MatMenu` usage despite `@angular/cdk`/`@angular/material` present.
- Correct fix: Prefer `@angular/material` (`MatTabGroup`, `MatMenu`, `mat-select`) or `@angular/cdk` primitives (`cdkMenu`/`cdkMenuItem`, `cdkListbox`/`cdkOption`, `CdkTree`), which ship the roles, keyboard model, and focus management. If staying custom, implement the full APG keyboard/role/state contract.
- Verification: Arrow-key navigation, Home/End, type-ahead, and Enter/Space work; screen reader announces role, position, and selected state.
- False positives / exceptions: A trivial static link group is not a tablist/menu; do not force a widget pattern onto plain navigation.
