# Native Binclusive accessibility journey format

Checked on 2026-10-19 against:
- https://github.com/Binclusive/monorepo/blob/main/services/mcp/src/journeys/adapters/driving/journey-tools.ts
- https://github.com/Binclusive/monorepo/blob/main/packages/a11y-contract/src/journey-entry.ts
- https://github.com/Binclusive/monorepo/blob/main/services/mcp/docs/reference/tools/journeys.md

Inspect the authenticated live schema before publishing. These are accessibility journeys (`create_journey`), distinct from Agentic QA (`import_qa_journeys`), which has step objects and different IDs.

| Native field | Mapping |
| --- | --- |
| project_id | Required at MCP call time, from selected project. Keep out of reusable export definitions. |
| name | Required journey name; distinguish platform/locale/branch where needed. |
| description | Optional plain-language goal and essential prerequisites, never review Markdown. |
| steps | Ordered string array. Export at least one step even though the API permits omission. No step objects, embedded numbering, Markdown fences, expectedResult keys, selector DSL, or template expressions. Checks are ordinary step strings. |
| entry | Optional mobile entry as one of the exact shapes below. Omit on web. |

```json
{"kind":"deep_link","url":"exampleapp://preferences"}
```

```json
{"kind":"tap_path","taps":["Menu","Preferences"]}
```

Use only verified links and labels. The discriminator is kind, not type; taps must be non-empty. A launch-screen journey can omit entry when that launch state is known. A deep link does not bypass authentication prerequisites.

## Synthetic web export

The fictional URL/controls below are examples, not runnable project evidence. Replace them with verified values. This local array is not a server bulk-import contract: add the selected project_id to each definition when calling create_journey individually.

```json
[
  {
    "name":"Web: update preferences",
    "description":"Use the seeded signed-in test account. Reset preferences before each run.",
    "steps":[
      "Go to https://example.invalid/preferences.",
      "Activate Edit profile in the Profile section.",
      "Enter Journey Tester in the Display name field.",
      "Choose English in the Language field.",
      "Check the Receive updates checkbox.",
      "Activate Save preferences.",
      "Verify the Preferences saved confirmation appears and is announced by the screen reader."
    ]
  }
]
```

## Synthetic mobile export

Assumes verified navigation/labels and a seeded active session. Entry taps execute before steps and are not repeated.

```json
[
  {
    "name":"iOS: update preferences",
    "description":"Use the seeded signed-in account with notification permission already resolved. Reset preferences before each run.",
    "entry":{"kind":"tap_path","taps":["Menu","Preferences"]},
    "steps":[
      "Activate Edit profile on the Preferences screen.",
      "Enter Journey Tester in the Display name field.",
      "Choose English in the Language picker.",
      "Set the Receive updates switch to on.",
      "Activate Save preferences.",
      "Verify the Preferences saved confirmation is exposed to VoiceOver and focus remains in a meaningful location."
    ]
  }
]
```

Derive Android's actual navigation and TalkBack checks independently. Checks are intended expectations, not observations of passed behavior. For repeated targets, include distinguishing context in the string.

## Local review and publishing

For each candidate record local ID, platform/locale, user-selected goal/variant, source revision, entry, prerequisites, fixture/reset needs, technical readiness/blockers, user review status, reviewed revision and numbered steps. Each step records action/check, target, input if applicable, expected observable state, source path:line or user-provided evidence, and evidence label. Preserve user decisions and the pending question for resuming. Keep coverage and unsupported runner capabilities explicit. Only accepted, technically ready journeys enter the publishable array; all others remain in the local review.

Do not include those local fields in create_journey. Keep local ID to saved ID receipts for safe retries and verification. Update steps only with authorization because it replaces the whole array. No arbitrary variable interpolation is specified by this string-array contract; unresolved credentials/data keep candidates draft.

Starting an audit is separate from saving. Inspect live start_agentic_audit and runner/platform support, then use explicit saved accessibility journey IDs only when execution was requested. Schema acceptance of entry does not prove app installation, device provisioning, deep-link handling, or mobile runner availability.
