# Extracting journeys from source

| Platform | Entry/transition evidence | Control/target evidence |
| --- | --- | --- |
| Web React/Next.js, Angular, ASP.NET/ASPX, WordPress/Shopify | Routes, links, router/controller actions, menus, forms, submit handlers, redirects | Native role, associated label, rendered accessible name, input type, options and state. Trace wrappers, naming containers, portals, localization. |
| React Native / Expo | Router files/linking, navigation stacks/tabs, navigation calls, auth guards | Text, accessibilityLabel/Role, testID, TextInput labels, picker options, switch state, callbacks. A testID is not an accessible name. |
| iOS SwiftUI / UIKit | NavigationStack destinations, sheets, tabs, coordinators, segues, URL handlers | Button/Toggle/Picker/TextField, accessibilityLabel/Identifier, UIControl actions, traits and localized resources. |
| Android Compose / Views | NavHost, activities/fragments, manifests/app links, intents, navigation graph | Semantics/contentDescription, label, testTag/resource ID, field/checkbox/radio/switch state and listeners; merged semantics and translations. |
| Flutter | Router/GoRouter/Navigator, named routes, guards, link configuration | Semantics, labels, keys, field validators, dropdown options, checkbox/switch state, callbacks, localization. A Key does not prove a spoken name. |

Verify platform overrides in mixed projects. Include conditional-rendering requirements as prerequisites. Existing E2E tests establish ordering and fixtures, but check current labels and handlers rather than assuming tests prove today's behavior.

For a source-backed preferences flow, follow the actual route to Edit profile, enter the agreed synthetic Display name, choose an existing Language option, activate Save, then check the supported success state. Do not add checkboxes or navigation merely because they occur elsewhere in the project. Separate keyboard variations when actions differ; Tab order and screen-reader speech need runtime evidence.

Keep candidates draft when start location, authentication/setup, target identity, input, permissions, or transitions are unresolved. Disambiguate repeated labels by region/item. If a target lacks an accessible name, document the defect and use a verified fallback only when the runner supports it; never invent a label or repair source silently.

A source-ready journey may intentionally check behavior that currently fails. Distinguish a known failing expectation from an unknown target/entry state that prevents reliable execution.
