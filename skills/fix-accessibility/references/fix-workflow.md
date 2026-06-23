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
