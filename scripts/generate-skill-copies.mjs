#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const args = process.argv.slice(2);
const unknown = args.filter((arg) => arg !== "--check");
if (unknown.length > 0) fail(`Unknown argument: ${unknown.join(" ")}. Usage: generate-skill-copies.mjs [--check]`);
const check = args.includes("--check");

const entries = (dir) =>
  readdirSync(join(root, dir), { withFileTypes: true })
    .map((entry) => (entry.isDirectory() ? `${entry.name}/` : entry.name))
    .sort();

const readSkill = (dir) => {
  const file = `skills/${dir}/SKILL.md`;
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(readFileSync(join(root, file), "utf8"));
  if (!frontmatter) fail(`${file}: no frontmatter`);
  const fields = Object.fromEntries(
    frontmatter[1].split(/\r?\n/).map((line) => {
      const field = /^([a-z-]+): (\S.*)$/.exec(line);
      if (!field) fail(`${file}: frontmatter line is not a single-line "key: value": ${line}`);
      return [field[1], field[2].trim()];
    }),
  );
  const { name, description } = fields;
  if (name !== dir) fail(`${file}: name "${name}" must equal its directory "${dir}"`);
  if (!description || /^["'>|]/.test(description)) fail(`${file}: description must be a single-line plain value`);
  const summary = /^.*?[.!?](?=\s|$)/.exec(description)?.[0] ?? description;
  return { name, summary };
};

const skills = entries("skills")
  .filter((entry) => entry.endsWith("/"))
  .map((entry) => readSkill(entry.slice(0, -1)));

const markers = {
  html: (name, edge) => `<!-- generated:${name}:${edge} -->`,
  hash: (name, edge) => `# generated:${name}:${edge}`,
};

const region = (style, name, render) => (text) => {
  const begin = markers[style](name, "begin");
  const end = markers[style](name, "end");
  const start = text.indexOf(begin);
  const stop = text.indexOf(end);
  if (start < 0 || stop < start) fail(`Missing generated region: ${begin} ... ${end}`);
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const body = render(skills).split("\n").join(eol);
  return text.slice(0, start + begin.length) + eol + body + eol + text.slice(stop);
};

const html = (name, render) => region("html", name, render);
const hash = (name, render) => region("hash", name, render);

const lines = (render) => (list) => list.map(render).join("\n");
const fenced = (render) => (list) => `\`\`\`text\n${lines(render)(list)}\n\`\`\``;
const pointer = lines((skill) => `- \`skills/${skill.name}/SKILL.md\`: ${skill.summary}`);

const layout = (list) =>
  [
    "```text",
    "skills/",
    ...list.map((skill) => `  ${skill.name}/`),
    ...["adapters", "scripts"].flatMap((dir) => [`${dir}/`, ...entries(dir).map((entry) => `  ${entry}`)]),
    "```",
  ].join("\n");

const codexSkills = (text) => {
  const manifest = JSON.parse(text);
  manifest.skills = skills.map((skill) => ({ path: `../../skills/${skill.name}/SKILL.md` }));
  return `${JSON.stringify(manifest, null, 2)}\n`;
};

const targets = {
  "README.md": [
    html("skills", lines((skill) => `- \`${skill.name}\`: ${skill.summary}`)),
    html("codex-invocations", fenced((skill) => `$${skill.name}`)),
    html("claude-invocations", fenced((skill) => `/${skill.name}`)),
    html("layout", layout),
  ],
  "adapters/claude-code/README-snippet.md": [html("commands", lines((skill) => `- \`/${skill.name}\``))],
  "adapters/codex/.codex-plugin/plugin.json": [codexSkills],
  "adapters/copilot/copilot-instructions.md": [html("skills", pointer)],
  "adapters/copilot/.github/instructions/binclusive-accessibility.instructions.md": [html("skills", pointer)],
  "adapters/cursor/.cursor/rules/binclusive-accessibility.mdc": [html("skills", pointer)],
  "scripts/install.sh": [hash("skills", (list) => `SKILLS=(${list.map((skill) => skill.name).join(" ")})`)],
  "scripts/install.ps1": [
    hash("skills", (list) => `$SkillNames = @(${list.map((skill) => `"${skill.name}"`).join(", ")})`),
  ],
};

const stale = [];
for (const [file, edits] of Object.entries(targets)) {
  const current = readFileSync(join(root, file), "utf8");
  const next = edits.reduce((text, edit) => edit(text), current);
  if (next === current) continue;
  stale.push(file);
  if (!check) writeFileSync(join(root, file), next);
}

if (check && stale.length > 0) {
  fail(
    `Generated files differ from skills/*/SKILL.md frontmatter:\n${stale.map((file) => `  ${file}`).join("\n")}\nRun: node scripts/generate-skill-copies.mjs`,
  );
}

console.log(
  stale.length === 0
    ? `Generated files match ${skills.length} skills.`
    : `Wrote ${stale.length} files:\n${stale.map((file) => `  ${file}`).join("\n")}`,
);
