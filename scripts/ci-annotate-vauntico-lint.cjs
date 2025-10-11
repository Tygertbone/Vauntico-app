#!/usr/bin/env node
// scripts/ci-annotate-vauntico-lint.cjs
// Runs vauntico-lint.cjs, captures output, and emits GitHub Actions annotations.
// Emits ::warning annotations for issues; does not fail the job.

const { spawn } = require('child_process');

const child = spawn(process.execPath, ['vauntico-lint.cjs'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let stdout = '';
let stderr = '';

child.stdout.on('data', (d) => (stdout += d.toString()))
child.stderr.on('data', (d) => (stderr += d.toString()))

child.on('close', (code) => {
  // Echo original output to logs
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);

  // Parse a simple format like:
  // 📄 /abs/path/to/file.jsx
  //    ❌ Missing prop 'label' ...
  //    ⚠️ Missing Vauntico hover ...
  const lines = stdout.split(/\r?\n/);
  let currentFile = null;
  for (const line of lines) {
    const fileMatch = line.match(/^📄\s+(.+)$/);
    if (fileMatch) {
      currentFile = fileMatch[1].trim();
      continue;
    }
    if (!currentFile) continue;
    const issueMatch = line.match(/^\s+(❌|⚠️)\s+(.*)$/);
    if (issueMatch) {
      const level = issueMatch[1] === '❌' ? 'warning' : 'warning';
      const message = issueMatch[2];
      // Emit GitHub annotation without line/col
      console.log(`::${level} file=${currentFile}::${message}`);
    }
  }

  // Always succeed to keep annotations informative and non-blocking
  process.exit(0);
});
