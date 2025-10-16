const fs = require('fs').promises;
const path = require('path');
const { parse } = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * VAUNTICO FIXER
 * Applies mystical healing to corrupted JSX
 */

class VaunticoFixer {
  constructor() {
    this.fixesApplied = [];
    this.processedFiles = 0;
    this.fixedFiles = 0;
  }

  async autofix(targetPath, options = {}) {
    const { 
      types = ['jsx', 'js', 'tsx', 'ts'], 
      dryRun = false, 
      commit = false 
    } = options;
    
    console.log(chalk.magenta(`⚡ Fixing: ${targetPath}`));
    
    this.fixesApplied = [];
    this.processedFiles = 0;
    this.fixedFiles = 0;
    
    await this._processDirectory(targetPath, types, dryRun);
    
    if (commit && !dryRun && this.fixedFiles > 0) {
      await this._commitChanges();
    }
    
    return {
      processed: this.processedFiles,
      fixed: this.fixedFiles,
      fixesApplied: this.fixesApplied.length,
      fixes: this.fixesApplied
    };
  }

  async _processDirectory(dir, types, dryRun) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await this._processDirectory(fullPath, types, dryRun);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).slice(1);
          if (types.includes(ext)) {
            await this._processFile(fullPath, dryRun);
          }
        }
      }
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Cannot read directory: ${dir}`));
    }
  }

  async _processFile(filePath, dryRun) {
    try {
      this.processedFiles++;
      const originalContent = await fs.readFile(filePath, 'utf8');
      let content = originalContent;
      const relativePath = path.relative(process.cwd(), filePath);
      
      console.log(chalk.gray(`   🔧 Processing: ${relativePath}`));
      
      let hasChanges = false;
      const appliedFixes = [];
      
      // Apply pattern-based fixes
      const patternResult = this._applyPatternFixes(filePath, content);
      if (patternResult.changed) {
        content = patternResult.content;
        hasChanges = true;
        appliedFixes.push(...patternResult.fixes);
      }
      
      // Apply AST-based fixes for JSX files
      if (path.extname(filePath).match(/\.(jsx|tsx)$/)) {
        const astResult = this._applyASTFixes(filePath, content);
        if (astResult.changed) {
          content = astResult.content;
          hasChanges = true;
          appliedFixes.push(...astResult.fixes);
        }
      }
      
      // Write changes if any
      if (hasChanges && !dryRun) {
        await fs.writeFile(filePath, content, 'utf8');
        this.fixedFiles++;
        console.log(chalk.green(`   ✅ Fixed: ${relativePath}`));
      } else if (hasChanges && dryRun) {
        console.log(chalk.blue(`   📋 Would fix: ${relativePath}`));
      }
      
      // Record all fixes
      appliedFixes.forEach(fix => {
        this.fixesApplied.push({
          file: relativePath,
          type: fix.type,
          description: fix.description,
          dryRun
        });
      });
      
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Error processing ${filePath}: ${error.message}`));
    }
  }

  _applyPatternFixes(filePath, content) {
    let newContent = content;
    const fixes = [];
    let changed = false;
    
    // Fix truncated exports
    const lines = newContent.split('\n');
    const lastLineIndex = lines.length - 1;
    const lastLine = lines[lastLineIndex];
    
    if (/export\s+default\s+(\w+)$/.test(lastLine)) {
      const match = lastLine.match(/export\s+default\s+(\w+)$/);
      if (match) {
        const exportName = match[1];
        const expectedName = this._getExpectedComponentName(filePath);
        
        if (expectedName.startsWith(exportName) && exportName !== expectedName) {
          lines[lastLineIndex] = `export default ${expectedName}`;
          newContent = lines.join('\n');
          changed = true;
          fixes.push({
            type: 'TRUNCATED_EXPORT',
            description: `Fixed truncated export: ${exportName} → ${expectedName}`
          });
        }
      }
    }
    
    // Fix misaligned className props
    const misalignedProps = newContent.match(/(\n\s*)(className\s*=)/g);
    if (misalignedProps) {
      // Fix by ensuring className is properly indented
      newContent = newContent.replace(
        /(\n)(\s*)(className\s*=)/g,
        (match, newline, spaces, prop) => {
          const previousLine = newContent.split(newline)[0].split('\n').pop();
          if (/<\w+\s*$/.test(previousLine)) {
            return `${newline}            ${prop}`;
          }
          return match;
        }
      );
      
      if (newContent !== content) {
        changed = true;
        fixes.push({
          type: 'MISALIGNED_PROPS',
          description: 'Fixed misaligned className properties'
        });
      }
    }
    
    // Fix malformed onClick handlers
    newContent = newContent.replace(
      /onClick\s*=\s*\{([^}]*)$/gm,
      'onClick={() => $1}'
    );
    
    if (newContent !== content && !changed) {
      changed = true;
      fixes.push({
        type: 'MALFORMED_ONCLICK',
        description: 'Fixed malformed onClick handlers'
      });
    }
    
    return { content: newContent, changed, fixes };
  }

  _applyASTFixes(filePath, content) {
    try {
      const ast = parse(content, {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        allowReturnOutsideFunction: true,
        plugins: [
          'jsx',
          'typescript',
          'classProperties',
          'decorators-legacy',
          'objectRestSpread'
        ]
      });
      
      const fixes = [];
      let changed = false;
      
      // Track JSX elements outside return statements
      const jsxOutsideReturn = [];
      let functionDepth = 0;
      let isInReturn = false;
      
      traverse(ast, {
        FunctionDeclaration: {
          enter() { functionDepth++; },
          exit() { functionDepth--; }
        },
        FunctionExpression: {
          enter() { functionDepth++; },
          exit() { functionDepth--; }
        },
        ArrowFunctionExpression: {
          enter() { functionDepth++; },
          exit() { functionDepth--; }
        },
        ReturnStatement: {
          enter() { isInReturn = true; },
          exit() { isInReturn = false; }
        },
        JSXElement(path) {
          // Detect JSX outside return statements
          if (!isInReturn && functionDepth > 0) {
            jsxOutsideReturn.push(path);
          }
        }
      });
      
      // Fix JSX outside return by wrapping in proper return structure
      if (jsxOutsideReturn.length > 0) {
        // This is a complex fix that would require restructuring the component
        // For now, we'll just report it
        fixes.push({
          type: 'JSX_OUTSIDE_RETURN',
          description: `Found ${jsxOutsideReturn.length} JSX elements outside return statements`
        });
      }
      
      // Generate fixed content
      if (changed) {
        const result = generate(ast, {
          retainLines: true,
          compact: false
        });
        return { content: result.code, changed, fixes };
      }
      
      return { content, changed: false, fixes };
      
    } catch (parseError) {
      // If we can't parse, return original content
      return { 
        content, 
        changed: false, 
        fixes: [{
          type: 'SYNTAX_ERROR',
          description: `Could not parse file: ${parseError.message}`
        }]
      };
    }
  }

  _getExpectedComponentName(filePath) {
    const basename = path.basename(filePath, path.extname(filePath));
    return basename
      .replace(/[-_]/g, '')
      .replace(/^\w/, c => c.toUpperCase());
  }

  async _commitChanges() {
    try {
      const message = 'fix: recursive JSX corruption cleanup via Vauntico Purifier\n\n' +
        '🔥 PURIFICATION RITUAL COMPLETE 🔥\n' +
        `- Fixed ${this.fixedFiles} corrupted files\n` +
        `- Applied ${this.fixesApplied.length} structural repairs\n` +
        '- Restored JSX harmony and mystical balance\n\n' +
        'Generated by @vauntico/purifier\n' +
        '"From corruption comes clarity. From chaos comes code."';
      
      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
      
      console.log(chalk.green('📝 Changes committed with ritual blessing'));
      
    } catch (error) {
      console.warn(chalk.yellow(`⚠️  Could not commit changes: ${error.message}`));
    }
  }
}

const fixer = new VaunticoFixer();

module.exports = {
  fixer
};