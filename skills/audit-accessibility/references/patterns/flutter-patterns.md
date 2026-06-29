# Flutter Pattern Catalog

This catalog contains anonymized, reusable accessibility patterns only. Do not add customer names, application IDs, bundle identifiers, package names, domains, internal URLs, proprietary screen names, ticket IDs, business copy, screenshots, or exact customer source paths. Flutter (Dart, Material/Cupertino/Widgets) only; native Android patterns live in `android-patterns.md` and React Native patterns in `react-native-patterns.md`.

## Pattern Entry Template

```md
### PATTERN-FLT-001: Short title
- Platform: Flutter
- Framework: Material | Cupertino | Widgets | Mixed
- Component type: Button | Input | Row | Dialog | Chart | etc.
- WCAG / Platform: WCAG 2.1.1, 4.1.2, TalkBack/VoiceOver, text scaling, etc.
- Severity default: Critical | Serious | Moderate | Minor
- Fix type default: SAFE | VISUAL-IMPACT | FUNCTIONAL-RISK | RUNTIME-CHECK
- Bad shape: anonymized description of the recurring code/UX problem
- Detection hints: grep/search/static cues
- Correct fix: preferred Flutter widget/semantics implementation pattern
- Verification: TalkBack/VoiceOver, Switch Access, Voice Access, text scaling, runtime notes
- False positives / exceptions: when not to flag
```

## Seed Patterns

### PATTERN-FLT-001: GestureDetector/InkWell control lacks semantics
- Platform: Flutter
- Framework: Material | Widgets
- Component type: Button-like custom control
- WCAG / Platform: WCAG 2.1.1 Keyboard, WCAG 4.1.2 Name/Role/Value, TalkBack/VoiceOver activation
- Severity default: Critical
- Fix type default: FUNCTIONAL-RISK
- Bad shape: A `Container`, `Row`, `Column`, `Text`, or `Image` uses `GestureDetector(onTap:)`, `InkWell`, `InkResponse`, or a raw gesture as an action control without a role or accessible name in the semantics tree.
- Detection hints: `GestureDetector`/`InkWell`/`InkResponse` wrapping non-control widgets; missing `Semantics(button: true, label: ...)`, no `tooltip`/`semanticLabel`, an `onTap` styled to look like a button.
- Correct fix: Prefer `ElevatedButton`/`TextButton`/`OutlinedButton`/`IconButton` for actions. If a custom container must stay tappable, wrap it in `Semantics(button: true, label: localizedName, onTap: handler, child: ...)`; expose hidden gestures via `customSemanticsActions`.
- Verification: TalkBack/VoiceOver reaches the element, announces name and role, and activates it; Switch Access/Voice Access can also reach and trigger it.
- False positives / exceptions: Do not flag a passive wrapper whose inner real button is the actual target and the outer tap is redundant/delegated.

### PATTERN-FLT-002: Icon-only control without accessible name
- Platform: Flutter
- Framework: Material | Cupertino
- Component type: Icon button / app-bar action / FAB / image control
- WCAG / Platform: WCAG 4.1.2 Name/Role/Value, TalkBack/VoiceOver, Voice Access
- Severity default: Serious
- Fix type default: SAFE when adding a localized name; FUNCTIONAL-RISK when changing control structure.
- Bad shape: An `IconButton`/`Icon`/`FloatingActionButton` or image-based control has no meaningful accessible name.
- Detection hints: `IconButton(icon: Icon(...))` with no `tooltip`; `Icon(...)`/`ImageIcon(...)` with no `semanticLabel`; `FloatingActionButton` with no `tooltip`; a tappable `Image`/`SvgPicture` with no `semanticLabel`.
- Correct fix: Provide a localized `tooltip:` (icon buttons/FAB also surface it to screen readers) or `semanticLabel:` describing the action/content; set `ExcludeSemantics`/`semanticLabel: null` only for purely decorative icons backed by adjacent text.
- Verification: TalkBack/VoiceOver announces the intended action and role; Voice Access can target the control by a meaningful name.
- False positives / exceptions: Do not add a name that duplicates adjacent visible text; prefer the visible localized label when one exists.

### PATTERN-FLT-003: Field uses hint as its only label
- Platform: Flutter
- Framework: Material
- Component type: TextField / TextFormField
- WCAG / Platform: WCAG 1.3.1 Info and Relationships, WCAG 3.3.2 Labels or Instructions, screen-reader forms
- Severity default: Serious
- Fix type default: SAFE
- Bad shape: An input relies on `InputDecoration(hintText: ...)` as the only field name, so context disappears after entry or is unclear to the screen reader.
- Detection hints: `TextField`/`TextFormField` with `InputDecoration(hintText: ...)` and no `labelText:`, and no nearby visible label wired to the field.
- Correct fix: Add `InputDecoration(labelText: localized)` (a floating label) or a visible localized `Text` label adjacent to the field; keep `hintText` as a hint, not the name. Wrap with `Semantics(label:)` only if no decoration label is feasible.
- Verification: TalkBack/VoiceOver announces the field name, value, role, and error/help context before and after entry.
- False positives / exceptions: A compact search field can be acceptable when a clear localized programmatic label remains available (e.g. a `tooltip` or `Semantics(label:)`).

### PATTERN-FLT-004: Text-scale clipping risk
- Platform: Flutter
- Framework: Material | Cupertino | Widgets
- Component type: Text / Button / Row / Card / Form row
- WCAG / Platform: WCAG 1.4.4 Resize Text, text scaling / display size
- Severity default: Serious
- Fix type default: RUNTIME-CHECK by default; VISUAL-IMPACT when layout changes are required.
- Bad shape: Text or controls use fixed heights, clipped containers, single-line truncation, dense horizontal layouts, or a clamped `textScaler` that may not scale at large `textScaleFactor`/display size.
- Detection hints: `SizedBox(height:)`/`Container(height:)` around `Text`, `maxLines: 1` + `TextOverflow.ellipsis`, `softWrap: false`, dense `Row` text/icon/button stacks with no `Wrap`/`Flexible`, design-system `Text` wrappers with fixed `fontSize`/`height`, fixed `itemExtent` list items, and `MaterialApp(builder:)` overriding `MediaQuery.textScaler`/`textScaleFactor` to a fixed value.
- Correct fix: Let text size respond to `MediaQuery.textScaler`, allow wrapping and flexible/intrinsic heights, use `Flexible`/`Expanded`/`Wrap` for dense rows, avoid single-line truncation for important values, and do not lock `textScaler`.
- Verification: Runtime check at large Font size and Display size confirms text, controls, and row/card contents remain usable without clipping or overlap.
- False positives / exceptions: Do not flag fixed-size decorative text that is not user-facing. Do not state overlap is confirmed without a device/emulator check or rendered output.

### PATTERN-FLT-005: List/builder row has unclear screen-reader summary
- Platform: Flutter
- Framework: Material | Widgets
- Component type: ListView item / GridView tile / Card
- WCAG / Platform: WCAG 1.3.1 Info and Relationships, WCAG 2.4.6 Headings and Labels, TalkBack/VoiceOver reading order
- Severity default: Moderate
- Fix type default: RUNTIME-CHECK when final row output is dynamic; SAFE when label/value composition is obvious.
- Bad shape: A row/card/tile contains multiple visual labels, values, icons, and actions, but the accessible order or summary is fragmented, missing important values, or hides available actions.
- Detection hints: `ListView.builder`/`GridView` items with nested `Row`/`Column` and no `MergeSemantics`; tiles with several `Text` widgets and separate tap areas; swipe (`Dismissible`/`Slidable`) row actions with no semantics.
- Correct fix: Group the row into a coherent node with `MergeSemantics` (or a single `Semantics(label:/value:)`), keep separately actionable children reachable, and expose row actions via `customSemanticsActions`/`onTap` semantics.
- Verification: TalkBack/VoiceOver reads representative rows in a meaningful order and exposes all actions without requiring visual gestures.
- False positives / exceptions: Do not over-merge rows that contain multiple independent controls; preserve separate controls when each has its own action.

### PATTERN-FLT-006: Color-only state or status
- Platform: Flutter
- Framework: Material | Cupertino | Widgets
- Component type: Badge / Status / Validation / Chart / Selection
- WCAG / Platform: WCAG 1.4.1 Use of Color, high-contrast, color inversion
- Severity default: Serious
- Fix type default: VISUAL-IMPACT
- Bad shape: Status, selection, validation, chart categories, or availability are communicated only through color.
- Detection hints: `color: Colors.red` errors without text/icon, selected state shown by tint only, chart legends keyed by color only, `TextStyle(color:)`-only status.
- Correct fix: Add text, icon shape, pattern, state, or an accessible value (`Semantics(value:)`) that communicates the same information without relying on color alone.
- Verification: Inspect with color correction/inversion and high-contrast where applicable and confirm the screen reader announces the state.
- False positives / exceptions: Color can remain as redundant reinforcement when text, icon shape, or accessible state already communicates the meaning.

### PATTERN-FLT-007: Decorative image exposed / informative image hidden
- Platform: Flutter
- Framework: Material | Widgets
- Component type: Image / Icon / SvgPicture
- WCAG / Platform: WCAG 1.1.1 Non-text Content, TalkBack/VoiceOver
- Severity default: Serious
- Fix type default: SAFE
- Bad shape: An informative image has no accessible name, or a purely decorative image is announced by the screen reader.
- Detection hints: Informative `Image.asset`/`Image.network`/`SvgPicture` with no `semanticLabel`; decorative `Image`/`Icon` with a non-null `semanticLabel` and not wrapped in `ExcludeSemantics`.
- Correct fix: For informative images add a localized `semanticLabel`. For decorative images set `semanticLabel: null` (or wrap in `ExcludeSemantics`) so the screen reader skips them.
- Verification: TalkBack/VoiceOver describes informative images and skips decorative ones.
- False positives / exceptions: Do not hide an image that is the only carrier of information; do not label background decoration.

### PATTERN-FLT-008: Visual title not exposed as a heading
- Platform: Flutter
- Framework: Material | Cupertino | Widgets
- Component type: Section/screen title Text
- WCAG / Platform: WCAG 1.3.1, WCAG 2.4.6, TalkBack/VoiceOver heading navigation
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: A `Text` is a visual section or screen title (large/bold) but is not exposed as a heading, so screen-reader heading navigation cannot jump to it.
- Detection hints: A title `Text(...)` styled as a heading with no surrounding `Semantics(header: true)`; an `AppBar` title is fine, but in-body section titles often are not.
- Correct fix: Wrap the title in `Semantics(header: true, child: Text(...))`. The `AppBar`/`SliverAppBar` title is already exposed; reserve this for in-body section/screen titles.
- Verification: Screen-reader heading navigation (the headings rotor/gesture) lands on the title.
- False positives / exceptions: Do not mark every bold label as a heading; reserve it for genuine section/screen titles.

### PATTERN-FLT-009: Touch target below 48x48
- Platform: Flutter
- Framework: Material | Widgets
- Component type: Icon button / chip / compact control / row action
- WCAG / Platform: WCAG 2.5.8 Target Size (Minimum), Material 48x48 guidance, Switch Access/Voice Access
- Severity default: Moderate
- Fix type default: VISUAL-IMPACT when layout changes; SAFE when only restoring the minimum tap target.
- Bad shape: An interactive element renders smaller than the 48x48 minimum, making it hard to hit for motor-impaired and switch users.
- Detection hints: `IconButton(iconSize: small)` with reduced/zero padding, `InkWell`/`GestureDetector` on a small `SizedBox`/`Container`, `MaterialTapTargetSize.shrinkWrap` on buttons, `VisualDensity` shrinking controls, or compact `Chip`/custom controls.
- Correct fix: Keep `MaterialTapTargetSize.padded` (the default), wrap small targets to ≥48x48 (e.g. `ConstrainedBox(minWidth/minHeight: 48)` or adequate padding), and avoid `shrinkWrap` on primary controls.
- Verification: Runtime check confirms the touchable area is ≥48x48; Switch Access/Voice Access can reliably target it.
- False positives / exceptions: Do not flag non-interactive decorative elements; spacing between large neighbors can satisfy the target if the touchable area itself is adequate.

### PATTERN-FLT-010: Hardcoded visible/accessibility text not localized
- Platform: Flutter
- Framework: Material | Cupertino | Widgets
- Component type: Any labeled element
- WCAG / Platform: Localization, WCAG 3.1.x context
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: Visible text or `semanticLabel`/`Semantics(label:)`/`tooltip:` is a Dart literal instead of a localized string, so it never translates and is hard to maintain.
- Detection hints: `Text("Submit")`/`semanticLabel: "Close"`/`tooltip: "Close"` literals where the project otherwise uses `AppLocalizations.of(context)!.x`, `.tr()`, or `Intl.message`.
- Correct fix: Move strings into the localization store (`.arb` + `AppLocalizations`, or `intl`/`easy_localization`) and reference the generated getter; use ICU `Intl.plural`/`.arb` plurals for counts.
- Verification: Switch device language and confirm visible and accessible text both change; the localization generator runs clean.
- False positives / exceptions: Single-locale apps with no localization setup — record as a localization-readiness note instead of a defect. Do not flag debug/test-only literals.

### PATTERN-FLT-011: CustomPaint/custom widget exposes no semantics
- Platform: Flutter
- Framework: Widgets
- Component type: CustomPaint / custom render widget / chart / drawn control
- WCAG / Platform: WCAG 1.1.1, WCAG 4.1.2, TalkBack/VoiceOver
- Severity default: Serious
- Fix type default: FUNCTIONAL-RISK
- Bad shape: A `CustomPaint`/custom-render widget (a chart, rating, gauge, or drawn toggle) handles touch or conveys data but exposes no name, role, state, or actions to the semantics tree.
- Detection hints: `CustomPaint`/`RenderObject` widgets with gesture handling and no `Semantics` wrapper, no `semanticLabel`, and no `CustomPainter.semanticsBuilder`; charts drawn with `Canvas` and no text alternative.
- Correct fix: Wrap the widget in `Semantics(label:/value:/button: ...)` with localized text, expose actions via `customSemanticsActions`, and provide a `CustomPainter.semanticsBuilder` (or a text/data summary) for drawn content.
- Verification: TalkBack/VoiceOver reaches the widget, announces name/role/state/value, and can trigger its actions; complex drawn data has an accessible summary.
- False positives / exceptions: Do not flag purely decorative `CustomPaint` that carries no information and is correctly excluded with `ExcludeSemantics`.

### PATTERN-FLT-012: Dynamic update is silent (no live region)
- Platform: Flutter
- Framework: Material | Widgets
- Component type: Status text / SnackBar / inline validation / loading
- WCAG / Platform: WCAG 4.1.3 Status Messages, TalkBack/VoiceOver
- Severity default: Moderate
- Fix type default: SAFE
- Bad shape: Content updates in place (validation result, count, loading-to-loaded, inline status) without an announcement, so screen-reader users are not notified.
- Detection hints: A status `Text(...)` that changes on `setState`/state with no surrounding `Semantics(liveRegion: true)`; no `SemanticsService.announce(...)` for transient messages; custom toasts built without semantics.
- Correct fix: Wrap the updating region in `Semantics(liveRegion: true, child: ...)`, or announce transient messages via `SemanticsService.announce(message, textDirection)`. Material `SnackBar` content is read — verify it is meaningful.
- Verification: With a screen reader on, the update is announced without moving focus; whether it fires is a runtime check.
- False positives / exceptions: Do not mark high-frequency or non-essential updates as live regions; that creates announcement spam.
