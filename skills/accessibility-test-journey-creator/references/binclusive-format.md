# Native Binclusive accessibility journey format

Inspect the authenticated live schema of `create_journey` before the first call. These are accessibility journeys (`create_journey`), distinct from Agentic QA (`import_qa_journeys`), which has step objects and different IDs.

| Native field | Mapping |
| --- | --- |
| projectId | Required. The project the customer confirmed. |
| name | Required journey name. |
| description | Optional plain-language goal and essential prerequisites. |
| steps | Ordered string array, one action or expectation per string. Write at least one step even though the API permits omission. No step objects, embedded numbering, Markdown fences, selector DSL or template expressions. |
| personaId | Optional. The test account a web journey signs in as. Omit it for a public journey. The API refuses a persona on an app journey. |
| entry | Optional mobile entry as one of the exact shapes below. Omit on web. |

```json
{"kind":"deep_link","url":"exampleapp://preferences"}
```

```json
{"kind":"tap_path","taps":["Menu","Preferences"]}
```

Use only verified links and labels. The discriminator is kind, not type; taps must be non-empty. A launch-screen journey can omit entry when that launch state is known. A deep link does not bypass authentication prerequisites. Entry taps run before the steps and are not repeated in them.

## Synthetic web example

The fictional address and controls below are examples, not runnable project evidence. Replace them with verified values. Pass the signed-in persona's `personaId` and the project's `projectId` when calling `create_journey`.

```json
{
  "name": "Update preferences",
  "description": "Signed in as the persona. Preferences are reset before each run.",
  "steps": [
    "Open https://example.invalid/preferences.",
    "Activate Edit profile in the Profile section.",
    "Enter a display name in the Display name field.",
    "Choose English in the Language field.",
    "Check the Receive updates checkbox.",
    "Activate Save preferences.",
    "Verify the saved confirmation is conveyed to a screen-reader user."
  ]
}
```

## Synthetic mobile example

Assumes verified navigation and labels. Entry taps execute before the steps.

```json
{
  "name": "Update preferences",
  "description": "Signed-in app, notification permission already resolved. Preferences are reset before each run.",
  "entry": {"kind": "tap_path", "taps": ["Menu", "Preferences"]},
  "steps": [
    "Activate Edit profile on the Preferences screen.",
    "Enter a display name in the Display name field.",
    "Choose English in the Language picker.",
    "Set the Receive updates switch to on.",
    "Activate Save preferences.",
    "Verify the saved confirmation is conveyed to a screen-reader user and focus stays in a meaningful place."
  ]
}
```

Derive Android's actual navigation and TalkBack expectations independently. Expectations are what must hold, not observations of passed behavior. For repeated targets, include distinguishing context in the string.

## Updating

`update_journey` with `steps` replaces the whole list. Change a journey only when the customer asks; the changed version follows the lifecycle table in SKILL.md Step 4. Saving a journey does not start an audit. Schema acceptance of `entry` does not prove app installation, device provisioning, deep-link handling or mobile runner availability.
