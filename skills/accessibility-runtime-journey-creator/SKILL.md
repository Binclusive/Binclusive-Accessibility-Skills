---
name: accessibility-runtime-journey-creator
description: Drive a live web app in Google Chrome or an Android/iOS app on a physical device or emulator/simulator, as the hands of the WCAG-EM journey flow in accessibility-test-journey-creator. Explores the product so the customer gets a suggested list of processes and views, and replays journeys to verify them; creating and publishing follow the approval lifecycle in accessibility-test-journey-creator Step 4. Covers mobile connection setup, saves journeys locally, guides Binclusive MCP delivery, and does not perform a complete accessibility audit or start cloud tests.
---

# Accessibility Runtime Journey Creator

Work the live product through real interactions, without requiring source access. Keep the existing skill name for compatibility. This workflow covers Web, Android and iOS; do not route mobile requests away merely because earlier versions were Chrome-only.

What to test, and when a journey may be created or published, is decided by [accessibility-test-journey-creator](../accessibility-test-journey-creator/SKILL.md) (its Step 4 lifecycle table). This skill is the hands for that flow. It explores the live product for Step 2 and replays journeys to verify them in Step 4.

## Intake and connection

Credit information already supplied in the request or session. Ask focused questions in the user's language, one unresolved choice at a time. Never ask again for a known app, platform, device or scope.

1. Establish platform first: “Hangi platform için journey oluşturalım: Web, Android, iOS?” If explicitly provided, use it directly; a brand/app name alone does not establish platform.
2. Read the selected branch of [references/platform-setup.md](references/platform-setup.md). For Web, prove the active AI tool can observe and control Google Chrome. For Android, ask physical device versus computer emulator, then check ADB and a working control bridge. For iOS, ask physical device versus simulator, then check Mobile MCP and its version-specific dependencies. Detect installed tools before suggesting installation. Resolve missing prerequisites one at a time and recheck each before proceeding. A configured server or installed browser is not proof of control.
3. After connection is ready, resolve the app/site only if missing. Web needs a real URL; mobile needs an app name or package/bundle ID. Search installed apps on the chosen device, disambiguate matches, launch the actual match and record its identifier. If missing, request the appropriate build or installation route; never silently substitute a browser or another device.
4. Take scope and approval from accessibility-test-journey-creator (its Step 1 scope, its Step 4 lifecycle table), not from a choice made here. If the scope is not yet stated, run its Step 1 first. Exploring the live product answers its Step 2. The safety bounds for exploring and replay are in its Step 4.
5. Establish the project folder from the active workspace or a supplied path. If none exists or several roots are ambiguous, ask for the destination before writing. The required deliverable is `<project>/binclusive-accessibility-test-journies.md` (preserve this exact spelling).

## Explore and verify

Read [references/runtime-workflow.md](references/runtime-workflow.md). To explore for the suggested list (Step 2), start at launch and inspect the in-scope screens and pages, including content below the fold. Follow controls into screens, pop-ups, modals, menus and meaningful states by actually controlling the selected phone, emulator/simulator or Chrome. A product with few views is explored in full; for a larger one, take one example of each view type and every essential function the customer names. Reconcile discovered and visited states; never label a sample or blocked traversal “the whole app”. When a calling skill has already named the exact flow, such as the issue flow `aftertestvalidation` passes in, explore only that flow and its prerequisites without broadening scope.

Ask for missing user data at the point of need: test account, role, fixture, destination, recipient, amount, currency or payment method. Do not invent transfer/payment information. Have the user enter passwords, device passcodes, OTPs and payment secrets privately. Keep secrets out of steps, evidence, exports and MCP payloads. What exploring and replay may activate is set by the safety bounds in accessibility-test-journey-creator's Step 4. A journey that must stop before a payment, transfer or order is bounded before it, and the uncovered remainder is recorded separately as not replayed. Do not claim the full transaction was verified.

Execute each journey from its documented starting state and observe the result of every action. Replay after materially changing steps; discovery alone does not verify the final sequence. What a replay result allows next is in accessibility-test-journey-creator's Step 4 lifecycle table. Save pause state as that skill's Step 4 says, in the local evidence. Reset only by safe navigation or an agreed fixture; never clear app data or repeat transactions to make a replay work. Record step-to-observation evidence and blockers locally. Runtime verification is separate from user feedback and from an accessibility test pass; do not claim VoiceOver/TalkBack behavior unless actually tested.

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

Create and publish only journeys that reach created in accessibility-test-journey-creator's Step 4 lifecycle table. After saving and validating locally, follow [references/binclusive-delivery.md](references/binclusive-delivery.md): check workspace/global Binclusive MCP, connect `https://mcp.binclusive.io/mcp` if missing, open the supported OAuth authorization flow, then have the user select organization and project and add the journeys that reached created. Respect a user's local-only instruction.

Connection/authentication failure must preserve the local work and resume point. Do not start cloud QA or an accessibility audit as part of saving journeys. Report the document path, exact coverage, verified versus blocked journeys, and saved IDs or the specific remaining setup/user choice.
