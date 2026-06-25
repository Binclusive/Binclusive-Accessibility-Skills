# Android Pattern Catalog

This catalog contains anonymized, reusable accessibility patterns only. Do not add customer names, application IDs, package names, domains, internal URLs, proprietary screen names, ticket IDs, business copy, screenshots, or exact customer source paths. Native Android (Kotlin/Java, Jetpack Compose, Android Views/XML) only; React Native Android patterns live in `react-native-patterns.md`.

## Pattern Entry Template

```md
### PATTERN-AND-001: Short title
- Platform: Android
- Framework: Compose | Views (XML) | Mixed
- Component type: Button | Input | Row | Dialog | Chart | etc.
- WCAG / Platform: WCAG 2.1.1, 4.1.2, TalkBack, font scaling, etc.
- Severity default: Critical | Serious | Moderate | Minor
- Fix type default: SAFE | VISUAL-IMPACT | FUNCTIONAL-RISK | RUNTIME-CHECK
- Bad shape: anonymized description of the recurring code/UX problem
- Detection hints: grep/search/static cues
- Correct fix: preferred Compose/View implementation pattern
- Verification: TalkBack, Switch Access, Voice Access, font scaling, runtime notes
- False positives / exceptions: when not to flag
```

## Seed Patterns

### PATTERN-AND-001: Clickable modifier or gesture-only control lacks semantics
- Platform: Android
- Framework: Compose
- Component type: Button-like custom control
- WCAG / Platform: WCAG 2.1.1 Keyboard, WCAG 4.1.2 Name/Role/Value, TalkBack activation
- Severity default: Critical
- Fix type default: FUNCTIONAL-RISK
- Bad shape: A `Box`, `Row`, `Column`, `Text`, or `Image` uses `Modifier.clickable`, `Modifier.combinedClickable`, or a custom `pointerInput` gesture as an action control without a `Role` or accessible name.
- Detection hints: `Modifier.clickable`/`combinedClickable`/`pointerInput` on non-control composables; missing `role = Role.Button`, `contentDescription`, `onClickLabel`, and `Modifier.semantics`.
- Correct fix: Prefer `Button`/`IconButton`/`TextButton` for actions. If a custom container must stay clickable, add `Modifier.clickable(onClickLabel = stringResource(...)) { }` with `Modifier.semantics { role = Role.Button }` and a localized name; expose hidden gestures via `customActions`.
- Verification: TalkBack reaches the element, announces name and role, and activates it; Switch Access/Voice Access can also reach and trigger it.
- False positives / exceptions: Do not flag a passive container whose inner `Button`/`IconButton` is the real target and the outer click is redundant/delegated.

### PATTERN-AND-002: Icon-only control without accessible name
- Platform: Android
- Framework: Compose | Views (XML)
- Component type: Icon button / toolbar action / FAB / image control
- WCAG / Platform: WCAG 4.1.2 Name/Role/Value, TalkBack, Voice Access
- Severity default: Serious
- Fix type default: SAFE when adding a localized name; FUNCTIONAL-RISK when changing control structure.
- Bad shape: An `IconButton`/`Icon`/`FloatingActionButton`/`ImageButton` or image-based control has no meaningful accessible name.
- Detection hints: Compose `Icon(...)`/`IconButton(...)` with `contentDescription = null`/`""`; XML `<ImageButton>`/`<ImageView android:onClick>`/`<com.google.android.material.floatingactionbutton.FloatingActionButton>` with no `android:contentDescription` or `@null`.
- Correct fix: Provide a localized `contentDescription`/`android:contentDescription="@string/..."` describing the action or content; set `contentDescription = null` / `android:importantForAccessibility="no"` only for purely decorative icons backed by adjacent text.
- Verification: TalkBack announces the intended action and role; Voice Access can target the control by a meaningful name.
- False positives / exceptions: Do not add a name that duplicates adjacent visible text; prefer the visible localized label when one exists.

### PATTERN-AND-003: Field uses hint as its only label
- Platform: Android
- Framework: Compose | Views (XML)
- Component type: TextField / OutlinedTextField / EditText / TextInputLayout
- WCAG / Platform: WCAG 1.3.1 Info and Relationships, WCAG 3.3.2 Labels or Instructions, TalkBack forms
- Severity default: Serious
- Fix type default: SAFE
- Bad shape: An input relies on `placeholder`/`android:hint` as the only field name, so context disappears after entry or is unclear to TalkBack.
- Detection hints: Compose `TextField(..., placeholder = { Text(...) })` with no `label`; XML `<EditText android:hint="...">` with no `<TextView android:labelFor>` or a `TextInputLayout` whose label is empty.
- Correct fix: Compose — pass a `label = { Text(stringResource(...)) }`. Views — wrap in `TextInputLayout` with a persistent `android:hint` acting as a floating label, or wire a visible `<TextView android:labelFor="@id/field">`. Keep placeholder as a hint, not the name.
- Verification: TalkBack announces the field name, value, role, and error/help context before and after entry.
- False positives / exceptions: A compact search field can be acceptable when a clear localized programmatic label remains available.

### PATTERN-AND-004: Font-scale clipping risk
- Platform: Android
- Framework: Compose | Views (XML)
- Component type: Text / Button / Row / Card / Form row
- WCAG / Platform: WCAG 1.4.4 Resize Text, font scaling / Display size
- Severity default: Serious
- Fix type default: RUNTIME-CHECK by default; VISUAL-IMPACT when layout changes are required.
- Bad shape: Text or controls use `dp`/`px` font sizes, fixed heights, clipped containers, single-line truncation, or dense horizontal layouts that may not scale at large `fontScale`/Display size.
- Detection hints: Compose `fontSize = N.dp`, `Modifier.height(...)`/`Modifier.size(...)`/`requiredHeight(...)` around text, `maxLines = 1` + `TextOverflow.Ellipsis`, `softWrap = false`, `Modifier.clipToBounds`, dense `Row` text/icon/button stacks, design-system `Text` wrappers with non-scaling units. XML `android:textSize="14dp"`/`px`, fixed `android:layout_height` on text, `android:maxLines="1"` + `android:ellipsize`, `android:singleLine="true"`, and constrained `RecyclerView` row heights.
- Correct fix: Size text in `sp`/`TextUnit`, allow wrapping and flexible/`wrap_content` heights, provide vertical fallback for dense rows, and avoid single-line truncation for important values.
- Verification: Runtime check at large Font size and Display size confirms text, controls, and row/card contents remain usable without clipping or overlap.
- False positives / exceptions: Do not flag fixed-size decorative text that is not user-facing. Do not state overlap is confirmed without a device/emulator check or rendered output.

### PATTERN-AND-005: List/RecyclerView row has unclear TalkBack summary
- Platform: Android
- Framework: Compose | Views (XML)
- Component type: LazyColumn item / RecyclerView row / Card
- WCAG / Platform: WCAG 1.3.1 Info and Relationships, WCAG 2.4.6 Headings and Labels, TalkBack reading order
- Severity default: Moderate
- Fix type default: RUNTIME-CHECK when final row output is dynamic; SAFE when label/value composition is obvious.
- Bad shape: A row/card contains multiple visual labels, values, icons, and actions, but the accessible order or summary is fragmented, missing important values, or hides available actions.
- Detection hints: Compose nested stacks in `LazyColumn` items without `Modifier.semantics(mergeDescendants = true)`; XML custom rows with several `TextView`s and no grouping; recycled rows; row swipe/overflow actions.
- Correct fix: Group the row into a coherent element (`Modifier.semantics(mergeDescendants = true)` / a focusable container) with a combined label/value, keep separately actionable children reachable, and expose row actions via `customActions`/`AccessibilityNodeInfo.AccessibilityAction`.
- Verification: TalkBack reads representative rows in a meaningful order and exposes all actions without requiring visual gestures.
- False positives / exceptions: Do not over-merge rows that contain multiple independent controls; preserve separate controls when each has its own action.

### PATTERN-AND-006: Color-only state or status
- Platform: Android
- Framework: Compose | Views (XML)
- Component type: Badge / Status / Validation / Chart / Selection
- WCAG / Platform: WCAG 1.4.1 Use of Color, Color correction, high-contrast text
- Severity default: Serious
- Fix type default: VISUAL-IMPACT
- Bad shape: Status, selection, validation, chart categories, or availability are communicated only through color.
- Detection hints: Compose `color = Color.Red` errors without text/icon, tint-only selected state; XML `android:textColor`/`android:tint`-only status, chart legends keyed by color only.
- Correct fix: Add text, icon shape, pattern, state, or an accessible value (`stateDescription`) that communicates the same information without relying on color alone.
- Verification: Inspect with Color correction/inversion where applicable and confirm TalkBack announces the state.
- False positives / exceptions: Color can remain as redundant reinforcement when text, icon shape, or accessible state already communicates the meaning.

### PATTERN-AND-007: Decorative image exposed / informative image hidden
- Platform: Android
- Framework: Compose | Views (XML)
- Component type: Image / ImageView / vector drawable
- WCAG / Platform: WCAG 1.1.1 Non-text Content, TalkBack
- Severity default: Serious
- Fix type default: SAFE
- Bad shape: An informative image has no accessible name, or a purely decorative image is announced by TalkBack.
- Detection hints: Compose informative `Image(...)` with `contentDescription = null`; decorative `Image(...)` with a non-null description. XML informative `<ImageView>` with no `android:contentDescription`; decorative `<ImageView>` without `android:importantForAccessibility="no"`.
- Correct fix: For informative images add a localized `contentDescription`/`android:contentDescription="@string/..."`. For decorative images set Compose `contentDescription = null` or XML `android:importantForAccessibility="no"`.
- Verification: TalkBack describes informative images and skips decorative ones.
- False positives / exceptions: Do not hide an image that is the only carrier of information; do not label background decoration.

### PATTERN-AND-008: Visual title not exposed as a heading
- Platform: Android
- Framework: Compose | Views (XML)
- Component type: Section/screen title Text
- WCAG / Platform: WCAG 1.3.1, WCAG 2.4.6, TalkBack heading navigation
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: A `Text`/`TextView` is a visual section or screen title (large/bold) but is not exposed as a heading, so TalkBack heading navigation cannot jump to it.
- Detection hints: Compose title `Text(...)` without `Modifier.semantics { heading() }`; XML title `<TextView>` without `android:accessibilityHeading="true"`.
- Correct fix: Add `Modifier.semantics { heading() }` (Compose) or `android:accessibilityHeading="true"` (XML, API 28+; use `ViewCompat.setAccessibilityHeading` for back-compat).
- Verification: TalkBack heading navigation (swipe up/down with the heading rotor) lands on the title.
- False positives / exceptions: Do not mark every bold label as a heading; reserve it for genuine section/screen titles.

### PATTERN-AND-009: Touch target below 48dp
- Platform: Android
- Framework: Compose | Views (XML)
- Component type: Icon button / chip / compact control / row action
- WCAG / Platform: WCAG 2.5.8 Target Size (Minimum), Material 48dp guidance, Switch Access/Voice Access
- Severity default: Moderate
- Fix type default: VISUAL-IMPACT when layout changes; SAFE when only adding minimum-size padding.
- Bad shape: An interactive element renders smaller than the 48dp minimum, making it hard to hit for motor-impaired and switch users.
- Detection hints: Compose `Modifier.size(Ndp)` < 48dp on clickable elements, or interactive content missing `Modifier.minimumInteractiveComponentSize()`; XML `android:layout_width`/`height`/`minWidth`/`minHeight` below 48dp on buttons/icons.
- Correct fix: Use `Modifier.minimumInteractiveComponentSize()` or size the touch target to ≥48dp (icon can stay smaller with padding); in XML set `android:minWidth`/`android:minHeight="48dp"` and adequate padding.
- Verification: Runtime check confirms the touchable area is ≥48dp; Switch Access/Voice Access can reliably target it.
- False positives / exceptions: Do not flag non-interactive decorative elements; spacing between large neighbors can satisfy the target if the touchable area itself is adequate.

### PATTERN-AND-010: Hardcoded visible/accessibility text not localized
- Platform: Android
- Framework: Compose | Views (XML)
- Component type: Any labeled element
- WCAG / Platform: Localization, WCAG 3.1.x context
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: Visible text or `contentDescription` is a literal string instead of a string resource, so it never translates and is hard to maintain.
- Detection hints: Compose `Text("Submit")`/`contentDescription = "Close"` literals where the project otherwise uses `stringResource(R.string...)`; XML `android:text="Submit"`/`android:contentDescription="Close"`/menu `android:title="..."` literals instead of `@string/...`.
- Correct fix: Move strings into `res/values/strings.xml` (and locale variants) and reference via `stringResource(R.string.x)` / `@string/x`. Use `pluralStringResource`/`<plurals>` for counts.
- Verification: Switch device language and confirm visible and accessible text both change; lint `HardcodedText` is clean.
- False positives / exceptions: Single-locale apps with no localization setup — record as a localization-readiness note instead of a defect. Do not flag `tools:text`/`tools:`-namespaced design-time attributes.

### PATTERN-AND-011: Custom View exposes no accessibility node
- Platform: Android
- Framework: Views (XML)
- Component type: Custom View / ViewGroup / onDraw control
- WCAG / Platform: WCAG 1.1.1, WCAG 4.1.2, TalkBack
- Severity default: Serious
- Fix type default: FUNCTIONAL-RISK
- Bad shape: A custom `View`/`ViewGroup` (often drawn with `onDraw`/`Canvas`, e.g. a chart, rating, or custom toggle) handles touch but exposes no name, role, state, or actions to accessibility services.
- Detection hints: `class ... : View(...)` with `onTouchEvent`/`setOnClickListener` and `onDraw` but no `ViewCompat.setAccessibilityDelegate`/`AccessibilityNodeInfo` customization, no `contentDescription`, and no `ExploreByTouchHelper`.
- Correct fix: Provide `android:contentDescription`/role/state via an `AccessibilityDelegateCompat` (or `ExploreByTouchHelper` for multiple virtual sub-elements), expose `AccessibilityAction`s for gestures, and a text alternative or data summary for drawn content.
- Verification: TalkBack reaches the custom view, announces name/role/state/value, and can trigger its actions; complex drawn data has an accessible summary.
- False positives / exceptions: Do not flag purely decorative custom views that carry no information and are correctly marked `importantForAccessibility="no"`.

### PATTERN-AND-012: Dynamic update is silent (no live region)
- Platform: Android
- Framework: Compose | Views (XML)
- Component type: Status text / Snackbar / inline validation / loading
- WCAG / Platform: WCAG 4.1.3 Status Messages, TalkBack
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: Content updates in place (validation result, count, loading-to-loaded, inline status) without an announcement, so TalkBack users are not notified.
- Detection hints: Compose status `Text(...)` that changes on state without `Modifier.semantics { liveRegion = LiveRegionMode.Polite }`; XML status `<TextView>` without `android:accessibilityLiveRegion="polite"`; absence of `announceForAccessibility(...)` for transient messages.
- Correct fix: Mark the updating region as a polite live region (Compose `liveRegion`, XML `android:accessibilityLiveRegion`), or announce transient messages via `View.announceForAccessibility(...)`. Snackbars announce by default — verify content is meaningful.
- Verification: With TalkBack on, the update is announced without moving focus; whether it fires is a runtime check.
- False positives / exceptions: Do not mark high-frequency or non-essential updates as live regions; that creates announcement spam.
