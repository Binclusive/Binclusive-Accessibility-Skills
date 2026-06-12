---
name: audit-accessibility
description: Audit React, Next.js, ASP.NET, ASPX/Web Forms, SwiftUI, or UIKit accessibility from a prior Binclusive project map. Use when the user says /auditaccessibility, audit accessibility, run accessibility audit, accessibility test, iOS accessibility audit, SwiftUI accessibility audit, UIKit accessibility audit, "binclusive projemi test et", "erişilebilirlik testi yap", "erişilebilirlik todo çıkar", "accessibility todo çıkar", or wants an accessibility TODO report from mapped routes, views, screens, components, controls, or paths.
---

# Audit Accessibility

Audit a previously mapped React/Next.js, ASP.NET/ASPX, or iOS SwiftUI/UIKit scope and write an actionable accessibility TODO report. This skill observes and documents only. It never edits source code.

## Start Here

1. Locate `Binclusive-auditing/` in the project root.
2. If no map file exists, stop and ask the user to run `map-project` or `/mapaccessibility` first.
3. If multiple map files exist, summarize them and ask which map to audit unless the user named one.
4. Read the selected `*_project-map.md` end to end.
5. Detect framework/platform/language from the map. Read only the references that match the mapped scope:
   - For React/Next.js web, read:
     - `references/auditor-web-a11y.md`
     - `references/react-nextjs.md`
     - `references/patterns/react-nextjs-patterns.md` when available
   - For ASP.NET MVC/Razor or ASPX/Web Forms, read:
     - `references/auditor-web-a11y.md`
     - `references/aspnet-aspx.md`
     - `references/patterns/aspnet-aspx-patterns.md` when available
   - For iOS SwiftUI/UIKit, read:
     - `references/ios-swift.md`
     - `references/patterns/ios-swift-patterns.md` when available
6. For mixed-platform maps, keep findings grouped by platform/surface and do not apply web-only rules to native iOS UI or iOS-only rules to web UI.
7. Audit only the scope listed in the map, unless the user explicitly expands scope.
8. Write `Binclusive-auditing/accessibility-todo.md` and also archive a dated copy: `accessibility-todo_<YYYY-MM-DD>.md`.

## Required Output

Use the TODO format in `references/accessibility-todo-format.md`. Every finding must include:

- stable task id (`TASK-001`, etc.)
- component/page/screen/control, file path, usage context
- severity: Critical, Serious, Moderate, Minor
- fix type: `SAFE`, `VISUAL-IMPACT`, `FUNCTIONAL-RISK`, or `RUNTIME-CHECK`
- exact code snippet or enough verified code/storyboard/xib context
- problem, WCAG/APG/platform impact, correct solution, verification steps
- status: `TODO`

## Audit Order

For web scopes:

1. Inline interactive UI in pages/views.
2. Shared interactive components: Button, Link, Input, Select, Dialog, Drawer, Popover, Menu, Tabs, Accordion, Carousel, Toast.
3. Shared display components: Image, Icon, Avatar, Table, Chart, Skeleton, Loading, Badge.
4. Page-level patterns: landmarks, headings, skip link, route focus, page title, language/locale, reduced motion, zoom/reflow.

For iOS scopes:

1. Inline interactive UI in SwiftUI views, UIKit controllers, cells, and storyboard/xib scenes.
2. Shared interactive controls: Button, NavigationLink, TextField, Picker, Toggle, Slider, Stepper, Sheet/Dialog, Menu, Tab, custom gesture targets, custom UIControls.
3. Shared display components: Image, SF Symbol/Icon, Avatar, List, Table, Collection/Grid, Chart, Map, Skeleton, Loading, Badge, Toast/Banner.
4. Screen-level patterns: navigation titles, headings, focus/reading order, modal presentation/dismissal, errors, status updates, localization, Dynamic Type, Reduce Motion, RTL, contrast, touch targets.
5. Platform assistive technology behavior: VoiceOver, Switch Control, Voice Control, Full Keyboard Access, Dynamic Type, Button Shapes, Differentiate Without Color, Increase Contrast.

## Rules

- User-provided audit documents may be read as inspiration only; do not copy customer data into skill resources.
- Do not modify source code.
- Do not include accessible elements as findings.
- Do not guess contrast, screen-reader/VoiceOver output, focus trap/focus order behavior, touch target size, Dynamic Type layout, or runtime state. Mark these `RUNTIME-CHECK`.
- Prefer native HTML fixes for web and native SwiftUI/UIKit controls/APIs for iOS.
- Do not claim compliance; report verified findings and residual risk only.
- If the map has blind spots, carry them into the audit summary.
