# Claude Code Adapter

Install the canonical skills into Claude Code with:

```bash
scripts/install.sh --target claude
```

or on Windows:

```powershell
scripts/install.ps1 --target claude
```

The installed commands are:

<!-- generated:commands:begin -->
- `/accessibility-runtime-journey-creator`
- `/accessibility-test-journey-creator`
- `/aftertestvalidation`
- `/audit-accessibility`
- `/audit-runtime-accessibility`
- `/fix-accessibility`
- `/map-project`
- `/onboard-binclusive-cli`
- `/shopify-theme-audit`
<!-- generated:commands:end -->

Do not fork the `SKILL.md` files for Claude-specific behavior. Keep the canonical instructions in `skills/<skill-name>/SKILL.md` and update this adapter only for Claude Code installation notes.
