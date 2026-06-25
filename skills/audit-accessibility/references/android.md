# Android Accessibility Audit Notes

Use this reference only for native Android applications written in Kotlin or Java, using Jetpack Compose, the Android View system (XML layouts), or a mixed Compose/View architecture. React Native/Expo Android apps use `react-native.md` instead. Pair this with the selected Binclusive project map and the Android pattern catalog when available. The auditor observes and documents only; it never edits source code.

## Privacy Boundary

User-provided audit documents may be read as inspiration during skill creation only. Do not copy customer data into skill resources. Store only anonymized, reusable patterns. Do not persist real customer names, application IDs, package names, domains, internal URLs, proprietary screen names, ticket IDs, business copy, screenshots, or exact customer source paths from customer artifacts.

## Required Input

Read a selected `Binclusive-auditing/*_project-map.md` first. It is the source of truth for scope. If no map exists, stop and ask the user to run `map-project` first.

Audit only the mapped Android screens, flows, components, XML layouts, and platform features. If the map marks an area as runtime-only, carry that limitation into the finding or summary.

## Audit Order

1. Inline interactive UI in mapped composables, Activities/Fragments, custom views, `RecyclerView` rows, and XML layouts.
2. Shared interactive components: Button, IconButton, clickable text/Link, TextField/`EditText`, Checkbox, RadioButton, Switch, Slider/`SeekBar`, Stepper, Dialog/`BottomSheet`, Menu, Tab, Chip, custom gesture targets, custom `View`s.
3. Shared display components: Image, Icon/vector drawable, Avatar, List/`LazyColumn`/`RecyclerView`, Grid, Chart, Map, Skeleton, Loading/Progress, Badge, Snackbar/Toast.
4. Screen-level patterns: app bar/toolbar titles, headings, focus/reading order, dialog/sheet presentation and dismissal, errors, status updates, localization, font scaling, animations, RTL, contrast, touch targets.
5. Platform assistive technology support: TalkBack, Switch Access, Voice Access, Select to Speak, keyboard/D-pad focus, font scale, bold/high-contrast text, Color correction/inversion, Remove animations.

## Jetpack Compose Checklist

### Semantics and Activation

- `Modifier.clickable`, `Modifier.combinedClickable`, or a custom `pointerInput` gesture used as a control on a `Box`/`Row`/`Column`/`Text`/`Image` without a `role` (`Role.Button`, `Role.Checkbox`, etc.) or an accessible name.
- Icon-only `IconButton`, `Icon`, toolbar action, or custom control whose `contentDescription` is `null` or empty when it is informative/actionable.
- Decorative `Image`/`Icon` exposed to TalkBack (non-null `contentDescription`) when it conveys nothing, or informative imagery with `contentDescription = null`.
- Combined visual groups missing an intentional grouping strategy (`Modifier.semantics(mergeDescendants = true)`) where a row/card should read as one element, or over-merged groups (`clearAndSetSemantics`) that swallow separately actionable controls or important values.
- State not exposed for selected, expanded, checked, disabled, loading, progress, or current-item states (`Modifier.toggleable`, `Modifier.selectable`, `stateDescription`, `Role` with state, `enabled = false`).
- Custom actions (swipe, long-press, drag) not reachable through `Modifier.semantics { customActions = ... }` / `onClick(label)` / `onLongClick(label)` when the visual gesture is the only path.
- `onClickLabel`/`onLongClickLabel` omitted on `Modifier.clickable`/`combinedClickable` where the action is non-obvious from the visible label.

### Names, Hints, Values, and Localization

- `TextField`/`OutlinedTextField` (or `BasicTextField`) without a `label`/persistent programmatic label, relying on `placeholder` only.
- Help/error text not connected to the field via nearby text, `supportingText`, `isError` + `stateDescription`, or a clear announcement strategy.
- Hardcoded visible strings or `contentDescription`/semantics strings written as Kotlin literals instead of `stringResource(...)`/`pluralStringResource(...)`.
- `contentDescription` or `stateDescription` that repeats the role or duplicates the visible `Text` instead of adding meaning, or placeholder names like "button"/"image"/"icon".
- Dynamic values, counts, dates, prices, durations, or percentages not localized or not exposed as understandable accessibility values (`stateDescription`/`progressBarRangeInfo`).

### Navigation, Modals, and Dynamic Updates

- Screen lacks a clear app bar/toolbar title or first meaningful heading; a visual title `Text` is not marked `Modifier.semantics { heading() }`.
- Custom back/up/close controls lack accessible names or expected activation.
- `Dialog`, `AlertDialog`, `ModalBottomSheet`, or custom overlay lacks a focus/announcement strategy after presentation/dismissal; focus should move into the modal on open and return to the trigger on dismiss. Native `AlertDialog`/`ModalBottomSheet` manage modality and background inertness — do not flag those for the background-hiding concern, but do flag missing/empty titles and unnamed actions.
- Composition/source order that does not match intended reading order without `Modifier.semantics { isTraversalGroup = true }` / `traversalIndex`. Rendered order is runtime-only, but a clearly mis-ordered source is a static finding.
- Async loading, success, failure, validation, or Snackbar updates lack a `Modifier.semantics { liveRegion = LiveRegionMode.Polite }` or announcement strategy, so they are silent for TalkBack. Whether the announcement actually fires is runtime-only.
- `LazyColumn`/`LazyRow`/`LazyGrid` rows/cards have unclear labels, fragmented values, missing actions, or poor reading order.

### Font Scaling, Layout, and Visual Settings

- Text sized in `dp`/hardcoded pixels instead of `sp`, or text/containers wrapped in fixed `Modifier.height(...)`/`Modifier.size(...)` likely to clip at large `fontScale`.
- `maxLines = 1` + `TextOverflow.Ellipsis` (or `softWrap = false`) on important labels, values, errors, or buttons where the full text matters.
- Dense `Row` compositions combining multiple `Text`, icons, badges, and controls without wrapping or vertical fallback.
- `Modifier.size(...)` smaller than 48dp on touch targets, or interactive elements missing `Modifier.minimumInteractiveComponentSize()`.
- Color alone used to communicate status, required/error state, selection, chart segments, or availability (`color = Color.Red` errors without text/icon).
- Animations without a Reduce/Remove-animations consideration (`Settings.Global.ANIMATOR_DURATION_SCALE` / accessibility "Remove animations").
- Custom theme/disabled/placeholder/chart/dark-theme colors requiring runtime contrast verification.
- RTL-sensitive layouts using absolute `Alignment.Start` assumptions, `padding(start/end)` mistakes, or directional icons not considered for mirroring.

### Compose Font-Scale Static Risk Signals

Flag these as font-scale clipping/overlap risks when they affect user-facing text, controls, rows, cards, or form content. Do not claim the UI definitely overlaps from static code alone; phrase findings as "Large font sizes may cause clipping or overlap" and use `RUNTIME-CHECK` unless the required fix clearly changes visual layout, in which case use `VISUAL-IMPACT`.

- `fontSize = N.dp` or text sizes that bypass `sp`/`TextUnit`, custom `TextStyle` with non-scaling units.
- `Modifier.height(...)`, `Modifier.size(...)`, fixed `Modifier.requiredSize/requiredHeight`, or small fixed containers around `Text`, `Button`, list rows, cards, toolbars, or badges.
- `maxLines = 1`/low `maxLines` with `TextOverflow.Ellipsis`/`TextOverflow.Clip`, or `softWrap = false`, where the full value is important.
- `Modifier.clipToBounds`, fixed overlays, `Modifier.offset(...)`, `Box` stacking text/badges/controls without flexible space.
- Dense `Row`/`FlowRow` compositions mixing multiple text values, icons, badges, and buttons without wrapping or vertical fallback.
- Design-system `Text` wrappers that hardcode size/line height or hide Compose text params from callers.
- `LazyColumn`/`LazyRow` item composables with fixed item heights whose text/state changes dynamically.

## Android Views (XML) Checklist

### Semantics and Activation

- Custom `View`/`ImageView`/`TextView`/`ViewGroup` with an `OnClickListener` or touch handling used as a control without `android:focusable="true"`, `android:clickable="true"`, an accessible name, and an exposed role/action (often needs `AccessibilityDelegate`/`AccessibilityNodeInfo`).
- `ImageView`/`ImageButton`/`FloatingActionButton` (icon-only) without `android:contentDescription`, or `android:contentDescription="@null"` on an informative image.
- Decorative `ImageView`/`View` exposed to TalkBack instead of `android:importantForAccessibility="no"` (or `"noHideDescendants"` to hide a whole subtree).
- Incorrect or missing roles/state: action controls not exposed as buttons, selected/checked/expanded/disabled state not communicated; custom toggles that never update `AccessibilityNodeInfo`.
- Important grouped information not exposed coherently, or interactive children hidden inside an over-broad grouped node.

### Forms, Errors, and Data Entry

- `EditText`/`AutoCompleteTextView`/`TextInputEditText` without a paired label wired via `android:labelFor` on the visible `TextView`, or a `TextInputLayout` without an `android:hint`/label, relying on `android:hint` as the only accessible name when it disappears on entry.
- Validation errors shown visually but not surfaced via `TextInputLayout.setError(...)`/`EditText.setError(...)`, not announced, and not associated with the field.
- Missing `android:inputType`, `android:autofillHints`, `android:imeOptions`, or content type where relevant to accessibility and usability.
- Required/optional, disabled, or formatting constraints not communicated to assistive technology.

### Lists, RecyclerView, and Custom Layouts

- `RecyclerView`/`ListView` rows with fragmented labels, confusing reading order, hidden values, or missing custom actions for row actions (swipe/overflow).
- Swipe actions, context menus, reorder/delete, or expandable rows not exposed to TalkBack (no `AccessibilityNodeInfo.AccessibilityAction`).
- Custom drawing (`onDraw`/`Canvas`), chart, map, or calendar views lacking a text alternative, data summary, or accessible interaction model.
- Recycled rows that do not reset `contentDescription`, state, or `AccessibilityNodeInfo` on bind, leaking stale labels.

### XML Layouts, Menus, and Generated UI

- Static `TextView`/`Button`/`ImageView`/`ImageButton` in `res/layout/*.xml` and `res/menu/*.xml` with hardcoded `android:text`/`android:title`/`android:contentDescription` literals instead of `@string/...`, so they never localize.
- Headings not marked with `android:accessibilityHeading="true"` where a `TextView` is a visual section/screen title.
- Controls relying on visual order that may not match TalkBack order after inflation (`android:accessibilityTraversalBefore`/`After` absent where reorder is needed).
- Live/dynamic regions without `android:accessibilityLiveRegion`.
- Touch targets below 48dp (`android:layout_width`/`height`, `minWidth`/`minHeight`), and icon-only controls without `android:padding`/`minHeight` to reach target size.
- Text sized in `dp`/`px` instead of `sp` (`android:textSize="14dp"`), fixed `android:layout_height` around text, `android:maxLines="1"` + `android:ellipsize`, `android:singleLine="true"`, or `android:textAlignment`/`Left`/`Right` instead of `Start`/`End`.

## Runtime-Only Checks

Mark `RUNTIME-CHECK` when static code cannot prove the issue:

- TalkBack announcement, traversal/reading order, grouping, and custom action behavior.
- Switch Access and Voice Access reachability/name matching.
- D-pad/keyboard focus order and activation.
- font scale layout at large sizes and "Display size" changes — clipping, overlap, scrollability.
- touch target measurements and gesture conflict behavior.
- color contrast, dark theme contrast, Color correction/inversion, disabled/placeholder contrast.
- Remove/Reduce animations behavior and alternatives.
- dialog/sheet focus and background inertness after presentation/dismissal.
- inflated XML output, ConstraintLayout results, recycled row state, and third-party/`WebView`/chart/map/media behavior.
- camera/scanner flows and permission/system dialogs.

## Finding Rules

- Include problems only; do not list accessible elements.
- Every finding must reference code or XML markup that was actually read.
- Prefer native Compose/Material and Material Components semantics and platform accessibility APIs before custom `AccessibilityDelegate` workarounds.
- Do not invent TalkBack output, inflated layout, contrast measurements, touch target dimensions, or confirmed font-scale overlap/clipping.
- When static code shows `dp`/`px` text sizing, fixed heights, truncation, clipping, absolute positioning, sub-48dp targets, or constrained recycled rows, report it as a font-scale/touch-target risk and require emulator/device verification at large font and display sizes.
- Never recommend placeholder labels such as `button`, `image`, `icon`, or `view`.
- Accessible names must be specific, localized (via `strings.xml`/`stringResource`), and action- or content-oriented.
- If a fix may change layout, gestures, navigation, state, or public component API, classify it as `VISUAL-IMPACT` or `FUNCTIONAL-RISK`.
- Do not claim Play Store, WCAG, or platform compliance; report verified findings and residual risk only.

## Output

Write `Binclusive-auditing/accessibility-todo.md` and a dated archive copy. Use `accessibility-todo-format.md` for the exact structure. In the platform impact field or problem text, connect findings to relevant WCAG principles and Android platform behavior such as TalkBack, Switch Access, Voice Access, font scaling, Remove animations, RTL, or localization.
