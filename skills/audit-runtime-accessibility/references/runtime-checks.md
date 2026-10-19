# Runtime check matrix

Apply only checks relevant to the element and state being tested.

## Page and structure

- Document title identifies the page or step.
- One primary page heading and logical heading hierarchy are exposed.
- Landmarks and regions have distinct names when repeated.
- Reading order matches the meaningful visual order.
- Instructions do not rely only on color, position, shape, or sensory characteristics.

## Every interactive element

- Role matches behavior and an accessible name is exposed.
- Visible label and accessible name are consistent; speech-input users can target visible text.
- State and value are programmatically exposed.
- Element is reachable and operable with the expected keyboard commands.
- Focus indicator is visible and not fully obscured.
- Disabled controls remain understandable and are not falsely operable.
- Target size and spacing are checked when reliable geometry is available.

## Forms

- Each field has a persistent label; placeholder-only labels fail.
- Required state, format, and constraints are available before submission.
- Autocomplete purpose is exposed where applicable.
- Errors identify the field, explain correction, and receive or announce attention without destroying entered data.
- Grouped fields such as radios and checkboxes have a group name/instruction.

## Combobox and autocomplete

- Input exposes combobox semantics, accessible name, expanded state, and popup relationship.
- ArrowDown enters or moves through results without unexpectedly changing focus context.
- Active option is exposed; selected state and input value update coherently.
- Enter selects, Escape dismisses, and Tab behavior is predictable.
- Loading, no-results, and result-count changes are exposed as status where needed.

## Dialogs, menus, disclosures, and overlays

- Trigger exposes expanded/has-popup state when applicable.
- Opened content has an appropriate role and name.
- Focus moves into modal content, remains contained where required, and returns to the trigger on close.
- Escape closes dismissible overlays without data loss.
- Background content does not remain interactable through a modal.

## Tabs and composite widgets

- Composite and child roles/states/relationships are exposed.
- Roving focus or active-descendant behavior produces one predictable tab stop.
- Arrow keys, Home/End, Enter/Space, and selection behavior follow the widget pattern.
- Selected item and controlled panel remain synchronized.

## Date pickers

- Date input and picker trigger have names, formats, and instructions.
- Calendar grid, month/year controls, selected date, current date, unavailable dates, and navigation controls expose semantics and state.
- Keyboard users can reach and select a date, change month when required, dismiss the picker, and continue the flow.
- Focus is not lost when the calendar rerenders.
- The chosen date is conveyed in an unambiguous localized format.

## Dynamic updates and navigation

- Focus moves only when the user action and context justify it.
- Route/page changes update title, heading, and focus context.
- Loading, success, error, and result-count messages are exposed without stealing focus unnecessarily.
- Newly inserted content appears in a logical reading and focus order.

## Visual runtime checks

- Text and controls remain visible without clipping or overlap in the tested viewport.
- Focus is visible against adjacent colors.
- Meaning is not conveyed by color alone.
- Rendered text/background and component-state contrast are measured only when reliable computed colors are available.
- Zoom, reflow, text spacing, forced colors, reduced motion, and alternate viewport behavior remain `unverified` unless explicitly exercised.

## Evidence limits

- DOM/semantic inspection can verify exposed role, name, state, relationships, and focus.
- Browser interaction can verify keyboard reachability, operation, state transitions, and focus behavior.
- Screenshots can support visual focus, clipping, overlap, and color observations.
- Only actual assistive-technology output can verify spoken announcements, pronunciation, browse-mode order, or AT-specific gestures.
