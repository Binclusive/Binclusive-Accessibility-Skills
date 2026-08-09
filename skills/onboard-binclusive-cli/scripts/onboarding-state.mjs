#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const [command = "status", rootArg = ".", ...args] = process.argv.slice(2);
const root = resolve(rootArg);
const auditDir = join(root, "Binclusive-auditing");
const statePath = join(auditDir, "cli-onboarding.json");
const configPath = join(root, "binclusive.json");

function output(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function fail(message, code = 1, details = {}) {
  output({ status: "error", message, statePath, ...details });
  process.exit(code);
}

function readState() {
  if (!existsSync(statePath)) return null;
  try {
    return JSON.parse(readFileSync(statePath, "utf8"));
  } catch (error) {
    fail("Onboarding state is not valid JSON.", 1, { error: error.message });
  }
}

function option(name) {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) fail(`Missing value for --${name}.`);
  return value;
}

function validate(state) {
  const missing = [];
  if (!state) missing.push("state file");
  if (state && state.schemaVersion !== 4) missing.push("current onboarding schema");
  if (state && state.status !== "complete") missing.push("status=complete");
  if (state && !state.cli?.version) missing.push("cli.version");
  if (state && !["local", "dashboard"].includes(state.scan?.mode)) missing.push("valid scan mode");
  if (state && state.scan?.status !== "verified") missing.push("verified Binclusive scan");
  if (state?.scan?.mode === "dashboard") {
    if (state.authentication?.status !== "verified") missing.push("verified login/whoami");
    if (state.projectContext?.status !== "verified") missing.push("verified project context");
    if (state.ciCredentials?.status !== "verified") missing.push("verified CI credential environment");
    if (state.scan?.delivery !== "delivered") missing.push("dashboard-connected CI delivery");
    if (!Number.isInteger(state.scan?.uploadedFindings) || state.scan.uploadedFindings < 0) {
      missing.push("terminal-confirmed uploaded finding count");
    }
  }
  if (!existsSync(configPath)) missing.push("binclusive.json");
  if (state?.scan?.mode === "dashboard" && !process.env.BINCLUSIVE_API_KEY) missing.push("BINCLUSIVE_API_KEY environment variable");
  if (state?.scan?.mode === "dashboard" && !process.env.BINCLUSIVE_PROJECT_ID) missing.push("BINCLUSIVE_PROJECT_ID environment variable");
  return missing;
}

if (command === "status") {
  const state = readState();
  const missing = validate(state);
  output({
    status: missing.length ? "incomplete" : "complete",
    projectRoot: root,
    statePath,
    configPath,
    missing,
    onboarding: state,
  });
  process.exit(missing.length ? 2 : 0);
}

if (command === "complete") {
  if (!existsSync(configPath)) fail("Cannot complete onboarding before binclusive.json exists.", 2);
  const cliVersion = option("cli-version");
  const scanMode = option("scan-mode");
  const ciTarget = option("ci-target");
  const uploadedCountText = option("uploaded-count");
  const uploadedCount = Number(uploadedCountText);
  if (!cliVersion || !["local", "dashboard"].includes(scanMode)) {
    fail("complete requires --cli-version and --scan-mode local|dashboard.");
  }
  if (scanMode === "dashboard") {
    if (!process.env.BINCLUSIVE_API_KEY || !process.env.BINCLUSIVE_PROJECT_ID) {
      fail("Dashboard completion requires BINCLUSIVE_API_KEY and BINCLUSIVE_PROJECT_ID in the current process.", 2);
    }
    if (!ciTarget || uploadedCountText === undefined) {
      fail("Dashboard completion requires --ci-target and --uploaded-count.");
    }
    if (!Number.isInteger(uploadedCount) || uploadedCount < 0) {
      fail("--uploaded-count must be a non-negative integer copied from the CLI upload confirmation.");
    }
  }

  const now = new Date().toISOString();
  const state = {
    schemaVersion: 4,
    status: "complete",
    completedAt: now,
    cli: { package: "@binclusive/cli", version: cliVersion },
    config: { path: "binclusive.json", verifiedAt: now },
    authentication: { status: scanMode === "dashboard" ? "verified" : "not-required" },
    projectContext: { status: scanMode === "dashboard" ? "verified" : "not-required" },
    ciCredentials: scanMode === "dashboard"
      ? { status: "verified", environmentVariables: ["BINCLUSIVE_API_KEY", "BINCLUSIVE_PROJECT_ID"], verifiedAt: now }
      : { status: "not-required" },
    scan: scanMode === "dashboard"
      ? { mode: "dashboard", status: "verified", delivery: "delivered", target: ciTarget, uploadedFindings: uploadedCount, evidence: "terminal upload confirmation", verifiedAt: now }
      : { mode: "local", status: "verified", delivery: "local-only", evidence: "completed local scan", verifiedAt: now },
  };

  mkdirSync(auditDir, { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  output({ status: "complete", projectRoot: root, statePath, onboarding: state });
  process.exit(0);
}

fail("Usage: onboarding-state.mjs status <project-root> | complete <project-root> --cli-version <version> --scan-mode local|dashboard [--ci-target <target> --uploaded-count <N>]");
