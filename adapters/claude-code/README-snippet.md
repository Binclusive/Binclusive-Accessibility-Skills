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

- `/map-project`
- `/audit-accessibility`
- `/fix-accessibility`

Do not fork the `SKILL.md` files for Claude-specific behavior. Keep the canonical instructions in `skills/<skill-name>/SKILL.md` and update this adapter only for Claude Code installation notes.
