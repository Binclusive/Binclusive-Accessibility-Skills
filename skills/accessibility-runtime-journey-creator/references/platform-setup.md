# Platform setup and proof of control

Read only the chosen platform branch and shared setup rules. These are authoring instructions for future runs, not a request to install device tools while editing the skill.

## Shared setup rules

Identify the active AI client, host OS, configured MCP integrations and currently exposed tools. Check workspace and global configuration without printing tokens or unrelated config. Use the client's own MCP setup UI/CLI and preserve existing entries. Never use another client's config format blindly. Explain a missing prerequisite with one concrete OS-specific action, execute where authorized or have the user perform the interactive/privileged part, verify it, then continue to the next missing prerequisite. Do not dump a long installation checklist or claim a connection succeeded because a config file exists. If a reconnect/restart is necessary, save the selected platform/device/app, completed checks, remaining step and resume location first.

Prefer already working integrations. For Node-based MCP servers verify `node --version` and `npx --version`; meet the selected server release's documented engine requirement using the official Node installer or the user's existing version manager. Verify current official package/release guidance before installation rather than pinning an old assumption. Do not configure all AI clients on the machine or allocate paid/cloud devices when the user chose a local target.

## Web: Google Chrome

1. Discover whether the client exposes Google Chrome control through a native browser connector, extension, Chrome DevTools MCP or another documented Chrome bridge. Enumerate Chrome tabs, select the intended session, read a fresh snapshot and perform a harmless reversible navigation/control action with an observed result. An installed Chrome app or an in-app browser tab does not prove control of Google Chrome.
2. If missing, use the client's supported browser-connection flow and direct the user to enable/connect its Chrome extension if that integration requires one. Otherwise consult [Chrome DevTools MCP setup](https://github.com/ChromeDevTools/chrome-devtools-mcp) and its [existing-browser connection guide](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/advanced-usage.md). Verify the installed Chrome and server runtime versions first.
3. With compatible Chrome (144+ per current guide), existing-session setup uses Remote Debugging at `chrome://inspect/#remote-debugging`, an MCP server launched with `npx -y chrome-devtools-mcp@latest --autoConnect`, and the user's browser connection consent. Configure only in the active client's supported format. If unavailable on that version, use the documented dedicated-profile/manual connection procedure; do not expose an unauthenticated debugging port externally or silently change the user's session.
4. Reconnect the client if needed, list pages again and repeat the observation/action proof. If tools remain unavailable, record the specific blocker and guide the next connection step. Do not generate purported runtime-verified journeys from HTTP requests, source code or an unrelated browser.

## Android: physical device or emulator

Ask the target type if missing. First check `adb version`, `adb devices -l`, SDK location/PATH, and the chosen control bridge's device enumeration. Always target the selected serial (`adb -s <serial> ...`); never pick the first of multiple devices silently.

### Missing ADB/platform tools

Use [official Android SDK Platform-Tools](https://developer.android.com/tools/releases/platform-tools). If Android Studio exists, install/update Android SDK Platform-Tools through SDK Manager. Otherwise use Google's OS-specific Platform-Tools archive, extract to a user-chosen SDK location and add that `platform-tools` directory to PATH. Verify `adb version` in the same environment used by the MCP process. Do not require a full Android Studio installation merely to control a connected physical Android device.

### Physical Android

Follow [Android hardware-device setup](https://developer.android.com/studio/run/device) and [ADB authorization](https://developer.android.com/tools/adb): guide Developer options and USB debugging, connect a data-capable cable, unlock the device and have the user accept its RSA authorization prompt. On Windows check the required OEM USB driver; on Linux follow documented USB/udev permissions. `unauthorized` requires on-device approval; `offline` requires connection troubleshooting, not a successful readiness status. Re-run enumeration until the chosen serial reports `device`. Wireless debugging is an alternative only through the documented pairing flow chosen by the user.

### Android emulator

Check Android SDK Emulator, a compatible system image and an existing AVD (`emulator -list-avds`, using the SDK executable path if not on PATH). For missing components, use SDK Manager and [Device Manager/AVD setup](https://developer.android.com/studio/run/managing-avds); choose an image compatible with host architecture and the app. Confirm required virtualization using [emulator acceleration guidance](https://developer.android.com/studio/run/emulator-acceleration). Handle SDK licenses in the user's supported setup UI. Boot the selected AVD, wait for boot completion and for its serial to report `device` in ADB. An installed emulator binary alone is insufficient.

### Android AI control

Prefer a working Mobile MCP connection (shared section below). If unavailable, an already documented ADB automation bridge may be used only when it supplies both real observations (UI hierarchy/screenshots) and actual tap/type/swipe/navigation operations. ADB enumeration alone proves no UI control. Do not invent a bridge or silently fall back to source-only authoring. Prove screen observation and a harmless reversible action on the selected device, then resolve and launch the app.

## Mobile MCP (Android and iOS)

Check tools for device enumeration, app listing/launch, screen observation and interaction. For missing Mobile MCP, consult its [current README](https://github.com/mobile-next/mobile-mcp) and release requirements. The documented stdio launcher is `npx -y @mobilenext/mobile-mcp@latest` (README currently specifies Node 20+). Configure that command in the active client, reconnect, and invoke live device enumeration; tool names/namespaces can vary. Use the exposed tool schemas, not guessed arguments. Follow enumeration with app listing, screen observation and a reversible action on the selected device. A connected server with an empty device list is not ready. Do not install Android dependencies for an iOS-only task or vice versa.

## iOS: physical device or simulator

Ask the target type if missing. Check Mobile MCP first, its installed version/backend and host compatibility. The current local Xcode/simctl route requires a Mac; on other hosts explain the need for a supported Mac/device host and ask the user to choose that route. Do not promise that installing ADB or command-line tools on Windows provisions a local iOS Simulator. A remote/cloud alternative requires the user's choice.

### Xcode and simulator

Check `xcode-select -p`, `xcodebuild -version`, and `xcrun simctl list devices available`. When missing, guide full Xcode installation from Apple, first-launch components/license and selection of the actual installed Xcode developer directory. Command Line Tools alone do not provide the iOS Simulator/runtime. Through Xcode's current Settings/components and device-management UI, install a compatible iOS runtime and create/select a simulator. Boot the selected UDID and wait for it to be usable. Use [Apple device/simulator guidance](https://developer.apple.com/documentation/xcode/running-your-app-on-simulated-or-physical-devices); UI names depend on Xcode version. Verify the same UDID appears in Mobile MCP.

### Physical iPhone/iPad

Connect via USB, unlock and have the user approve “Trust This Computer” privately. Verify pairing/device visibility through the installed Xcode device tooling and Mobile MCP. For development-signed components, use [Apple Developer Mode instructions](https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device): enable it when required, complete the on-device restart/confirmation, and verify readiness again. If the automation backend needs signing, provisioning, a helper agent or a device tunnel, follow that **installed version's** official instructions one dependency at a time; the user handles Apple ID, certificates and trust prompts. Do not request passcodes/signing secrets in chat or assert every App Store app needs development signing.

### Backend/version guard

[Mobile MCP's roadmap](https://github.com/mobile-next/mobile-mcp/blob/main/ROADMAP.md) records replacement of WebDriverAgent by Device Kit and removal of external go-ios in 2026. Older wiki instructions may still describe WDA. Do not require WDA, Appium, go-ios or a manual tunnel for all installations. If the selected older backend actually requires them, identify its version and follow its matching official instructions (WDA build/sign/run and tunnel/port readiness as applicable), then retest control. Prefer updating through a supported route over mixing incompatible backend instructions. Report the actual failing dependency instead of installing every historical tool.

### App installation and proof

List apps on the chosen device and search the user's supplied name or bundle ID. If not installed, ask for an authorized installation/build: a simulator-compatible `.app` for Simulator, or a properly signed device build/distribution route for hardware. A device `.ipa` is not a Simulator build. Use the live install tool's supported formats. Launch the app and verify a current screen plus a reversible interaction; if the backend cannot observe/control it, keep authoring blocked rather than inventing successful mobile evidence.

## Client configuration examples

For Codex, check `codex mcp --help`, `codex mcp list` and existing entries before adding. Examples (only when that server is missing):

```sh
codex mcp add mobile-mcp -- npx -y @mobilenext/mobile-mcp@latest
codex mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest --autoConnect
```

Other clients use their own documented MCP settings UI/CLI; do not write Codex TOML into them. [Official Codex MCP guidance](https://learn.chatgpt.com/docs/extend/mcp) describes shared and project-scoped configuration. Configuration examples do not authorize unrelated server changes. After registration, require live tool availability and device/browser control proof.
