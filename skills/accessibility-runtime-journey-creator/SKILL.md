---
name: accessibility-runtime-journey-creator
description: Drive a live web app in Google Chrome or an Android/iOS app on a physical device or emulator/simulator, as the hands of the WCAG-EM journey flow in accessibility-test-journey-creator. Explores the product so the customer gets a suggested list of processes and views, then, only after the customer approves that list, verifies each approved journey by replay. Covers mobile connection setup, saves journeys locally and guides Binclusive MCP delivery; does not perform a complete accessibility audit, start cloud tests, or publish a journey the customer has not approved.
---

# Accessibility Runtime Journey Creator

Work the live product through real interactions, without requiring source access. Keep the existing skill name for compatibility. This workflow covers Web, Android and iOS; do not route mobile requests away merely because earlier versions were Chrome-only.

What to test is decided by [accessibility-test-journey-creator](../accessibility-test-journey-creator/SKILL.md): the customer states the scope, the skill suggests processes and sample views, the customer edits and approves the list, and only approved journeys are created. This skill is the hands for that flow. It explores the live product for Step 2 and verifies each approved journey by replay in Step 4. It never picks, saves or publishes a journey on its own.

## Intake and connection

Credit information already supplied in the request or session. Ask focused questions in the user's language, one unresolved choice at a time. Never ask again for a known app, platform, device or scope.

1. Establish platform first: “Hangi platform için journey oluşturalım: Web, Android, iOS?” If explicitly provided, use it directly; a brand/app name alone does not establish platform.
2. Read the selected branch of [references/platform-setup.md](references/platform-setup.md). For Web, prove the active AI tool can observe and control Google Chrome. For Android, ask physical device versus computer emulator, then check ADB and a working control bridge. For iOS, ask physical device versus simulator, then check Mobile MCP and its version-specific dependencies. Detect installed tools before suggesting installation. Resolve missing prerequisites one at a time and recheck each before proceeding. A configured server or installed browser is not proof of control.
3. After connection is ready, resolve the app/site only if missing. Web needs a real URL; mobile needs an app name or package/bundle ID. Search installed apps on the chosen device, disambiguate matches, launch the actual match and record its identifier. If missing, request the appropriate build or installation route; never silently substitute a browser or another device.
4. Take scope and approval from accessibility-test-journey-creator's WCAG-EM steps, not from a choice made here. If the scope (its Step 1) is not yet stated, run that step first. A flow the user names, or one a calling skill such as `aftertestvalidation` passes in, is a request and not approval: draft the journey, show it, and get the user's yes before verifying, creating or publishing it. Exploring the live product answers its Step 2; the list it produces goes to the customer, who edits and approves it before any journey is verified or created. Exploring never authorizes real payments or other consequential submissions.
5. Establish the project folder from the active workspace or a supplied path. If none exists or several roots are ambiguous, ask for the destination before writing. The required deliverable is `<project>/binclusive-accessibility-test-journies.md` (preserve this exact spelling).

## Explore and verify

Read [references/runtime-workflow.md](references/runtime-workflow.md). To explore for the suggested list (Step 2), start at launch and inspect the in-scope screens and pages, including content below the fold. Follow controls into screens, pop-ups, modals, menus and meaningful states by actually controlling the selected phone, emulator/simulator or Chrome. A product with few views is explored in full; for a larger one, take one example of each view type and every essential function the customer names. Reconcile discovered and visited states; never label a sample or blocked traversal “the whole app”. Exploring produces observations for the list and creates no journey. When the customer or a calling skill has already named the exact flow, such as the issue flow `aftertestvalidation` passes in, explore only that flow and its prerequisites without broadening scope. The drafted journey still goes to the customer for a yes before it is verified, created or published.

Ask for missing user data at the point of need: test account, role, fixture, destination, recipient, amount, currency or payment method. Do not invent transfer/payment information. Have the user enter passwords, device passcodes, OTPs and payment secrets privately. Keep secrets out of steps, evidence, exports and MCP payloads. For payment, transfer, order or similarly consequential actions, obtain the exact intended transaction and authorization before committing it; prefer the user's sandbox/test fixtures. If completion is not authorized or possible, bound the journey before that action and record the uncovered remainder separately. Do not claim the full transaction was verified.

After the customer approves the list, execute each approved journey from its documented starting state and observe the result of every action. Replay after materially changing steps; discovery alone does not verify the final sequence. A journey the customer has not approved is not replayed, saved or delivered. A journey whose steps change materially during replay goes back to the customer for approval of the changed version before it is created. Reset only by safe navigation or an agreed fixture; never clear app data or repeat transactions to make a replay work. Record step-to-observation evidence and blockers locally. Runtime verification is separate from user feedback and from an accessibility test pass; do not claim VoiceOver/TalkBack behavior unless actually tested.

## Deliverable: the journeys

Every journey has a title, description (including starting state and non-secret prerequisites), and a numbered list of steps. Steps follow accessibility-test-journey-creator's Wording rules: they say what the user does and what must hold for an assistive-technology user, never how the page does it. Use the user's language and real observed labels. One action per step, with distinguishing screen/section context where needed. Examples:

```markdown
# Binclusive Accessibility Test Journeys

## Journey 1: Bildirim tercihini güncelle

Açıklama: Test hesabıyla oturum açılmış ana ekrandan başlar. Test verisi: ad alanı için Deniz.

### Steps
1. “Profil” sekmesine tıkla.
2. “Ad” alanına geçerli bir ad yaz.
3. “E-posta bildirimi” kutusunu işaretle.
4. “Tercih edilen kanal” grubunda “E-posta” radio butonunu seç.
5. “Kaydet” butonuna tıkla.
6. Kaydedildi onayının ekran okuyucu kullanıcısına iletildiğini doğrula.
```

This example is illustrative, not runtime evidence. A step that states what must hold is an outcome of the action before it, not an audit instruction, and it is not a claim that anything passed. When replaying, perform each action and record what you observed for each outcome in the local evidence, outside the step lists. Split compound actions; remove passive observations and conditional branches by making separate journeys. Do not invent labels for unlabeled controls: use observed visible context/position and record ambiguity, or block an unsafe target.

After generating all journeys, perform a separate semantic pass over **every step** for the Wording rules, concrete targets/data, order, starting-state consistency, missing navigation, unresolved placeholders and runtime evidence. Fix and replay changed paths before marking them verified. Keep validation results, coverage, pending data and unexecuted branches outside the journey step lists.

Write the required Markdown in the project root. Keep app-specific evidence, inventory, native drafts and sync receipts under `Binclusive-auditing/<app-or-site>/journeys/`, keyed by platform/device/locale. Preserve other app/platform sections and existing user edits; do not overwrite unrelated journeys. Keep partially verified candidates clearly separated in the local evidence/drafts; the primary journey document must identify any bounded start/end or pending status in descriptions and must not present unexecuted steps as verified.

## Binclusive delivery

After the customer has approved the list, and after saving and validating locally, follow [references/binclusive-delivery.md](references/binclusive-delivery.md): check workspace/global Binclusive MCP, connect `https://mcp.binclusive.io/mcp` if missing, open the supported OAuth authorization flow, then have the user select organization and project and add the verified journeys. Nothing is published without that approval of the list; invoking this skill, exploring the app or selecting a platform is not approval. Respect a user's local-only instruction. Reuse the customer's approval of the list and their confirmed destination rather than adding a redundant final permission question.

Connection/authentication failure must preserve the local work and resume point. Do not start cloud QA or an accessibility audit as part of saving journeys. Report the document path, exact coverage, verified versus blocked journeys, and saved IDs or the specific remaining setup/user choice.
