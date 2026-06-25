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
