console.log("🔍 Running Vauntico QA Ritual...");
console.log("🏛️ Sacred code inspection beginning...");

const fs = require('fs');
const path = require('path');

// Check multiple directories
const checkPaths = [
  { name: 'Components', path: path.join(__dirname, 'src', 'components') },
  { name: 'Pages', path: path.join(__dirname, 'src', 'pages') }
];

let totalFiles = 0;
let missingHover = [];
let missingCTA = [];
let missingARIA = [];
let hasHover = [];
let hasCTA = [];
let hasARIA = [];

checkPaths.forEach(({ name, path: dirPath }) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️ Directory not found: ${name}`);
    return;
  }

  console.log(`\n📂 Scanning ${name}...`);
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    // Only process .jsx and .js files
    if (stat.isFile() && (file.endsWith('.jsx') || file.endsWith('.js'))) {
      totalFiles++;
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for hover effects
      if (content.includes('hover:')) {
        hasHover.push(`${name}/${file}`);
      } else {
        missingHover.push(`${name}/${file}`);
      }
      
      // Check for CTA tracking
      if (content.includes('data-cta') || content.includes('onClick') || content.includes('onSubmit')) {
        hasCTA.push(`${name}/${file}`);
      } else {
        missingCTA.push(`${name}/${file}`);
      }
      
      // Check for ARIA compliance
      if (content.includes('aria-') || content.includes('role=')) {
        hasARIA.push(`${name}/${file}`);
      } else {
        missingARIA.push(`${name}/${file}`);
      }
    }
  });
});

console.log(`\n🎯 QA Ritual Results:`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`📁 Total files scanned: ${totalFiles}`);
console.log(`🎨 With hover effects: ${hasHover.length}/${totalFiles}`);
console.log(`📦 With CTA tracking: ${hasCTA.length}/${totalFiles}`);
console.log(`♿ With ARIA labels: ${hasARIA.length}/${totalFiles}`);

if (missingHover.length > 0) {
  console.log(`\n⚠️ Files missing hover polish (${missingHover.length}):`);
  missingHover.forEach(file => console.log(`  • ${file}`));
}

if (missingCTA.length > 0) {
  console.log(`\n⚠️ Files missing CTA tracking (${missingCTA.length}):`);
  missingCTA.forEach(file => console.log(`  • ${file}`));
}

if (missingARIA.length > 0) {
  console.log(`\n⚠️ Files missing ARIA compliance (${missingARIA.length}):`);
  missingARIA.forEach(file => console.log(`  • ${file}`));
}

// Overall quality score
const hoverScore = Math.round((hasHover.length / totalFiles) * 100);
const ctaScore = Math.round((hasCTA.length / totalFiles) * 100);
const ariaScore = Math.round((hasARIA.length / totalFiles) * 100);
const overallScore = Math.round((hoverScore + ctaScore + ariaScore) / 3);

console.log(`\n📊 Quality Scores:`);
console.log(`  🎨 Hover Polish: ${hoverScore}%`);
console.log(`  📦 CTA Tracking: ${ctaScore}%`);
console.log(`  ♿ ARIA Compliance: ${ariaScore}%`);
console.log(`  🏛️ Overall Score: ${overallScore}%`);

if (overallScore >= 80) {
  console.log(`\n✨ Excellent! Legacy-grade quality maintained.`);
} else if (overallScore >= 60) {
  console.log(`\n⚠️ Good progress, but room for improvement.`);
} else {
  console.log(`\n🚨 Quality needs attention before production.`);
}

console.log(`\n🏛️ Sacred QA Ritual Complete`);
console.log(`"This is legacy-grade work. Treat it as sacred."`);
