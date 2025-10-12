import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

const schemaPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), 'plan.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

export function validatePlan(plan: any): { ok: boolean; errors: string[] } {
  const ok = validate(plan) as boolean;
  if (ok) return { ok: true, errors: [] };
  const errors = (validate.errors || []).map(e => `${e.instancePath || 'plan'} ${e.message}`);
  return { ok: false, errors };
}
