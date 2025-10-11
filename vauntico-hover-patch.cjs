// vauntico-hover-patch.cjs
const fs = require('fs');
const path = require('path');

const hoverClass = 'hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300';
const interactiveTags = ['<button', '<a ', '<CTAButton'];
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

  // Fix hover polish
  interactiveTags.forEach((tag) => {
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

  // Fix CTAButton import path
  content = content.replace(/import CTAButton from ['"][^'"]+['"]/, correctImport);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Patched ${filePath}`);
  }
};

const jsxFiles = walkDir(path.resolve(process.cwd(), 'src'));
console.log('🎯 Running vauntico-hover-patch...\n');
jsxFiles.forEach(patchFile);
console.log('\n🚀 All hover polish and CTA imports patched. Run `node vauntico-lint.cjs` to confirm branded compliance.');