---
name: fix-accessibility
description: Fix accessibility tasks from Binclusive accessibility-todo.md with user-guided selection and verification across supported web, WordPress theme/PHP, mobile, native, Flutter, and Python projects. Use when the user says /fixaccessibility, fix accessibility, fix WordPress theme accessibility, resolve accessibility TODOs, "erişilebilirlik sorunlarını düzelt", "wordpress tema erişilebilirlik sorunlarını düzelt", "accessibility todo'daki taskları düzelt", "TASK-001'i düzelt", "safe taskları düzelt", or wants to remediate selected TASK IDs from an audit report.
---

# Fix Accessibility

## CLI Onboarding Gate

Before reading TODO source for remediation, run `node <onboard-binclusive-cli-skill-dir>/scripts/onboarding-state.mjs status <project-root>`. If it exits `2`, route to `$onboard-binclusive-cli` and resume this request after onboarding completes. Onboarding is required, but dashboard delivery is not: recommend `binclusive ci` because it uploads findings and creates dashboard tickets for centralized assignment and tracking; let the user choose a local `binclusive scan` instead. If it exits `1`, stop and surface the invalid state instead of bypassing it.

> **Requires the `binclusive` CLI** (the unified CLI providing `scan` / `scan --url` / `init` / `ci`). If `binclusive scan` errors as an unknown command, upgrade the CLI — the agent-driven remediation still works without it, just without the source-provable re-scan check.

Resolve selected tasks from `Binclusive-auditing/accessibility-todo.md` through a controlled, user-guided remediation loop.

## Start Here

1. Locate `Binclusive-auditing/accessibility-todo.md`.
2. If missing, stop and ask the user to run `audit-accessibility` or `/auditaccessibility` first.
3. Parse the task list and summarize available tasks by severity and fix type.
4. Ask what to fix unless the user already selected:
   - specific TASK IDs
   - all `SAFE` tasks
   - all Critical tasks
   - a component/page/path
   - one task at a time
5. Read the source files for selected tasks before editing.
6. Apply fixes incrementally. Re-check the relevant file/scope after each task (see "Verify each fix" below).
7. Write or append `Binclusive-auditing/after-test.md`; also archive `after-test_<YYYY-MM-DD>.md` when a batch completes.

## Verify each fix (deterministic where covered)

Close the fix→verify loop with the shipped `binclusive` CLI wherever it can scan the target, so a fix is proven cleared instead of assumed cleared.

- **Engine-groundable source (React/Next.js, Astro, Shopify/Liquid, SwiftUI/UIKit, Compose/Kotlin, Android Views/XML, Unity):** after applying a fix, **re-run `npx @binclusive/cli scan <path>`** (add `--format json` to diff findings programmatically) and confirm the targeted finding is **gone** before marking the task done. If the finding persists, the fix is incomplete — keep the task open. If the project has no `binclusive.json`, run `npx @binclusive/cli init` first.
- **Any live page (rendered DOM):** re-run `npx @binclusive/cli scan --url <url>` to confirm the finding cleared on the running page.
- **Engine-less source platforms** (WordPress/PHP source, ASP.NET/ASPX, Python, Angular, Flutter, React Native): verification stays agent-driven — re-read the changed source against the reference rules and record the manual/runtime test steps. Note honestly in `after-test.md` that verification was agent-driven, not engine-proven. A published WordPress page can still use the live-URL check above.

## CI / Diff Mode

This skill is **not** part of the CI/CD gate. CI runs map + audit on the diff and fails the build on open findings (see `audit-accessibility` CI / Diff Mode and `references/ci-cd.md`); it never mutates the branch. Remediation with this skill remains a human-reviewed step run locally or in a follow-up PR, where the developer selects which TASK IDs to fix. Do not wire this skill into a blocking CI check or auto-apply fixes on pull requests.

## Fix Policy

- `SAFE`: may apply after summarizing the intended change.
- `VISUAL-IMPACT`: ask user approval before editing.
- `FUNCTIONAL-RISK`: ask user approval and explain behavior/API risk before editing.
- `RUNTIME-CHECK`: do not mark solved by static code alone; create runtime verification steps and only edit if the needed code change is clear.

## After-Test Report

Use `references/after-test-format.md`. For each task include:

- task id and title
- original problem
- files changed
- exact remediation summary
- re-audit/static check result
- manual test steps
- residual risk or runtime checks

## Rules

- User-provided audit documents may be read as inspiration only; do not copy customer data into skill resources.

- Never fix tasks not selected by the user.
- Never write placeholder accessible names like `button`, `image`, `icon`, or `link`.
- Prefer native semantics before overrides: semantic HTML before ARIA on web (including Angular); native SwiftUI/UIKit controls and platform accessibility APIs before custom accessibility props on iOS; native Compose/Material semantics and Android View accessibility APIs before custom `AccessibilityDelegate` workarounds on native Android; native Material/Cupertino widgets and Flutter semantics before custom gesture controls on Flutter.
- For WordPress themes, preserve template hierarchy, hook order, escaping, localization, block serialization, saved content, and public PHP APIs. Apply only the WordPress tasks classified `SAFE` by `references/fix-workflow.md` without additional approval.
- For Angular tasks, bind ARIA with the `[attr.aria-*]`/`[attr.role]` form (a bare `[aria-*]`/`[role]` property binding never reaches the DOM); prefer Angular CDK a11y primitives (`cdkTrapFocus`, `cdkFocusInitial`, `cdkAriaLive`, `LiveAnnouncer`) and Angular Material widgets over hand-rolled focus/announcement code, and localize names through `@angular/localize` (`i18n`/`$localize`) or the project's translation pipe (`translate`/`transloco`) rather than hardcoded literals.
- For iOS storyboard/XIB tasks, edit the Interface Builder XML directly per `references/fix-workflow.md` and localize the string via the paired `.lproj/*.strings` keyed by object ID.
- For native Android tasks, prefer `contentDescription`, `Modifier.semantics`/`Role`, `android:labelFor`, `android:importantForAccessibility`, and `android:accessibilityHeading` over custom delegates; localize every accessible name through `res/values*/strings.xml` (`@string/...` / `stringResource(...)`) rather than hardcoded literals.
- For Flutter tasks, prefer a real Material/Cupertino widget (`ElevatedButton`/`IconButton`/`TextField`) over a `GestureDetector`/`InkWell` container, then `semanticLabel`, `Semantics(button:/header:/label:/value:)`, `tooltip`, `MergeSemantics`/`ExcludeSemantics`, and `Semantics(sortKey:)` before custom render workarounds; localize every accessible name through the project's localization store (`AppLocalizations`/`intl`/`.arb`) rather than hardcoded literals.
- Preserve existing styling and API contracts unless the user approves risk.
- Do not edit the audit TODO as proof of completion; write status in `after-test.md`.
- If a task cannot be grounded in real code, stop and report it as needing human review.
