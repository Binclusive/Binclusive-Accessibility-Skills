# Binclusive delivery and execution

## Destination and journey

Reuse the sibling's [MCP delivery workflow](../../accessibility-runtime-journey-creator/references/binclusive-delivery.md) for connection/OAuth, organization/project selection, schema discovery, reconciliation and receipts. Resolve supplied names to live IDs and verify project platform and URL/app identifier against the tested environment. Do not create a project or choose an arbitrary organization. If destination/authentication is missing, preserve local work and record the specific blocker.

Use accessibility `create_journey`, with `project_id`, an `aftertest` name, post-fix `description`, and ordered action-only `steps` per the live schema. Omit web `entry`. For launch-to-target mobile journeys omit shortcut entry and retain navigation in the steps; do not skip or duplicate navigation through a deep link/tap-path entry. Save only replayed journeys and capture the returned ID immediately. Reconcile existing journeys and receipts before creates and after ambiguous timeouts; do not blindly duplicate or overwrite. Record limited readback if the API does not expose the complete saved content.

## Runner choice and prerequisites

Discover the currently exposed tools and read their live schemas/descriptions before calls. Known accessibility tools are `start_agentic_audit`, `get_audit_progress` and `get_agentic_audit_report`; names can vary by client. The selected project determines web, Android or iOS execution. Verify that the live tool supports the chosen platform, selected method and build; accepting a mobile journey does not prove mobile runner availability.

For `start_agentic_audit`, supply the selected `organization_id`, `project_id` and an explicit nonempty `journey_ids` list containing only this aftertest's saved journeys. Omitting/emptying the list can run the entire project. For mobile, resolve the user's fixed uploaded build and use `build_target` as `<release>/<dist>` when required/supported. Never invent a build or pass a mobile build target to a web project. Record local discovery and cloud execution build/environment separately; a mismatch blocks a claim about the intended fix.

`import_qa_journeys` / `start_cloud_qa_audit` use a separate Agentic QA model; they are not interchangeable with accessibility journeys or proof of screen-reader accessibility. Do not switch to them to bypass unavailable accessibility execution. If the user explicitly chose QA, explain its evidence limits, inspect platform support (including iOS restrictions), and resolve a compatible accessibility verification method before claiming validation. If the chosen local device/method cannot be used by the available Binclusive runner, ask for the user's supported alternative and record the blocker; do not silently change their method.

## Start, monitor, evaluate

Start only the bounded authorized test. Persist each returned run ID, journey mapping, build, timestamp and destination before monitoring. An ambiguous start response requires reconciliation through available run-history/progress tools before any retry; if identity remains ambiguous, stop retries and report the pending run. Do not rerun completed tests automatically just because evidence is missing.

Poll `get_audit_progress` with the returned run ID at sensible intervals; queued/VM boot/running states are pending, not failures or passes. Follow terminal states and fetch `get_agentic_audit_report` for completed runs with its required organization ID. Save returned report/evidence references and inspect target steps, coverage, screen-reader observations and violations. Run completion alone and “zero violations” alone are insufficient: verify the affected state was reached and the issue-specific behavior was actually evaluated. Distinguish runner/navigation failure, wrong build/state, unavailable accessibility evidence and a reproduced defect.

If execution is unsupported, fails, is cancelled, or remains pending when handing back, update `aftertest.md` with exact status, IDs and resume action. Preserve completed stages so a later run resumes monitoring/evaluation rather than recreating journeys or launching duplicate tests. No recurring monitor is implied. Never auto-resolve the source ticket.
