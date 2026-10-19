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

Read the authenticated ticket-creation tool's live input schema, required fields, enums, formats, and descriptions before building payloads. The mapping below follows the Binclusive MCP contract; if the deployed schema differs, adapt without inventing fields.

Reference contracts (recheck when the schema changes):
- https://github.com/Binclusive/monorepo/blob/main/services/mcp/src/findings/adapters/driving/tools.ts
- https://github.com/Binclusive/monorepo/blob/main/services/mcp/docs/reference/vocabularies.md

## Map each finding to structured fields

Parse individual open TODO findings. The Markdown file is a local input, never an upload payload. Create one ticket per finding. Never send the whole file, a raw finding section, summary table, coverage ledger, or sync receipt in any field or attachment.

| MCP input | Source and transformation |
| --- | --- |
| `organization_id` | ID from the user-selected `list_organizations` result; required for user authentication. Do not use the default organization from `get_viewer`. |
| `project_id` | ID of the selected project belonging to that organization. |
| `location` | Verified occurrence location using one of the shapes below. |
| `element` | Verified DOM selector or accessibility-tree path. A task ID or component name alone is not a locator. |
| `criterion` | Explicit, verified WCAG success-criterion ID, e.g. `1.4.3`; omit when unmapped. Never guess from severity or fix type. |
| `impact` | Severity normalized to `critical`, `serious`, `moderate`, or `minor`. Use `unknown` only for explicitly unjudged impact when accepted by the live schema. |
| `evidence` | Plain-language observation from the detailed problem and verified code/runtime evidence: what is missing or behaving incorrectly at the element. Preserve static/runtime uncertainty; do not paste source code. |
| `description` | Finding title and detailed problem as prose explaining affected behavior and user impact. Include only context relevant to this finding, without duplicating dedicated fields. |
| `recommendation` | Correct solution rewritten as actionable prose, followed by verification steps. Preserve runtime checks and risk/approval qualifications; do not paste solution code. |

The current creation schema has no `title`, `status`, `priority`, `assignee`, `fixType`, or external task-reference input. Do not send unsupported keys, equate severity with priority, or force local TODO status onto a server-assigned status. Keep stable task IDs and unmapped audit metadata in the local report and sync receipt. If a future schema exposes an exact native reference field, use it.

### Location and evidence

- For a verified rendered page, use `{ "type": "page", "url": "<observed page URL>" }`. A route or source path alone is not a verified page URL; never invent a host or use a file path as a URL.
- For static source findings, use `{ "type": "source", "path": "<repo-relative file>", "lineHash": "<fingerprint>", "index": <occurrence index>, "line": <optional display line> }`. Read the actual offending source line. Compute `lineHash` as hexadecimal MD5 with spaces and tabs removed: `crypto.createHash("md5").update(line.replace(/[ \t]/g, "")).digest("hex")`. `index` is zero-based among identical normalized lines in that file; optional `line` is the verified one-based line number. Never hash TODO text, substitute a line number for a hash, or add snippet/source properties to location.
- For native/mobile findings, use a verified source location and accessibility-tree path when available. Do not fabricate web selectors or URLs.
- Verify missing required values from source/runtime evidence or ask only for missing data. Leave an unresolved ticket pending; never send placeholders or fabricated observations.

### Plain text, not Markdown

Convert Markdown field values into ordinary text before assigning MCP string fields. Remove heading, checkbox, list, emphasis, table, inline-code, and code-fence formatting; convert links to their label and URL. Preserve meaningful words, identifiers, URLs, and line breaks. Do not strip punctuation belonging to selectors or identifiers.

Describe code evidence and remediation in prose; keep exact original and proposed code in the local TODO. Never serialize Markdown, HTML, rich-text documents, or a JSON copy of the finding inside `description`, `evidence`, or `recommendation`.

For the synthetic icon-button TODO, after verifying the actual occurrence, use text such as:

```json
{
  "impact": "serious",
  "evidence": "The close button contains only an icon and has no accessible name in the verified source.",
  "description": "Icon-only button has no accessible name. Screen-reader users cannot identify the shared close control's action.",
  "recommendation": "Give the button a localized accessible name describing the close action and hide the decorative icon from assistive technology. Verify that the accessibility tree exposes the intended localized close action as the button name."
}
```

This illustrates text fields, not a complete tool call. Resolve the actual selector/tree path, organization, project, and location before sending. Do not infer a criterion absent from the report.

The local report remains the full audit record. Keep report-only metadata and exact code there rather than duplicating them into dashboard prose. Preserve the meaning of the problem, evidence, user impact, remediation, and verification during conversion. If a field limit would remove essential information, leave the ticket pending and report the limitation instead of truncating or reverting to a Markdown dump.

## Create and verify all tickets

1. Parse open TODO finding bodies in report order, keyed by stable task ID. Do not count summary-table rows as extra findings or republish completed tasks.
2. Check local sync receipts and available ticket lookup tools for verified task-to-ticket mappings in the same destination. Where supported, also compare exact occurrence identity (location, element, criterion). Do not merge merely similar findings. Resolve uncertain prior call outcomes before retrying; local task IDs are not searchable remote fields in the current schema.
3. Before each call, validate required fields, accepted enums, location shape, and that every value belongs to this finding. Ensure text fields contain prose rather than raw report sections or formatting. Create one ticket using the structured mapping above.
4. Inspect both transport success and the tool's error/result body. Record failures and reasons; retry only when duplicates can be ruled out.
5. Verify returned finding/ticket IDs and destination through returned data or a supported read tool. Where readable, compare saved impact, location, evidence, description, and recommendation with the mapped values. Report created, already existing, pending, and failed counts with task IDs.
6. Append a `Dashboard sync` receipt locally with destination names, timestamp, report fingerprint when available, and `TASK-ID -> finding ID / ticket ID / URL` results, including pending/failed reasons. Preserve original finding data. Never store auth tokens or secrets.
7. Claim full sync only when every open TODO is verified-created or verified-existing in the selected project. Never create test tickets just to validate formatting.
