#!/usr/bin/env node
// Snapshot for the SKILL.md "Coverage tiers" contract: which platforms the CLI
// grounds today vs. which stay agent-only. This is the served-skill's honesty
// guarantee — an agent consuming audit-accessibility is told a platform is
// engine-backed ONLY when the monorepo CLI actually dispatches its collector
// (`collectAllStacks` in packages/cli). Drift here re-introduces the exact
// over-claim this snapshot exists to catch. Run: `node coverage-tiers.snapshot.mjs`.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL = join(dirname(fileURLToPath(import.meta.url)), "..", "SKILL.md");

// Every collector `collectAllStacks` dispatches today reads as engine-groundable;
// the five with no collector stay agent-only. Keep in lockstep with the monorepo
// dispatcher — a move here without a dispatch there is the over-claim to reject.
const ENGINE_GROUNDABLE = [
  "React / Next.js web",
  "Astro",
  "Shopify/Liquid",
  "SwiftUI/UIKit",
  "Jetpack Compose / Kotlin",
  "Android Views/XML",
  "Unity",
  "Any live page",
];
const AGENT_ONLY = ["ASP.NET/ASPX", "WordPress/PHP source", "Python", "Angular", "Flutter", "React Native"];

const md = readFileSync(SKILL, "utf8");

/** Slice a tier bullet (plus its sub-bullets) — bounded at the next top-level
 *  `- **` bullet OR the paragraph break that ends the tier list, whichever is
 *  first, so the last tier never bleeds into the prose that follows it. */
function tierBlock(label) {
  const start = md.indexOf(`- **${label}`);
  if (start === -1) return null;
  const rest = md.slice(start + 1);
  const ends = [rest.indexOf("\n- **"), rest.indexOf("\n\n")].filter((i) => i !== -1);
  if (ends.length === 0) return md.slice(start);
  return md.slice(start, start + 1 + Math.min(...ends));
}

const fail = [];

const groundable = tierBlock("Engine-groundable now — run the CLI:");
if (!groundable) fail.push('missing tier header: "Engine-groundable now — run the CLI:"');
else for (const p of ENGINE_GROUNDABLE) {
  if (!groundable.includes(p)) fail.push(`engine-groundable tier is missing: ${p}`);
}

const agentOnly = tierBlock("No engine — agent-only");
if (!agentOnly) fail.push('missing tier header: "No engine — agent-only"');
else {
  for (const p of AGENT_ONLY) {
    if (!agentOnly.includes(p)) fail.push(`agent-only tier is missing: ${p}`);
  }
  // The agent-only tier must NOT list any now-dispatched platform.
  for (const p of ["Astro", "Liquid", "SwiftUI", "Kotlin", "Android Views/XML", "Unity"]) {
    if (agentOnly.includes(p)) fail.push(`agent-only tier still lists a dispatched platform: ${p}`);
  }
}

// The stale "deterministic floor coming / stays agent-driven" middle tier must be gone —
// every collector it held is dispatched now, so no platform sits in a not-yet-dispatched bucket.
if (/stays agent-driven today|does not dispatch it yet|deterministic floor coming/i.test(md)) {
  fail.push('stale "not-yet-dispatched" tier language still present — every listed collector is dispatched today');
}

if (fail.length) {
  console.error("coverage-tiers snapshot FAILED:");
  for (const f of fail) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`coverage-tiers snapshot PASSED: ${ENGINE_GROUNDABLE.length} engine-groundable, ${AGENT_ONLY.length} agent-only.`);
