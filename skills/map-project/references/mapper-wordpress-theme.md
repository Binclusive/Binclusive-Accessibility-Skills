# Mapper WordPress Theme and Plugin Reference

Use this reference for a WordPress classic/block/hybrid theme or WordPress plugin. Observe and document only; never edit project source while mapping.

## Confirm Scope and WordPress Project Model

1. Confirm the theme root from a root `style.css` containing a `Theme Name:` header. Treat `functions.php`, `theme.json`, `templates/`, `parts/`, PHP template files, or block metadata as supporting signals, not substitutes for an arbitrary PHP project.
2. Classify the theme:
   - Classic: PHP template hierarchy is primary.
   - Block: `theme.json`, `templates/*.html`, and `parts/*.html` are primary.
   - Hybrid: classic PHP and block templates/features both render public UI.
   - Child: `Template:` in `style.css`; record the parent-theme dependency and mark inherited source unavailable unless it is in scope.
3. Exclude WordPress core, plugins, `uploads/`, caches, generated bundles, dependencies, and parent themes outside the selected root. Record plugin, WooCommerce, and parent-theme output as blind spots unless their source is explicitly included.
4. Ask whether WooCommerce template overrides, custom blocks, or a child/parent pair are in scope when signals exist and the user has not already specified them.
5. For a plugin, confirm one or more root PHP files with a `Plugin Name:` header. Record plugin name/version/text domain, dependencies, lifecycle hooks, and whether UI is public, wp-admin, block/Site Editor, REST/AJAX-driven, multisite/network-admin, or mixed.

## Enumerate the Coverage Denominator

Enumerate all in-scope `.php`, `.html`, `.js`, `.jsx`, `.ts`, `.tsx`, `.css`, `.scss`, `.json`, `.svg`, `.po`, and `.pot` source files before reading them. Include localization catalogs when localization is in scope. Enumerate build/config source separately as `A11Y-INDIRECT`; read enough to prove entrypoints, transforms, copied assets, and output paths. Exclude `.git`, `node_modules`, `vendor`, binary `.mo`, minified third-party assets, screenshots, and generated caches unless no readable owned source exists.

Reconcile every enumerated file as mapped, partially mapped, not-yet-mapped, or named `A11Y-INDIRECT`. Distinguish generated outputs present-but-excluded from outputs absent from the checkout; never claim an absent bundle was inspected or excluded. Do not silently sample a large project.

## Map Rendering and Composition

Record:

- Template hierarchy: `index.php`, `front-page.php`, `home.php`, `singular.php`, `single*.php`, `page*.php`, `archive*.php`, `taxonomy*.php`, `search.php`, `404.php`, attachment, author, date, and custom post-type templates.
- Block templates and parts: `templates/*.html`, `parts/*.html`, `theme.json`, and serialized `<!-- wp:* -->` block composition.
- Reuse: `get_header()`, `get_footer()`, `get_sidebar()`, `get_template_part()`, block template parts, PHP includes, patterns, and reusable render callbacks.
- Dynamic output: loops, pagination, comments, search forms, menus, breadcrumbs, widgets, sidebars, shortcodes, block render callbacks, and hook/filter output.
- Registration: `register_block_type()`, block `block.json`, `add_theme_support()`, `register_nav_menus()`, `register_sidebar()`, scripts/styles, image sizes, custom walkers, and customizer/settings code that changes public markup.
- Third-party boundaries: WooCommerce overrides, plugin template hooks, app embeds, page-builder templates, remote iframes, and generated form markup.

For every public template or flow, list its file path, composition chain, shared parts, primary landmarks, interactive controls, content source, and runtime-only dependencies.

## Map Accessibility-Relevant Surfaces

Inventory:

- Skip links, header, navigation, main, complementary regions, footer, search, breadcrumbs, pagination, post metadata, comments, forms, validation, tables, media, galleries, embeds, dialogs, drawers, accordions, tabs, carousels, and infinite/AJAX updates.
- Native HTML and ARIA emitted through PHP, escaped attributes, WordPress helpers, block markup, JavaScript custom controls, and CSS visibility/focus behavior.
- Menu walkers, submenu toggles, mobile navigation, search overlays, cookie notices, and theme-owned WooCommerce templates.
- `theme.json` typography, color, spacing, layout, and custom CSS settings that can affect focus, contrast, zoom, reflow, target size, or reduced motion.
- Localization via `__()`, `_e()`, `esc_html__()`, `esc_attr__()`, context/plural variants, text domain, translation files, and RTL styles.
- User-controlled content such as titles, excerpts, navigation labels, image alt text, block order, colors, and widget content. Mark unprovable content outcomes as runtime/content-governance checks.

For plugins, inventory public shortcodes, blocks, widgets, embeds, templates and forms; wp-admin menus/pages, Settings API, notices, list tables, bulk/row actions, filters, metaboxes, dashboard widgets, media, import/export and onboarding; block/Site Editor panels, toolbar/inserter/inspector controls, formats, commands, patterns, variations and render callbacks; Classic Editor/TinyMCE, widgets and Customizer; plus REST/AJAX loaders, progress, validation, errors, toasts, drag/drop, modals, tabs, menus, comboboxes, pickers, uploads, charts and shortcuts. Include empty/loading/error/success/disabled/read-only, capability/role, multisite/network, locale/RTL, activation/setup and upgrade states.

## Required WordPress Map Additions

Add these fields to the normal map output:

- project kind; theme/plugin name, version and text domain; theme classification/parent or plugin entry files/UI surfaces
- WordPress/PHP compatibility evidence when declared
- template hierarchy and template-part/block-part graph
- hook/filter/render-callback inventory that contributes public UI
- registered menus, widget areas, patterns, blocks, and public theme settings
- theme-owned WooCommerce/page-builder/plugin integration surfaces
- counts by PHP, block HTML, JavaScript/TypeScript, CSS/SCSS, JSON, SVG, PO/POT, plus A11Y-INDIRECT build/config files
- runtime blind spots: database content, block editor configuration, plugins, parent theme, WordPress core, and live rendered state

Do not infer final DOM order, accessible names, contrast, focus behavior, or plugin output from a registration call alone. Carry those items into the audit as runtime verification needs.
