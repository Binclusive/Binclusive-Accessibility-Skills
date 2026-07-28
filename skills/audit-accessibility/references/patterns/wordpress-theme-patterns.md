# WordPress Theme and Plugin Pattern Catalog

Use only for reusable WordPress theme or plugin patterns. Never add customer names, domains, proprietary copy, private paths, screenshots, or site content.

## Pattern Shape

Record: pattern ID, theme model, affected templates/components, source evidence, accessibility impact, fix type, correct WordPress-native remedy, and static/runtime verification.

### PATTERN-WP-001: Submenu toggle state is absent or stale

- Detection: custom walker or theme navigation outputs a button/toggle but JavaScript does not synchronize `aria-expanded` and the controlled submenu ID.
- Impact: keyboard and screen-reader users cannot determine or reliably operate submenu state.
- Correct remedy: retain ordinary navigation semantics; use a localized button name, stable `aria-controls`, synchronized `aria-expanded`, keyboard activation, and theme-appropriate focus behavior.
- Classification: `SAFE` only when local state wiring is complete and markup/API contracts remain unchanged; otherwise `FUNCTIONAL-RISK`.

### PATTERN-WP-002: Skip link and main target disagree

- Detection: skip-link href does not match a unique main-content ID across one or more template hierarchy branches.
- Impact: keyboard users cannot bypass repeated navigation consistently.
- Correct remedy: provide one stable target and one main landmark in every affected composition path.
- Classification: `SAFE` only for an unambiguous local ID correction; template restructuring is `FUNCTIONAL-RISK`.

### PATTERN-WP-003: Variable image semantics are guessed

- Detection: featured image, custom logo, gallery, avatar, or block image forces filename/title alt text, duplicates an adjacent link label, or removes author/editor-provided alt unconditionally.
- Impact: images become noisy, misleading, or unnamed.
- Correct remedy: preserve meaningful media-library alt when context requires it; use empty alt only when the rendered context proves decoration; do not generate guessed text.
- Classification: source-proven hardcoded behavior may be `SAFE`; content quality is `RUNTIME-CHECK`.

### PATTERN-WP-004: Dynamic theme update is silent

- Detection: AJAX search/filter, infinite loading, pagination replacement, cart/count, or validation updates visible content without a status announcement or appropriate focus strategy.
- Impact: screen-reader users do not learn that content changed.
- Correct remedy: reuse a persistent status region with concise localized messages and avoid moving focus unless the interaction requires it.
- Classification: usually `FUNCTIONAL-RISK`; missing localized status copy may also require content approval.

### PATTERN-WP-005: Block or theme setting permits unbounded inaccessible presentation

- Detection: `theme.json`, custom block attributes, or Customizer settings expose color, font size, motion, heading level, or layout choices without accessible defaults/constraints.
- Impact: editor-selected combinations can produce contrast, hierarchy, scaling, motion, or reflow failures.
- Correct remedy: make defaults accessible, constrain only when the product contract permits, and give editors meaningful guidance.
- Classification: `VISUAL-IMPACT` or `RUNTIME-CHECK`; block schema changes can be `FUNCTIONAL-RISK`.

### PATTERN-WP-006: Accessible name bypasses WordPress localization

- Detection: theme-owned PHP or JavaScript hardcodes an accessible label, instruction, error, or status string outside the established translation system.
- Impact: assistive-technology-only information is unavailable in the site's locale.
- Correct remedy: use the correct text-domain function and context/plural form in PHP, or the project's WordPress script translation mechanism in JavaScript; escape for the output context.
- Classification: `SAFE` when the text domain and translation path are already established and the change is local.

### PATTERN-WP-007: Admin or editor async UI is silent

- Detection: REST/AJAX/fetch actions update tables, settings, validation, uploads, imports, scans, or notices without persistent status, busy state, and focus handling.
- Impact: screen-reader and keyboard users cannot determine progress, failure, or completion.
- Correct remedy: use WordPress components/notices where available, localized status text, and deliberate focus only when context changes.
- Classification: usually `FUNCTIONAL-RISK`.

### PATTERN-WP-008: Plugin table or bulk-action UI loses relationships

- Detection: custom tables use visual headers, icon-only row actions, sortable columns without state, unlabeled selection checkboxes, or unnamed filters/search.
- Impact: users cannot understand columns, selection, sorting, or actions.
- Correct remedy: preserve native table and WordPress list-table semantics, row context, sort state, labels, and status feedback.
- Classification: isolated names may be `SAFE`; structural changes are `FUNCTIONAL-RISK`.

### PATTERN-WP-009: Editor control has no keyboard-equivalent workflow

- Detection: block/editor/plugin UI relies on drag/drop, hover, pointer gestures, color alone, or undiscoverable shortcuts.
- Impact: keyboard, switch, voice, and low-vision users cannot operate or understand the feature.
- Correct remedy: use WordPress component primitives and provide named actions, reorder controls, visible state, and conflict-safe shortcuts.
- Classification: `FUNCTIONAL-RISK` or `VISUAL-IMPACT`.

### PATTERN-WP-010: Localization catalog and source have drifted

- Detection: PO/POT references moved files, omits current accessible names/status/errors, uses another text domain, or packages stale binaries.
- Impact: critical UI and assistive-only information remains untranslated.
- Correct remedy: regenerate catalogs from current source with context/plurals and rebuild binaries during release.
- Classification: catalog regeneration can be `SAFE`; runtime locale verification remains required.
