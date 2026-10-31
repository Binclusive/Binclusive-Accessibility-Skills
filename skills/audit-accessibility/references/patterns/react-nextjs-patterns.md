# React / Next.js Pattern Catalog

This catalog contains anonymized, reusable accessibility patterns only. Do not add customer names, project names, domains, internal URLs, proprietary component names, ticket IDs, business copy, screenshots, or exact customer source paths.

## Pattern Entry Template

```md
### PATTERN-REACT-001: Short title
- Platform: Web
- Framework: React / Next.js
- Component type: Button | Link | Input | Dialog | Tabs | Carousel | etc.
- WCAG / APG: WCAG 2.1.1, 4.1.2, APG Dialog Pattern, etc.
- Severity default: Critical | Serious | Moderate | Minor
- Fix type default: SAFE | VISUAL-IMPACT | FUNCTIONAL-RISK | RUNTIME-CHECK
- Bad shape: anonymized description of the recurring code/UX problem
- Detection hints: grep/search/static cues
- Correct fix: preferred implementation pattern
- Verification: keyboard, screen reader, automated, runtime notes
- False positives / exceptions: when not to flag
```

## Seed Patterns

### PATTERN-REACT-001: Non-semantic click target
- Platform: Web
- Framework: React / Next.js
- Component type: Button-like custom control
- WCAG / APG: WCAG 2.1.1 Keyboard, WCAG 4.1.2 Name/Role/Value
- Severity default: Critical
- Fix type default: FUNCTIONAL-RISK
- Bad shape: A `div`, `span`, layout component, or icon wrapper has `onClick` but no native semantics.
- Detection hints: `onClick` on non-interactive JSX elements; missing `role`, `tabIndex`, Enter/Space handler, and accessible name.
- Correct fix: Render a native `<button type="button">` for actions or `<a href>` for navigation. Use ARIA only when native replacement is not feasible.
- Verification: Tab reaches it, Enter/Space activates it, and screen reader announces name, role, and state.
- False positives / exceptions: Do not flag non-interactive containers where the handler is only delegated and an inner native control handles activation.

### PATTERN-REACT-002: Icon-only control without accessible name
- Platform: Web
- Framework: React / Next.js
- Component type: IconButton / close button / carousel arrow / menu trigger
- WCAG / APG: WCAG 4.1.2 Name/Role/Value
- Severity default: Serious
- Fix type default: SAFE when adding a real label; FUNCTIONAL-RISK when changing structure.
- Bad shape: A button or clickable icon contains only SVG/icon content and has no visible text, `aria-label`, or `aria-labelledby`.
- Detection hints: icon children, empty text content, close/search/favorite/menu SVGs.
- Correct fix: Provide a localized accessible name that describes the action, not the icon. Hide decorative SVGs from assistive tech.
- Verification: Screen reader announces the intended action plus role.
- False positives / exceptions: Do not add `aria-label` that conflicts with visible text; prefer visible text or `aria-labelledby` when available.

### PATTERN-REACT-003: Form field label is visual only
- Platform: Web
- Framework: React / Next.js
- Component type: Input / Textarea / Select
- WCAG / APG: WCAG 1.3.1 Info and Relationships, WCAG 3.3.2 Labels or Instructions
- Severity default: Serious
- Fix type default: SAFE
- Bad shape: Visible label text is not programmatically associated with the form control, or placeholder is the only label.
- Detection hints: `<label>` without `htmlFor`, input without `id`, custom label wrapper, placeholder-only fields.
- Correct fix: Use a stable `id` plus `<label htmlFor>`, or `aria-labelledby`; associate help/error text with `aria-describedby`.
- Verification: Accessibility tree exposes the intended name and description.
- False positives / exceptions: A control can be validly named by `aria-label` or `aria-labelledby` when no visible label is appropriate.

### PATTERN-REACT-004: Data table lacks semantic headers or caption
- Platform: Web
- Framework: React / Next.js
- Component type: Table / Data grid
- WCAG / APG: WCAG 1.3.1 Info and Relationships, WCAG 2.4.6 Headings and Labels
- Severity default: Serious
- Fix type default: SAFE when adding caption/header semantics; RUNTIME-CHECK for virtualized or third-party grids.
- Bad shape: A data table renders without `<caption>`, uses `<td>` for headers, omits `scope`/`headers`, or renders a visual table with `<div>` elements and no equivalent grid semantics.
- Detection hints: reusable `Table`, `DataTable`, `Grid`, `columns` configs, `renderHeader`, sortable headers, `<table>` without `<caption>`, `<thead>` containing `<td>`.
- Correct fix: Use native table markup for tabular data; provide a table name, semantic `<th>` headers, `scope` for simple relationships, and `id`/`headers` for complex relationships.
- Verification: Screen reader can identify the table name and announce the correct row/column headers for representative cells.
- False positives / exceptions: Do not require `<caption>` for layout tables that are correctly removed from table semantics; do not force native tables for interactive widgets that correctly implement the ARIA grid pattern.

### PATTERN-REACT-005: Interactive descendants inside a presentational-children role
- Platform: Web
- Framework: React / Next.js
- Component type: Listbox option rows / tabs / custom composite widgets
- WCAG / APG: WCAG 4.1.2 Name/Role/Value, WCAG 1.3.1 Info and Relationships; ARIA "children presentational"; ACT rule 307n5z
- Severity default: Critical
- Fix type default: FUNCTIONAL-RISK
- Bad shape: Focusable or interactive elements (inputs, textareas, buttons, checkboxes, links) are rendered inside an element whose role defines its children as presentational — `option`, `tab`, `button`, `checkbox`, `radio`, `switch`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, `slider`, `progressbar`, `separator`, `img`, `meter`, `scrollbar`. Per the ARIA spec the descendants collapse into the ancestor's accessible name and lose their own role — an edit field inside `role="option"` is not announced as an edit field. Browsers/AT enforce this inconsistently, so the widget can appear to work in one screen reader and be broken in another (a common NVDA-works/JAWS-fails source). An `aria-label` on the ancestor makes it worse: the label overrides the entire subtree.
- Detection hints: `role="option"` / `role="tab"` / other children-presentational roles whose JSX children include `input`, `textarea`, `select`, `button`, `a href`, or components wrapping them; editable "row cards" inside `role="listbox"`.
- Correct fix: Use a container role that permits interactive descendants — `row`/`gridcell` in an ARIA grid for editable row collections, or drop the composite role entirely and use list/group semantics with natively-announced controls. Reserve `listbox`/`option` for flat, text-only choices.
- Verification: In the accessibility tree, each nested control keeps its own role and name. Screen reader announces the textarea/input as an edit field with its label, not as flattened option text.
- False positives / exceptions: Purely decorative or `aria-hidden` descendants with `tabIndex={-1}` that are duplicated by an accessible mechanism elsewhere; static icons/text inside options.

### PATTERN-REACT-006: Composite widget without a keyboard entry point
- Platform: Web
- Framework: React / Next.js
- Component type: Listbox / grid / tree / custom roving-focus widget
- WCAG / APG: WCAG 2.1.1 Keyboard, WCAG 2.4.3 Focus Order; APG composite-widget patterns (roving tabindex / `aria-activedescendant`)
- Severity default: Serious
- Fix type default: FUNCTIONAL-RISK
- Bad shape: A `role="listbox"` / `grid` / `tree` container has no `tabIndex` and no `aria-activedescendant`, and every item is `tabIndex={-1}` — the composite has no Tab stop at all. Entry depends on a programmatic `.focus()` (mount effect or click), so keyboard users who Tab away cannot Tab back, and screen readers that switch to focus/forms mode based on the focused element type never switch, leaving arrow-key handlers unreachable.
- Detection hints: composite roles with all descendants `tabIndex={-1}` and no `tabIndex={0}`/`aria-activedescendant` on the container; focus managed only via refs in effects.
- Correct fix: Implement roving tabindex (active item `tabIndex={0}`, others `-1`, moved with selection) or make the container the single Tab stop with `tabIndex={0}` + `aria-activedescendant`. Either gives AT a focusable composite that triggers forms/application mode.
- Verification: Tab reaches the widget, Shift+Tab leaves and returns to it, arrow keys move the active item, and the screen reader switches to focus/forms mode on entry. RUNTIME-CHECK the mode switch in JAWS and NVDA.
- False positives / exceptions: Widgets correctly using `aria-activedescendant` with a focusable container; disclosure lists that are not composite widgets.

### PATTERN-REACT-007: Single-character keyboard shortcuts on document or window
- Platform: Web
- Framework: React / Next.js
- Component type: Editor / player / list view with hotkeys
- WCAG / APG: WCAG 2.1.4 Character Key Shortcuts (Level A)
- Severity default: Serious
- Fix type default: RUNTIME-CHECK
- Bad shape: A `keydown` listener on `document`/`window` binds unmodified printable keys (letters, digits, `?`) to actions. Even when the handler is scoped to a focused component — which technically satisfies 2.1.4's "active only on focus" option — bare letters still collide with screen-reader quick-navigation keys (e/f/b/h/l/r/t/x…) that JAWS and NVDA consume in browse mode: the command never reaches the page, or a typed letter fires a destructive action for speech-input users. The static pass must never clear 2.1.4 as "satisfied"; whether the shortcut is reachable and safe under AT is runtime behavior.
- Detection hints: `addEventListener("keydown")` at document/window level; hotkey maps whose combos are bare single characters without `ctrl`/`alt`/`meta`; libraries like `react-hotkeys`, `mousetrap` with letter bindings.
- Correct fix: Provide remap/disable (2.1.4 mechanisms) or restrict activation to a genuinely focused composite widget that forces forms/application mode (see PATTERN-REACT-006); prefer modifier combos (`Alt+…`) for anything reachable from browse mode; document shortcuts in an accessible help surface.
- Verification: RUNTIME-CHECK in JAWS and NVDA browse mode — each shortcut either reaches the handler or is documented as forms-mode-only; typing in fields never triggers commands.
- False positives / exceptions: Combos always requiring a modifier; shortcuts bound only inside a focused `input`/`textarea`/`contenteditable`.

### PATTERN-REACT-008: Live region announces on every keystroke or competes with siblings
- Platform: Web
- Framework: React / Next.js
- Component type: Character counter / autosave status / badge / multiple status widgets
- WCAG / APG: WCAG 4.1.3 Status Messages (misuse/verbosity)
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: `aria-live` is attached to a value that changes per keystroke or per animation frame (character counter, elapsed time, progress percent), spamming speech and interrupting typing echo. Or one view declares several competing `aria-live`/`role="status"` regions (dirty badge + save status + range badge + counter), so announcements queue and trample each other.
- Detection hints: `aria-live` on elements rendering a fast-changing state variable; more than one `aria-live`/`role="status"`/`role="alert"` in a single component tree.
- Correct fix: One shared status region per view; push messages into it deliberately. For counters, announce only threshold crossings ("approaching 300 character limit") or debounce to pauses; keep the visible per-keystroke counter `aria-hidden`.
- Verification: With a screen reader, typing produces no per-character number announcements; status messages arrive one at a time from a single region.
- False positives / exceptions: A single properly-debounced live region; `role="alert"` reserved for genuine errors.

### PATTERN-REACT-009: Dynamic value embedded in aria-label
- Platform: Web
- Framework: React / Next.js
- Component type: Input / slider / toggle whose label interpolates state
- WCAG / APG: WCAG 4.1.2 Name/Role/Value (name vs value separation), WCAG 2.5.3 Label in Name
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: `aria-label={\`Start time ${formatTime(value)}\`}` — the control's accessible NAME embeds its current VALUE. The name then mutates while the user is editing, causing re-announcement mid-typing, breaking voice-control targeting ("click Start time" no longer matches), and duplicating what AT already reads from the value.
- Detection hints: template literals or string concatenation with state variables inside `aria-label`; `aria-label` values containing formatted numbers/times/counts.
- Correct fix: Keep the accessible name static ("Start time"); expose the value through the control's native value, `aria-valuetext` (sliders), or `aria-describedby` when extra context is needed.
- Verification: The accessible name stays constant while the value changes; screen reader reads name once and value separately.
- False positives / exceptions: Container/row labels summarizing content for navigation (not focusable form controls); `aria-valuetext`, which is the correct home for formatted values.
