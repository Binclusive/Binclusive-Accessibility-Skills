# Binclusive Dashboard Ticket Sync

Use this workflow after `Binclusive-auditing/accessibility-todo.md` has been written and verified. Publishing is optional and must never delay or invalidate the local report.

## Offer the sync

Ask once: "Accessibility TODO'larını Binclusive dashboard'a aktarmak ister misiniz? Önerilir: her bulgu organizasyonunuzun projesinde takip edilebilir bir ticket olur."

If the user declines, keep the local report unchanged and finish. If they accept, continue below.

In CI/Diff Mode or another non-interactive run, do not configure MCP, open a browser, prompt for a destination, or create tickets. Keep the TODO artifact local and print a short recommendation to run the dashboard sync interactively later.

## Connect the Binclusive MCP server

Use the remote MCP endpoint `https://mcp.binclusive.io/mcp`. MCP setup is separate from CLI onboarding; do not assume that a working CLI or `cli-onboarding.json` means the MCP server is configured.

Connection has exactly one owner per harness, and this file is not it: the **Claude Code plugin** owns Claude MCP, and the **dashboard Integrations → MCP page** owns per-harness connect for every other client. Route the user to the owning surface. Never reproduce a per-harness connect snippet here — those snippets live in the dashboard, and a copy in this file is one more thing to drift.

1. Detect whether the active client already exposes Binclusive MCP tools. Prefer capability/tool discovery over inspecting secrets or guessing from CLI state.
2. If absent, explain that connecting changes persistent client configuration and that first use opens a browser for Binclusive OAuth login. Ask permission before configuring it.
3. Route by harness:
   - **Claude Code** — the `accessibility@binclusive` plugin ships the skills and the MCP server together, so installing the plugin *is* the connect step: `claude plugin marketplace add Binclusive/Binclusive-Accessibility-Skills`, then `claude plugin install accessibility@binclusive`. Do not run `claude mcp add` for this endpoint: the plugin's manifest already declares the server, so a hand-added entry is a second competing registration with its own OAuth and no plugin attribution. When the plugin is already installed the server is already declared — verify with `claude mcp list` and reconnect, rather than adding anything. Installing skills with `scripts/install.sh` copies skill files only and never wires MCP, so a skills-only install still needs the plugin (or another client) for the sync.
   - **Every other client** (Codex, Cursor, Windsurf, VS Code, Zed, Claude Desktop) — send the user to the authed dashboard page, which renders a tabbed, copy-to-clipboard snippet per harness: `https://app.binclusive.io/<organization-slug>/integrations/mcp`. Substitute only the slug the user supplies. Do not guess a config file path or invent a command.
4. Reload/reconnect the MCP client if required. Invoke a harmless Binclusive list/identity tool to trigger OAuth. Tell the user to finish login in the browser; never request credentials or tokens in chat.
5. After authentication, rediscover the available Binclusive tools and their live input schemas. Do not continue until the organization/project listing tools and ticket-creation tool are available.

`binclusive init --mcp` and `binclusive add mcp` write no MCP configuration for any harness. They print the dashboard pointer and, when Claude is detected, offer the same plugin install as above — so they are another entrance to this routing, never a third mechanism to reconcile against.

OAuth and endpoint behavior are documented at `https://www.binclusive.io/en/blog/binclusive-mcp-server-is-now-live`.

## Select the destination

1. List only organizations returned by the authenticated Binclusive MCP tools. Ask which organization should receive the audit tickets.
2. List only projects belonging to the selected organization. Ask which project should receive the tickets.
3. State the selected organization and project and ask for one final confirmation before creating any tickets.
4. Never persist organization/project identifiers into reusable skill files. Use them only in the authenticated tool calls and, if useful, the local sync receipt.

## Inspect `create_ticket` before mapping

Read the live MCP tool definition for the ticket creation tool (commonly `create_ticket`) after authentication. Treat its current `inputSchema`, required fields, enums, formats, and descriptions as authoritative. Do not hard-code a historical field list.

Build the mapping for the current schema:

- Map a TODO value to a native ticket field only when the meaning is an exact match.
- Always populate every required field from verified report data or the user-selected organization/project context.
- Never invent assignees, due dates, statuses, asset IDs, WCAG criteria, URLs, or enum values.
- If a required field cannot be derived safely, pause before creating tickets and ask only for that missing value.
- Preserve the TODO's stable task ID in a native external/reference field when an exact field exists; otherwise include it in both the title and description.
- Use schema-supported native fields for exact matches such as title, project, severity/priority, status, location, WCAG criterion, component, or source only when the schema explicitly exposes them and accepts the report's value.

## Lossless description envelope

For every TODO, put all information that is not represented exactly in a native `create_ticket` field into `description`. To make the transfer auditable, include the complete finding even when some values are also mapped natively. Preserve fenced code verbatim.

Use this structure, omitting only fields that truly do not exist in the source report:

````md
## Binclusive audit finding

- Task ID: <TASK-001>
- Source report: Binclusive-auditing/accessibility-todo.md
- Component / Page / Screen: <value>
- File path: <value>
- Used in pages/screens: <value>
- Severity: <value>
- Fix Type: <value>
- Status: <value>
- Provenance: <value, when present>
- Coverage bucket: <value, when present>
- WCAG / APG / platform impact: <value, when present>

### Code block in question
```<language>
<exact source-report code block>
```

### Problem (detailed)
<complete value>

### Correct solution
<complete value>

### Verification
<complete value>

### Additional source data
<every remaining key/value, note, context, metadata, or custom field from this finding that was not listed above>

### Audit context
<report-level project, framework/platform, scope, date, map reference, static/runtime note, blind spots, and coverage-ledger context relevant to this finding>
````

Do not truncate, summarize away, or silently drop source fields. If the MCP schema imposes a description limit, create the most lossless valid representation and stop for user direction before omitting anything; do not split one finding into multiple tickets without approval.

## Create and verify all tickets

1. Parse every open `TODO` finding from the active report before writing. Build a deterministic queue ordered by report order/stable task ID.
2. Check available list/search tools for an existing ticket carrying the same project plus stable task ID. Reuse/skip exact matches rather than creating duplicates; do not merge merely similar findings.
3. Create one ticket per TODO with the live schema mapping and lossless description envelope.
4. Continue through the queue while calls succeed. On a failure, retain the failed item and reason, then continue only when retrying cannot create duplicates.
5. Verify each returned ticket ID and destination. Report counts for created, already existing, and failed tickets, and list failed task IDs.
6. Append a `Dashboard sync` receipt to the TODO report with destination names, timestamp, source report fingerprint when available, and `TASK-ID -> ticket ID/URL` results. Never store auth tokens, secrets, or reusable customer identifiers.
7. Claim full sync only when every open TODO is either verified-created or verified-existing in the selected project.
