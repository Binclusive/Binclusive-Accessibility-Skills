# Guided journey co-authoring

The user owns the scenario; source inspection grounds it in the actual interface. Default to one focused question per turn. Use the harness's question tool when available, otherwise ask in chat. Do not require another skill to be installed. Offer concise source-backed choices and allow free text; a user may describe a goal, paste steps, select multiple flows, reorder actions, remove steps, or correct labels. Never require selector/API knowledge.

## Open at the first unanswered decision

Explain briefly: "Önce test etmek istediğiniz işi belirleyelim; koddan akışı çıkarıp birlikte düzelteceğiz." Do not require a separate mode-selection question. If the prompt already names the goal/platform/start state, credit that answer. Ask only what remains relevant. Use progress labels such as Hedef, Akış seçimi, Başlangıç, Adımlar, Son kontrol; do not promise a fixed question count.

1. Goal: "Kullanıcı bu testin sonunda neyi tamamlamış olmalı?" Offer a few goals found in navigation if useful, not an invented list.
2. Platform when unresolved: "Bu akışı hangi ortam için hazırlayalım: web, iOS, Android veya seçtiğiniz birkaç ortam?" Split variants when implementation differs.
3. Candidate selection: inspect the relevant code, then show a few short flows with their start/end states. Ask which to develop first or accept a custom scenario. Keep other candidates as suggestions, not accepted journeys.
4. Starting conditions: ask the next missing condition, such as "Test giriş yapmış müşteriyle mi, misafirle mi başlasın?" Follow up separately for the actual starting URL/screen, role or permission state only if unresolved. Do not assume the initial session.
5. Data and branches: propose non-secret synthetic fixture values based on validation rules. Ask what business variant to exercise, e.g. successful submission versus required-field errors. Handle those as separate journeys. Never request passwords, OTPs or customer records in chat.
6. Draft: display the complete flow in plain numbered actions, using actual UI labels and expected state checks. Mark user-provided and unresolved details clearly. Ask a specific question about the next ambiguity, e.g. "Kaydet'ten sonra başarı mesajı mı, profil ekranı mı beklemeliyiz?"
7. Final review: once blockers are resolved, show entry, preconditions, fixture/reset needs, ordered actions, checks and consequential actions together. Ask "Bu journey gerçek kullanımınızı doğru yansıtıyor mu; hangi adımı değiştirelim?" Accept explicit acceptance or specific corrections. A general earlier "journey oluştur" request is not a review of unseen steps.

Do not turn these prompts into a mandatory questionnaire: skip answered/irrelevant items and adapt to corrections. If the user gives a complete scenario, inspect and move directly to the preview. If they ask for a quick single-shot draft, produce it without blocking questions, but record review pending and exclude it from publishable output until reviewed.

## Ground corrections without overruling the goal

If the user says "G alanını seç" and the source exposes two candidates, show their visible names and contexts and ask which. If the requested option/transition is absent, report the discrepancy and ask whether the environment/branch differs or the scenario should change. Do not fabricate the missing step, silently substitute a different business action, or mark the feature confirmed. Continue unrelated investigation while waiting.

Separate intent from observation: "Başarı mesajı görünmeli" is a user-provided expected result, not a passed check. Record its evidence source. Keep a flow draft if the target/setup cannot yet be executed reliably; a known failing accessibility expectation can still be a valid test.

For mobile entry, explain the choice in plain language: "Uygulama açılışından mı ilerleyelim, yoksa doğrulanmış bağlantıyla doğrudan bu ekrana mı girelim?" Derive the native entry shape internally. Do not repeat tap-path entry steps as test steps.

## Example dialogue (synthetic)

User: "Web'de profil düzenlemeyi test edelim."

Assistant, after inspecting relevant routes: "Profil düzenleme, oturum gerektiren Hesabım ekranından açılıyor. Journey giriş yapılmış test hesabıyla mı başlasın, giriş adımlarını da mı kapsasın?"

User: "Giriş yapılmış olsun. Sadece ad ve dil değişsin, bildirimlere dokunmayalım."

Assistant: inspect those fields and the save handler; omit notification actions. Present the actual labels and ask only for unresolved fixture/outcome data. Then show the whole numbered preview and request review.

User: "Dil önce seçilsin, sonra ad yazılsın. Bu hali doğru."

Assistant: verify that reordering is supported, apply it, show the revised order, and record acceptance for that exact revision if the user's acceptance clearly covers the requested change. No additional confirmation loop is needed for the same agreed change. Export when technically ready. Do not publish or run unless requested.

## Resume and change handling

Record the selected goal/platform/variant, answers, accepted fixture choices, pending question, blockers and per-journey reviewed revision in the local review file. Keep rejected/removed steps out of the export. When interrupted, answer the user's question briefly and resume from the pending decision. On pause, save the draft and stop questioning. When source or a correction materially changes an accepted journey, show the changed steps and renew review only for that affected journey.

User acceptance of a journey does not grant dashboard-write or execution permission. Preserve any already explicit publish/run authorization, but resolve the reviewed flow and destination before those actions.
