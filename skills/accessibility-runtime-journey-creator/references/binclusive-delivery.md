# Binclusive accessibility journey delivery

## Connect and authenticate after local save

Use `https://mcp.binclusive.io/mcp`. Inspect active tools and the active AI client's workspace/global server registry without dumping credentials. A working Binclusive integration may be exposed with a different namespace or connector name; reuse it rather than registering a duplicate. An endpoint configured in a file is not authenticated access.

If missing, register the remote Streamable HTTP endpoint through the current client's supported MCP UI/CLI, preserving unrelated configuration. On Codex, inspect installed CLI help and existing entries, then use:

```sh
codex mcp add binclusive --url https://mcp.binclusive.io/mcp
codex mcp login binclusive
```

The add flow may already start OAuth; do not start a second concurrent login. See [official Codex MCP guidance](https://learn.chatgpt.com/docs/extend/mcp). For other AI clients use their documented remote-MCP and OAuth workflow. Open the returned authorization URL through the supported browser/auth mechanism so the user can authorize it. Never fabricate an authorization URL or ask for tokens in chat. If no supported OAuth launcher is exposed, provide the exact client setup/Authenticate step and wait for the user; do not claim to have opened it. Save a resume point before reconnect/restart. Verify authenticated identity via the live viewer tool after authorization. If login fails or is cancelled, stop delivery attempts, retain the local document and report the next actionable step.

## Organization and project selection

Discover live identity, organization, project, journey-list/create and readback schemas. Have the user select the destination organization, then list that organization's projects (including pagination) and have the user select a compatible Web/Android/iOS project for the observed URL/app identifier. Credit an already explicit organization/project; resolve and confirm its identity rather than asking again. OAuth membership alone is not a project choice. If the connection is bound to another organization, use only a documented switch/re-authentication route and verify it; never invent an organization-switch tool. Do not create a new project or use a similarly named project without the user's instruction.

Show the final locally saved journeys before delivery. Continue when the explicit skill invocation or prior user request authorizes publishing and the destination is selected. Respect local-only instructions; if invocation was implicit and delivery intent is unclear, ask whether to add these journeys. No extra approval is needed when content/destination and publishing are already authorized. This workflow saves accessibility journeys and never starts an audit/cloud run automatically.

## Native payload contract

Use accessibility `create_journey`, never Agentic QA `import_qa_journeys`. Inspect the **live** schema; do not copy the source-authoring sibling skill's check-containing examples into this runtime workflow.

| Field | Mapping |
| --- | --- |
| `project_id` | User-selected authorized project, added at call time. |
| `name` | Journey title. Distinguish platform/locale/branch if needed. |
| `description` | Plain-text description, starting state and non-secret fixtures. |
| `steps` | Nonempty ordered `string[]`, one direct action per unnumbered string; no checks, assertions, step objects or Markdown. |
| `entry` | Mobile only, and only if supported by the live schema and actually verified. Omit for web. |

Supported known mobile entry shapes are `{"kind":"deep_link","url":"scheme://verified-path"}` or `{"kind":"tap_path","taps":["Observed menu","Observed destination"]}`. Do not guess a deep link or duplicate entry taps in steps. Launch-state journeys can omit entry when the starting app state is documented. Payload acceptance does not establish cloud mobile runner availability.

Export only complete, runtime-verified bounded journeys with known prerequisites and no unresolved placeholders or secrets. Incomplete/blocked candidates remain in local drafts and coverage evidence. Keep native definitions in `Binclusive-auditing/<app-or-site>/journeys/accessibility-test-journeys.json`; local IDs, observations, coverage and sync metadata belong in separate files, not MCP fields. The required user deliverable remains the root `binclusive-accessibility-test-journies.md`.

## Reconcile, save and verify

Before writing, list all existing accessibility journeys for the selected project and reconcile them with local receipts and exact normalized title/description/ordered actions/entry. Skip identical saved content. Similar titles with different steps are conflicts to resolve, not permission to overwrite. Update an existing journey only with authorization; otherwise ask how to handle the conflict. Create one journey at a time and immediately persist returned IDs, selected organization/project, local content revision and per-item status in a sync receipt. Verify saved content using available readback/list tools. If the API provides no adequate readback, record that limitation rather than claim a full content check.

On an ambiguous timeout, re-list/read and reconcile before retrying to avoid duplicates. If still ambiguous, stop that item's retries and preserve its pending state; continue independent items only where safe. Do not blindly retry the whole set. Report exact saved/skipped/failed/pending counts and IDs. Never upload the Markdown document, device snapshots, credentials or evidence ledger as the journey description.
