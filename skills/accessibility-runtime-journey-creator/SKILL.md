---
name: accessibility-runtime-journey-creator
description: Co-create Binclusive accessibility journeys by inspecting a live website page by page in Google Chrome. Use for runtime journey creation from a URL, robots.txt/sitemap discovery, multilingual flow comparisons, or "siteyi Chrome ile inceleyip journey oluştur". Produces local evidence and native journey definitions; does not replace a complete accessibility audit or publish/run cloud tests implicitly.
---

# Accessibility Runtime Journey Creator

Create user-directed journeys from observed Chrome pages and interactions, without requiring source access. Read [references/runtime-workflow.md](references/runtime-workflow.md). Reuse `accessibility-test-journey-creator/references/guided-authoring.md` for focused questions and `accessibility-test-journey-creator/references/binclusive-format.md` for native exports when those sibling resources are installed; the essential contract and interaction rules are also specified below.

## Guided runtime workflow

1. Credit existing user answers. Ask one focused unresolved question at a time about goal, scope, locale, starting state, test data or expected outcome. Let the user select/correct flows; do not silently equate discovery with user review. While waiting, inspect only already authorized scope.
2. Connect to Google Chrome through the active harness's supported browser integration. Read its current browser documentation and use its documented observation/interaction APIs. Do not substitute another browser, hidden HTTP scraper, source scan or guessed automation API for Chrome runtime evidence. If unavailable, record the blocker and request the connection.
3. Open the supplied homepage, record final origin/redirect, title, locale and browser conditions. Then read the final origin's robots.txt in Chrome, follow declared Sitemap URLs and sitemap indexes, and merge discovered page URLs with actual navigation/footer/content links. Robots.txt is discovery/policy metadata, not a complete URL inventory. Record inaccessible metadata and use observed navigation as a clearly incomplete fallback; do not bypass browser security/client blocks.
4. Normalize/deduplicate URLs without dropping meaningful query states or locales. Limit to the authorized host/locale/path set. Treat hash controls as interaction states, not new pages. Respect applicable robots restrictions for automated traversal. Keep documents, external links, auth gates and non-HTML resources separately classified. Guard against sitemap cycles, off-site entries and infinite pagination/calendar/query expansion.
5. Build a reconciled ledger of discovered, inspected, blocked, redirected, deferred and excluded URLs. Inspect each in-scope page individually in Chrome, including its real headings/landmarks, visible controls/labels, links, form fields, options, tabs, accordions and dynamic states. Shared templates do not prove an unvisited page. Keep pagination and newly discovered pages on the queue; never call a sampled/partial traversal complete.
6. Exercise relevant reversible actions with fresh observations after state changes. Record actual target context, action, input, resulting URL/state and evidence. Inspect keyboard/focus behavior where pertinent, but claim screen-reader verification only when actually observed with that assistive technology. DOM/AX snapshots alone do not prove speech or usability.
7. Ask the user to choose/refine candidate goals and resolve ambiguous branches. Compare locale counterparts by real structure, available actions, steps and business content; do not assume translated URLs or labels. Combine equivalent flows in one reviewed definition only when language navigation and instructions remain unambiguous. Split genuinely different flows and record locale-only label differences in local evidence. User acceptance, technical readiness, and execution results are separate states.

## Forms and consequential steps

Form discovery does not authorize submission. If the user explicitly asks for submission, preserve that authorization and use agreed synthetic non-secret data for the named site; inspect fields and the actual result. Never use invented real contact details, upload personal files, subscribe, apply for jobs, send complaints or place orders merely because a form exists. Clarify destination/purpose when needed. Follow the browser tool's action-time rules for CAPTCHA, binding agreements, payments and sensitive data. If blocked, save a bounded journey up to that step, with the unresolved action marked locally. Never claim delivery from a click alone. Do not send test submissions repeatedly after ambiguous outcomes.

## Local outputs and native contract

Write site-specific artifacts under `Binclusive-auditing/<site>/journeys/` so they cannot overwrite another site's work:

- `page-inventory.json`: discovered URLs, provenance, locale, final URLs, inspection status and reason, observed page structure, and scope/count reconciliation.
- `accessibility-test-journeys-review.md`: numbered user-facing journeys, prerequisites/test data, observed versus intended checks, evidence per step, locale comparisons, user decisions, pending question, blockers and reviewed revision.
- `accessibility-test-journeys-drafts.json`: native-shaped candidate definitions pending review, with local readiness/evidence in the separate review, never mixed into MCP arguments.
- `accessibility-test-journeys.json`: only user-accepted, technically ready definitions. Empty when review/blockers remain unresolved.

Native definitions have `name`, optional plain-text `description`, and ordered non-empty `steps: string[]`. Use one action/check per unnumbered string. Web definitions have no mobile entry. Add authorized `project_id` only at create_journey call time, after live schema discovery. Do not send unsupported locale/startUrl/expectedResult fields from the distinct QA journey API. Use actual full starting URLs and real localized labels. Keep review Markdown, evidence ledgers and source/page dumps local.

Technical readiness is draft, runtime-observed (targets/states inspected), or runtime-verified (entire bounded flow executed with results). User review is independently pending, accepted, or changes-requested. Show complete entry, ordered actions, data and expected checks before acceptance. A source/runtime observation is not user acceptance, and a user expectation is not a test pass. Preserve session decisions and re-review only materially changed flows.

Validate JSON structure, actual URLs/targets, evidence links, locale equivalence, absence of unresolved placeholders/secrets, and ledger totals. State exact coverage and any unexecuted checks. Do not call runtime inspection a complete WCAG audit.

## Optional publishing

Publish only when requested, to an authenticated user-selected project. Discover live list_journeys/create_journey/update_journey schemas. Compare saved content and local ID receipts to avoid duplicates; resolve ambiguous outcomes before retrying, and update only with authorization. Send one native definition per journey, verify returned IDs/content and record receipts locally. Saving does not start a cloud audit; that is separately authorized and uses explicit saved accessibility journey IDs. Never upload the review Markdown.
