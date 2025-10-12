import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
export function generateSLA(custom) {
    const doc = {
        organization: custom.org,
        soc2: !!custom.soc2,
        uptime: custom.uptime || '99.9%'
    };
    return yaml.dump(doc);
}
export function writeSLA(outPath, contents) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, contents);
}
