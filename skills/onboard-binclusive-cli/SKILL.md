---
name: onboard-binclusive-cli
description: Configure and verify the Binclusive CLI for a project, then run either the recommended dashboard-connected CI scan or a local-only scan. Use before any Binclusive map, audit, Shopify audit, or fix workflow when `Binclusive-auditing/cli-onboarding.json` is missing or incomplete; or when a user asks to login, authorize, configure, or onboard the Binclusive CLI.
---

# Onboard Binclusive CLI

Complete CLI setup and a verified scan before handing the project to mapping, audit, or remediation skills. Recommend dashboard-connected CI, but allow a local-only onboarding path.

## Security rules

- Never ask the user to paste an API key into chat.
- Never place an API key or project ID in a tool call, generated command output, onboarding state, report, source file, or git-tracked file.
- Have the user enter credentials directly in their own terminal.
- Show placeholders only: `b8e_paste_your_ci_token_here` and `prj_paste_your_project_id_here`.
- Do not print environment-variable values. Verify only whether they exist.
- Treat the dashboard organization name or slug as user-provided context. Use `<organization-slug>` in reusable examples and repository content.

## Completion contract

Use `<project-root>/Binclusive-auditing/cli-onboarding.json` as the non-secret onboarding record. Never infer completion from conversation history.

Run `node <this-skill-dir>/scripts/onboarding-state.mjs status <project-root>` first.

- Exit `0`: authenticated dashboard onboarding is complete. Resume the skill that routed here.
- Exit `2`: onboarding is missing, incomplete, or stale. Continue below.
- Exit `1`: state is invalid or unreadable. Explain the error; repair or recreate it only with user approval.

Completion always requires a verified CLI version, `binclusive.json`, and one successful scan. Recommend the dashboard path: login, verified organization/project context, CI credentials, and `binclusive ci` delivery create dashboard tickets for assignment and tracking. If the user declines dashboard delivery, a successful local `binclusive scan` also completes onboarding; state clearly that it neither uploads findings nor creates dashboard tickets.

## Guided workflow

Complete one numbered stage at a time. Before every action, explain what will happen, why it is needed, what the user will see, and whether it opens a browser or changes persistent configuration. Ask only the question needed for that stage, wait for the answer when user action is required, verify the result, and then announce the next stage. Preserve already-verified stages when resuming.

### 1. Verify CLI availability

Tell the user: "First I will check whether Node.js and the Binclusive CLI are available. This does not scan or upload the project."

1. Verify Node.js and npm/npx.
2. Run `npx @binclusive/cli --version` from the project root.
3. Prefer `npx @binclusive/cli`; do not globally install without approval.
4. Use `--help` when command support is uncertain. Do not invent flags from another release.
5. Report the detected version. If unavailable, explain the installation choice and ask permission before installing anything.

### 2. Initialize the project

Explain that `binclusive.json` stores project scan configuration, not dashboard secrets. Ask: "An existing configuration was not found. Shall I start the interactive `binclusive init` setup now?" Skip this question when a valid config already exists.

1. Inspect and preserve an existing `binclusive.json`.
2. If missing, run `npx @binclusive/cli init <project-root>` interactively.
3. Use `--yes` only when the user requests defaults or the run is explicitly non-interactive.
4. Never use `--force` without explicit approval.

### 3. Choose scan destination

Explain the tradeoff before authentication:

- **Dashboard CI (recommended):** uploads findings and creates dashboard tickets so teams can assign, prioritize, and track remediation.
- **Local scan:** keeps results local and requires no dashboard delivery; it does not create dashboard tickets.

Ask which path the user wants. If they choose local, skip stages 3a–4 below and continue at stage 5. Respect the choice without repeatedly prompting.

### 3a. Authenticate and select dashboard context

Do not ask for an organization before login. Explain: "Next, Binclusive will open a browser. Sign in there; if you do not have an account, create one on that screen. Return here after the browser confirms authentication."

1. Run `npx @binclusive/cli whoami` first. If it already confirms an authenticated user, ask whether to keep that account. Do not force a new login.
2. If unauthenticated, ask: "Are you ready for me to open the Binclusive login/signup page?" Then run `npx @binclusive/cli login`.
3. Wait for the browser flow to finish. Ask the user to say when login/signup is complete only if the CLI does not return automatically.
4. Run `whoami` and require an authenticated user.
5. Read the organization from `whoami`. If none exists, explain how to create or join one in the dashboard; do not continue until one exists.
6. If multiple organizations are available or the current one is wrong, list only the choices returned by the CLI, ask "Which organization should receive this project's CI results?", and use `npx @binclusive/cli org --org <id|slug|name>`.
7. Run `whoami` again and summarize the selected organization without writing it to repository files.
8. If no project is selected, list or describe the available project choices when the CLI provides them and ask: "Which dashboard project should receive these accessibility results?" Then run `npx @binclusive/cli project --org <organization> --project <id|name|domain>`.
9. Run `whoami` again and require the intended organization and project. Ask the user to confirm this destination before continuing. Do not store user, organization, or project identifiers in onboarding state.

If browser interaction is available and the user asks to open the settings page, open:

```text
https://app.binclusive.io/<organization-slug>/settings/ci-access
```

Otherwise give the clickable organization-specific link after substituting only the slug supplied by the user. Never use a real customer's slug as a reusable example.

### 4. Configure CI credentials (dashboard path only)

Explain: "The login session identifies you interactively. The next two environment variables authorize automated `binclusive ci` uploads and route findings to the selected dashboard project."

1. Derive the organization slug only after authenticated context is known. Show or open `https://app.binclusive.io/<organization-slug>/settings/ci-access`.
2. Tell the user exactly where to look: copy the CI API key and project ID from the **CI Access** page.
3. Ask which operating system/shell they are using only when it cannot be detected.
4. Show the matching commands below and instruct the user to replace placeholders locally. Never ask them to paste the values into chat.
5. Ask the user to reply only "ayarlandı" after both values are set.

macOS/Linux for the current shell:

```bash
export BINCLUSIVE_API_KEY="b8e_paste_your_ci_token_here"
export BINCLUSIVE_PROJECT_ID="prj_paste_your_project_id_here"
```

Windows PowerShell for the current shell:

```powershell
$env:BINCLUSIVE_API_KEY="b8e_paste_your_ci_token_here"
$env:BINCLUSIVE_PROJECT_ID="prj_paste_your_project_id_here"
```

Windows persistent values for future terminals:

```powershell
setx BINCLUSIVE_API_KEY "b8e_paste_your_ci_token_here"
setx BINCLUSIVE_PROJECT_ID "prj_paste_your_project_id_here"
```

Explain that `setx` does not update the current terminal; set `$env:` too or open a new terminal. For persistence on macOS/Linux, let the user choose the appropriate shell profile and warn that it stores a secret in a plaintext profile. Prefer a secret manager or CI secret store for shared/CI environments.

Verify presence without printing values:

```bash
test -n "$BINCLUSIVE_API_KEY" && test -n "$BINCLUSIVE_PROJECT_ID"
```

```powershell
if (-not $env:BINCLUSIVE_API_KEY -or -not $env:BINCLUSIVE_PROJECT_ID) { throw "Binclusive CI credentials are missing" }
```

If validation fails, explain whether the current shell or future-shell persistence is missing. Do not proceed to CI until both variables are present in the process that will run it.

### 5. Run the selected scan

For the dashboard path, explain: "I will run `binclusive ci`. It uploads findings and creates dashboard tickets for centralized tracking. It may return a failing gate when findings exist; that is different from an upload failure."

1. Ask: "The destination organization and project are confirmed. Shall I run the CI scan and send its findings now?"
2. From the project root run `npx @binclusive/cli ci <project-root> --format json`. Keep stderr visible because dashboard delivery confirmation is written there.
3. Inspect the combined terminal output. Dashboard delivery is proven only by this exact success shape:
   `binclusive ci — uploaded <N> finding(s) to the dashboard.`
4. Reject these as onboarding failures: unusable credential, missing project ID, ingest API rejection, GraphQL/4xx/network failure, or the absence of the upload confirmation.
5. A non-zero exit caused only by `FAIL — gating findings present` is acceptable when the upload confirmation is also present. Record the uploaded count from the confirmation.
6. Report the count to the user and ask them to confirm the run is visible in the selected dashboard project. If it is not visible, keep onboarding incomplete and troubleshoot before any map/audit/fix work.

The current CLI does not call the dashboard ingest path when a CI scan produces zero findings, so it emits no upload confirmation. In that case, state this limitation clearly and keep dashboard-delivery onboarding incomplete; do not pretend an empty local scan was uploaded. A CLI change that records zero-finding runs is required to make that case verifiable.

For the local path:

1. Explain that results remain local and no dashboard tickets will be created.
2. Run `npx @binclusive/cli scan <project-root> --format json` from the project root. Confirm supported syntax with `--help` if needed.
3. Treat a completed scan as verification even when it reports accessibility findings. Command/configuration failures do not complete onboarding.

### 6. Record completion and resume

For the dashboard path, with both environment variables present, run:

```text
node <this-skill-dir>/scripts/onboarding-state.mjs complete <project-root> --cli-version <version> --scan-mode dashboard --ci-target <target> --uploaded-count <N>
```

For the local path, run:

```text
node <this-skill-dir>/scripts/onboarding-state.mjs complete <project-root> --cli-version <version> --scan-mode local
```

Run `status` again. The state records the selected scan mode and verification status. It never records credential values or dashboard identifiers.

This step is internal; do not present it as another user task. Then resume the original request automatically:

- `$map-project` for project inventory
- `$audit-accessibility` after mapping
- `$shopify-theme-audit` for Shopify themes
- `$fix-accessibility` after an audit TODO exists
