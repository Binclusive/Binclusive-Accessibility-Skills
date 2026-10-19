# Runtime accessibility report format

Use this compact structure. Omit empty sections only when the reason is explicit.

```markdown
# Runtime Accessibility Report

- Target: <URL/origin>
- Browser/harness: <browser and agent runtime>
- Date: <YYYY-MM-DD>
- Scope: <page(s), component(s), and states>
- Flow: <user-provided | exploratory>
- Safety stop: <none | action not executed>

## Coverage

| Measure | Count | Gap |
| --- | ---: | --- |
| Flow steps completed | 0/0 | ... |
| Visible interactive elements inspected | 0 | ... |
| Keyboard-operable elements tested | 0 | ... |
| Distinct UI states observed | 0 | ... |

## Step and state ledger

| Step/state | Action | Target | Focus before -> after | Observable result | Status |
| --- | --- | --- | --- | --- | --- |
| S0 baseline | Navigate | page | browser -> E001 | ... | pass |

## Element inventory

| ID | Visible text/descriptor | Role | Accessible name | State/value | Evidence |
| --- | --- | --- | --- | --- | --- |
| E001 | ... | ... | ... | ... | runtime-inspected |

## Findings

### RUNTIME-001: <short defect title>

- Severity: critical | serious | moderate | minor
- Provenance: agent: runtime
- Evidence: runtime-observed | runtime-inspected | visual-observed
- WCAG: <criterion and level, or needs-review>
- Affected: <element IDs and state/step>
- Reproduce:
  1. ...
- Expected: ...
- Actual: ...
- Evidence captured: <role/name/state/focus/geometry/visual observation>
- User impact: ...
- Suggested direction: <native pattern or behavior; not a source edit>

## Passed checks

- <check, element/state, and evidence>

## Blocked or unverified

- <check>: <why it could not be verified and what is required>

## Residual risk

- No conformance claim is made. <AT, viewport, zoom, forced-colors, or untested-flow risks>
```

## Reporting rules

- Keep finding IDs stable within one run.
- Tie every finding to a step/state and one or more element IDs.
- Keep raw browser evidence concise; do not paste full DOM dumps.
- Separate tool failure from application failure.
- Record a blocked step in both the ledger and coverage gap.
- Redact credentials, tokens, personal data, and sensitive form values.
