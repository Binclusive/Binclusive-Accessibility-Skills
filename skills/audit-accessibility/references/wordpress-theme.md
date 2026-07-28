# WordPress Theme and Plugin Accessibility Audit Notes

Use this reference only for a mapped WordPress classic/block/hybrid theme or plugin. Pair it with `auditor-web-a11y.md` and the WordPress pattern catalog. Observe and document only.

## Grounding and Boundaries

Audit only mapped, theme-owned source. Treat WordPress core, plugins, parent themes outside scope, database content, page-builder output, admin/editor UI, and remote embeds as blind spots. If a public URL is available, run the live-URL engine first and reconcile its rendered-DOM results with source findings.

Classify every finding:

- `agent: judgment` when the theme source proves the problem.
- `agent: runtime` and `RUNTIME-CHECK` when content, hooks, plugins, settings, or browser/assistive-technology state determine the outcome.
- Never label WordPress PHP source as engine-proven unless a future collector actually scans it.

## Audit Order

1. Global composition: document language/direction, title support, skip link target, header/navigation/main/footer landmarks, body classes, and focus utilities.
2. Template hierarchy: home/front page, posts/pages, archives/taxonomies, search, 404, comments, attachments, author/date views, and theme-owned WooCommerce overrides.
3. Shared composition: template parts, block parts, patterns, menus/walkers, breadcrumbs, pagination, post metadata, widgets/sidebars, and hook-rendered regions.
4. Interactive behavior: submenu toggles, mobile navigation, search overlays, dialogs/drawers, accordions/tabs, galleries/carousels, media, AJAX/infinite updates, comments, and forms.
5. Block theme behavior: serialized block markup, navigation/search/query/pagination blocks, custom blocks, render callbacks, `theme.json`, and settings that change public markup or presentation.
6. CSS/JavaScript: focus visibility, hidden utilities, reduced motion, forced colors, reflow, zoom/text spacing, target size, keyboard operation, focus movement/return, Escape, and live announcements.
7. Localization and variable content: translatable names/status messages, plural/context functions, text domain, RTL, navigation labels, image alt text, headings, colors, and block order.
8. Plugin UI: public output, wp-admin pages, block/Site Editor controls, Settings API, list tables, metaboxes, notices, widgets, shortcodes, Classic Editor/Customizer, REST/AJAX UI, role/network states, and activation/onboarding/upgrade flows.

## WordPress-Specific Checks

- Require exactly one meaningful `main` target per rendered template and ensure the skip link points to its stable ID.
- Check `wp_nav_menu()` output and custom walkers together. A toggle must expose a localized name, `aria-expanded`, `aria-controls`, keyboard operation, and synchronized state without converting ordinary site navigation into an ARIA menu.
- Check `the_custom_logo()`, featured images, galleries, avatars, icon SVGs, and attachment output for correct variable-alt and decorative-image behavior. Do not invent alt text.
- Check search, comment, password, login/account, newsletter, and WooCommerce forms for persistent labels, instructions, errors, required state, autocomplete, and summary/focus behavior.
- Check loops, query blocks, pagination, AJAX filters, infinite scroll, cart/count updates, and status messages for understandable headings/links and announced dynamic changes.
- Check theme-owned `add_action()`/`add_filter()` callbacks in their actual hook context. Do not report registration alone; follow the callback and output path.
- Check escaping without recommending accessibility-breaking substitutions: use `esc_html__()` for text and `esc_attr__()` for attribute values, preserve allowed semantic markup deliberately, and never solve accessibility by outputting unsafe HTML.
- Check localization functions, text domain consistency, context, plurals, and RTL styles. Accessible names and status text must be localized through the theme's established system.
- Check `theme.json` and editor-controlled presets for focus, contrast, typography scaling, spacing, and user-selectable combinations. Mark contrast dependent on user-selected colors as runtime/content governance unless defaults prove a failure.
- Check block serialization integrity. Changing block wrapper structure or required block comments can invalidate editor content and is generally `FUNCTIONAL-RISK`.
- For plugins, audit every UI state: empty/loading/error/success/disabled/read-only, activation/setup/upgrade, capability denial, single-site/network-admin, and localization/RTL. Follow hooks and callbacks to rendered PHP/JSX/HTML; registration alone is not coverage.
- Audit admin/editor controls with the same rigor as public UI: native WordPress components first; names, descriptions and errors; keyboard/focus order; modal focus restore; notices and async status; table headers/sort state; drag/drop alternatives; shortcuts; zoom and reflow.
- Read `.po`/`.pot` catalogs and compare them with current paths, text domain, accessible names, instructions, errors, notices and status strings. Report stale catalogs and missing current strings.
- Reconcile source and distribution: inspect present built bundles when they are shipped, or state that absent bundles prevent parity verification. Do not call an absent artifact “excluded.”

## Fix-Type Classification

`SAFE` requires a local, source-proven change with no template-selection, hook-order, block-serialization, public PHP API, saved-content, visual-layout, or plugin contract impact. Typical candidates include a missing synchronized state attribute in theme-owned JavaScript, a localized name for an icon-only theme control, a correct decorative SVG treatment, or a focus rule that restores an already-designed visible outline without changing layout.

Use `VISUAL-IMPACT` for spacing, typography, color, focus design, reflow, target size, or visible labels. Use `FUNCTIONAL-RISK` for template hierarchy, hooks, walkers, block serialization, render callbacks, WooCommerce overrides, public functions, focus-trap behavior, or DOM composition changes. Use `RUNTIME-CHECK` for database content, editor settings, plugins, parent themes, third-party scripts, and outcomes that require a rendered page.

## Verification

For static findings, specify syntax/lint/test commands already present in the theme, source reinspection, and exact keyboard/screen-reader checks. For a runnable theme, verify representative URLs for each affected template with keyboard, browser zoom/reflow, reduced motion, forced colors/high contrast, and at least one screen reader. Re-run `binclusive scan --url` when a URL is available; do not claim PHP source engine verification.
