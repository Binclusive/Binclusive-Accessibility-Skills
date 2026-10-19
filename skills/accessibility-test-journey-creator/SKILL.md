---
name: accessibility-test-journey-creator
description: Co-create Binclusive accessibility test journeys with the user through focused questions and web/mobile source inspection. Use for guided journey creation, extracting click/type/select/check flows from code, or "birlikte test journey oluşturalım". Produces user-reviewed local drafts and native accessibility-journey definitions. Does not replace accessibility auditing or create Agentic QA journeys.
---

# Accessibility Test Journey Creator

Co-create user-directed, source-backed flows for Binclusive accessibility automation. Start with [references/guided-authoring.md](references/guided-authoring.md) for the conversation. Use [references/extraction.md](references/extraction.md) for platform evidence and [references/binclusive-format.md](references/binclusive-format.md) for the native contract and examples.

## Resolve scope

Guided co-authoring is the default. Use the user's existing answers; ask one focused question at a time and wait before making a dependent decision. Establish the user goal, offer source-backed candidate flows, and let the user select and correct the journey. Never silently choose the primary flows on the user's behalf. Code discovery suggests possibilities; the user directs the scope, business scenario, starting state, data, and expected outcome.

Reuse current maps/tests as discovery aids, then verify relevant source. Do not force a full map or CLI scan. Inspect independently while an answer is pending only within established scope; do not treat silence as selection or review. If explicitly asked for one-shot/best-effort output, skip the interview and label unreviewed drafts and assumptions. Do not change application code.

When journeys are requested alongside mapping/auditing, reuse source reads and the coverage ledger. Ordinary audits do not implicitly authorize journey creation or publishing. Findings stay in accessibility-todo.md; journeys have separate artifacts.

## Trace reachable flows

1. Enumerate in-scope routes/screens, components, handlers, navigation edges, validation branches, and interaction tests. Exclude generated/vendor/build output. Record source revision, files read, and partial/unread scope or stale-map limitations.
2. Follow a user goal from a known entry through actual component/handler transitions to a source-supported end state. Account for authentication, roles, flags, permissions, loading, error states, and fixtures. File order is not interaction order; never stitch unrelated controls into a flow.
3. Extract visible localized names, roles, stable identifiers, input semantics, options, and state changes. Trace custom component props to implementation. An onClick/onPress alone does not prove an accessible button or spoken name.
4. Separate mutually exclusive branches into journeys with explicit prerequisites. Prefer primary flows and relevant validation/keyboard alternatives over every possible combination. Mark backend behavior known only at runtime as unresolved.
5. Assign stable local journey/step IDs with source file:line evidence for each action and expected outcome. Label evidence source-confirmed, runtime-confirmed, user-provided, or inferred, explaining uncertainty and conflicts. A user statement establishes intended behavior, not source/runtime confirmation. Evidence labels never establish accessibility conformance.

## Write actionable steps

Use the user's language and the app's actual UI locale. One action per step; no embedded numbering in exported strings. Distinguish repeated labels by screen/region. Use activate/tap, enter, choose, check/uncheck, or navigate according to control semantics. Set a switch to a named state instead of saying toggle.

Add observable checkpoints after navigation, submission, expansion, or validation. Derive expected states from source or flag them unverified. Wait for named states, not arbitrary sleeps. Include keyboard, focus, and screen-reader checks where relevant as expectations to test, never claims of passed tests. Do not use screen coordinates, nth-child positions, invented labels, or actions that bypass the interaction being tested.

Web routes require a verified base URL. Mobile requires a known launch state, deep link, or tap-path entry; do not repeat entry taps in steps. Create separate web/iOS/Android variants when implementation differs. Do not invent app identifiers, link schemes, or native browser support.

Use synthetic non-secret fixtures and explicit setup/reset requirements. Passwords, OTPs, and personal data stay out of artifacts and MCP payloads. Never read secrets into outputs. Unresolved data bindings keep a candidate draft: string steps do not provide a variable-interpolation engine. Flag consequential actions and sandbox requirements; creating a journey does not authorize executing it.

## Export and assess readiness

Write under `Binclusive-auditing/journeys/`, preserving unrelated existing journeys:

- `accessibility-test-journeys.json`: array of publishable native definitions only, as specified in the format reference. No Markdown, review metadata, unsupported step objects, or unresolved placeholders. Use an empty array when all candidates are drafts.
- `accessibility-test-journeys-review.md`: numbered flows, stable IDs, platform/locale, prerequisites, fixtures/reset, source references per step, expected outcomes, evidence labels, coverage gaps, readiness and blockers. Blocked candidate steps belong here; this local record is never a dashboard description dump.

Track technical readiness (draft, source-ready, runtime-verified) separately from user review (pending, accepted, changes-requested) in the local review. Source-ready means entry, targets, values, sequence, and prerequisites are resolved sufficiently to execute; it does not mean tested. Runtime-verified requires observed execution evidence. Only export accepted, technically ready candidates. One-shot/unanswered reviews remain drafts in the local review; the publishable array may be empty. Never claim that a user review verifies runtime behavior.

Show a complete numbered preview of the selected journey, including entry, setup, data and expected results, before requesting user review. Apply corrections, show the changed steps, and ask only about the changed scope. Previously accepted unchanged journeys need no repeated review. Persist decisions, pending question, reviewed revision and blockers locally so the session can resume without repeating the interview. Material source/user changes make the affected journey review pending again.

Before finishing, parse JSON, check allowed fields and non-empty ordered strings, trace every exported action/check to source or observation, resolve target/locale ambiguity, and reconcile exported/draft counts. Retain local IDs on repeat runs and refresh affected flows. Report derivation, blockers, and whether any execution occurred.

## Optional publishing and execution

Local creation is the default. When asked to publish, discover authenticated Binclusive tools and inspect live create_journey. Reuse an authorized destination; otherwise select organization/project through authenticated listings. Resolve connection through the Binclusive plugin/dashboard integration; never invent setup commands or request secrets.

List saved journeys and consult the local sync receipt before creating. Compare exact destination and content; do not overwrite same-named journeys automatically. Update only when authorized: steps replaces the entire list. Resolve uncertain outcomes before retrying. Send one native payload per ready journey, record local ID to returned ID, and verify saved steps/entry using supported reads. Keep source evidence and review Markdown local.

Publishing does not start an audit. Run only when requested, with saved accessibility journey IDs and verified runner/project platform support. Never substitute QA IDs or omit journey_ids such that all project journeys run unintentionally. Report save success separately from execution; a saved mobile journey proves neither runner availability nor a passed audit.
