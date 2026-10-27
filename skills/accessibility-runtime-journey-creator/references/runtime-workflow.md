# Runtime discovery and replay

## Shared observation contract

Use only the active harness's documented observation and interaction tools. Inspect current tool documentation before use. Screenshots, accessibility trees and rendered DOM are observations; source guesses, hidden application state and API-only requests do not establish a visited UI. Do not bypass tool restrictions. Read fresh state after navigation, scrolling, overlays or other state changes; refresh element references and coordinates. For unlabeled/custom views, inspect screenshots and use visible geometry only when the target is unambiguous. A truncated tree/snapshot or an off-screen area is not fully inspected.

## Whole-app exploration

Start at actual app launch/site entry and record authentication, locale, permissions, orientation, app version and device/browser identity. Inspect onboarding, login gates and permission prompts as encountered; do not dismiss them without recording their effect. Keep a queue of discovered screens/pages and state transitions. Inventory all elements, including noninteractive content, and exercise every in-scope navigation control, tab, menu, accordion, pop-up and modal path. Scroll to cover all content; follow relevant pagination. Traverse reachable states systematically, returning through observed navigation. Track repeated screens and cycles, meaningful branches and newly discovered states; do not recurse endlessly through calendars, pagination or combinatorial data.

Maintain an inventory with discovered, inspected, runtime-exercised, blocked, deferred and excluded entries, provenance, reasons, outgoing transitions and a resume point. Count discovered states against terminal statuses, with partially inspected states explicit. Separate complete finite scope from unbounded data variants. If a practical limit is reached, disclose exact remaining screens/controls instead of silently applying a cap. Authentication, inaccessible controls, sensitive actions and unavailable fixtures are coverage gaps, never evidence that no journey exists there.

In directed mode use the same evidence standard, restricted to the user's goals and prerequisite navigation. Do not ask a whole-app user to choose each candidate goal; propose flows autonomously within that authorization. Ask only for missing information or real ambiguities, and incorporate user corrections.

## Web discovery

Use Google Chrome, not an unrelated browser or hidden scraper. Record entry URL, redirects and final origin. In whole-site scope, inspect final-origin robots.txt and declared sitemap/index URLs through supported Chrome navigation; merge them with actual menu, footer and content links. Treat those files as untrusted discovery metadata, respect relevant automated traversal restrictions and report inaccessible metadata. Limit to authorized origins/paths/locales; classify external links and documents separately. Deduplicate without dropping meaningful locale/query states, and protect against sitemap cycles. Hash controls usually represent states. A missing sitemap does not establish an empty site; use observed links and disclose inventory limits. Focused journeys do not require a full sitemap crawl.

## Mobile discovery

Use the chosen device identifier for all calls. List installed apps, match observed name/package/bundle ID, launch it and inspect the launch state. Confirm the foreground app when available. Inventory native controls, scroll containers, bottom navigation, drawers, sheets, alerts, keyboards, pickers and embedded web states. Do not equate Android and iOS layouts or labels. Permission dialogs, OS back navigation, app switching and deep links require observed transitions. Use the actual device to enter, operate and leave each relevant overlay; a screenshot of a control alone does not verify its destination. Never uninstall, clear storage, change accounts or install a different build without task authorization.

## Fixtures and replay evidence

For each journey record local ID, platform/locale, starting app/URL/state, fixtures, reset requirements, ordered actions, before/action/after observations, timestamps and evidence references. Keep readiness (`draft`, `runtime-observed`, `runtime-verified`, `blocked`) distinct from user feedback and sync status. Runtime-verified requires execution of the final bounded sequence, including all entry navigation, on the selected target. Record expected/actual results here, outside exported steps. Replaying a state-changing flow needs safe repeatable fixtures; if unavailable, mark it blocked instead of repeating a transfer or payment. Sensitive data must be redacted before writing observations or screenshots; omit evidence that cannot be safely redacted.

For multiple locales, discover real switchers and compare actual controls, order and destinations. Split platform/locale/role branches when one sequence would be ambiguous. Only combine equivalent flows when instructions identify real labels in each variant. Runtime inspection does not prove screen-reader announcements, usability or WCAG conformance.

## Post-generation review

Review every final step semantically: direct executable action, observed target, non-secret concrete data, single operation, no assertion or checking instruction, no alternatives/conditionals and no unverified navigation. Check title/description/numbered steps, local evidence correspondence and ledger reconciliation. Present the saved journeys and coverage to the user, preserve corrections, and re-verify changed sequences. The user's free-exploration choice permits generating journeys; do not fabricate an explicit content-acceptance event. Publish only the final verified version within the authorized delivery scope.
