# React Native Accessibility Audit Notes

Use this reference only for React Native or Expo applications. Pair it with the selected Binclusive project map and the React Native pattern catalog when available. The auditor observes and documents only; it never edits source code.

## Privacy Boundary

User-provided audit documents may be read as inspiration during skill creation only. Do not copy customer data into skill resources. Store only anonymized, reusable patterns. Do not persist real customer names, app identifiers, domains, internal URLs, proprietary screen names, ticket IDs, business copy, screenshots, or exact customer source paths from customer artifacts.

## Required Input

Read a selected `Binclusive-auditing/*_project-map.md` first. It is the source of truth for scope. If no map exists, stop and ask the user to run `map-project` first.

Audit only the mapped React Native screens, flows, components, native wrappers, and platform features. If the map marks an area as runtime-only, carry that limitation into the finding or summary.

## Audit Order

1. Inline interactive UI in mapped screens, route files, custom headers, list items, forms, modals, and native-wrapper components.
2. Shared interactive components: Pressable/Button, Touchable, Link, TextInput, Select/Picker, Checkbox, Radio, Switch, Slider, Dialog/Modal, BottomSheet, Menu, Tabs, custom gesture targets.
3. Shared display components: Text, Image/Icon, Avatar, List/FlatList/SectionList, Card/Row, Chart, Map, Skeleton, Loading, Badge, Toast/Banner, WebView, Media controls.
4. Screen-level patterns: screen titles, focus/reading order, modal presentation/dismissal, errors, status updates, localization, font scaling, reduce motion, RTL, contrast, touch targets.
5. Platform assistive technology behavior: VoiceOver/TalkBack, Switch Control, Voice Control, keyboard/accessibility focus, Dynamic Type/font scale, Bold Text, Button Shapes, Increase Contrast, Differentiate Without Color, Reduce Motion.

## React Native Checklist

### Semantics and Activation

- `Pressable`, `Touchable*`, gesture handler, row/card, icon, or custom wrapper used as a control without a meaningful accessible name, role, state, and activation behavior.
- `TouchableWithoutFeedback` or gesture-only interaction that hides intent from assistive technology users.
- Action controls exposed with the wrong `accessibilityRole`, missing `accessibilityState`, or missing disabled/selected/expanded/checked/busy state.
- Image/icon-only controls without localized `accessibilityLabel`, or decorative icons/images exposed unnecessarily.
- Row/card controls that combine multiple visual labels, values, and actions without a coherent accessibility summary or separate actionable children where needed.
- Swipe, long-press, drag/drop, context menu, or hidden row actions without an accessible alternative such as `accessibilityActions` and `onAccessibilityAction` where supported.

### Custom and Wrapper Components

- A project-owned interactive wrapper (`IconButton`, `PrimaryButton`, `Card` with an `onPress`, or any component wrapping `Pressable`/`Touchable*`) used without an accessible name, role, or state. The omission usually lives in the wrapper definition, not the call site, so it repeats at every usage.
- Report the finding at the component **definition** (its file and line) rather than at each call site; one fix there repairs every usage. Quote the definition.
- When the wrapper forwards props (`{...props}`) and a call site supplies the name/role itself, that call site is fine — flag only the usages that omit it.
- A wrapper that hardcodes a press handler but never exposes `accessibilityRole`/`accessibilityLabel` is the same prop-add, applied once at the definition.

### Hiding Content from Assistive Technology

React Native has several distinct hiding mechanisms with different platform behavior; name the right one for the platform and the intent.

- `accessible={true}` on a container **groups its children into a single element**, so the children are no longer individually focusable. This is correct for one atomic, non-interactive unit, but applying it to a region that contains multiple controls hides each control's own name, role, and state. Flag over-grouping that swallows real controls.
- `importantForAccessibility="no"` (Android/TalkBack) hides the element but **not** its descendants; `"no-hide-descendants"` hides the element and its whole subtree.
- `accessibilityElementsHidden={true}` (iOS/VoiceOver) hides the element and its descendants from VoiceOver.
- Genuinely decorative content (a decorative `View`, vector icon, illustration, or duplicated-text node) usually needs **both** the iOS and Android props to be hidden cross-platform; do not assume one prop hides it on every platform.
- Inverse failure: a hiding prop (`accessibilityElementsHidden`, `importantForAccessibility="no-hide-descendants"`, or an over-broad `accessible={true}`) placed on a node that **wraps a real control** silently removes that control from assistive technology. Flag it and classify as `FUNCTIONAL-RISK`; do not blind-fix, because the correct boundary depends on intent.

### Composite Widgets and Headings

- A `Text` that is visually a screen or section title should carry `accessibilityRole="header"` so VoiceOver/TalkBack heading and rotor navigation can reach it; visual weight alone does not expose a heading.
- Each tab in a tab bar should expose `accessibilityRole="tab"` with `accessibilityState={{ selected: <live value> }}`, and the container may use `accessibilityRole="tablist"`. Verify the selected state tracks the actual active tab, not a hardcoded value.
- Adjustable controls (sliders, steppers) should use `accessibilityRole="adjustable"` with `accessibilityValue` (`{ min, max, now, text }`) and handle increment/decrement through `accessibilityActions`/`onAccessibilityAction`. Annotating the value is low risk; wiring the actions changes behavior.

### Names, Hints, Values, and Localization

- `TextInput`, picker/select, search, secure input, checkbox/radio/switch, slider, or custom field without a persistent visible/programmatic label.
- Placeholder used as the only accessible name or field context.
- Help/error text not connected through clear nearby text, announcement, focus movement, or field-level accessibility description.
- Hardcoded visible strings, `accessibilityLabel`, `accessibilityHint`, `accessibilityValue`, image labels, placeholders, alerts, toasts, and navigation titles outside localization resources.
- Hints that repeat the role or visible label instead of explaining non-obvious outcomes.
- Dynamic values, counts, dates, prices, durations, or percentages not localized or not exposed as understandable accessibility values.

### Navigation, Modals, and Dynamic Updates

- Screen lacks a clear title, route title, or first meaningful heading/summary.
- Custom back/close/header controls lack accessible names or expected activation behavior.
- Modal, bottom sheet, alert, drawer, popover, or custom overlay lacks modal semantics/focus strategy, dismissal announcement, or background hiding strategy where supported.
- Async loading, success, failure, validation, or toast/banner updates lack an announcement/live-region strategy. Concretely: an update appears without `accessibilityLiveRegion="polite"` (Android) or an `AccessibilityInfo.announceForAccessibility(...)` call (cross-platform), so it is silent for screen-reader users. Whether the announcement actually fires is runtime-only.
- Custom modal/overlay (not a native `Modal`, or a `Modal` with a custom backdrop) omits `accessibilityViewIsModal={true}` (iOS) or a background-hiding strategy (Android), letting focus escape behind the dialog. On open, focus should move in via `AccessibilityInfo.setAccessibilityFocus(reactTag)` and return to the trigger on close; that the focus lands correctly is runtime-only.
- Programmatic navigation or content replacement leaves screen reader focus in stale or confusing context.
- Third-party navigation, bottom sheet, picker, calendar, chart, map, and webview components require runtime verification for final focus order and announcements.

### Font Scaling, Layout, and Visual Settings

- User-facing `Text`, text-bearing controls, rows, cards, or form content disable scaling with `allowFontScaling={false}` or equivalent design-system defaults.
- `maxFontSizeMultiplier` is set too low for important content without a documented exception.
- `numberOfLines`, aggressive ellipsizing, fixed width/height, dense horizontal rows, or absolute positioning may clip or overlap content at large font sizes.
- Styles use fixed `height`, `maxHeight`, `width`, `lineHeight`, `top/left/right/bottom`, `position: 'absolute'`, or manual dimensions around dynamic text and controls.
- Dense `flexDirection: 'row'` card/list/form layouts combine multiple `Text` nodes, icons, badges, and actions without wrapping or vertical fallback.
- Custom typography wrappers use fixed font sizes or line heights without respecting platform font scale.
- Color alone communicates status, required/error state, selection, chart segments, or availability.
- Motion/animation lacks Reduce Motion consideration.
- Custom contrast, disabled state, placeholder, chart, or dark mode colors require runtime contrast verification.
- RTL-sensitive layouts use left/right style props or directional icons without mirroring strategy.

## Font Scaling Static Risk Signals

Flag these as font-scale clipping/overlap risks when they affect user-facing text, controls, rows, cards, or form content. Do not claim the UI definitely overlaps from static code alone; phrase findings as "Large font sizes may cause clipping or overlap" and use `RUNTIME-CHECK` unless the required fix clearly changes visual layout, in which case use `VISUAL-IMPACT`.

React Native risk signals:

- `allowFontScaling={false}`, `allowFontScaling: false`, design-system typography defaults that disable scaling, or wrappers that do not pass scaling props through.
- `maxFontSizeMultiplier` set to a restrictive value for body, form, row, or action text without a clear exception.
- `numberOfLines={1}`, low `numberOfLines`, ellipsize/truncation on important labels, values, errors, helper text, navigation titles, or buttons.
- Fixed `height`, `maxHeight`, `minHeight`, `width`, `maxWidth`, fixed card/list item sizes, fixed toolbar/header/footer sizes, or fixed `lineHeight` around dynamic text.
- `position: 'absolute'`, `top`, `left`, `right`, `bottom`, transform offsets, overlays, badges, or stacked text/control layouts without flexible space.
- Dense `flexDirection: 'row'`, `nowrap`-like layouts, or row/card compositions with multiple `Text` values, icons, badges, buttons, and controls without wrapping or vertical fallback.
- Custom `Text`/typography components that hardcode `fontSize`, `lineHeight`, or scaling behavior while hiding RN text props from callers.
- `FlatList`, `SectionList`, or virtualized row renderers with fixed item heights or reused cells whose text/accessibility state changes dynamically.
- Platform-specific files or `Platform.select` branches that disable scaling or use fixed sizing on only one platform.

## Runtime-Only Checks

Mark `RUNTIME-CHECK` when static code cannot prove the issue:

- VoiceOver/TalkBack announcement, reading order, grouping, and custom action behavior.
- Switch Control and Voice Control reachability/name matching.
- keyboard/accessibility focus order and activation.
- large font scale/Dynamic Type layout, clipping, overlap, and scrollability.
- touch target measurements and gesture conflict behavior.
- color contrast, dark mode contrast, Increase Contrast, disabled/placeholder contrast.
- Reduce Motion behavior and animation alternatives.
- modal/bottom-sheet/drawer focus behavior and background hiding.
- rendered third-party UI behavior, virtualized list output, reused row state, native modules, WebView content, charts, maps, media controls, camera/scanner flows, and permission/system dialogs.

## Finding Rules

- Include problems only; do not list accessible elements.
- Every finding must reference code that was actually read.
- Prefer React Native primitives and platform accessibility props before custom accessibility workarounds.
- Do not invent VoiceOver/TalkBack output, rendered layout, contrast measurements, touch target dimensions, or confirmed font-scale overlap/clipping.
- When static code shows disabled scaling, restrictive multipliers, fixed sizing, truncation, absolute positioning, dense rows, non-scaling fonts, or constrained list items, report it as a font-scale risk and require simulator/device verification at large font sizes.
- Never recommend placeholder labels such as `button`, `image`, `icon`, or `view`.
- Accessible names must be specific, localized, and action- or content-oriented.
- If a fix may change layout, gestures, navigation, state, or public component API, classify it as `VISUAL-IMPACT` or `FUNCTIONAL-RISK`.
- Do not claim App Store, Play Store, WCAG, or platform compliance; report verified findings and residual risk only.

## Output

Write `Binclusive-auditing/accessibility-todo.md` and a dated archive copy. Use `accessibility-todo-format.md` for the exact structure. In the platform impact field or problem text, connect findings to relevant WCAG principles and mobile platform behavior such as VoiceOver, TalkBack, Switch Control, Voice Control, font scaling, Reduce Motion, RTL, or localization.