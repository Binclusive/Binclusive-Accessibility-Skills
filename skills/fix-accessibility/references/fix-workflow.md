# Fix Workflow

Use `scripts/parse-todo.mjs` when a TODO file is large:

```bash
node scripts/parse-todo.mjs path/to/Binclusive-auditing/accessibility-todo.md
```

Then filter by `id`, `severity`, `fixType`, `component`, or `file` before editing.

## Selection Prompt

Ask one concise question when the user has not selected tasks:

"Which tasks should I fix: specific TASK IDs, all SAFE tasks, all Critical tasks, or a component/page/path?"

## Completion Rule

A task is only considered remediated when the code has been changed and the relevant file/scope has been re-read or re-checked. Record the result in `after-test.md`.

## Editing Storyboards and XIBs (Interface Builder XML)

`.storyboard` and `.xib` files are XML. For iOS Interface Builder findings, edit the markup directly with minimal, well-formed insertions. Treat this like any source edit — do not rewrite or reformat the whole file.

Accessibility lives in an `<accessibility key="accessibilityConfiguration">` child of the target element:

```xml
<button id="aB3-cd-9Xy" userLabel="Submit">
    <!-- existing children: <state>, <constraints>, <connections>, etc. -->
    <accessibility key="accessibilityConfiguration" label="Submit order">
        <accessibilityTraits key="traits" button="YES"/>
        <bool key="isElement" value="YES"/>
    </accessibility>
</button>
```

Rules:

- **Locate the element by `id`** (and `userLabel` when present) recorded in the finding. Never invent or change an existing `id`, and never alter the `<document>` header, `toolsVersion`, or `targetRuntime` attributes.
- **Add a label:** insert (or update) the `<accessibility ... label="...">` element with a specific, action/content-oriented name. If one already exists, edit its `label` attribute rather than adding a second element.
- **Decorative image:** add `<bool key="isElement" value="NO"/>` inside `<accessibility>` so VoiceOver skips it.
- **Traits:** add `<accessibilityTraits key="traits" button="YES"/>` (or the correct trait) only when the native element role does not already convey it.
- **Localize the string.** A literal `label="..."` in the storyboard is not translated. When the project uses Base Internationalization (`Base.lproj` + per-locale `.lproj/*.strings`), add a matching key to every locale's `.strings` file, keyed by the element's object ID:

  ```
  "aB3-cd-9Xy.accessibilityLabel" = "Submit order";
  ```

  Keep the literal in the storyboard consistent with the Base/Development-language value. If the project has no localization setup, set the label inline and note localization readiness in `after-test.md`.
- **Keep it valid XML.** Match the file's existing indentation; ensure the edit is well-formed and the element still opens cleanly. A later re-save in Xcode may reorder attributes — that is expected and harmless.
- **Re-check** by re-reading the edited element and confirming the matching `.strings` keys exist for each locale. Rendered VoiceOver order, Auto Layout at large Dynamic Type, and reused prototype-cell output stay `RUNTIME-CHECK` — record them as manual steps, do not mark them statically solved.

## Editing Angular Templates and Components

Most Angular accessibility findings live in `*.component.html` (or an inline `template`). Edit the template markup with minimal, well-formed insertions; do not reformat the whole template or change unrelated bindings. A few findings live in the component `.ts` (host bindings, `@HostListener`, injected `LiveAnnouncer`) or in `index.html`/`app.config.ts` (lang, `TitleStrategy`).

The single most common Angular-specific mistake is binding ARIA as a DOM **property** instead of an **attribute** — bind it with `attr.`:

```html
<!-- correct: attribute binding lands on the element -->
<button [attr.aria-label]="closeLabel" (click)="close()">
  <mat-icon aria-hidden="true">close</mat-icon>
</button>

<!-- wrong: [aria-label] binds a non-existent DOM property and silently sets nothing -->
<button [aria-label]="closeLabel">…</button>
```

Rules:

- **Locate the element by the finding's template path + line and its binding/selector.** Never invent a `formControlName`/`id`/selector that is not in the code.
- **Add a name:** for icon-only/image controls add a localized `[attr.aria-label]` (dynamic) or static `aria-label` (single-locale); for inputs pair `<label for="id">` with the control `id`, use `<mat-label>` inside `mat-form-field`, or `[attr.aria-labelledby]`. Prefer a visible localized label when one exists. Hide decorative icons/SVG with `aria-hidden="true"`.
- **Use the `attr.` form for all ARIA/role bindings** (`[attr.aria-expanded]`, `[attr.aria-controls]`, `[attr.role]`, `[attr.aria-describedby]`); `[alt]`, `[id]`, `[hidden]`, and `[tabindex]` are real DOM properties and bind without `attr.`. Make conditional ARIA track real state (`[attr.aria-expanded]="isOpen"`).
- **Focus management:** prefer `MatDialog`/CDK `Dialog`/`Overlay` (focus trap + restore built in). For a custom overlay, wrap the panel with `cdkTrapFocus`, mark the first focusable element `cdkFocusInitial`, restore focus to the trigger on close, and import `A11yModule` (or the standalone CDK a11y directives) in the component/`NgModule`.
- **Announcements:** inject `LiveAnnouncer` for transient messages, or mark an in-place status region with `cdkAriaLive="polite"` (or `aria-live="polite"`). Verify the region/message is meaningful.
- **Routing:** set a per-route `title` or a `TitleStrategy`, and move focus to the new view's heading/`<main tabindex="-1">` (or announce it) on `NavigationEnd`; add a skip link and a stable `<main>` landmark in the app shell.
- **Localize the string.** A literal in a template/`aria-label` is not translated. Use `@angular/localize` (`i18n`/`i18n-aria-label`/`$localize`) or the project's translation pipe (`{{ 'key' | translate }}` / `[attr.aria-label]="'key' | translate"` / `*transloco`). Use ICU/`i18nPlural` for counts. If the project has no i18n setup, set the string inline and note localization readiness in `after-test.md`.
- **Prefer CDK/Material over reimplementation.** When a finding is a hand-rolled tabs/menu/listbox/combobox, prefer `MatTabGroup`/`MatMenu`/`mat-select` or `@angular/cdk` (`cdkMenu`, `cdkListbox`) — this is `FUNCTIONAL-RISK`; get approval and keep the change minimal.
- **Keep it valid.** Match the template's existing indentation and binding style; ensure the element still opens cleanly and existing bindings are untouched.
- **Re-check** by re-reading the edited template/component and confirming any translation keys exist. Router focus timing, CDK focus trap/restore, screen-reader announcement order, `@defer`/SSR-hydration behavior, and third-party UI-kit internals stay `RUNTIME-CHECK` — record them as manual steps, do not mark them statically solved.

## Editing Android XML Layouts and Resources

Android `res/layout/*.xml`, `res/menu/*.xml`, and `res/values/strings.xml` are XML. Edit the markup directly with minimal, well-formed insertions; do not reformat the whole file or change unrelated attributes.

Most native Android accessibility fixes are single attributes on the target view, plus a string resource:

```xml
<!-- res/layout/view_toolbar.xml -->
<ImageButton
    android:id="@+id/closeButton"
    android:src="@drawable/ic_close"
    android:contentDescription="@string/close_dialog"
    android:minWidth="48dp"
    android:minHeight="48dp" />
```

```xml
<!-- res/values/strings.xml (and each res/values-<lang>/strings.xml) -->
<string name="close_dialog">Close dialog</string>
```

Rules:

- **Locate the view by `android:id`** recorded in the finding; never invent or change an existing id, and never edit `tools:`-namespaced design-time attributes as if they were runtime ones.
- **Add a name:** set `android:contentDescription="@string/..."` for icon-only/image controls; wire a visible `<TextView android:labelFor="@id/field">` (or a `TextInputLayout` label) for inputs. Prefer the visible localized label when one already exists.
- **Decorative image:** set `android:importantForAccessibility="no"` (or `"noHideDescendants"` to hide a subtree); set `contentDescription = null` for the Compose equivalent.
- **Heading:** add `android:accessibilityHeading="true"` (API 28+) or call `ViewCompat.setAccessibilityHeading(view, true)` for back-compat.
- **Touch target:** raise to ≥48dp via `android:minWidth`/`android:minHeight` (XML) or `Modifier.minimumInteractiveComponentSize()` (Compose).
- **Localize the string.** A literal `android:text`/`android:contentDescription`/menu `android:title` is not translated. Add the value to `res/values/strings.xml` and every `res/values-<lang>/strings.xml`, referenced via `@string/...` (or `stringResource(R.string.x)` in Compose). Use `<plurals>`/`pluralStringResource` for counts. If the project has no localization setup, set the string inline and note localization readiness in `after-test.md`.
- **Compose fixes** are code edits, not XML: prefer `contentDescription`, `Modifier.semantics { role = Role.* }`, `onClickLabel`, `Modifier.semantics { heading() }`, and `stateDescription` over a custom `AccessibilityDelegate`.
- **Custom `View` subclasses** that need a node usually take a `ViewCompat.setAccessibilityDelegate(...)` (or `ExploreByTouchHelper` for virtual sub-elements) — this is `FUNCTIONAL-RISK`; get approval and keep the change minimal.
- **Keep it valid XML.** Match the file's existing indentation and namespaces; ensure the element still opens cleanly.
- **Re-check** by re-reading the edited view and confirming the `@string/...` keys exist in each locale. TalkBack traversal order, font-scale layout at large sizes, recycled `RecyclerView` row state, and inflated/runtime output stay `RUNTIME-CHECK` — record them as manual steps, do not mark them statically solved.

## Editing Flutter Widgets (Dart)

Flutter accessibility fixes are Dart code edits in `lib/**`, not markup. Edit the widget tree with minimal, well-formed changes; do not reformat the file or alter unrelated widgets. Most fixes add one property or a thin `Semantics`/`Tooltip` wrapper around the target widget, plus a localized string.

```dart
// Icon-only button: add an accessible name via tooltip (surfaced to screen readers).
IconButton(
  icon: const Icon(Icons.close),
  tooltip: AppLocalizations.of(context)!.closeDialog,
  onPressed: _close,
)

// Custom tappable container: give it a role + name in the semantics tree.
Semantics(
  button: true,
  label: AppLocalizations.of(context)!.addToCart,
  onTap: _addToCart,
  child: GestureDetector(onTap: _addToCart, child: /* ... */),
)
```

Rules:

- **Locate the widget** by the file path and the verified code in the finding; never invent a widget or rename an existing identifier.
- **Prefer a real widget first.** Replace a `GestureDetector`/`InkWell`-on-a-`Container` control with `ElevatedButton`/`TextButton`/`IconButton` when feasible — that restores role, focus, and the 48x48 tap target for free. Only wrap with `Semantics(...)` when a real widget cannot be used.
- **Add a name:** set `semanticLabel:` on `Image`/`Icon`/`CircleAvatar`, `tooltip:` on `IconButton`/`FloatingActionButton`, `InputDecoration(labelText:)` on a field, or a wrapping `Semantics(label:)`. Prefer the visible localized label when one already exists.
- **Decorative image:** set `semanticLabel: null` or wrap in `ExcludeSemantics(...)` so screen readers skip it.
- **Heading:** wrap an in-body section/screen title in `Semantics(header: true, child: Text(...))`. The `AppBar`/`SliverAppBar` title is already exposed — do not double-wrap it.
- **Grouping:** wrap a fragmented row/tile in `MergeSemantics(child: ...)` so it reads as one item, keeping separately actionable children reachable; do not over-merge independent controls.
- **State/value:** expose `Semantics(checked:/selected:/toggled:/value:/enabled:)`, or use a native `Checkbox`/`Switch`/`Radio`/`Slider` that exposes it automatically.
- **Live updates:** wrap an updating status region in `Semantics(liveRegion: true, child: ...)`, or call `SemanticsService.announce(message, Directionality.of(context))` for transient messages.
- **Touch target:** keep `MaterialTapTargetSize.padded` (the default) and avoid `shrinkWrap`; wrap small targets to ≥48x48 via `ConstrainedBox`/padding — this may be `VISUAL-IMPACT`.
- **Localize the string.** A literal Dart string in `Text`/`semanticLabel`/`label:`/`tooltip:` is not translated. Add the key to the localization store (`.arb` + `AppLocalizations`, or `intl`/`easy_localization`) and reference the generated getter; use ICU plurals for counts. If the project has no localization setup, set the string inline and note localization readiness in `after-test.md`.
- **Custom render widgets** (`CustomPaint`/`RenderObject`) that need a node take a wrapping `Semantics(...)` and a `CustomPainter.semanticsBuilder` — this is `FUNCTIONAL-RISK`; get approval and keep the change minimal.
- **Re-check** by re-reading the edited widget and confirming the localization key exists for each locale. Rendered semantics tree, TalkBack/VoiceOver order, text-scale layout at large sizes, and Flutter-web semantics stay `RUNTIME-CHECK` — record them as manual steps, do not mark them statically solved.
