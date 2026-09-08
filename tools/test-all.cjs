#!/usr/bin/env node
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const help = require('./lib/test-guidance.cjs');
const { ROOT } = require('./lib/project.cjs');

const resultsDir = path.join(ROOT, 'test-results');
const filter = process.argv[2] || process.env.DEVKIT_TEST_FILTER || '';

function discoverTests() {
  const names = fs
    .readdirSync(path.join(ROOT, 'tests'))
    .filter((name) => name.endsWith('.cjs'))
    .sort();
  const selected = filter
    ? names.filter((name) => name.toLowerCase().includes(filter.toLowerCase()))
    : names;
  if (!selected.length) throw new Error(`No test filename matches "${filter}".`);
  return selected;
}

function runDefinition(name) {
  return {
    name,
    command: process.execPath,
    args: [path.join('tests', name)],
    fix: help[name] || 'Inspect this test log and repair the failing behavior.',
  };
}

function execute(run) {
  process.stdout.write(`\n== ${run.name} ==\n`);
  const started = Date.now();
  const result = spawnSync(run.command, run.args, {
    cwd: ROOT,
    env: process.env,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  const output = (result.stdout || '') + (result.stderr || '');
  process.stdout.write(output);
  const record = {
    ...run,
    ok: result.status === 0,
    seconds: ((Date.now() - started) / 1000).toFixed(1),
    output,
  };
  fs.writeFileSync(path.join(resultsDir, run.name.replace(/[^a-z0-9.-]+/gi, '-') + '.log'), output);
  if (!record.ok) process.stdout.write(`::error title=${run.name} failed::${run.fix}\n`);
  return record;
}

function reportMarkdown(records) {
  const failed = records.filter((record) => !record.ok);
  const lines = [
    `# DevKit QA ${failed.length ? 'failed' : 'passed'}`,
    '',
    '| Check | Result | Time |',
    '| --- | --- | ---: |',
    ...records.map(
      (record) =>
        `| ${record.name} | ${record.ok ? '✅ Passed' : '❌ Failed'} | ${record.seconds}s |`,
    ),
  ];
  if (failed.length) {
    lines.push('', '## What failed and what to fix');
    for (const item of failed) {
      const excerpt = item.output.trim().split(/\r?\n/).slice(-18).join('\n');
      lines.push('', `### ${item.name}`, '', item.fix, '', '```text', excerpt, '```');
    }
  } else {
    lines.push(
      '',
      'All build, model, interaction, round-trip, upload, security, responsive-layout, syntax-coloring, completion, and Vim checks passed.',
    );
  }
  return `${lines.join('\n')}\n`;
}

function main() {
  fs.rmSync(resultsDir, { recursive: true, force: true });
  fs.mkdirSync(resultsDir, { recursive: true });
  const runs = [
    {
      name: 'portable build',
      command: process.execPath,
      args: ['tools/build.cjs'],
      fix: 'Fix the manifest, source bundle order, or standalone build.',
    },
    ...discoverTests().map(runDefinition),
  ];
  const records = runs.map(execute);
  const markdown = reportMarkdown(records);
  fs.writeFileSync(path.join(resultsDir, 'qa-report.md'), markdown);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  const failed = records.filter((record) => !record.ok);
  console.log(
    `\n${records.length - failed.length}/${records.length} checks passed. Report: test-results/qa-report.md`,
  );
  if (failed.length) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(`QA runner failed: ${error.message}`);
  process.exitCode = 1;
}
