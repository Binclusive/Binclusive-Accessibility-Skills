# React Native Pattern Catalog

This catalog contains anonymized, reusable accessibility patterns only. Do not add customer names, app identifiers, domains, internal URLs, proprietary screen names, ticket IDs, business copy, screenshots, or exact customer source paths.

## Pattern Entry Template

```md
### PATTERN-RN-001: Short title
- Platform: React Native
- Framework: React Native | Expo
- Component type: Pressable | Input | Cell | Modal | Chart | etc.
- WCAG / Platform: WCAG 2.1.1, 4.1.2, VoiceOver/TalkBack, font scaling, etc.
- Severity default: Critical | Serious | Moderate | Minor
- Fix type default: SAFE | VISUAL-IMPACT | FUNCTIONAL-RISK | RUNTIME-CHECK
- Bad shape: anonymized description of the recurring code/UX problem
- Detection hints: grep/search/static cues
- Correct fix: preferred React Native implementation pattern
- Verification: VoiceOver, TalkBack, Switch Control, Voice Control, font scaling, runtime notes
- False positives / exceptions: when not to flag
```

## Seed Patterns

### PATTERN-RN-001: Pressable or gesture-only control lacks semantics
- Platform: React Native
- Framework: React Native | Expo
- Component type: Pressable / Touchable / Gesture target / Card action
- WCAG / Platform: WCAG 2.1.1 Keyboard, WCAG 4.1.2 Name/Role/Value, VoiceOver/TalkBack activation
- Severity default: Critical
- Fix type default: FUNCTIONAL-RISK
- Bad shape: A `Pressable`, `Touchable*`, gesture handler, row, card, icon wrapper, or custom component performs an action without an accessible name, role, state, or accessible activation path.
- Detection hints: `onPress`, `onLongPress`, gesture handlers, row/card wrappers, `TouchableWithoutFeedback`, missing `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, and accessible alternative for gesture-only actions.
- Correct fix: Use a semantic React Native control pattern with localized name, accurate role, state/value, disabled handling, and accessible custom actions where gestures expose hidden behavior.
- Verification: VoiceOver/TalkBack reaches the element, announces name/role/state, and activates it with the standard gesture; Switch Control/Voice Control can target it where applicable.
- False positives / exceptions: Do not flag passive containers when an inner accessible control is the actual target and the wrapper handler is redundant/delegated.

### PATTERN-RN-002: Icon-only control without accessible name
- Platform: React Native
- Framework: React Native | Expo
- Component type: Icon button / header action / tab action / row action
- WCAG / Platform: WCAG 4.1.2 Name/Role/Value, VoiceOver/TalkBack, Voice Control
- Severity default: Serious
- Fix type default: SAFE when adding a localized label; FUNCTIONAL-RISK when changing control structure.
- Bad shape: A pressable icon, vector icon, image button, header button, floating action button, or row action has no meaningful accessible name.
- Detection hints: icon-only children inside `Pressable`, `Touchable*`, `Button`, custom header actions, vector icon components, `Image` controls, missing `accessibilityLabel` or localized text.
- Correct fix: Provide a localized accessible name that describes the action or content; hide decorative icons/images from assistive technologies when needed.
- Verification: VoiceOver/TalkBack announces the intended action and role; Voice Control can target the control by a meaningful name.
- False positives / exceptions: Do not add a label that conflicts with visible text; prefer visible localized text when one exists.

### PATTERN-RN-003: Field uses placeholder as its only label
- Platform: React Native
- Framework: React Native | Expo
- Component type: TextInput / Search / Select / Picker
- WCAG / Platform: WCAG 1.3.1 Info and Relationships, WCAG 3.3.2 Labels or Instructions, mobile screen reader forms
- Severity default: Serious
- Fix type default: SAFE
- Bad shape: An input relies on placeholder text as the only field name, so context may disappear after entry or be unclear in review mode.
- Detection hints: `TextInput` with `placeholder` but no nearby persistent label, no `accessibilityLabel`, or no design-system field label; custom select/search wrappers that only expose placeholder text.
- Correct fix: Provide a persistent visible label or a programmatic localized label tied to the field context; connect help/error text through clear nearby text, announcement, or field-level accessibility description where appropriate.
- Verification: VoiceOver/TalkBack announces the field name, value, role, and relevant help/error context before and after text entry.
- False positives / exceptions: Compact search controls can be acceptable when a clear localized programmatic label remains available.

### PATTERN-RN-004: Font scaling clipping risk
- Platform: React Native
- Framework: React Native | Expo
- Component type: Text / Button / Cell / Card / Form row / Header
- WCAG / Platform: WCAG 1.4.4 Resize Text, mobile font scaling / Dynamic Type
- Severity default: Serious
- Fix type default: RUNTIME-CHECK by default; VISUAL-IMPACT when layout changes are required.
- Bad shape: Text or controls disable scaling, use restrictive max multipliers, fixed dimensions, absolute positioning, dense horizontal layouts, one-line assumptions, truncation, or custom typography that may not scale at large font sizes.
- Detection hints: `allowFontScaling={false}`, `allowFontScaling: false`, low `maxFontSizeMultiplier`, `numberOfLines={1}`, `ellipsizeMode`, fixed `height`/`maxHeight`/`width`, fixed `lineHeight`, `position: 'absolute'`, `top`/`left`/`right`/`bottom`, dense `flexDirection: 'row'`, fixed-size `FlatList`/`SectionList` items, custom `Text` wrappers with hardcoded `fontSize` or hidden text props.
- Correct fix: Allow platform font scaling, avoid restrictive multipliers for important content, use flexible layout and multiline text, provide vertical fallback for dense rows, avoid absolute positioning around dynamic text, and ensure typography wrappers pass through scaling props intentionally.
- Verification: Runtime check with large iOS Dynamic Type and Android font/display size confirms text, controls, row/card contents, and focus outlines remain usable without clipping or overlap.
- False positives / exceptions: Do not flag fixed-size decorative text that is not user-facing or accessibility-relevant. Do not state that overlap is confirmed unless a runtime screenshot, simulator/device check, or rendered output proves it.

### PATTERN-RN-005: Modal or bottom sheet lacks accessible modal strategy
- Platform: React Native
- Framework: React Native | Expo
- Component type: Modal / BottomSheet / Drawer / Overlay
- WCAG / Platform: WCAG 2.4.3 Focus Order, WCAG 4.1.2 Name/Role/Value, mobile screen reader modal behavior
- Severity default: Serious
- Fix type default: RUNTIME-CHECK
- Bad shape: A modal, bottom sheet, drawer, or overlay opens without clear title, close action, focus/background strategy, or accessibility props that prevent users from navigating stale background content where supported.
- Detection hints: `Modal`, bottom-sheet libraries, portal overlays, custom drawers, missing accessible title/close label, missing `accessibilityViewIsModal`, `accessibilityElementsHidden`, or `importantForAccessibility` strategy.
- Correct fix: Provide a named modal region/screen, localized close action, predictable focus/announcement behavior, and hide or deprioritize background content using platform-supported props where appropriate.
- Verification: Runtime VoiceOver/TalkBack checks confirm users enter, understand, dismiss, and do not accidentally navigate hidden background content.
- False positives / exceptions: Native navigation modals may provide part of the behavior, but final behavior still needs runtime verification.

### PATTERN-RN-006: Color-only status or state
- Platform: React Native
- Framework: React Native | Expo
- Component type: Badge / Status / Validation / Chart / Selection
- WCAG / Platform: WCAG 1.4.1 Use of Color, Differentiate Without Color, Increase Contrast
- Severity default: Serious
- Fix type default: VISUAL-IMPACT
- Bad shape: Status, selection, validation, chart categories, or availability are communicated only through color.
- Detection hints: color-coded badges, red/green states without text/icon, chart legends by color only, selected state shown only by tint, error text implied only by color.
- Correct fix: Add text, icon shape, pattern, state, or accessible value that communicates the same information without relying on color alone.
- Verification: Inspect visually with relevant contrast/color settings where applicable and verify VoiceOver/TalkBack announces the state.
- False positives / exceptions: Color can remain as redundant reinforcement when text, icon shape, or accessible state already communicates the meaning.

### PATTERN-RN-007: Custom wrapper component lacks semantics
- Platform: React Native
- Framework: React Native | Expo
- Component type: Custom wrapper / Design-system control (IconButton, PrimaryButton, Card action)
- WCAG / Platform: WCAG 4.1.2 Name/Role/Value, WCAG 1.3.1 Info and Relationships, VoiceOver/TalkBack
- Severity default: Serious; Critical when the wrapper is icon-only
- Fix type default: SAFE when adding name/role at the definition; FUNCTIONAL-RISK when changing structure or adding handlers.
- Bad shape: A project-owned interactive wrapper around `Pressable`/`Touchable*` is used without an accessible name, role, or state. Because the omission lives in the wrapper definition, it repeats at every call site and is invisible to tag-name detection.
- Detection hints: custom components with `onPress` that wrap `Pressable`/`Touchable*`; missing `accessibilityRole`/`accessibilityLabel` in the component definition; `{...props}` forwarding; one wrapper with many call sites.
- Correct fix: Add the name/role/state at the component definition so one change repairs all usages. Where the wrapper forwards props, leave compliant call sites and flag only the usages that omit the name.
- Verification: VoiceOver/TalkBack announces name/role/state at representative call sites; confirm forwarded props still reach the underlying primitive.
- False positives / exceptions: Do not flag a passive wrapper when an inner accessible control is the real target and the wrapper handler is redundant or delegated.

### PATTERN-RN-008: Content hidden from assistive technology incorrectly
- Platform: React Native
- Framework: React Native | Expo
- Component type: Decorative node / Container / Overlay
- WCAG / Platform: WCAG 1.1.1 Non-text Content, WCAG 1.3.1, 4.1.2, VoiceOver/TalkBack
- Severity default: Moderate when decorative content is exposed; Serious when a real control is hidden
- Fix type default: SAFE when hiding a genuinely decorative leaf; FUNCTIONAL-RISK when a hiding prop or over-broad grouping removes a real control.
- Bad shape: Decorative content is exposed to assistive technology, or a hiding prop / over-broad `accessible={true}` grouping removes a real control or its semantics. `accessible={true}` groups children into one element; the wrong platform prop hides too much or too little.
- Detection hints: decorative `View`/vector icon/illustration/duplicated-text without hiding; `accessible={true}` on a region containing multiple controls; `accessibilityElementsHidden` or `importantForAccessibility="no-hide-descendants"` wrapping interactive content; only one of the iOS/Android hiding props present for cross-platform decoration.
- Correct fix: Hide genuinely decorative content with the correct platform props (iOS `accessibilityElementsHidden`, Android `importantForAccessibility="no-hide-descendants"`), usually both for cross-platform. Reserve `accessible={true}` grouping for a single atomic, non-interactive unit; never leave a real control inside a hidden subtree.
- Verification: VoiceOver and TalkBack skip the decorative node and still reach every real control with its own name, role, and state.
- False positives / exceptions: Grouping is correct when the children form a single non-interactive unit (for example a label-and-value pair with no inner action).

### PATTERN-RN-009: Tabs, adjustable controls, or headings missing widget semantics
- Platform: React Native
- Framework: React Native | Expo
- Component type: Tabs / Slider / Stepper / Section header
- WCAG / Platform: WCAG 4.1.2 Name/Role/Value, WCAG 1.3.1, VoiceOver/TalkBack heading navigation and adjustable actions
- Severity default: Serious
- Fix type default: SAFE to annotate role/state/value; FUNCTIONAL-RISK when wiring adjustable increment/decrement actions.
- Bad shape: A tab bar, adjustable control, or section title does not expose its widget semantics — tabs lack `accessibilityRole="tab"` and a selected state, sliders/steppers lack `accessibilityRole="adjustable"` and `accessibilityValue`, or a visual title lacks `accessibilityRole="header"`.
- Detection hints: tab bars without per-tab `accessibilityRole="tab"` or `accessibilityState={{ selected }}`; sliders/steppers without `accessibilityRole="adjustable"`/`accessibilityValue`; visually styled titles (`Text`) without `accessibilityRole="header"`.
- Correct fix: Annotate each tab with the tab role and a live selected state (container `tablist`), adjustable controls with the adjustable role plus `accessibilityValue` (`{ min, max, now, text }`) and `accessibilityActions`/`onAccessibilityAction`, and section titles with the header role.
- Verification: VoiceOver/TalkBack announces the tab role and the selected tab, the adjustable value and its increment/decrement, and reaches titles via heading navigation.
- False positives / exceptions: Do not add a header role to non-title text, and do not duplicate a role a native control already provides.