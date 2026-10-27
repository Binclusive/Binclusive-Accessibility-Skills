---
name: accessibility-runtime-journey-creator
description: Create Binclusive accessibility test journeys by controlling live web apps in Google Chrome or Android/iOS apps on physical devices and emulators/simulators. Use for runtime journey creation, whole-app exploration or user-directed flows, including mobile connection setup. Saves action-only journeys locally and guides Binclusive MCP delivery; does not perform a complete accessibility audit or start cloud tests.
---

# Accessibility Runtime Journey Creator

Create journeys from real interactions without requiring source access. Keep the existing skill name for compatibility. This workflow covers Web, Android and iOS; do not route mobile requests away merely because earlier versions were Chrome-only.

## Intake and connection

Credit information already supplied in the request or session. Ask focused questions in the user's language, one unresolved choice at a time. Never ask again for a known app, platform, device or scope.

1. Establish platform first: “Hangi platform için journey oluşturalım: Web, Android, iOS?” If explicitly provided, use it directly; a brand/app name alone does not establish platform.
2. Read the selected branch of [references/platform-setup.md](references/platform-setup.md). For Web, prove the active AI tool can observe and control Google Chrome. For Android, ask physical device versus computer emulator, then check ADB and a working control bridge. For iOS, ask physical device versus simulator, then check Mobile MCP and its version-specific dependencies. Detect installed tools before suggesting installation. Resolve missing prerequisites one at a time and recheck each before proceeding. A configured server or installed browser is not proof of control.
3. After connection is ready, resolve the app/site only if missing. Web needs a real URL; mobile needs an app name or package/bundle ID. Search installed apps on the chosen device, disambiguate matches, launch the actual match and record its identifier. If missing, request the appropriate build or installation route; never silently substitute a browser or another device.
4. Ask whether to explore the whole app freely or create journeys from user-provided goals/instructions: “Tüm uygulamayı keşfedip journey’leri ben mi oluşturayım, yoksa belirleyeceğin akışlardan mı ilerleyelim?” Honor an already explicit choice. Free exploration authorizes choosing candidate flows within scope; it does not authorize real payments or other consequential submissions.
5. Establish the project folder from the active workspace or a supplied path. If none exists or several roots are ambiguous, ask for the destination before writing. The required deliverable is `<project>/binclusive-accessibility-test-journies.md` (preserve this exact spelling).

## Explore and verify

Read [references/runtime-workflow.md](references/runtime-workflow.md). In whole-app mode start at launch, inspect every reachable in-scope screen/page and all visible elements, including content below the fold. Follow controls into screens, pop-ups, modals, menus and meaningful states by actually controlling the selected phone, emulator/simulator or Chrome. Reconcile discovered and visited states; never label a sample or blocked traversal “the whole app”. In directed mode explore the requested paths and necessary prerequisites without broadening scope.

Ask for missing user data at the point of need: test account, role, fixture, destination, recipient, amount, currency or payment method. Do not invent transfer/payment information. Have the user enter passwords, device passcodes, OTPs and payment secrets privately. Keep secrets out of steps, evidence, exports and MCP payloads. For payment, transfer, order or similarly consequential actions, obtain the exact intended transaction and authorization before committing it; prefer the user's sandbox/test fixtures. If completion is not authorized or possible, bound the journey before that action and record the uncovered remainder separately. Do not claim the full transaction was verified.

Execute each candidate journey from its documented starting state and observe the result of every action. Replay after materially changing steps; discovery alone does not verify the final sequence. Reset only by safe navigation or an agreed fixture; never clear app data or repeat transactions to make a replay work. Record step-to-observation evidence and blockers locally. Runtime verification is separate from user feedback and from an accessibility test pass; do not claim VoiceOver/TalkBack behavior unless actually tested.

## Deliverable: actions only

Every journey has a title, description (including starting state and non-secret prerequisites), and a numbered list of direct actions. Use the user's language and real observed labels. One action per step, with distinguishing screen/section context where needed. Examples:

```markdown
# Binclusive Accessibility Test Journeys

## Journey 1: Bildirim tercihini güncelle

Açıklama: Test hesabıyla oturum açılmış ana ekrandan başlar. Test verisi: ad alanı için Deniz.

### Steps
1. “Profil” sekmesine tıkla.
2. “Ad” alanına “Deniz” yaz.
3. “E-posta bildirimi” kutusunu işaretle.
4. “Tercih edilen kanal” grubunda “E-posta” radio butonunu seç.
5. “Kaydet” butonuna tıkla.
```

This example is illustrative, not runtime evidence. Do not include “check”, “verify”, “confirm that”, “assert”, “kontrol et”, “doğrula”, expected-result assertions, audit instructions or combined action/assertion steps. “Onayla butonuna tıkla” is an action when that is the observed label; inspecting a result is the agent's verification work, not a journey step. Split compound actions; remove passive observations and conditional branches by making separate journeys. Do not invent labels for unlabeled controls: use observed visible context/position and record ambiguity, or block an unsafe target.

After generating all journeys, perform a separate semantic pass over **every step** for action-only wording, concrete targets/data, order, starting-state consistency, missing navigation, unresolved placeholders and runtime evidence. Fix and replay changed paths before marking them verified. Keep validation results, coverage, pending data and unexecuted branches outside the journey step lists.

Write the required Markdown in the project root. Keep app-specific evidence, inventory, native drafts and sync receipts under `Binclusive-auditing/<app-or-site>/journeys/`, keyed by platform/device/locale. Preserve other app/platform sections and existing user edits; do not overwrite unrelated journeys. Keep partially verified candidates clearly separated in the local evidence/drafts; the primary journey document must identify any bounded start/end or pending status in descriptions and must not present unexecuted steps as verified.

## Binclusive delivery

After saving and validating locally, follow [references/binclusive-delivery.md](references/binclusive-delivery.md): check workspace/global Binclusive MCP, connect `https://mcp.binclusive.io/mcp` if missing, open the supported OAuth authorization flow, then have the user select organization and project and add the verified journeys. Explicit skill invocation includes this delivery workflow; respect a user's local-only instruction. If invoked implicitly and external delivery intent is unclear, ask about delivery after showing the saved document. Never treat app exploration or selecting a platform as approval of an unknown destination. Reuse prior authorization rather than adding a redundant final permission question.

Connection/authentication failure must preserve the local work and resume point. Do not start cloud QA or an accessibility audit as part of saving journeys. Report the document path, exact coverage, verified versus blocked journeys, and saved IDs or the specific remaining setup/user choice.
