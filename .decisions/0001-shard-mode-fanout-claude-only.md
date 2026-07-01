---
id: 0001
title: Shard Mode fan-out is a Claude-Code-only optimization
status: accepted
date: 2026-07-01
tags: [skills, audit, portability]
---

# 0001 — Shard Mode Fan-Out Is a Claude-Code-Only Optimization

## Context

Shard Mode — subagent fan-out for the audit skill — was added in #19 (commit
`bcfb8e3`). Its parallelism is gated entirely on the Claude Code `Task` tool:
`skills/audit-accessibility/SKILL.md` ("Harness capability — fall back silently, never
error") states that fan-out "requires a harness that can spawn parallel subagents (the
Claude Code `Task` tool)," and that the Copilot, Codex, and OpenAI
(`agents/openai.yaml`) adapters cannot, so "on any harness without that capability, **run
single-agent regardless of mode** — including `--shard`."

So every non-Claude harness gets the single-agent fallback, even when `--shard` is
explicitly requested. There is no portable fan-out path; the speedup is
Claude-Code-exclusive.

Issue #21 (`type:decision`, p2) framed this as a fork to settle, and its own framing is
the deciding context:

- The single-agent path is exactly the case Shard Mode was added to relieve on large maps
  (>~25 in-scope files / >~6 shard groups) — attention/budget-exhaustion risk and a long
  unread-gap tail. But **correctness is preserved either way**: the read-coverage ledger
  (`skills/audit-accessibility/SKILL.md`, "Fan-out procedure" / "Coverage") keeps every
  run honest regardless of harness. This is a **throughput gap, not a correctness gap** —
  nothing is broken; non-Claude users just get the slower path on the runs that most want
  parallelism. That is why it is p2 (deferred), not urgent.

The two options:

- **Option A — build a portable path.** Abstract "spawn a subagent per shard" behind a
  harness-neutral capability check so other runtimes that support parallel sub-tasks can
  opt in instead of hardcoding the `Task` tool. Larger surface; spawns implementation
  work.
- **Option B — accept & document.** Ratify fan-out as an intentional Claude-Code-only
  optimization and make that explicit in the portability note. Small surface; closes with
  a doc edit.

## Decision

Adopt **Option B**. Fan-out is an intentional Claude-Code-only throughput optimization.
Non-Claude harnesses (Copilot, Codex, the OpenAI `agents/openai.yaml` adapter, and any
future harness lacking a parallel-subtask primitive) **run single-agent by design** — even
under an explicit `--shard` — and produce the same report shape, noting the fallback in the
audit summary. The audit skill's portability note states this plainly.

## Consequences

- **What this makes easier.** The decision closes with a documentation edit and carries no
  new abstraction to maintain. Users' expectations are set explicitly: fan-out is a
  Claude-Code speedup, not a cross-harness guarantee.
- **What this accepts.** Non-Claude harnesses keep the single-agent path on large maps —
  the runs that would most benefit from parallelism. This is a deliberately accepted
  throughput trade, not a defect. Because correctness is preserved by the read-coverage
  ledger on every harness, the accepted cost is wall-clock/attention-budget only, never
  missed findings.
- **Why not Option A now.** A harness-neutral fan-out abstraction is speculative surface
  for a deferred (p2), non-correctness optimization: the non-Claude adapters lack a
  uniform, reliable parallel-subtask primitive to target today, so the abstraction would
  serve no concrete consumer. Building it now is YAGNI; the read-coverage ledger already
  guarantees the property that actually matters (honest, complete coverage) on every
  harness.
- **When to revisit.** If a future harness gains a reliable parallel-subtask primitive
  **and** a real workload demonstrates the single-agent path is a genuine bottleneck there,
  supersede this ADR and file the Option A harness-neutral abstraction at that point — with
  a concrete consumer in hand rather than on spec.
