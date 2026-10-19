---
name: audit-runtime-accessibility
description: Audit a live web page or user-provided browser flow through a connected Chrome, external browser extension, or harness browser. Use when the user asks for runtime accessibility testing of localhost or a URL, visible or interactive element inspection, keyboard navigation, focus behavior, autocomplete/date-picker/dialog testing, or step-by-step accessibility validation in Codex, Claude Code, or another browser-capable agent harness.
---

# Audit Runtime Accessibility

Test the rendered interface and its state changes in a connected browser. Observe and report only; do not edit application source.

## Required references

Read these files before starting the audit:

- `references/runtime-checks.md` for element, interaction, keyboard, focus, and state-change checks.
- `references/report-format.md` for the evidence ledger and report schema.

## 1. Establish scope and browser

1. Resolve the target URL. Accept `http://localhost`, loopback addresses, development URLs, and public URLs. Never replace a user-specified URL with search results or a different site.
2. If the user supplied a flow, preserve its order and values. Treat each numbered instruction as a test step. If no flow was supplied, audit the initial page and exercise only reversible interactions needed to expose component states.
3. Prefer the browser explicitly named by the user. If Chrome or an external browser extension was requested, do not silently substitute another browser.
4. Use the active harness's supported browser connection:
   - **Codex:** invoke and follow the installed Browser/Chrome control skill, connect to the requested browser family, and read that browser's runtime documentation before interaction.
   - **Claude Code:** use its connected Chrome/browser integration and its current tool documentation.
   - **Other harnesses:** use their connected-browser primitive only when it exposes page inspection plus keyboard/click/type interaction.
5. If no connected browser capability exists, stop and explain the missing browser connection. Do not claim a runtime audit from fetched HTML, source code, or screenshots alone.
6. Keep authentication and session state in the selected browser. Do not inspect cookies, passwords, local storage, session storage, or browser profile files.

## 2. Set safety boundaries

- Follow user-provided navigation and form steps, including reversible searches and selections.
- Pause before purchases, account deletion, publishing, sending messages, final booking, or any other irreversible/external side effect unless the user explicitly authorized that exact action.
- Never enter secrets that the user did not provide for the flow.
- Do not disable page behavior, inject accessibility fixes, or mutate the DOM to make a test pass.

## 3. Capture the baseline state

After navigation settles:

1. Record URL, document title, viewport when available, visible heading structure, landmarks, dialogs, alerts, and current focus.
2. Inventory every currently visible interactive element in reading order: links, buttons, inputs, textareas, selects, comboboxes, checkboxes, radios, switches, tabs, menu items, disclosure controls, date controls, and custom focusable widgets.
3. For each element capture the strongest available evidence: locator or stable descriptor, semantic role, accessible name, state/value, disabled/required/expanded/selected/checked status, focusability, and visible label.
4. Include visible non-interactive content only when it affects accessibility: headings, images, instructions, errors, status messages, tables, lists, and contrast/zoom-sensitive text.
5. Use semantic DOM/accessibility information as primary evidence. Use screenshots for visual corroboration, never as the sole basis for role, name, focus order, or screen-reader claims.
6. Assign stable element IDs such as `E001`, `E002`, and reuse them while the same element persists. Create new IDs for newly rendered controls.

## 4. Execute the flow step by step

For every user step:

1. Record the intended action and the target element ID.
2. Capture the relevant pre-action state.
3. Perform the action through the same modality the instruction names. Use real keyboard keys for keyboard steps; do not replace ArrowDown/Enter/Tab/Escape with clicks.
4. Wait only for a defined observable condition: navigation, element appearance, value/state change, focus move, dialog open/close, or status update.
5. Capture the post-action state, current focus, newly visible/hidden elements, changed accessible properties, errors, alerts, and live-region/status content.
6. Run the applicable checks from `references/runtime-checks.md` against that transition.
7. Record pass, fail, blocked, or not applicable. A blocked test is a coverage gap, not a pass.
8. Stop the flow when a required step cannot be completed; document the blocker and continue only with independent checks that remain valid.

## 5. Run keyboard and interaction checks

- Test the user's stated keyboard path exactly.
- When no keyboard path is supplied, traverse the in-scope interactive surface with Tab and Shift+Tab; use Enter/Space, arrow keys, and Escape according to the widget pattern.
- Verify visible focus, logical focus order, keyboard reachability, operation, dismissal, and focus restoration.
- For composite widgets such as comboboxes, listboxes, menus, tabs, grids, and date pickers, verify the keyboard behavior and semantic state changes expected by the pattern.
- Do not infer screen-reader speech from DOM attributes. Report the exposed role/name/state and mark actual assistive-technology announcements as unverified unless an AT output channel was tested.

## 6. Classify evidence and findings

Use only these evidence levels:

- `runtime-observed`: directly reproduced through browser state or interaction.
- `runtime-inspected`: verified from rendered semantic/DOM/accessibility properties but not interaction-dependent.
- `visual-observed`: supported by the rendered visual state; use for focus visibility, clipping, overlap, and similar visual behavior.
- `unverified`: requires assistive technology, another viewport, forced-colors, zoom, or a capability the browser connection did not expose.

Report a failure only when evidence demonstrates it. Do not claim full WCAG conformance. Do not report accessible elements as findings.

## 7. Write the report

Write `Binclusive-auditing/runtime-accessibility-report.md` in the audited project when a writable project root is available. Otherwise return the same structure in the response. Include:

- target, browser/harness, date, scope, flow, and safety stops;
- state/step ledger with element IDs and focus transitions;
- findings with severity, WCAG mapping, evidence level, reproduction steps, expected/actual behavior, and affected elements;
- passed checks;
- blocked/unverified checks and residual risks;
- final coverage counts: flow steps completed/blocked, visible interactive elements inspected, keyboard-operable elements tested, and states observed.

Use `agent: runtime` as provenance when merging findings into `accessibility-todo.md` from `$audit-accessibility`. Deduplicate by affected element, state, and root cause.

## Rules

- Audit only the requested origin, page, and flow unless the user expands scope.
- Re-inventory after navigation, modal/dialog changes, autocomplete results, validation, async loading, and route transitions.
- Never equate "present in DOM" with "visible" or "operable".
- Never equate a successful click with keyboard accessibility.
- Never infer contrast from CSS tokens alone; measure rendered colors when the browser capability supports it, otherwise mark unverified.
- Preserve raw values only when needed to reproduce the test; redact personal or sensitive input from the report.
- Distinguish application defects from browser-tool limitations.
