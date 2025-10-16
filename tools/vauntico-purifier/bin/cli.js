#!/usr/bin/env node

/**
 * VAUNTICO PURIFIER
 * The Mythic JSX Restoration Tool
 * 
 * "From corruption comes clarity. From chaos comes code."
 * — The Vauntico Doctrine
 */

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const { scanner } = require('../lib/scanner');
const { fixer } = require('../lib/fixer');
const { reporter } = require('../lib/reporter');

const program = new Command();

// ASCII Art Header
const VAUNTICO_HEADER = `
${chalk.yellow('╔══════════════════════════════════════════════════════════╗')}
${chalk.yellow('║')}          ${chalk.bold.white('VAUNTICO PURIFIER')}                        ${chalk.yellow('║')}
${chalk.yellow('║')}          ${chalk.italic.gray('The Mythic JSX Restoration Tool')}               ${chalk.yellow('║')}
${chalk.yellow('╚══════════════════════════════════════════════════════════╝')}

${chalk.cyan('From corruption comes clarity. From chaos comes code.')}
`;

program
  .name('vauntico-purifier')
  .description('🔥 Restore JSX files from structural corruption')
  .version('1.0.0')
  .hook('preAction', () => {
    console.log(VAUNTICO_HEADER);
  });

// SCAN Command
program
  .command('scan')
  .description('🔍 Scan JSX files for structural corruption')
  .option('-p, --path <path>', 'Target directory to scan', './src')
  .option('-t, --types <types>', 'File types to scan', 'jsx,js,tsx,ts')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    console.log(chalk.blue('🔍 Initiating Corruption Scan...\\n'));
    
    try {
      const results = await scanner.scan(options.path, {
        types: options.types.split(','),
        verbose: options.verbose
      });
      
      console.log(chalk.green('✅ Scan Complete'));
      console.log(`${chalk.yellow('Files Scanned:')} ${results.totalFiles}`);
      console.log(`${chalk.red('Corruptions Found:')} ${results.corruptions.length}`);
      
      if (results.corruptions.length > 0) {
        console.log('\\n' + chalk.bold.red('🚨 CORRUPTION DETECTED:'));
        results.corruptions.forEach((corruption, index) => {
          console.log(`${index + 1}. ${chalk.cyan(corruption.file)} - ${chalk.yellow(corruption.type)}`);
          if (options.verbose && corruption.details) {
            console.log(`   ${chalk.gray(corruption.details)}`);
          }
        });
      } else {
        console.log('\\n' + chalk.green('🎉 No corruptions detected. Your JSX is pure.'));
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Scan failed:'), error.message);
      process.exit(1);
    }
  });

// AUTOFIX Command
program
  .command('autofix')
  .description('⚡ Apply structural and syntactic fixes')
  .option('-p, --path <path>', 'Target directory to fix', './src')
  .option('-t, --types <types>', 'File types to fix', 'jsx,js,tsx,ts')
  .option('--commit', 'Auto-commit changes with branded message')
  .option('--dry-run', 'Preview fixes without applying them')
  .action(async (options) => {
    console.log(chalk.magenta('⚡ Initiating Purification Ritual...\\n'));
    
    try {
      const results = await fixer.autofix(options.path, {
        types: options.types.split(','),
        dryRun: options.dryRun,
        commit: options.commit
      });
      
      console.log(chalk.green('✅ Purification Complete'));
      console.log(`${chalk.yellow('Files Processed:')} ${results.processed}`);
      console.log(`${chalk.green('Files Fixed:')} ${results.fixed}`);
      console.log(`${chalk.blue('Fixes Applied:')} ${results.fixesApplied}`);
      
      if (results.fixed > 0) {
        console.log('\\n' + chalk.bold.green('🔧 APPLIED FIXES:'));
        results.fixes.forEach((fix, index) => {
          console.log(`${index + 1}. ${chalk.cyan(fix.file)} - ${chalk.yellow(fix.type)}`);
        });
        
        if (options.commit && !options.dryRun) {
          console.log('\\n' + chalk.green('📝 Changes committed with ritual message'));
        }
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Purification failed:'), error.message);
      process.exit(1);
    }
  });

// REPORT Command
program
  .command('report')
  .description('📊 Generate corruption map and analysis')
  .option('-p, --path <path>', 'Target directory to analyze', './src')
  .option('-o, --output <file>', 'Output file for report', './corruption-report.json')
  .option('-f, --format <format>', 'Output format (json|markdown|console)', 'console')
  .action(async (options) => {
    console.log(chalk.blue('📊 Generating Corruption Report...\\n'));
    
    try {
      const report = await reporter.generate(options.path, {
        format: options.format,
        output: options.output
      });
      
      if (options.format === 'console') {
        console.log(report.formatted);
      } else {
        console.log(chalk.green(`✅ Report generated: ${options.output}`));
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Report generation failed:'), error.message);
      process.exit(1);
    }
  });

// RITUAL Command (Special Vauntico Command)
program
  .command('ritual')
  .description('🔥 Complete purification ritual (scan → fix → report)')
  .option('-p, --path <path>', 'Target directory', './src')
  .option('--commit', 'Auto-commit all changes')
  .action(async (options) => {
    console.log(chalk.bold.magenta('🔥 INITIATING COMPLETE PURIFICATION RITUAL 🔥\\n'));
    
    try {
      // Phase 1: Scan
      console.log(chalk.yellow('Phase 1: Corruption Detection'));
      const scanResults = await scanner.scan(options.path);
      
      // Phase 2: Purification
      console.log(chalk.yellow('\\nPhase 2: Purification'));
      const fixResults = await fixer.autofix(options.path, { commit: options.commit });
      
      // Phase 3: Documentation
      console.log(chalk.yellow('\\nPhase 3: Documentation'));
      const report = await reporter.generate(options.path, { format: 'console' });
      
      console.log('\\n' + chalk.bold.green('🎉 RITUAL COMPLETE 🎉'));
      console.log(chalk.cyan('Your codebase has been purified and blessed.'));
      
    } catch (error) {
      console.error(chalk.red('❌ Ritual failed:'), error.message);
      process.exit(1);
    }
  });

program.parse();