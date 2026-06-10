# After-Test Report Format

Write active remediation results to `Binclusive-auditing/after-test.md` and archive dated copies for completed batches.

## Header

- Date
- Project
- TODO file used
- Selected task IDs
- Fix operator/agent

## Per Task

```md
### TASK-001: Title
- **Original problem:** concise summary from accessibility-todo.md
- **Files changed:** list paths
- **What changed:** exact behavioral/semantic summary
- **Why this fixes it:** connect to WCAG/APG/platform rule
- **Static re-check:** command or manual static review result
- **Runtime/manual verification:** steps for keyboard, screen reader, axe/Lighthouse, browser checks
- **Residual risk:** none / needs runtime check / needs product copy / needs design review
```

## Batch Summary

- Fixed
- Deferred
- Needs human decision
- Runtime checks still required
