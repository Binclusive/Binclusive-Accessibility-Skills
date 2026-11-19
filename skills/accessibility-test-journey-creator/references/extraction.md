# Exploring from source code

Use this in Step 2 when the customer shares the project's source. Source suggests which processes and views exist and what their controls are called. It creates no journey: the customer approves the list in Step 3.

Do not change application code. Exclude generated, vendor and build output. Reuse an existing project map or tests as discovery aids, then verify the relevant source.

## Trace reachable flows

1. List the in-scope routes or screens, components, handlers, navigation edges, validation branches and interaction tests. Say which files you read and which scope you left unread.
2. Follow a user goal from a known entry through the actual component and handler transitions to an end state the source supports. Account for authentication, roles, flags, permissions, loading and error states. File order is not interaction order; never stitch unrelated controls into a flow.
3. Read the visible localized names, roles, stable identifiers, input semantics, options and state changes. Trace custom component props to the implementation. An onClick or onPress alone does not prove an accessible button or spoken name.
4. Put mutually exclusive branches in separate list items with their prerequisites. Prefer the primary flow and the relevant validation and keyboard alternatives over every combination. Mark behavior known only at runtime as unresolved.
5. Give each suggested process or view a `file:line` the customer can check. A user statement tells you the intended behavior, not what the source or the running product does.

## By platform

| Platform | Entry/transition evidence | Control/target evidence |
| --- | --- | --- |
| Web React/Next.js, Angular, ASP.NET/ASPX, WordPress/Shopify | Routes, links, router/controller actions, menus, forms, submit handlers, redirects | Native role, associated label, rendered accessible name, input type, options and state. Trace wrappers, naming containers, portals, localization. |
| React Native / Expo | Router files/linking, navigation stacks/tabs, navigation calls, auth guards | Text, accessibilityLabel/Role, testID, TextInput labels, picker options, switch state, callbacks. A testID is not an accessible name. |
| iOS SwiftUI / UIKit | NavigationStack destinations, sheets, tabs, coordinators, segues, URL handlers | Button/Toggle/Picker/TextField, accessibilityLabel/Identifier, UIControl actions, traits and localized resources. |
| Android Compose / Views | NavHost, activities/fragments, manifests/app links, intents, navigation graph | Semantics/contentDescription, label, testTag/resource ID, field/checkbox/radio/switch state and listeners; merged semantics and translations. |
| Flutter | Router/GoRouter/Navigator, named routes, guards, link configuration | Semantics, labels, keys, field validators, dropdown options, checkbox/switch state, callbacks, localization. A Key does not prove a spoken name. |

Verify platform overrides in mixed projects. Include conditional-rendering requirements as prerequisites. Existing E2E tests establish ordering and fixtures, but check current labels and handlers rather than assuming tests prove today's behavior.

For a source-backed preferences flow, follow the actual route to Edit profile, enter a synthetic display name, choose an existing Language option, activate Save, then expect the supported success state. Do not add checkboxes or navigation merely because they occur elsewhere in the project. Separate keyboard variations when actions differ; Tab order and screen-reader speech need runtime evidence.

## When the source and the customer disagree

Keep the customer's goal and show the discrepancy. If the customer says "pick the G field" and the source exposes two candidates, show their visible names and contexts and ask which. If the requested option or transition is absent, report that and ask whether the environment or branch differs or the scenario should change. Do not invent the missing step, silently swap in a different business action, or call the feature confirmed. Keep exploring the unrelated parts while you wait.

An expectation the customer states ("a success message should appear") is intent, not an observation of a passed check. A journey may expect behavior that fails today: that is a valid test. Separate it from an unknown target, entry state or input that stops anyone from running the journey reliably. Put the second kind in the draft list as an open question, with what you need to resolve it.

If a target has no accessible name, report the defect and use a verified fallback only when the runner supports it. Never invent a label or repair the source silently.

For a mobile product, ask in plain words how the journey should start: "From the app launch, or straight into this screen through a verified link?" Then write the `entry` shape yourself.
