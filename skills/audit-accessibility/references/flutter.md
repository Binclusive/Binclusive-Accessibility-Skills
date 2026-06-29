# Flutter Accessibility Audit Notes

Use this reference only for Flutter applications written in Dart, using Material, Cupertino, or the base Widgets library. React Native/Expo apps use `react-native.md` instead, and native Android (Kotlin/Java) apps use `android.md`. Pair this with the selected Binclusive project map and the Flutter pattern catalog when available. The auditor observes and documents only; it never edits source code.

## Privacy Boundary

User-provided audit documents may be read as inspiration during skill creation only. Do not copy customer data into skill resources. Store only anonymized, reusable patterns. Do not persist real customer names, application IDs, bundle identifiers, package names, domains, internal URLs, proprietary screen names, ticket IDs, business copy, screenshots, or exact customer source paths from customer artifacts.

## Required Input

Read a selected `Binclusive-auditing/*_project-map.md` first. It is the source of truth for scope. If no map exists, stop and ask the user to run `map-project` first.

Audit only the mapped Flutter screens, flows, widgets, and platform features. If the map marks an area as runtime-only, carry that limitation into the finding or summary.

## The Flutter Semantics Model (read first)

Flutter does not expose native platform widgets; it paints its own and reports an abstract **semantics tree** to each platform's assistive technology — TalkBack on Android, VoiceOver on iOS, and the DOM-based semantics layer on Flutter web. Audit against this model:

- **Material/Cupertino widgets carry built-in semantics.** `ElevatedButton`, `TextButton`, `IconButton`, `Checkbox`, `Switch`, `Slider`, `TextField`, `Tab`, etc. already expose role, state, and (often) actions. Prefer them; flag custom gesture controls (`GestureDetector`/`InkWell` on a `Container`) that re-implement a control without the semantics a real widget would give.
- **Names come from a few specific properties:** `semanticLabel` (on `Image`, `Icon`, `Text`, `CircleAvatar`), `Semantics(label:)`, `tooltip:`/`Tooltip` (icon buttons), and `InputDecoration(labelText:)` for fields. A visible `Text` is its own label; a wrapping `Semantics(label:)` overrides it.
- **Roles are flags on `Semantics`:** `button: true`, `header: true` (heading), `image: true`, `textField: true`, `link: true`, plus state flags `enabled`, `checked`, `selected`, `toggled`, `slider`, `inMutuallyExclusiveGroup`.
- **Grouping is explicit:** `MergeSemantics` collapses descendants into one node (a row that should read as one item); `ExcludeSemantics` removes a subtree from the tree (decorative); `BlockSemantics` hides everything painted behind it (a modal/overlay). Over-merging hides separately actionable children; under-merging fragments a row.
- **Traversal/reading order:** `Semantics(sortKey: OrdinalSortKey(n))`, `FocusTraversalGroup`, and `FocusTraversalOrder` control order when visual/paint order is wrong. Rendered order is runtime-only; a clearly mis-ordered source is a static finding.
- **Live updates:** `Semantics(liveRegion: true)` or `SemanticsService.announce(...)` announces an in-place change; otherwise it is silent.

## Audit Order

1. Inline interactive UI in mapped screen/page widgets, custom widgets, `ListView`/`GridView` items, and dialogs/sheets.
2. Shared interactive widgets: Button (`ElevatedButton`/`TextButton`/`OutlinedButton`/`FilledButton`), IconButton/FAB, tappable text/Link, TextField/`TextFormField`, Checkbox, Radio, Switch, Slider, Stepper, Dropdown, Dialog/BottomSheet, Menu/`PopupMenuButton`, Tab, Chip, custom gesture targets (`GestureDetector`/`InkWell`).
3. Shared display widgets: Image/`Image.network`/`SvgPicture`, Icon, `CircleAvatar`, List/`ListView`/`GridView`, Chart, Map, Skeleton/Shimmer, Loading/Progress, Badge, SnackBar/Tooltip.
4. Screen-level patterns: `AppBar`/`SliverAppBar` titles, headings, focus/reading order, dialog/sheet presentation and dismissal, errors, status updates, localization, text scaling, animations, RTL, contrast, touch targets (48x48).
5. Platform assistive technology support: TalkBack (Android), VoiceOver (iOS), Switch Access/Switch Control, Voice Access/Voice Control, keyboard/D-pad/focus traversal, text scale, bold/high-contrast text, Reduce Motion, and (when in scope) Flutter web/desktop semantics.

## Semantics and Activation

- `GestureDetector`, `InkWell`, `InkResponse`, or a raw `onTap` on a `Container`/`Row`/`Column`/`Text`/`Image` used as a control without a wrapping `Semantics(button: true, label: ...)` or `onTap` semantics — so the element has no role or name for screen readers.
- Icon-only `IconButton`, `Icon`, `FloatingActionButton`, or custom control whose `tooltip`/`semanticLabel` is null or empty when it is informative/actionable.
- Decorative `Image`/`Icon`/`SvgPicture` exposed to the semantics tree (it has a `semanticLabel`, or is not wrapped in `ExcludeSemantics`) when it conveys nothing; or an informative image with no `semanticLabel`.
- Combined visual groups missing an intentional grouping strategy (`MergeSemantics`) where a row/card/tile should read as one element, or over-merged groups that swallow separately actionable controls.
- State not exposed for selected, expanded, checked, disabled, loading, progress, or current-item states (`Semantics(checked:/selected:/toggled:/enabled:)`, or using a native `Checkbox`/`Switch`/`Radio` that exposes it automatically).
- Custom actions (swipe, long-press, drag — e.g. `Dismissible`, `Slidable`) not reachable through `Semantics(customSemanticsActions: ...)` / `onTap`/`onLongPress` semantics when the visual gesture is the only path.
- A real control rebuilt from scratch (`GestureDetector` + `Container` styled like a button) instead of using `ElevatedButton`/`TextButton`/`IconButton`, losing built-in role, focus, and minimum tap target.

## Names, Hints, Values, and Localization

- `TextField`/`TextFormField` relying on `hintText` only, with no `InputDecoration(labelText:)` or associated visible label, so the name disappears after entry.
- Error/helper text not connected to the field (`InputDecoration(errorText:)`/`FormField` validators) or not announced as a live region.
- Hardcoded visible strings or `semanticLabel`/`Semantics(label:)`/`tooltip:` strings written as Dart literals instead of generated localizations (`AppLocalizations.of(context)`, `.tr()`, `Intl.message`).
- `semanticLabel`/`label:` that repeats the role or duplicates the visible `Text` instead of adding meaning, or placeholder names like "button"/"image"/"icon".
- Dynamic values, counts, dates, prices, durations, or percentages not localized (`NumberFormat`/`DateFormat`/`Intl.plural`) or not exposed as understandable accessibility values (`Semantics(value:)`).

## Navigation, Modals, and Dynamic Updates

- Screen lacks a clear `AppBar`/`SliverAppBar` title or first meaningful heading; a visual title `Text` is not exposed via `Semantics(header: true)`.
- Custom back/up/close controls lack accessible names (`tooltip`/`semanticLabel`) or expected activation.
- `showDialog`/`AlertDialog`/`showModalBottomSheet`/custom `Overlay` lacks a focus/announcement strategy or does not block the background from the semantics tree (`BlockSemantics`/`ModalBarrier`) so screen-reader focus can escape behind it. Native `AlertDialog`/`showModalBottomSheet` manage the barrier — do not flag those for background-inertness, but do flag missing/empty titles and unnamed actions.
- Source/paint order that does not match intended reading order without `Semantics(sortKey: OrdinalSortKey(...))` / `FocusTraversalOrder`. Rendered order is runtime-only, but a clearly mis-ordered source is a static finding.
- Async loading, success, failure, validation, or `SnackBar` updates lack `Semantics(liveRegion: true)` or `SemanticsService.announce(...)`, so they are silent for screen readers. Whether the announcement fires is runtime-only.
- `ListView`/`GridView`/`ListView.builder` rows/cards have unclear labels, fragmented values, missing actions, or poor reading order.

## Text Scaling, Layout, and Visual Settings

- Text using a fixed `fontSize` inside containers with fixed `height`/`SizedBox`/`Container(height:)` likely to clip at large `textScaleFactor`/`MediaQuery.textScaler`, or a `MaterialApp.builder` that clamps/locks `textScaler` to 1.0 (suppressing user font scaling entirely).
- `maxLines: 1` + `TextOverflow.ellipsis` (or `softWrap: false`) on important labels, values, errors, or buttons where the full text matters.
- Dense `Row` compositions combining multiple `Text`, icons, badges, and controls without `Wrap`/`Flexible`/`Expanded` or a vertical fallback.
- Interactive targets smaller than 48x48 (`IconButton(iconSize:)` with no padding, `InkWell` on a small box, `MaterialTapTargetSize.shrinkWrap` removing the minimum), or `GestureDetector` targets with no enforced minimum size.
- Color alone used to communicate status, required/error state, selection, chart segments, or availability (`color: Colors.red` errors without text/icon).
- Animations without a Reduce-Motion consideration (`MediaQuery.of(context).disableAnimations` / `MediaQuery.disableAnimationsOf`).
- Custom theme/disabled/placeholder/chart/dark-theme colors requiring runtime contrast verification.
- RTL-sensitive layouts using `EdgeInsets.only(left:/right:)` and `Alignment` instead of `EdgeInsetsDirectional`/`AlignmentDirectional`, or directional icons not considered for mirroring.

### Flutter Text-Scale Static Risk Signals

Flag these as text-scale clipping/overlap risks when they affect user-facing text, controls, rows, cards, or form content. Do not claim the UI definitely overlaps from static code alone; phrase findings as "Large text scale may cause clipping or overlap" and use `RUNTIME-CHECK` unless the required fix clearly changes visual layout, in which case use `VISUAL-IMPACT`.

- Fixed `height`/`SizedBox(height:)`/`Container(height:)` wrapping `Text`, `Button`, list rows, cards, app bars, or badges.
- `maxLines: 1`/low `maxLines` with `TextOverflow.ellipsis`/`TextOverflow.clip`, or `softWrap: false`, where the full value is important.
- `MaterialApp`/`builder` overriding `MediaQuery.textScaler`/`textScaleFactor` to a fixed value (defeating user font-size settings).
- `Stack`/`Positioned`/`Transform`/`OverflowBox` placing text/badges/controls without flexible space.
- Dense `Row`/`Wrap`-less compositions mixing multiple text values, icons, badges, and buttons.
- Design-system `Text` wrappers that hardcode `fontSize`/`height` and hide text params from callers.
- `ListView`/`GridView` items with fixed `itemExtent`/fixed-height tiles whose text/state changes dynamically.

## Flutter Web and Desktop (when in scope)

- Flutter web ships an accessibility/semantics layer that may need to be enabled and can produce a different tree than mobile; carry "verify on the web target's screen reader" as `RUNTIME-CHECK`.
- Keyboard focus traversal (`FocusTraversalGroup`/`FocusNode`) matters more on web/desktop; flag interactive widgets unreachable by keyboard and missing focus order where the source order is wrong.

## Runtime-Only Checks

Mark `RUNTIME-CHECK` when static code cannot prove the issue:

- TalkBack/VoiceOver announcement, traversal/reading order, grouping, and custom-action behavior.
- Switch Access/Switch Control and Voice Access/Voice Control reachability/name matching.
- keyboard/D-pad/focus order and activation (especially web/desktop).
- text scale layout at large `textScaleFactor` and display-size changes — clipping, overlap, scrollability.
- touch target measurements and gesture conflict behavior.
- color contrast, dark theme contrast, high-contrast/inversion, disabled/placeholder contrast.
- Reduce Motion behavior and animation alternatives.
- dialog/sheet focus and background inertness after presentation/dismissal.
- rendered semantics tree, `CustomPaint`/chart/map output, `WebView`/platform-view behavior, and Flutter-web semantics output.
- camera/scanner flows and permission/system dialogs.

## Finding Rules

- Include problems only; do not list accessible elements.
- Every finding must reference Dart code that was actually read.
- Prefer native Material/Cupertino widgets and Flutter semantics properties before custom `Semantics`/gesture workarounds.
- Do not invent screen-reader output, rendered semantics tree, contrast measurements, touch target dimensions, or confirmed text-scale overlap/clipping.
- When static code shows fixed heights, truncation, clipping, absolute positioning, sub-48x48 targets, text-scale locking, or constrained dynamic items, report it as a text-scale/touch-target risk and require emulator/device verification at large text and display sizes.
- Never recommend placeholder labels such as `button`, `image`, `icon`, or `widget`.
- Accessible names must be specific, localized (via `AppLocalizations`/`intl`/`.arb`), and action- or content-oriented.
- If a fix may change layout, gestures, navigation, state, or public widget API, classify it as `VISUAL-IMPACT` or `FUNCTIONAL-RISK`.
- Do not claim store, WCAG, or platform compliance; report verified findings and residual risk only.

## Output

Write `Binclusive-auditing/accessibility-todo.md` and a dated archive copy. Use `accessibility-todo-format.md` for the exact structure. In the platform impact field or problem text, connect findings to relevant WCAG principles and Flutter/platform behavior such as TalkBack/VoiceOver, Switch Access, Voice Access, text scaling, Reduce Motion, RTL, or localization.
