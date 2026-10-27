# aftertest.md

Keep this report in the selected working folder. Append attempts or update the same issue using stable source references; preserve previous evidence and unrelated results. Store large snapshots in a scoped artifact folder and link them. Exclude credentials and private authentication data.

For each issue record:

- Source: input filename + sheet/row or page/section, or Binclusive ticket ID; original issue and acceptance condition.
- Context: platform, app URL/package/bundle ID, role/locale, fixed version/build/environment, user's chosen method and device/browser.
- Control proof: observation, reversible action and observed result; unavailable capability if blocked.
- Location: supplied hints, candidates/paths searched, observed target and corroborating evidence; unresolved ambiguity or user's clarification.
- Journey: exact `aftertest` name, description, initial launch/authentication state, fixtures, local Markdown/native paths, replay result and issue mapping.
- Delivery: selected organization/project IDs, saved journey ID, receipt/readback outcome or delivery blocker.
- Execution: runner/method, actual build/environment, run ID, timestamps, progress/terminal state and report/evidence references.
- Validation: expected behavior versus observed behavior at the affected step/state; coverage and evidence limitations.
- Result: **passed**, **failed**, **unable-to-validate** or **pending**. State why, including exactly what could not be verified. Pending means a known run is still queued/running; inability to start or establish evidence is unable-to-validate.
- Next action/resume point: missing location, fixture, build, connection, supported runner or evidence; retain existing IDs to avoid duplicate publication/execution.

A compact batch summary lists counts per result and unresolved actions. Mark unattempted items explicitly; never fold them into passed counts. Report a reproduced defect as failed even if other requested evidence remains unavailable, and describe the remaining gap.
