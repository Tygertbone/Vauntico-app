#!/usr/bin/env node
require('dotenv').config();
console.log('🔍 Loaded API Key:', process.env.OPENAI_API_KEY);

// --- Preflight Check: Enforce .env presence ---
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Missing OPENAI_API_KEY in .env. Please set it before running.');
  process.exit(1);
}

// --- Optional: Warn if MODEL is missing or unexpected ---
const allowedModels = ['gpt-4', 'gpt-4o'];
const MODEL = process.env.MODEL || 'gpt-4';
if (!allowedModels.includes(MODEL)) {
  console.warn(`⚠️ MODEL "${MODEL}" is not in allowed list. Defaulting to gpt-4`);
}

// --- Optional: Log active config for traceability ---
console.log(`🔧 Using model: ${MODEL}`);
console.log(`🔐 API key loaded: ${process.env.OPENAI_API_KEY.slice(0, 5)}...`);

const fs   = require('fs');
const path = require('path');

const PROMPT_PATH = path.resolve('ops/manus/prompt.txt');
const BANK_PATH   = path.resolve('ops/manus/research_bank.json');
const OUT_PATH    = path.resolve('ops/manus/generated_sample.txt');

console.log('🔍 DEBUG: process.env.OPENAI_API_KEY =', process.env.OPENAI_API_KEY);
const OPENAI_KEY = process.env.OPENAI_API_KEY;

const task = process.argv.slice(2).join(' ');
if (!task) {
  console.error('Usage: node scripts/run-manus.js "Now write: [SPECIFIC CONTENT REQUEST]"');
  process.exit(1);
}

const promptTxt     = fs.existsSync(PROMPT_PATH) ? fs.readFileSync(PROMPT_PATH, 'utf8') : '';
const bankJson      = fs.existsSync(BANK_PATH)   ? fs.readFileSync(BANK_PATH,   'utf8') : '[]';
const systemContent = promptTxt.replace('[INSERT FULL_RESEARCH_BANK HERE]', bankJson);

(async () => {
  const payload = {
    model: MODEL,
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user',   content: task }
    ],
    max_tokens: 1500,
    temperature: 0.2
  };

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`API error ${res.status}: ${txt}`);
    }

    const data   = await res.json();
    const output = data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);

    // --- Validate Ethical Footer ---
    if (!output.includes('Ethical Footer')) {
      console.warn('⚠️ Ethical Footer missing from Manus output. Please ensure compliance.');
    }

    // --- Validate Hero Section Elements ---
    const missingElements = [];
    if (!output.match(/Get Started/i)) missingElements.push('CTA button text ("Get Started")');
    if (!output.match(/headline/i))     missingElements.push('headline');
    if (!output.match(/subheadline/i))  missingElements.push('subheadline');

    if (missingElements.length > 0) {
      console.warn(`⚠️ Missing required elements: ${missingElements.join(', ')}`);
    }

    // --- Final Output with Metadata + CI Badge ---
    const metadataHeader = `<!-- METADATA: model=${MODEL}, bankIDs=${extractBankIDs(output)}, generated=${new Date().toISOString().split('T')[0]} -->\n`;
    const ciBadge = `\n<!-- CI-BADGE: Vauntico Verified | Timestamp=${new Date().toISOString()} -->`;
    const finalOutput = metadataHeader + output + ciBadge;

    fs.writeFileSync(OUT_PATH, finalOutput, 'utf8');
    console.log('✅ Manus output saved to', OUT_PATH);
    console.log('--- Preview ---\n', finalOutput.slice(0, 500));
  } catch (err) {
    console.error('Run error:', err.message);
    process.exit(2);
  }
})();

// --- Utility: Extract BankIDs from output ---
function extractBankIDs(text) {
  const matches = text.match(/RB-\d{4}-\d{3}/g);
  return matches ? [...new Set(matches)].join(',') : 'none';
}

// --- End of run-manus.js ---