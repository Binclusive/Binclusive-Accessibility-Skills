---
name: accessibility-test-journey-creator
description: Decide what a Binclusive project's accessibility audit tests, the way WCAG-EM 2.0 runs an evaluation. The customer states the scope, the skill explores the whole product (live, or from source code) and suggests a list of processes and sample views, the customer edits and approves that list, and only the approved journeys are verified and created. Nothing is picked or published on its own. Works for web, iOS and Android projects. Use whenever the user wants to set up, draft, generate, normalize, migrate or convert journeys, including phrases like "create journeys for this site", "what should we audit", "set up journeys in Binclusive for [project]", "turn this flow doc into journeys", "birlikte test journey oluşturalım". Does not replace accessibility auditing or create Agentic QA journeys.
---

# Accessibility Test Journey Creator

You help a customer write and own the journeys Binclusive audits. The customer owns the scope and the journeys. You propose, the customer edits and approves, and you create nothing before that approval.

This is the one skill that owns what to test. `accessibility-runtime-journey-creator` is its hands for a live product: it drives Chrome, a phone or a simulator to explore (Step 2) and to verify each approved journey by replay (Step 4).

The method is WCAG-EM 2.0, the W3C's evaluation method (https://www.w3.org/TR/WCAG-EM/). Every quote below is from it. Where the skill goes beyond it, the skill says so.

## Tools

Binclusive MCP tools (server `https://mcp.binclusive.io/mcp`; if it is not connected, follow [../accessibility-runtime-journey-creator/references/binclusive-delivery.md](../accessibility-runtime-journey-creator/references/binclusive-delivery.md) to connect it):

- `list_organizations`, `list_projects`: find the project. `list_projects` returns `type` (`web`, `ios` or `android`), `domain` and `bundleId`.
- `list_pages`, `import_sitemap`: the project's pages. `import_sitemap` is for web projects.
- `list_journeys`: what already exists.
- `list_personas`, `create_persona`: the test account.
- `create_journey`, `update_journey`: write the approved journeys. The payload is in [references/binclusive-format.md](references/binclusive-format.md).

To look at a live product, use `accessibility-runtime-journey-creator`. To read the product's source code, use [references/extraction.md](references/extraction.md). For an app you cannot run, ask the customer for its screens.

Resolve the project first, matching the name case-insensitively and asking when two match. Confirm it before anything else.

## Step 1. Scope

Ask these five questions one at a time, with a default where there is one. Write the answers to `journey-scope.md` in the working folder and show the file. Do not start Step 2 until all five are answered. Question 3 has a default. If the customer has no preference, record it as the default.

1. Product. Which address, or which app (platform and bundle id)? Include language versions, mobile versions, linked shops and third-party parts. WCAG-EM 2.0, Step 1.1: "for each view it is unambiguous whether it is within the scope of evaluation or not".
2. In and out. Which areas are in, which are out, and why? Tell the customer once: "Excluding specific parts of a digital product from the scope would likely conflict with the WCAG 2.2 conformance requirements for full pages and complete processes, or otherwise distort the evaluation results." (WCAG-EM 2.0, section 3.1)
3. Conformance target. Default to WCAG 2.2 level AA: "WCAG 2 Level AA is the generally accepted and recommended target." (Step 1.2) Offer another version or level only if the customer's legal regime names one.
4. Test account. Does any essential function need a signed-in user? If so, run `list_personas`, then reuse a persona or create one with `create_persona`. The customer must confirm it is a dedicated test account, not a real person's. The persona holds the session, and `list_personas` says how to capture the login (`b8e profile create --persona <id> --target <id>`). Never ask for a password in the chat and never write one in a step. WCAG-EM 2.0, Step 2: "it may be necessary to create an account and ensure that the product's configuration is representative".
5. Interruptions. Cookie banners, consent prompts, pop-ups, chat widgets and permission prompts sit in front of every view, and WCAG-EM has no rule for them. Our default is to test the banner once, on a first visit with nothing stored, as its own sample. Record which answer the customer prefers (accept, reject, or the page's own close control) in `journey-scope.md`. The audit's tester meets and answers interruptions on every run by itself, so no journey carries a step for them. A third-party banner is still part of the product: "This includes 3rd party content used within the site." (WCAG-EM 2.0, section 3.1.1)

## Step 2. Explore across the product

Look at the whole product, not one page. Exploring creates nothing. Sources, in this order:

- The sitemap (`list_pages`). With no pages, ask for the sitemap address and offer `import_sitemap`. It starts a crawl in the background, so read `list_pages` again when it finishes.
- The navigation, header and footer of the home page or start screen. Use `accessibility-runtime-journey-creator` to open the live product (Chrome, simulator or device) and snapshot one example of each view type, not every page.
- The source code, when the customer shares it: routes, screens and navigation, read as [references/extraction.md](references/extraction.md) describes. Source suggests what exists. The customer still decides what is tested.
- What exists: `list_journeys`. Show existing journeys in the list so you do not create a duplicate.
- A customer document, if there is one (flow doc, user stories, QA cases, top tasks, in any language). Read it end to end first. It is a source of functions, not the scope.

Then write three lists:

1. Common views. In the WCAG-EM glossary these are "views that are relevant to the entire digital product". They are usually linked from the header, footer or navigation: home, login, search, contact, help, legal, language switch. "The outcome of this step is a list of all common pages or views of the target product." (Step 2.1)
2. Essential functions. The glossary defines them as "functionality that, if removed, fundamentally changes the use or purpose of the product for users", such as "selecting and purchasing an item from an online shop". Give each one a sentence on what the user gets done and where you saw it. "The purpose of this step is not to exhaustively identify all functionality of a product but to determine those that are essential to the purpose and goal of the target product." (Step 2.2) Ask the customer for what an outsider cannot see: "Involvement of product owners and product developers can help evaluators make their explorations more effective." (Step 2)
3. View types. "The outcome of this step is a list of descriptions of the types of content identified, rather than specific instances of samples." (Step 2.3) Name each type and give one example address or screen.

Apps. An app has no address to open. Samples are screens and the path to them: "samples can be identified with unique screenshots and/or descriptions of the path that lead to the specific sample." (WCAG-EM 2.0, section 3.2) If the product has few views, propose all of them: "If feasible, it is recommended to evaluate the entire digital product." (Step 3)

When a control could do several things, click it once and write what you saw. One probe beats one wrong guess. Never probe a control that submits, sends, pays, deletes or logs out, with any data.

## Step 3. Draft the list and let the customer edit it

Show one numbered list. Create nothing yet.

- Processes. One per essential function. For each: the goal in plain words, who runs it (public, or the persona), where it starts, and the default sequence. "For each starting point for a process, identify and record at least the default sequence of samples to complete the process." The default "assumes that there are no user input errors and no selection of additional options." (Step 3.3) Add the branches: "the branch sequences of samples that are commonly accessed and critical for the successful completion of the process", and always the error path where there is a form. If the real end is a payment, a deletion or a sent message, end the process before it and say so.
- Views. One per view type from Step 2, with its example address or screen and the state to reach, such as a dialog opened or an error shown. Add the first-visit sample from question 5.
- Left out. Every flow in the customer's document and every area of the sitemap this list does not cover, each with a reason. Never drop one silently.

Ask the customer to keep, rename, reorder, drop or add. A use case of their own is theirs to add: WCAG-EM calls it an additional requirement, "analysis of particular use cases, situations, and user groups for interacting with the target digital product". (Step 1.4) WCAG-EM gives no count of journeys. The customer's confirmed functions set the number.

Repeat until the customer says the list is approved. Silence is not approval. A general request such as "create journeys" is not approval of a list the customer has not seen.

## Step 4. Verify and create what was approved

Only approved items go on. Where the product can be driven (Chrome, a simulator or a device), replay each approved journey with `accessibility-runtime-journey-creator` first and fix a step that does not replay. Where it cannot be driven, say in the output that the journey was not replayed.

Then one `create_journey` per approved item, run in parallel, with `projectId`, `name`, `description` and `steps`. Write each step as the action that moves from one view to the next, so a later run can repeat it: "In most cases the web address (URL) will not be sufficient to identify the sample in a complete process." Leave no view of a process out: "all pages or views that belong to that same process have to be included". (Step 3.3)

- Web journey. Step 1 opens the start address: `Open https://shop.example.com.` There is no separate start address field. Write no step for cookie banners or pop-ups, because the tester handles them on every run. Pass `personaId` for a signed-in journey. No `personaId` means a public journey. Do not paste the login into an otherwise signed-in journey, because the persona signs in. Audit the login itself as its own public journey.
- App journey. Pass `entry`: `{"kind":"deep_link","url":"..."}` or `{"kind":"tap_path","taps":["..."]}`. `create_journey` refuses a persona on an app journey, so ask the customer how a signed-in app flow gets in.
- Branch. A journey is a straight list, so we write each branch as its own journey, which is our choice and not W3C's. Repeat the default steps up to the branch point, then follow the branch.
- View. Name it for the view type, in plain words. Steps: open the example address, reach the state, then go through the whole view and use each interactive part you find, stopping before any control that submits, sends, pays, deletes or logs out. The first-visit view starts with nothing stored and tests the banner itself.
- Process. Name it for the goal: "Buy a product as a guest". Five to ten steps is our default, not W3C's. One goal per journey. If you write "and also", split it.

If a create is refused, show the customer the refusal and go on with the rest. They can change any journey later with `update_journey`. Saving a journey does not start an audit.

## Wording

Steps say what the user does and what must hold for an assistive-technology user, never how the page does it. A journey must still be useful after a redesign.

- No widget shapes (modal, drawer, popover) unless you clicked the trigger and saw it.
- No techniques (`aria-expanded`, `role=dialog`) and no keys ("press Alt+Down").
- Write what the assistive-technology user experiences: content is announced, labelled and in reading order, controls are reachable and usable by keyboard, state is conveyed and errors are located, focus is managed and there is a way back.
- No success criteria in steps. A journey does not choose what is tested: "Check that each sample that is not within or at the end of a complete process conforms to each of the five WCAG 2 conformance requirements at the target conformance level." (Step 4.1)
- No fixtures in steps: no emails, passwords, names, dates or card numbers. Write "enter a valid email". The product's own addresses are fine.
- Write the name, description and steps in the product's language. Read the page's `lang` and headline. `.com.tr` or `/tr/` is Turkish. Ask once when unclear.

| Brittle | Outcome |
|---|---|
| Press Alt+Down to open combobox | Open the term selector via keyboard |
| Verify aria-expanded flips to true | Verify the open or closed state is conveyed to a screen-reader user |
| Verify aria-live region updates | Verify the calculated result is conveyed to a screen-reader user, by announcement or focus move, not silence |

## Output

After creating, return:

1. A table of what was created: number, journey name, kind (process, branch or view), signs in as (persona or public), replayed or not, ID.
2. What the customer left out, and why.
3. Probes you ran, one line each: "Clicked X, saw Y, used in journey 3".
4. Test data you removed from the customer's document, so the customer still has it.
5. Accessibility problems you noticed while reading the product (`javascript:;` links, unlabeled controls, color-only state). These are findings for the audit team, not journeys.
