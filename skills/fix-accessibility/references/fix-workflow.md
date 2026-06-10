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
