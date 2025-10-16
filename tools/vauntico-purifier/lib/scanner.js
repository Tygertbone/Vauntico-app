const fs = require('fs').promises;
const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const chalk = require('chalk');

/**
 * VAUNTICO SCANNER
 * Detects JSX corruption patterns with mystical precision
 */

class VaunticoScanner {
  constructor() {
    this.patterns = {
      TRUNCATED_EXPORT: /export\s+default\s+(\w+)$/,
      JSX_OUTSIDE_RETURN: /^\s*<\w+/m,
      MISALIGNED_PROPS: /\n\s*className\s*=/,
      UNCLOSED_TAGS: /<(\w+)[^>]*>(?!.*<\/\1>)/,
      MALFORMED_ONCLICK: /onClick\s*=\s*\{[^}]*$/m,
      DUPLICATE_PROPS: /(className\s*=.*){2,}/,
      BROKEN_FRAGMENTS: /<>\s*<\/>/,
      EMPTY_BLOCKS: /\{\s*\}/
    };
    
    this.corruptions = [];
    this.totalFiles = 0;
  }

  async scan(targetPath, options = {}) {
    const { types = ['jsx', 'js', 'tsx', 'ts'], verbose = false } = options;
    
    console.log(chalk.blue(`🔍 Scanning: ${targetPath}`));
    
    this.corruptions = [];
    this.totalFiles = 0;
    
    await this._scanDirectory(targetPath, types, verbose);
    
    return {
      totalFiles: this.totalFiles,
      corruptions: this.corruptions,
      summary: this._generateSummary()
    };
  }

  async _scanDirectory(dir, types, verbose) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await this._scanDirectory(fullPath, types, verbose);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).slice(1);
          if (types.includes(ext)) {
            await this._scanFile(fullPath, verbose);
          }
        }
      }
    } catch (error) {
      if (verbose) {
        console.warn(chalk.yellow(`⚠️  Cannot read directory: ${dir}`));
      }
    }
  }

  async _scanFile(filePath, verbose) {
    try {
      this.totalFiles++;
      const content = await fs.readFile(filePath, 'utf8');
      
      if (verbose) {
        console.log(chalk.gray(`   📄 Scanning: ${path.relative(process.cwd(), filePath)}`));
      }
      
      // Pattern-based scanning (fast)
      await this._scanPatterns(filePath, content);
      
      // AST-based scanning (thorough)
      if (path.extname(filePath).match(/\.(jsx|tsx)$/)) {
        await this._scanAST(filePath, content);
      }
      
    } catch (error) {
      if (verbose) {
        console.warn(chalk.yellow(`⚠️  Error scanning ${filePath}: ${error.message}`));
      }
    }
  }

  async _scanPatterns(filePath, content) {
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Check for truncated exports
    const lines = content.split('\n');
    const lastLine = lines[lines.length - 1];
    if (this.patterns.TRUNCATED_EXPORT.test(lastLine)) {
      const match = lastLine.match(/export\s+default\s+(\w+)$/);
      if (match) {
        const exportName = match[1];
        const expectedName = this._getExpectedComponentName(filePath);
        if (exportName !== expectedName && expectedName.startsWith(exportName)) {
          this.corruptions.push({
            file: relativePath,
            type: 'TRUNCATED_EXPORT',
            line: lines.length,
            details: `Export "${exportName}" appears truncated. Expected: "${expectedName}"`,
            severity: 'high'
          });
        }
      }
    }
    
    // Check for misaligned props
    if (this.patterns.MISALIGNED_PROPS.test(content)) {
      const matches = [...content.matchAll(/\n(\s*)className\s*=/g)];
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        this.corruptions.push({
          file: relativePath,
          type: 'MISALIGNED_PROPS',
          line: lineNumber,
          details: 'className prop not properly aligned with JSX element',
          severity: 'medium'
        });
      }
    }
    
    // Check for malformed onClick handlers
    if (this.patterns.MALFORMED_ONCLICK.test(content)) {
      const matches = [...content.matchAll(/onClick\s*=\s*\{[^}]*$/gm)];
      for (const match of matches) {
        const lineNumber = content.substring(0, match.index).split('\n').length;
        this.corruptions.push({
          file: relativePath,
          type: 'MALFORMED_ONCLICK',
          line: lineNumber,
          details: 'onClick handler appears incomplete or malformed',
          severity: 'high'
        });
      }
    }
    
    // Check for duplicate props
    if (this.patterns.DUPLICATE_PROPS.test(content)) {
      this.corruptions.push({
        file: relativePath,
        type: 'DUPLICATE_PROPS',
        line: null,
        details: 'Duplicate className or other props detected',
        severity: 'medium'
      });
    }
  }

  async _scanAST(filePath, content) {
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
      
      const relativePath = path.relative(process.cwd(), filePath);
      let isInReturnStatement = false;
      let functionDepth = 0;
      
      traverse(ast, {
        FunctionDeclaration(path) {
          functionDepth++;
        },
        FunctionExpression(path) {
          functionDepth++;
        },
        ArrowFunctionExpression(path) {
          functionDepth++;
        },
        ReturnStatement: {
          enter() {
            isInReturnStatement = true;
          },
          exit() {
            isInReturnStatement = false;
          }
        },
        JSXElement(path) {
          // Check for JSX outside return statements
          if (!isInReturnStatement && functionDepth > 0) {
            this.corruptions.push({
              file: relativePath,
              type: 'JSX_OUTSIDE_RETURN',
              line: path.node.loc?.start.line,
              details: 'JSX element found outside component return statement',
              severity: 'high'
            });
          }
          
          // Check for unclosed JSX elements
          const openingElement = path.node.openingElement;
          if (!path.node.closingElement && !openingElement.selfClosing) {
            this.corruptions.push({
              file: relativePath,
              type: 'UNCLOSED_JSX',
              line: path.node.loc?.start.line,
              details: `Unclosed JSX element: ${openingElement.name.name}`,
              severity: 'critical'
            });
          }
        },
        JSXFragment(path) {
          // Check for empty fragments
          if (path.node.children.length === 0) {
            this.corruptions.push({
              file: relativePath,
              type: 'EMPTY_JSX_FRAGMENT',
              line: path.node.loc?.start.line,
              details: 'Empty JSX fragment detected',
              severity: 'low'
            });
          }
        }
      });
      
    } catch (parseError) {
      // If AST parsing fails, it's likely a syntax error
      this.corruptions.push({
        file: path.relative(process.cwd(), filePath),
        type: 'SYNTAX_ERROR',
        line: null,
        details: `Parse error: ${parseError.message}`,
        severity: 'critical'
      });
    }
  }

  _getExpectedComponentName(filePath) {
    const basename = path.basename(filePath, path.extname(filePath));
    return basename.replace(/[-_]/g, '').replace(/^\w/, c => c.toUpperCase());
  }

  _generateSummary() {
    const summary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    
    this.corruptions.forEach(corruption => {
      summary[corruption.severity]++;
    });
    
    return summary;
  }
}

const scanner = new VaunticoScanner();

module.exports = {
  scanner
};