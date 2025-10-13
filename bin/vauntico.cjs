#!/usr/bin/env node
const { program } = require('commander');
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

program
  .name('vauntico')
  .description('Vauntico CLI rituals')
  .version('0.1.0');

program.command('lint')
  .description('Run Vauntico lint rules')
  .action(() => {
    const p = spawnSync('node', [path.resolve(process.cwd(), 'vauntico-lint.cjs')], { stdio: 'inherit' });
    process.exit(p.status || 0);
  });

program.command('hover-fix')
  .description('Apply hover polish to interactive elements')
  .option('--dry-run', 'preview changes without writing')
  .action((opts) => {
    const hoverClass = 'hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300';
    const interactiveTags = ['<button', '<a ', '<CTAButton'];
    const walkDir = (dir) => fs.readdirSync(dir).flatMap(f => {
      const p = path.join(dir, f);
      const s = fs.statSync(p);
      if (s.isDirectory()) return walkDir(p);
      if (p.endsWith('.jsx')) return [p];
      return [];
    });
    const src = path.resolve(process.cwd(), 'src');
    if (!fs.existsSync(src)) {
      console.error('src directory not found');
      process.exit(1);
    }
    const files = walkDir(src);
    let changes = 0;
    files.forEach((filePath) => {
      const original = fs.readFileSync(filePath, 'utf8');
      let content = original;
      interactiveTags.forEach((tag) => {
        const regex = new RegExp(`${tag}([^>]*)>`, 'g');
        content = content.replace(regex, (match, props) => {
          if (props.includes('className=') && !props.includes('hover:scale-')) {
            return match.replace(/className="([^"]*)"/, (_, cls) => `className="${cls} ${hoverClass}"`);
          } else if (!props.includes('className=')) {
            return `${tag} className="${hoverClass}">`;
          }
          return match;
        });
      });
      if (content !== original) {
        changes++;
        if (opts.dryRun) {
          console.log(`[dry-run] Would patch ${filePath}`);
        } else {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`✅ Patched ${filePath}`);
        }
      }
    });
    console.log(opts.dryRun ? `\n[dry-run] ${changes} files would be modified` : `\n✅ ${changes} files modified`);
  });

program.command('polish')
  .description('Run polish script (no-op dry-run for now)')
  .option('--dry-run', 'preview actions only')
  .action((opts) => {
    if (opts.dryRun) {
      console.log('[dry-run] Would run vauntico-polish-fix.cjs');
      return;
    }
    const p = spawnSync('node', [path.resolve(process.cwd(), 'vauntico-polish-fix.cjs')], { stdio: 'inherit' });
    process.exit(p.status || 0);
  });

program.parse();