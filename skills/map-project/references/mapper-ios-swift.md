# Mapper iOS Reference: SwiftUI / UIKit

Use this reference when `map-project` is triggered for an iOS application written in Swift, SwiftUI, UIKit, or a mixed SwiftUI/UIKit architecture. The mapper observes and documents only; it never edits source code.

## Privacy Boundary

User-provided audit documents may be read as inspiration during skill creation only. Do not copy customer data into skill resources. Do not persist real customer names, bundle identifiers, domains, internal URLs, proprietary screen names, ticket IDs, business copy, screenshots, or exact customer source paths from customer artifacts.

## Step 0: Establish Context

First, run the read-only project inspector if available:

```bash
node map-project/scripts/inspect-project.mjs /path/to/project
```

The inspector returns Swift, SwiftUI, UIKit, Xcode, Swift Package Manager, and localization signals. Treat the JSON as discovery input, not as proof. Verify signals by reading the actual project files.

Determine these facts before asking the user:

- Application model: SwiftUI App lifecycle, UIKit AppDelegate/SceneDelegate lifecycle, storyboard/xib-based UIKit, mixed SwiftUI/UIKit, Swift Package module, or app extension.
- Language and UI stack: Swift, Objective-C bridge, SwiftUI, UIKit, Interface Builder, or mixed.
- Navigation model: `NavigationStack`, `NavigationView`, `TabView`, sheets, UIKit navigation controllers, tab bar controllers, coordinators, storyboards, segues, or custom routing.
- Screen roots: app entry point, scenes, root view controllers, top-level SwiftUI views, storyboard scene identifiers, and feature folders.
- Reusable UI roots: shared SwiftUI views, UIKit subclasses, cells, controls, modifiers, view models that provide labels/text, and design-system packages.
- Localization: `.xcstrings`, `.strings`, `.stringsdict`, `LocalizedStringKey`, `String(localized:)`, `NSLocalizedString`, `InfoPlist.strings`, locale formatting, and RTL/mirroring evidence.
- Assets and media: asset catalogs, SF Symbols usage, custom icons, images, charts, maps, video/audio, haptics, and motion-heavy surfaces.

If the app model or screen roots remain ambiguous after inspection, ask for the relevant app target, feature folders, and whether SwiftUI, UIKit, or both should be mapped.

## User Scope Questions

Ask these when the user did not already provide scope:

1. Should I map the whole iOS app, selected screens/flows, selected components, a folder path, or a free-form target list?
2. Should localization/hardcoded string hotspots be included? Default: yes.
3. Should SwiftUI and UIKit surfaces be mapped together when both exist? Default: yes for mixed apps.
4. Should storyboards/xibs be included when present? Default: yes.

## Project and Dependency Analysis

Read relevant manifests and configuration files when present:

- Xcode projects/workspaces: `.xcodeproj`, `.xcworkspace`, project target names when inferable.
- Swift Package Manager: `Package.swift`, `Package.resolved`.
- CocoaPods/Carthage when present: `Podfile`, `Podfile.lock`, `Cartfile`, `Cartfile.resolved`.
- App configuration: `Info.plist`, entitlements, asset catalogs, localization folders, generated resource files.

Classify dependencies as:

- `A11Y-RELEVANT`: UI component libraries, design systems, chart/map/media libraries, animation frameworks, image loaders, form/input controls, calendar/date pickers, web views, scanner/camera surfaces.
- `L10N-RELEVANT`: localization/resource frameworks, generated string tools, formatting helpers, pluralization, locale bundles, bidi/RTL helpers.
- `NEUTRAL`: unrelated data, networking, persistence, build, logging, analytics, or testing packages.

For relevant packages, record name, version when inferable, role, likely accessibility/localization concerns, and whether native SwiftUI/UIKit primitives are also used.

## Localization Detection

Look for:

- `.xcstrings`, `.strings`, `.stringsdict`, `Base.lproj`, locale-specific `.lproj` directories, and `InfoPlist.strings`.
- SwiftUI localization: `Text("...")`, `Label("...", systemImage:)`, `LocalizedStringKey`, `String(localized:)`, and interpolated localized strings.
- UIKit localization: `NSLocalizedString`, `Bundle.localizedString`, storyboard/xib localized resources, `accessibilityLabel` strings, `placeholder`, `title`, and `navigationItem.title`.
- Formatting usage: `Date.FormatStyle`, `NumberFormatter`, `DateFormatter`, `MeasurementFormatter`, `RelativeDateTimeFormatter`, `ListFormatter`, `Locale.current`, and hardcoded date/number/currency text.
- RTL and layout direction: `semanticContentAttribute`, `layoutDirection`, leading/trailing constraints, custom drawing, icons that may need mirroring.

If no localization setup is found, record `NONE - strings appear hardcoded` and flag user-facing literals and accessibility strings for later review.

## Screen and Flow Detection

Enumerate the mapped scope:

- SwiftUI: app entry points, root views, `NavigationStack`/`NavigationView` destinations, `TabView`, sheets, popovers, alerts, confirmation dialogs, lists, forms, and reusable view files.
- UIKit code: `UIViewController`, `UITableViewController`, `UICollectionViewController`, custom `UIView`, custom `UIControl`, cells, coordinators, and view controller containers.
- Interface Builder: `.storyboard` and `.xib` files, scenes, segues, prototype cells, outlets/actions, static labels, image views, and custom classes.
- Mixed bridges: `UIViewRepresentable`, `UIViewControllerRepresentable`, `UIHostingController`, `UIHostingConfiguration`, and embedded web views.
- App extensions and widgets: map only when included in the user scope; record separate runtime and platform constraints.

If no screen model is discoverable and no path was provided, ask the user for the app target and primary feature folders.

## Shared UI Inventory

Find likely shared UI roots such as `Views/`, `Components/`, `UI/`, `DesignSystem/`, `Features/`, `Screens/`, `Shared/`, `Common/`, `Cells/`, `Controls/`, `Modifiers/`, `Resources/`, and Swift packages.

For each relevant component/control, record:

- Name and verified file path.
- UI stack: SwiftUI view, ViewModifier, UIKit view/controller/cell, storyboard/xib scene, representable bridge, or mixed wrapper.
- Component type: Button, Link, TextField, Picker, Toggle, Slider, Stepper, Dialog/Sheet, Menu, Tab, Accordion/Disclosure, List, Table, Collection/Grid, Image, Icon, Chart, Map, Toast/Banner, Progress/Loading, WebView, Media control, custom gesture area.
- Whether it uses native SwiftUI/UIKit accessibility behavior, custom accessibility modifiers/properties, or custom drawing/gestures.
- Whether visible text comes from localized resources, Swift literals, view models, server data, storyboard resources, or hardcoded properties.
- Which mapped screens/flows use it, when statically discoverable.

## Inline UI Inventory

For each mapped screen/view/controller, record inline UI that bypasses shared components:

- Interactive controls and gestures: `Button`, `NavigationLink`, `onTapGesture`, `gesture`, custom `UIControl`, tap recognizers, swipe actions, context menus, drag/drop.
- Forms and validation UI: `TextField`, `SecureField`, `TextEditor`, UIKit fields, error text, required state, hints, keyboard types, content types.
- Navigation and modal patterns: navigation titles, back/custom close controls, sheets, alerts, popovers, tab bars, toolbars.
- Images, icons, SF Symbols, custom drawings, canvas, charts, maps, video/audio, web views, QR/scanner/camera surfaces.
- Dynamic content: loading indicators, progress, toasts/banners, async results, validation summaries, live updates.
- Accessibility declarations: `accessibilityLabel`, `accessibilityHint`, `accessibilityValue`, `accessibilityHidden`, `accessibilityElement(children:)`, `accessibilitySortPriority`, `accessibilityAction`, UIKit `isAccessibilityElement`, traits, custom actions, identifiers.
- Hardcoded visible text and hardcoded accessibility text.
- Locale-sensitive formatting and RTL-sensitive layout.

Record file path, approximate line range when verified, UI element/control type, interactivity, existing accessibility props/modifiers, localization status, runtime-only concerns, and notes.

## Output File

Write one file in project-root `Binclusive-auditing/` named `<project-name>_<YYYY-MM-DD>_project-map.md`.

Required sections:

1. Header: app, date, mapper, scope, app target if known, UI stack, language, navigation model, localization, directories, totals.
2. Dependencies: table of relevant packages and concerns.
3. Localization setup: resources, locales, fallback, string APIs, pluralization, formatting, RTL/mirroring evidence.
4. Screens / Flows: SwiftUI views, UIKit controllers, storyboard/xib scenes, routes/destinations, and file paths.
5. Shared Components / Controls: reusable UI inventory.
6. Inline UI Inventory: per-screen inline UI table.
7. Storyboard / XIB Inventory: scenes, controls, outlets/actions, localized resources, and custom classes when present.
8. Platform Feature Inventory: Dynamic Type, VoiceOver, Switch Control, Voice Control, Reduce Motion, Increase Contrast, Bold Text, Button Shapes, Differentiate Without Color, haptics/audio, and permission/system flows when statically visible.
9. Coverage and Blind Spots: runtime-only concerns, generated UI, third-party controls, excluded targets, simulator/device checks required.
10. How to Use This File: instructions for `audit-accessibility`.

## Non-Negotiable Rules

- Do not modify source files.
- Do not install dependencies or run Xcode builds unless the user explicitly asks.
- Do not invent targets, screens, paths, line numbers, storyboard output, accessibility tree output, or runtime behavior.
- Mark storyboard rendering, custom controls, VoiceOver order, Dynamic Type layout, contrast, touch target size, and gesture behavior as `needs runtime verification` unless directly verified.
- Keep customer-provided examples out of the skill package unless they have been anonymized into generic patterns.
