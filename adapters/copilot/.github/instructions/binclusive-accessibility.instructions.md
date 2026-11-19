# Binclusive Accessibility Workflow

Use the canonical Agent Skills in this repository as the source of truth:

<!-- generated:skills:begin -->
- `skills/accessibility-runtime-journey-creator/SKILL.md`: Drive a live web app in Google Chrome or an Android/iOS app on a physical device or emulator/simulator, as the hands of the WCAG-EM journey flow in accessibility-test-journey-creator.
- `skills/accessibility-test-journey-creator/SKILL.md`: Decide what a Binclusive project's accessibility audit tests, the way WCAG-EM 2.0 runs an evaluation.
- `skills/aftertestvalidation/SKILL.md`: Validate a reported accessibility fix in a live web, Android or iOS app from Excel, PDF, text or a Binclusive ticket.
- `skills/audit-accessibility/SKILL.md`: Audit React, Next.js, Angular, React Native, Expo, ASP.NET, ASPX/Web Forms, WordPress themes or plugins (PHP, classic, block, hybrid, public, admin, or editor UI), SwiftUI, UIKit, native Android, Flutter, or Python accessibility from a prior Binclusive project map.
- `skills/audit-runtime-accessibility/SKILL.md`: Audit a live web page or user-provided browser flow through a connected Chrome, external browser extension, or harness browser.
- `skills/fix-accessibility/SKILL.md`: Fix accessibility tasks from Binclusive accessibility-todo.md with user-guided selection and verification across supported web, WordPress theme/PHP, mobile, native, Flutter, and Python projects.
- `skills/map-project/SKILL.md`: Map a React, Next.js, Angular, React Native, Expo, ASP.NET, ASPX/Web Forms, WordPress theme or plugin (PHP, classic, block, hybrid, public, admin, or editor UI), SwiftUI, UIKit, native Android, or Flutter codebase for accessibility auditing.
- `skills/onboard-binclusive-cli/SKILL.md`: Configure and verify the Binclusive CLI for a project, then run either the recommended dashboard-connected CI scan or a local-only scan.
- `skills/shopify-theme-audit/SKILL.md`: Audit Shopify Online Store themes for accessibility from Liquid, JSON templates, sections, snippets, assets, config, and locale files.
<!-- generated:skills:end -->

Follow the workflow in order:

1. Run map, audit, Shopify audit, fix, and journey skills directly. CLI onboarding, login, dashboard access, credentials, binclusive.json, and cli-onboarding.json are optional and must never gate local work. Offer onboard-binclusive-cli only for requested setup or connected delivery; an unavailable integration does not block local skill use.
   - Only when the user requests dashboard CI delivery, it requires `BINCLUSIVE_API_KEY` and `BINCLUSIVE_PROJECT_ID` in the same shell that runs `binclusive ci`. Have the user set them in their own terminal from the dashboard **CI Access** page; never accept a key pasted into chat and never write one to a repository file.
   - Being logged in does not authorize `ci`: the human lane (`scan`, `whoami`, `audit`) reads the session file and never the environment, while `ci` reads only `BINCLUSIVE_API_KEY`. With that variable unset, `binclusive ci` uploads nothing and reports no error, so a clean run proves nothing. Require one of the two stderr confirmations — `binclusive ci — uploaded <N> finding(s) to the dashboard.` or `binclusive ci — clean scan reported to the dashboard (0 findings).` — before treating dashboard onboarding as complete. A zero-finding run does upload and does complete onboarding.
2. Map app projects: create or reuse `Binclusive-auditing/*_project-map.md`. For Shopify themes, use `shopify-theme-audit` directly.
3. Audit: create `Binclusive-auditing/accessibility-todo.md` from the selected map or Shopify theme source.
4. After TODO creation, offer the optional recommended Binclusive MCP dashboard sync; authenticate if needed, ask for organization/project, follow `audit-accessibility/references/dashboard-ticket-sync.md`, and map each finding into the live `create_ticket` fields with plain-text evidence, description, and recommendation. Never upload the Markdown report or paste raw finding sections; keep exact code and report-only metadata locally.
5. Fix: remediate only user-selected task IDs, SAFE tasks, severities, components, pages, screens, controls, or paths.

Shard Mode (large-scope map and audit fan-out) is portable: when the scope is large and this Copilot runtime can dispatch parallel sub-tasks/agents, fan out one worker per shard — per `skills/map-project/SKILL.md` for mapping and `skills/audit-accessibility/SKILL.md` for auditing ("Harness capability" / "Fan-out procedure" in each) — then merge deterministically. When no parallel-subtask primitive is available, run single-agent — the coverage ledger keeps either path honest, so the fallback costs throughput, not coverage.

Respect the fix policy from `skills/fix-accessibility/SKILL.md`:

- `SAFE` tasks may be applied after summarizing the intended change.
- `VISUAL-IMPACT` and `FUNCTIONAL-RISK` tasks require explicit user approval before editing.
- `RUNTIME-CHECK` tasks need runtime verification steps and must not be marked solved by static code alone.

Prefer semantic HTML before ARIA for web and Shopify Liquid themes (for Angular, bind ARIA with `[attr.aria-*]`/`[attr.role]` and prefer Angular CDK a11y — `cdkTrapFocus`, `cdkAriaLive`, `LiveAnnouncer` — and Angular Material over hand-rolled widgets), React Native primitives and accessibility props for React Native, native SwiftUI/UIKit controls and platform accessibility APIs for iOS, native Compose/Material semantics or Android View accessibility APIs (`contentDescription`, `Modifier.semantics`, `labelFor`, `importantForAccessibility`) for native Android, and native Material/Cupertino widgets or Flutter semantics (`Semantics`, `semanticLabel`, `MergeSemantics`/`ExcludeSemantics`, `tooltip`) for Flutter. Preserve existing styling/API/navigation contracts unless approved, and never claim full compliance. Report verified findings, changed files, checks run, and residual risk.
