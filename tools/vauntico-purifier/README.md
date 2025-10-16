# 🔥 Vauntico Purifier

*The Mythic JSX Restoration Tool*

> *"From corruption comes clarity. From chaos comes code."*  
> — The Vauntico Doctrine

## Overview

The **Vauntico Purifier** is a mystical CLI tool that detects and heals structural corruption in JSX files with the precision of ancient alchemy. Born from the sacred fires of the Vauntico forge, it transforms broken components into harmonious code.

## ✨ Mystical Features

- 🔍 **Deep Corruption Scanning** - Detects patterns invisible to mortal linters
- ⚡ **Automatic Purification** - Heals corrupted JSX with zero human intervention  
- 📊 **Sacred Reporting** - Generates mystical corruption maps and analysis
- 🔥 **Complete Ritual Mode** - End-to-end purification ceremony
- 🎯 **AST-Powered Detection** - Uses Babel's mystical parsing powers
- 💎 **Preservation Magic** - Maintains formatting while restoring structure

## 🚨 Corruption Patterns Detected

| Pattern | Severity | Description |
|---------|----------|-------------|
| `TRUNCATED_EXPORT` | 🔥 Critical | Export statements cut short (`VaultSuccessPag`) |
| `JSX_OUTSIDE_RETURN` | 🔥 Critical | JSX elements floating outside component returns |
| `MISALIGNED_PROPS` | ⚠️ High | Props scattered across lines without harmony |
| `MALFORMED_ONCLICK` | ⚠️ High | Event handlers broken mid-incantation |
| `UNCLOSED_JSX` | 🔥 Critical | Elements left open to the void |
| `DUPLICATE_PROPS` | 💡 Medium | Properties duplicated in confusion |
| `SYNTAX_ERROR` | 🔥 Critical | Parse failures that break the sacred flow |

## 🛠️ Installation

### As Part of Vauntico Ecosystem
```bash
# Already installed if you're in the Vauntico repo
cd tools/vauntico-purifier
npm install
```

### Standalone Installation
```bash
npm install -g @vauntico/purifier
```

## 📖 Sacred Commands

### 🔍 `scan` - Detect Corruption
Reveal hidden corruption patterns in your codebase:

```bash
vauntico-purifier scan
vauntico-purifier scan --path ./src/components --verbose
vauntico-purifier scan --types jsx,tsx
```

**Output:**
```
╔══════════════════════════════════════════════════════════╗
║          VAUNTICO PURIFIER                        ║
║          The Mythic JSX Restoration Tool               ║
╚══════════════════════════════════════════════════════════╝

🔍 Initiating Corruption Scan...

✅ Scan Complete
Files Scanned: 47
Corruptions Found: 3

🚨 CORRUPTION DETECTED:
1. src/components/VaultSuccessPage.jsx - TRUNCATED_EXPORT
2. src/pages/Homepage.jsx - MISALIGNED_PROPS
3. src/components/BadButton.jsx - JSX_OUTSIDE_RETURN
```

### ⚡ `autofix` - Purify & Heal
Automatically repair detected corruption:

```bash
vauntico-purifier autofix
vauntico-purifier autofix --commit
vauntico-purifier autofix --dry-run
```

**Example Fix:**
```diff
- export default VaultSuccessPag
+ export default VaultSuccessPage

-           <Link
-             to="/demo"
-className="btn-primary"
+           <Link
+             to="/demo"
+             className="btn-primary"
```

### 📊 `report` - Generate Corruption Maps
Create detailed analysis reports:

```bash
vauntico-purifier report
vauntico-purifier report --format markdown --output ./corruption-report.md
vauntico-purifier report --format json --output ./corruption.json
```

### 🔥 `ritual` - Complete Purification
Perform the complete purification ceremony:

```bash
vauntico-purifier ritual
vauntico-purifier ritual --commit
```

**Ritual Flow:**
1. **Phase 1:** Corruption Detection 🔍
2. **Phase 2:** Purification ⚡
3. **Phase 3:** Documentation 📊

## 🎯 Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `--path` | Target directory to scan/fix | `./src` |
| `--types` | File extensions to process | `jsx,js,tsx,ts` |
| `--commit` | Auto-commit changes with ritual message | `false` |
| `--dry-run` | Preview changes without applying | `false` |
| `--verbose` | Detailed output | `false` |
| `--format` | Report format (console/json/markdown) | `console` |
| `--output` | Output file for reports | `./corruption-report.json` |

## 🔮 Integration Examples

### With CI/CD
```yaml
name: Purification Ritual
on: [push]
jobs:
  purify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Vauntico Purifier
        run: npm install -g @vauntico/purifier
      - name: Detect Corruption
        run: vauntico-purifier scan
      - name: Auto-heal if needed
        run: vauntico-purifier autofix --commit
```

### With Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "vauntico-purifier scan && vauntico-purifier autofix"
    }
  }
}
```

### Programmatic Usage
```javascript
const { scanner, fixer, reporter } = require('@vauntico/purifier');

// Scan for corruption
const results = await scanner.scan('./src');
console.log(`Found ${results.corruptions.length} corruptions`);

// Auto-fix issues  
const fixes = await fixer.autofix('./src', { dryRun: false });
console.log(`Fixed ${fixes.fixed} files`);

// Generate report
const report = await reporter.generate('./src', { format: 'console' });
```

## 🏛️ Architecture

```
tools/vauntico-purifier/
├── bin/
│   └── cli.js              # CLI entry point with mystical ASCII art
├── lib/
│   ├── scanner.js          # Pattern & AST-based corruption detection
│   ├── fixer.js            # Automated healing with Babel transforms
│   └── reporter.js         # Sacred report generation
├── package.json            # Scoped as @vauntico/purifier
└── README.md               # This mystical tome
```

## 🧬 Corruption Detection Logic

### Pattern-Based (Fast)
- **Regex Patterns:** Quick detection of common issues
- **Line-by-line Analysis:** Truncated exports, misaligned props
- **Content Matching:** Malformed handlers, duplicate attributes

### AST-Based (Thorough) 
- **Babel Parser:** Deep structural analysis
- **Tree Traversal:** JSX placement validation
- **Scope Tracking:** Component boundary detection
- **Syntax Validation:** Parse error identification

## 🎨 Vauntico Brand Integration

The Purifier is deeply integrated into the Vauntico mythology:

- **Element:** Fire 🔥 (purification through sacred flames)
- **Purpose:** Restoration of corrupted digital artifacts  
- **Ritual Status:** True (can be invoked as part of larger ceremonies)
- **Doctrine:** *"From corruption comes clarity. From chaos comes code."*

### Brand Assets
- Mystical ASCII art headers
- Consistent color scheme (gold/purple/fire)
- Ritual-based command naming
- Sacred terminology throughout

## 🚀 Future Enhancements

- **Auto-healing for complex JSX restructuring**
- **Custom corruption pattern definitions**
- **Integration with Vauntico web dashboard**  
- **VS Code extension with real-time purification**
- **Team ritual reports and corruption trending**

## 🔬 Contributing

To contribute to the Purifier:

```bash
cd tools/vauntico-purifier
npm install
npm test
```

All contributions must align with the Vauntico brand and mystical aesthetic.

## 📜 License

MIT - May your code be forever pure.

---

## 🔥 Example Output

```
╔══════════════════════════════════════════════════════════╗
║                  CORRUPTION REPORT                  ║
║              Generated by Vauntico Purifier            ║
╚══════════════════════════════════════════════════════════╝

📊 ANALYSIS SUMMARY

Target Path: /Users/you/project/src
Scanned Files: 42
Total Corruptions: 0
Timestamp: 10/16/2025, 8:23:15 PM

🎉 NO CORRUPTIONS DETECTED

Your JSX is pure and blessed by the ancients.

────────────────────────────────────────────────────────
"From corruption comes clarity. From chaos comes code."
Generated by @vauntico/purifier v1.0.0
```

*Built with ⚡ by the Vauntico Collective*