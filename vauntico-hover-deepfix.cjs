// vauntico-hover-deepfix.cjs
const fs = require('fs');
const path = require('path');

const hoverClass = 'hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300';
const interactiveTags = ['button', 'a', 'CTAButton'];

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

const patchClassName = (props) => {
  const classMatch = props.match(/className\s*=\s*{?"([^"}]*)"?}/);
  if (classMatch) {
    const existing = classMatch[1];
    if (!existing.includes('hover:scale-')) {
      const patched = `${existing} ${hoverClass}`;
      return props.replace(classMatch[0], `className="${patched}"`);
    }
  } else {
    return props + ` className="${hoverClass}"`;
  }
  return props;
};

const patchFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  interactiveTags.forEach((tag) => {
    const regex = new RegExp(`<${tag}([^>]*)>`, 'g');
    content = content.replace(regex, (match, props) => {
      const patchedProps = patchClassName(props);
      return `<${tag}${patchedProps}>`;
    });
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Deep patched ${filePath}`);
  }
};

const jsxFiles = walkDir(path.resolve(process.cwd(), 'src'));
console.log('🧠 Running vauntico-hover-deepfix...\n');
jsxFiles.forEach(patchFile);
console.log('\n🏁 Deep hover polish applied. Run `node vauntico-lint.cjs` to confirm full pass.');