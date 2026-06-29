# Mapper Flutter Reference: Flutter / Dart (Material, Cupertino, Widgets)

Use this reference when `map-project` is triggered for a Flutter application written in Dart, using Material, Cupertino, or the base Widgets library. This is for **Flutter** (a `pubspec.yaml` with a `flutter` SDK dependency and a `lib/` Dart tree); native Android (Kotlin/Java) apps are covered by `mapper-android.md`, React Native/Expo apps by `mapper-react-native.md`, and native iOS (Swift) apps by `mapper-ios-swift.md`. The mapper observes and documents only; it never edits source code.

## Privacy Boundary

User-provided audit documents may be read as inspiration during skill creation only. Do not copy customer data into skill resources. Do not persist real customer names, application IDs, package names, bundle identifiers, domains, internal URLs, proprietary screen names, ticket IDs, business copy, screenshots, or exact customer source paths from customer artifacts.

## Step 0: Establish Context

First, run the read-only project inspector if available:

```bash
node map-project/scripts/inspect-project.mjs /path/to/project
```

The inspector returns Dart file counts, `pubspec.yaml`/`pubspec.lock` locations, whether a `flutter` SDK dependency is declared, the entrypoint (`lib/main.dart`), `Semantics`/`semanticLabel`/`ExcludeSemantics`/`MergeSemantics`/`tooltip` accessibility signals under `flutter.accessibilitySignals`, widget-usage signals under `flutter.widgetSignals`, localization signals (`flutter_localizations`/`intl`, `l10n.yaml`, `.arb` files), and platform-folder signals (`android/`, `ios/`, `web/`, `macos/`, `linux/`, `windows/`). Treat the JSON as discovery input, not as proof. Verify signals by reading the actual Dart source, `pubspec.yaml`, `l10n.yaml`, and `.arb` files.

Determine these facts before asking the user:

- Application model: single `MaterialApp`/`CupertinoApp`/`WidgetsApp`, multi-flavor app, add-to-app module, package/plugin, Flutter web/desktop target, or melos/monorepo workspace.
- UI stack: Material (`MaterialApp`), Cupertino (`CupertinoApp`), mixed Material/Cupertino, or a custom `WidgetsApp` design system.
- State/architecture: `StatelessWidget`/`StatefulWidget`, Provider, Riverpod, BLoC/`flutter_bloc`, GetX, `setState`-only, or MVVM — record only as it affects where UI and labels are built.
- Navigation model: imperative `Navigator` (`push`/`pushNamed`, `MaterialPageRoute`), named routes (`routes:`/`onGenerateRoute`), declarative `Navigator 2.0`/`Router`, `go_router`, `auto_route`, `beamer`, tabs (`BottomNavigationBar`/`TabBar`/`NavigationRail`), `Drawer`, deep links, or a custom router.
- Screen roots: top-level screen/page widgets (often `*_screen.dart`/`*_page.dart`/`*_view.dart`), route destinations, `Scaffold` builders, dialogs (`showDialog`), bottom sheets (`showModalBottomSheet`), and feature directories/packages.
- Reusable UI roots: shared widgets, custom `StatelessWidget`/`StatefulWidget` controls, design-system packages, `ListView`/`GridView` item builders, custom painters (`CustomPaint`), and themed component wrappers.
- Localization: `flutter_localizations`, `intl`, `l10n.yaml`, `lib/l10n/*.arb` (or `assets/` translations), `AppLocalizations`, `MaterialApp(localizationsDelegates:, supportedLocales:)`, `Intl.message`, hardcoded string literals vs generated `AppLocalizations.of(context)` getters, and RTL evidence (`Directionality`, `TextDirection`, `EdgeInsetsDirectional`, `AlignmentDirectional`, `*Directional` widgets, `ar`/`he`/`fa` locales).
- Assets and media: `assets/` images/SVGs, `Image.asset`/`Image.network`/`SvgPicture`, `Icon`/`ImageIcon`, `CustomPaint`/`Canvas` drawing, charts, maps, `WebView` (`webview_flutter`), video/audio, motion-heavy surfaces, and haptics.

If the app model or screen roots remain ambiguous after inspection, ask which app/package, feature directories, and whether Material, Cupertino, or a custom widget design system should be mapped.

## User Scope Questions

Ask these when the user did not already provide scope:

1. Should I map the whole Flutter app, selected screens/flows, selected widgets, a package/folder path, or a free-form target list?
2. Should localization/hardcoded string hotspots be included? Default: yes.
3. Should Material and Cupertino surfaces be mapped together when both exist? Default: yes for mixed apps.
4. Which run targets are in scope — mobile (Android/iOS), Flutter web, and/or desktop? Accessibility behavior differs per target. Default: the mobile targets that exist.

## Project and Dependency Analysis

Read relevant manifests and configuration files when present:

- Pub configuration: `pubspec.yaml` (the `flutter:` SDK dependency, `dependencies`, `dev_dependencies`, `flutter:` assets/fonts block), `pubspec.lock` for resolved versions, `analysis_options.yaml` (lints), and `l10n.yaml`.
- App configuration: `lib/main.dart` entrypoint, `MaterialApp`/`CupertinoApp` root (`localizationsDelegates`, `supportedLocales`, `theme`/`darkTheme`, `builder` for text-scale clamping), and flavor/entrypoint files (`main_*.dart`).
- Platform folders only as they affect accessibility wiring: `android/` and `ios/` runner config, `web/index.html` for Flutter web semantics, and `assets/`.

Classify dependencies (from `pubspec.yaml`/`pubspec.lock`) as:

- `A11Y-RELEVANT`: UI toolkits and design systems (`flutter` Material/Cupertino, `flutter_hooks`, component libs), navigation/routing (`go_router`, `auto_route`, `beamer`), forms (`flutter_form_builder`, `reactive_forms`), lists/scrolling helpers, dialogs/sheets, pickers, charts (`fl_chart`, `syncfusion_flutter_charts`), maps (`google_maps_flutter`), media/video (`video_player`, `chewie`), `webview_flutter`, image/SVG (`cached_network_image`, `flutter_svg`), icons, and animation (`lottie`, `rive`).
- `L10N-RELEVANT`: `flutter_localizations`, `intl`, `intl_utils`, `slang`, `easy_localization`, date/number/currency formatting, locale management, and bidi/RTL helpers.
- `NEUTRAL`: unrelated data, networking, persistence, dependency injection, build, logging, analytics, or testing packages.

For relevant packages, record name, version when inferable (from `pubspec.yaml`/`pubspec.lock`), role, likely accessibility/localization concerns, and whether native Flutter widgets/semantics are also used.

## Localization Detection

Look for:

- Configuration: `l10n.yaml`, the `flutter_localizations` SDK dependency, `intl`, and the `generate: true` flag under `flutter:` in `pubspec.yaml`.
- Resource files: `lib/l10n/*.arb` (or the path set in `l10n.yaml`), `app_en.arb`/`app_<locale>.arb`, ICU plural/select messages in the `.arb` values, and any non-`.arb` translation store (`assets/translations/*.json` for `easy_localization`/`slang`).
- Usage: generated `AppLocalizations.of(context)!.key`, `S.of(context).key`, `context.tr(...)`/`'key'.tr()`, `Intl.message`/`Intl.plural`, and literal `String` arguments passed to `Text(...)`, `semanticLabel:`, `Semantics(label:)`, `tooltip:`, and `hintText:`.
- Formatting usage: `NumberFormat`, `DateFormat`, `Intl.plural`/`Intl.select`, `toStringAsFixed`, and hardcoded date/number/currency text.
- RTL and layout direction: `Directionality`, `TextDirection.rtl`, `EdgeInsetsDirectional`, `AlignmentDirectional`, `*Directional` widgets (`PositionedDirectional`), `Localizations.localeOf`, mirrored vs non-mirrored assets, and `ar`/`he`/`fa` entries in `supportedLocales`.

If no localization setup is found, record `NONE - strings appear hardcoded` and flag user-facing literals and accessibility strings (`semanticLabel`, `Semantics(label:)`, `tooltip:`) for later review.

## Screen and Flow Detection

Enumerate the mapped scope:

- App entry: `lib/main.dart` `runApp(...)`, the `MaterialApp`/`CupertinoApp`/`WidgetsApp` root, and flavor entrypoints.
- Screens: top-level page/screen widgets (`*_screen.dart`/`*_page.dart`/`*_view.dart`), `Scaffold` builders, and route destinations.
- Navigation: imperative `Navigator.push(...)`/`pushNamed(...)` and `MaterialPageRoute`/`CupertinoPageRoute`; named `routes:`/`onGenerateRoute`; declarative `go_router` (`GoRoute`), `auto_route`, or `Router`/`RouterDelegate`; tabs (`BottomNavigationBar`, `TabBar`/`TabBarView`, `NavigationRail`); `Drawer`; and deep links.
- Modals and overlays: `showDialog`/`AlertDialog`/`Dialog`, `showModalBottomSheet`/`BottomSheet`, `showCupertinoModalPopup`, `SnackBar`, `Tooltip`, `PopupMenuButton`, and custom `Overlay`/`OverlayEntry`.
- Mixed UI stacks: Material screens embedding Cupertino widgets (or vice versa), and platform-adaptive widgets.
- Run targets: note when Flutter web or desktop is in scope, since semantics output and assistive-technology behavior differ from mobile.

If no screen model is discoverable and no path was provided, ask for the app package and primary feature directories.

## Shared UI Inventory

Find likely shared UI roots such as `lib/widgets/`, `lib/components/`, `lib/ui/`, `lib/common/`, `lib/shared/`, `lib/core/ui/`, `lib/design_system/`, `lib/features/*/widgets/`, and package directories under `packages/`.

For each relevant component/control, record:

- Name and verified file path.
- Widget kind: `StatelessWidget`, `StatefulWidget`, a `build` helper/function, a themed wrapper, a `ListView`/`GridView` item builder, or a `CustomPaint`/custom-render widget.
- Component type: Button (`ElevatedButton`/`TextButton`/`OutlinedButton`/`FilledButton`), IconButton, Link/tappable text, TextField/`TextFormField`, Checkbox, Radio, Switch, Slider, Stepper, Dropdown, Dialog/BottomSheet, Menu/`PopupMenuButton`, Tab/`TabBar`, Chip, Disclosure/`ExpansionTile`, List/`ListView`/`GridView`, Image/Icon, Chart, Map, `WebView`, SnackBar/Toast, Progress/Loading, custom gesture area (`GestureDetector`/`InkWell`).
- Whether it uses native Material/Cupertino semantics, a wrapping `Semantics` widget, `semanticLabel`, or custom gesture handling without semantics.
- Whether visible text comes from generated localizations (`AppLocalizations`), Dart literals, view models, server data, or hardcoded properties.
- Which mapped screens/flows use it, when statically discoverable.

## Inline UI Inventory

For each mapped screen/page widget, record inline UI that bypasses shared components:

- Interactive controls and gestures: `ElevatedButton`/`TextButton`/`OutlinedButton`/`FilledButton`, `IconButton`, `FloatingActionButton`, `GestureDetector`, `InkWell`/`InkResponse`, `Dismissible`, `Draggable`, `onTap`/`onLongPress`/`onDoubleTap` handlers, and custom gesture recognizers.
- Forms and validation UI: `TextField`/`TextFormField`, `InputDecoration` (`labelText`/`hintText`/`errorText`), `Form`/`FormField` validators, `DropdownButton`/`DropdownButtonFormField`, `Checkbox`/`Radio`/`Switch`, keyboard type (`keyboardType`), and `autofillHints`.
- Navigation and modal patterns: `AppBar`/`SliverAppBar` titles, leading/back actions, `BottomNavigationBar`/`NavigationBar`/`NavigationRail`, `TabBar`, `Drawer`, `AlertDialog`/`Dialog`, `showModalBottomSheet`, `SnackBar`, and `PopupMenuButton`.
- Images, icons, vector assets, `CustomPaint`/`Canvas`, charts, maps, video/audio, `WebView`, QR/scanner/camera surfaces.
- Dynamic content: loading indicators, `CircularProgressIndicator`/`LinearProgressIndicator`, `SnackBar`s, async `FutureBuilder`/`StreamBuilder` results, validation summaries, and live updates.
- Accessibility declarations: `Semantics(...)` (`label`, `hint`, `value`, `button`, `header`, `image`, `textField`, `link`, `enabled`, `checked`, `selected`, `toggled`, `liveRegion`, `sortKey`, `onTap`, `onLongPress`, `customSemanticsActions`), `semanticLabel` (on `Image`/`Icon`/`Text`/`CircleAvatar`), `MergeSemantics`, `ExcludeSemantics`, `BlockSemantics`, `tooltip:`/`Tooltip`, `Semantics(sortKey: OrdinalSortKey(...))`, `FocusTraversalGroup`/`FocusTraversalOrder`, and `MaterialTapTargetSize`.
- Hardcoded visible text and hardcoded accessibility text (`semanticLabel`/`label:`/`tooltip:` literals).
- Locale-sensitive formatting and RTL-sensitive layout (`EdgeInsets` with hardcoded left/right instead of `EdgeInsetsDirectional`, non-mirrored directional icons).

Record file path, approximate line range when verified, UI element/control type, interactivity, existing accessibility props/widgets, localization status, runtime-only concerns, and notes.

## Output File

Write one file in project-root `Binclusive-auditing/` named `<project-name>_<YYYY-MM-DD>_project-map.md`.

Required sections:

1. Header: app, date, mapper, scope, app/package if known, UI stack (Material / Cupertino / mixed / custom), language (Dart), run targets in scope (mobile/web/desktop), navigation model, localization, directories, totals.
2. Dependencies: table of relevant packages and concerns.
3. Localization setup: `l10n.yaml`, `.arb`/translation files, locales, fallback/base, localization APIs, plurals/ICU, formatting, `Directionality`/RTL evidence.
4. Screens / Flows: screen/page widgets, route destinations, app entry, navigation model, and file paths.
5. Shared Components / Controls: reusable widget inventory.
6. Inline UI Inventory: per-screen inline UI table.
7. Widget/Asset Inventory: custom widgets, `CustomPaint` surfaces, assets, and localized resources when present.
8. Platform Feature Inventory: text scaling (`MediaQuery.textScaler`/`textScaleFactor`, fixed heights), TalkBack/VoiceOver (Flutter renders to both), Switch Access/Switch Control, Voice Access/Voice Control, touch target size (48x48, `MaterialTapTargetSize`), Reduce Motion (`MediaQuery.disableAnimations`), bold text / high contrast (`MediaQuery.boldText`/`highContrast`), dark theme, haptics/audio, and Flutter-web/desktop semantics differences when in scope.
9. Coverage and Blind Spots: runtime-only concerns, generated/build-time UI, third-party widgets, excluded packages/targets, emulator/device/screen-reader checks required.
10. How to Use This File: instructions for `audit-accessibility`.

## Non-Negotiable Rules

- Do not modify source files.
- Do not install packages or run `flutter pub get`/`flutter build` unless the user explicitly asks.
- Do not invent packages, screens, paths, line numbers, rendered semantics-tree output, or runtime behavior.
- Mark rendered semantics tree, TalkBack/VoiceOver order, text-scale layout, contrast, touch target size, and gesture behavior as `needs runtime verification` unless directly verified.
- Keep customer-provided examples out of the skill package unless they have been anonymized into generic patterns.
