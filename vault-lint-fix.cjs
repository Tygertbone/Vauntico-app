// vauntico-lint-fix.cjs
const fs = require('fs');
const path = require('path');

const CTA_REGEX = /<CTAButton([^>]*)>/g;
const IMPORT_REGEX = /import CTAButton from ['"]([^'"]+)['"]/;
const INTERACTIVE_TAGS = ['<button', '<a ', '<CTAButton'];

const requiredProps = {
  label: 'label="FixMe"',
  to: 'to="/fix-me"',
  trackEvent: 'trackEvent="cta_click"',
};

const hoverClass = 'hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300';
const correctImport = `import CTAButton from '@/components/ui/CTAButton';`;

const walkDir = (dir) => {
  const results = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (file.endsWith('.jsx')) {
      results.push(fullPath);
    }
  });
  return results;
};

const patchFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Fix CTAButton props
  content = content.replace(CTA_REGEX, (match, props) => {
    let newProps = props;
    Object.entries(requiredProps).forEach(([key, value]) => {
      if (!props.includes(`${key}=`)) {
        newProps += ` ${value}`;
      }
    });
    if (!newProps.includes('className=')) {
      newProps += ` className="${hoverClass}"`;
    } else if (!newProps.includes('hover:scale-')) {
      newProps = newProps.replace(/className="([^"]*)"/, (_, cls) => {
        return `className="${cls} ${hoverClass}"`;
      });
    }
    return `<CTAButton${newProps}>`;
  });

  // Fix import path
  content = content.replace(IMPORT_REGEX, () => correctImport);

  // Fix hover polish on <button> and <a>
  INTERACTIVE_TAGS.forEach((tag) => {
    const regex = new RegExp(`${tag}([^>]*)>`, 'g');
    content = content.replace(regex, (match, props) => {
      if (props.includes('className=') && !props.includes('hover:scale-')) {
        return match.replace(/className="([^"]*)"/, (_, cls) => {
          return `className="${cls} ${hoverClass}"`;
        });
      } else if (!props.includes('className=')) {
        return `${tag} className="${hoverClass}">`;
      }
      return match;
    });
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${filePath}`);
  }
};

const jsxFiles = walkDir(path.resolve(process.cwd(), 'src'));
console.log('🔧 Running vauntico-lint-fix...\n');
jsxFiles.forEach(patchFile);
console.log('\n🎯 All files patched. Run `npm run audit` or `node vauntico-lint.cjs` to confirm.');