# Mapper Android Reference: Jetpack Compose / Android Views (XML)

Use this reference when `map-project` is triggered for a native Android application written in Kotlin or Java, using Jetpack Compose, the Android View system (XML layouts), or a mixed Compose/View architecture. This is for **native Android**; React Native/Expo Android apps are covered by `mapper-react-native.md` instead. The mapper observes and documents only; it never edits source code.

## Privacy Boundary

User-provided audit documents may be read as inspiration during skill creation only. Do not copy customer data into skill resources. Do not persist real customer names, application IDs, package names, domains, internal URLs, proprietary screen names, ticket IDs, business copy, screenshots, or exact customer source paths from customer artifacts.

## Step 0: Establish Context

First, run the read-only project inspector if available:

```bash
node map-project/scripts/inspect-project.mjs /path/to/project
```

The inspector returns Kotlin/Java file counts, Gradle build files, `androidx.compose`/`@Composable`/`Modifier.semantics`/`contentDescription` signals under `android.composeSignals`, XML layout files under `android.xmlLayoutSignals`, `AndroidManifest.xml` files, navigation graph and menu resources, accessibility attribute signals in XML, and `res/values*/strings.xml` localization signals. Treat the JSON as discovery input, not as proof. Verify signals by reading the actual Kotlin/Java source, XML layouts, manifest, and `strings.xml` files.

Determine these facts before asking the user:

- Application model: single-Activity + Compose, single-Activity + Fragments, multi-Activity, Compose-only, View/XML-only, mixed Compose/View (`ComposeView`/`AndroidView` bridges), library module, dynamic feature module, or Wear/TV/Automotive target.
- Language and UI stack: Kotlin, Java, Jetpack Compose, Android Views with XML layouts, View Binding/Data Binding, or mixed.
- Navigation model: Jetpack Navigation Component (XML nav graphs under `res/navigation/`), Navigation-Compose (`NavHost`/`composable(route)`), Fragment transactions, Activity intents, bottom navigation, single-Activity vs multi-Activity, deep links, or a custom router.
- Screen roots: launcher `Activity` from `AndroidManifest.xml`, `Activity`/`Fragment` classes, top-level `@Composable` screens, navigation destinations, and feature modules/packages.
- Reusable UI roots: shared composables, custom `View`/`ViewGroup` subclasses, `RecyclerView.Adapter`/`ViewHolder` rows, custom controls, `BaseAdapter`s, theme/style resources, and design-system modules.
- Localization: `res/values/strings.xml`, `res/values-<lang>/strings.xml`, `<plurals>`, `<string-array>`, `stringResource(...)` in Compose, `getString(...)` in code, `android:text`/`android:contentDescription` literals vs `@string/...` references, formatting helpers, and RTL evidence (`android:supportsRtl`, `Start`/`End` attributes, `res/values-ar`/`values-iw`/`values-fa`).
- Assets and media: drawables/vector assets, `ImageView`/`Image` usage, custom `onDraw` views, charts, maps, `WebView`, video/audio, motion-heavy surfaces, and haptics.

If the app model or screen roots remain ambiguous after inspection, ask which application/module, feature packages, and whether Compose, Views/XML, or both should be mapped.

## User Scope Questions

Ask these when the user did not already provide scope:

1. Should I map the whole Android app, selected screens/flows, selected components, a module/folder path, or a free-form target list?
2. Should localization/hardcoded string hotspots be included? Default: yes.
3. Should Jetpack Compose and Android View/XML surfaces be mapped together when both exist? Default: yes for mixed apps.
4. Should XML layout, menu, and navigation resources be included when present? Default: yes.

## Project and Dependency Analysis

Read relevant manifests and configuration files when present:

- Gradle build files: `settings.gradle(.kts)`, root and module `build.gradle(.kts)`, `gradle/libs.versions.toml` (version catalogs), `gradle.properties`.
- Android configuration: `AndroidManifest.xml` (activities, `<application android:supportsRtl>`, launcher intent filters, screen orientation locks), `proguard`/`r8` rules when they affect resource keep behavior.
- Resources: `res/layout*/`, `res/navigation/`, `res/menu/`, `res/values*/` (`strings.xml`, `styles.xml`, `themes.xml`, `dimens.xml`, `colors.xml`), `res/xml/`, asset catalogs/drawables.

Classify dependencies as:

- `A11Y-RELEVANT`: UI toolkits and design systems (Jetpack Compose Material/Material3, Material Components for Android, AndroidX AppCompat/ConstraintLayout), `RecyclerView`, `ViewPager2`, navigation, bottom sheets/dialogs, pickers, form/input controls, chart/map/media/`WebView` libraries, image loaders (Coil/Glide/Picasso), animation/Lottie, accessibility helpers.
- `L10N-RELEVANT`: localization/resource tooling, ICU/pluralization helpers, date/number/currency formatting, locale management (`AppCompatDelegate`/per-app language, `androidx.core:core` locale APIs), bidi/RTL helpers.
- `NEUTRAL`: unrelated data, networking, persistence, dependency injection, build, logging, analytics, or testing packages.

For relevant packages, record name, version when inferable (from the version catalog or module `build.gradle`), role, likely accessibility/localization concerns, and whether native Compose/View primitives are also used.

## Localization Detection

Look for:

- Resource files: `res/values/strings.xml` (default/base), `res/values-<lang>/strings.xml`, `<plurals>`, `<string-array>`, and configuration-qualified `values-*` directories.
- Compose localization: `stringResource(R.string.x)`, `pluralStringResource(...)`, `LocalContext.current.getString(...)`, and literal string arguments passed to `Text(...)`, `contentDescription`, and semantics.
- View/XML localization: `@string/...` references in `android:text`, `android:hint`, `android:contentDescription`, `app:title`, menu `android:title`; hardcoded literals in those same attributes; `getString(...)`/`getText(...)` in Kotlin/Java.
- Formatting usage: `String.format`, `NumberFormat`, `DateFormat`/`SimpleDateFormat`, `DateTimeFormatter`, `MeasureFormat`, `Locale.getDefault()`, `Resources.getQuantityString`, and hardcoded date/number/currency text.
- RTL and layout direction: `android:supportsRtl="true"` in the manifest, `Start`/`End` vs `Left`/`Right` attributes (`paddingStart`, `layout_marginEnd`, `layout_constraintStart_toStartOf`), `android:textAlignment`, `layoutDirection`, `View.LAYOUT_DIRECTION_*`, mirrored vs non-mirrored drawables (`android:autoMirrored`), and per-locale resource dirs such as `values-ar`/`values-iw`/`values-fa`.

If no localization setup is found, record `NONE - strings appear hardcoded` and flag user-facing literals and accessibility strings for later review.

## Screen and Flow Detection

Enumerate the mapped scope:

- Compose: app entry `Activity` `setContent { }`, top-level screen composables, `NavHost`/`composable(route)` destinations, bottom sheets, dialogs, `ModalNavigationDrawer`, `Scaffold` usages, and reusable composable files.
- Android Views: `Activity`, `Fragment`, `DialogFragment`, `BottomSheetDialogFragment`, custom `View`/`ViewGroup`, `RecyclerView.Adapter`/`ViewHolder`, and their paired `res/layout/*.xml`.
- XML resources: layout files (`res/layout*/`), navigation graphs (`res/navigation/*.xml` with `<fragment>`/`<activity>`/`<dialog>` destinations and `<action>`s), menu resources (`res/menu/*.xml`), and `<include>`/`<merge>`/`<ViewStub>` composition.
- Mixed bridges: `ComposeView` embedded in XML/Fragments, `AndroidView { }` embedding legacy views in Compose, `AbstractComposeView`, and `Fragment` ↔ Compose interop.
- Manifest: map screen entry points and the launcher Activity from `AndroidManifest.xml`; note exported activities, deep links (`<intent-filter>`/`<data>`), and orientation/`configChanges` locks.
- Wear OS, TV (Leanback), Automotive, App Widgets, and Quick Settings tiles: map only when in the user scope; record separate runtime and platform constraints.

If no screen model is discoverable and no path was provided, ask for the application module and primary feature packages.

## Shared UI Inventory

Find likely shared UI roots such as `ui/`, `components/`, `designsystem/`, `widgets/`, `views/`, `common/`, `core/ui/`, `feature/*/ui/`, adapter/viewholder packages, and `res/layout/` partials (`item_*.xml`, `view_*.xml`, `component_*.xml`).

For each relevant component/control, record:

- Name and verified file path (and the paired XML layout for View-based components).
- UI stack: Compose composable, custom `View`/`ViewGroup`, `RecyclerView` adapter/viewholder, XML layout partial, `<merge>`/`<include>` fragment, or mixed bridge.
- Component type: Button, IconButton, Link/clickable text, TextField/`EditText`, Checkbox, RadioButton, Switch/`SwitchCompat`, Slider/`SeekBar`, Stepper, Dialog/`BottomSheet`, Menu/`PopupMenu`, Tab/`TabLayout`, Chip, Disclosure/expandable, List/`RecyclerView`/`LazyColumn`, `LazyGrid`, Image/Icon, Chart, Map, `WebView`, Toast/Snackbar, Progress/Loading, custom gesture area.
- Whether it uses native Compose/Material or Material Components semantics, custom `Modifier.semantics`/`AccessibilityDelegate`, or custom drawing/gestures.
- Whether visible text comes from string resources, Kotlin/Java literals, view models, server data, XML literals, or hardcoded properties.
- Which mapped screens/flows use it, when statically discoverable.

## Inline UI Inventory

For each mapped screen/Activity/Fragment/composable, record inline UI that bypasses shared components:

- Interactive controls and gestures (Compose): `Button`, `IconButton`, `TextButton`, `Modifier.clickable`, `Modifier.toggleable`, `Modifier.selectable`, `Modifier.combinedClickable`, `Modifier.pointerInput`/custom gestures, swipe-to-dismiss, drag handles.
- Interactive controls (Views/XML): `Button`, `ImageButton`, `EditText`, `CheckBox`, `RadioButton`, `Switch`/`SwitchCompat`, `SeekBar`, `Spinner`, `ImageView` with `onClick`, custom `View` with touch handling, `FloatingActionButton`, toolbar/menu actions.
- Forms and validation UI: `TextField`/`OutlinedTextField`/`EditText`, `TextInputLayout`, error/helper text, required state, `inputType`/keyboard type, `autofillHints`, IME options.
- Navigation and modal patterns: app bar/toolbar titles, navigation/up buttons, `BottomSheet`, `AlertDialog`/`DialogFragment`, `PopupMenu`, `Snackbar`, tabs, bottom navigation, drawers.
- Images, icons, vector drawables, custom `onDraw`/`Canvas`, charts, maps, video/audio, `WebView`, QR/scanner/camera surfaces.
- Dynamic content: loading indicators, progress, Snackbars/Toasts, async results, validation summaries, live updates.
- Accessibility declarations (Compose): `contentDescription`, `Modifier.semantics { }`, `Modifier.clearAndSetSemantics`, `Modifier.semantics(mergeDescendants = true)`, `role = Role.*`, `stateDescription`, `onClick(label)`/`onLongClick(label)` semantics, `heading()`, `liveRegion`, `Modifier.minimumInteractiveComponentSize()`, `testTag`.
- Accessibility declarations (Views/XML): `android:contentDescription`, `android:importantForAccessibility`, `android:labelFor`, `android:accessibilityHeading`, `android:accessibilityLiveRegion`, `android:screenReaderFocusable`, `android:focusable`/`android:clickable`, `android:minWidth`/`android:minHeight`, `ViewCompat.setAccessibilityDelegate`, and `AccessibilityNodeInfo` customization.
- Hardcoded visible text and hardcoded accessibility text.
- Locale-sensitive formatting and RTL-sensitive layout (`Left`/`Right` attributes, non-mirrored directional drawables).

Record file path, approximate line range when verified, UI element/control type, interactivity, existing accessibility props/modifiers, localization status, runtime-only concerns, and notes.

## Output File

Write one file in project-root `Binclusive-auditing/` named `<project-name>_<YYYY-MM-DD>_project-map.md`.

Required sections:

1. Header: app, date, mapper, scope, application module if known, UI stack (Compose / Views / mixed), language (Kotlin/Java), navigation model, localization, directories, totals.
2. Dependencies: table of relevant packages and concerns.
3. Localization setup: resources, locales, fallback/base, string APIs, plurals, formatting, `supportsRtl`/RTL evidence.
4. Screens / Flows: Activities, Fragments, composable screens, navigation destinations, launcher entry, and file paths.
5. Shared Components / Controls: reusable UI inventory.
6. Inline UI Inventory: per-screen inline UI table.
7. XML Resource Inventory: layout, menu, and navigation resources, custom view classes, and localized resources when present.
8. Platform Feature Inventory: font scaling (`sp` vs `dp`, `fontScale`), TalkBack, Switch Access, Voice Access, Select to Speak, touch target size (48dp), Reduce/Remove animations, high-contrast/Color correction, dark theme, haptics/audio, and permission/system flows when statically visible.
9. Coverage and Blind Spots: runtime-only concerns, generated/inflated UI, third-party controls, excluded modules/targets, emulator/device checks required.
10. How to Use This File: instructions for `audit-accessibility`.

## Non-Negotiable Rules

- Do not modify source files.
- Do not install dependencies or run Gradle builds unless the user explicitly asks.
- Do not invent modules, screens, paths, line numbers, inflated layout output, accessibility tree output, or runtime behavior.
- Mark inflated XML rendering, custom views, TalkBack order, font-scale layout, contrast, touch target size, and gesture behavior as `needs runtime verification` unless directly verified.
- Keep customer-provided examples out of the skill package unless they have been anonymized into generic patterns.
