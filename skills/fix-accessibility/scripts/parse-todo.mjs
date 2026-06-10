#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'Binclusive-auditing/accessibility-todo.md';
const text = readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const headingRe = /^#{2,4}\s+-?\s*\[[ xX]?\]\s+\[(TASK-\d+)\]\s+(.+)$/gm;
const tasks = [];
const headings = [...text.matchAll(headingRe)];

for (let i = 0; i < headings.length; i += 1) {
  const match = headings[i];
  const start = match.index;
  const next = headings[i + 1]?.index ?? text.length;
  const block = text.slice(start, next);
  const field = (name) => {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = block.match(new RegExp(`^-\\s*\\*\\*${escaped}:\\*\\*\\s*(.+)$`, 'm'));
    return m ? m[1].trim() : '';
  };
  tasks.push({
    id: match[1],
    title: match[2].trim(),
    component: field('Component / Page'),
    file: field('File path'),
    severity: field('Severity'),
    fixType: field('Fix Type'),
    status: field('Status') || 'TODO',
  });
}

console.log(JSON.stringify({ file, count: tasks.length, tasks }, null, 2));
