import { ScanReport, ActionManifest } from "../types.js";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface PlanRule {
  name: string;
  match?: { paths?: string[]; patterns?: string[]; sizeMinMB?: number };
  action: {
    type: "relocate" | "link" | "rehome_app";
    destination: string;
    verify?: "hash" | "sample" | "launchCheck";
    linkType?: "junction" | "symlink";
    rollback?: "auto" | "manual";
  };
}

export interface Plan {
  version: number;
  targetDrive: string;
  modes: { safety: "safe" | "advanced" | "expert"; linking: "none" | "preferred" | "required" };
  rules: PlanRule[];
}

export function loadPlan(path: string): Plan {
  const doc = yaml.load(fs.readFileSync(path, "utf8")) as Plan;
  return doc;
}

export function simulate(plan: Plan, report: ScanReport) {
  const actions: any[] = [];
  let totalFree = 0;

  for (const rule of plan.rules) {
    for (const item of report.items) {
      const min = (rule.match?.sizeMinMB ?? 0) * 1_000_000;
      const matchPath =
        (rule.match?.paths ?? []).some(p => item.path.toLowerCase().startsWith(p.toLowerCase())) ||
        (rule.match?.patterns ?? []).some(p => item.path.toLowerCase().includes(p.toLowerCase()));

      if (matchPath && item.sizeBytes >= min) {
        if (rule.action.type === 'rehome_app' && (item as any).type && (item as any).type !== 'folder') {
          continue; // only rehome directories
        }
        const actionPayload: any = { rule: rule.name, item: item.path, to: rule.action.destination, type: rule.action.type };
        if ((rule.action as any).verify) {
          actionPayload.verify = (rule.action as any).verify;
        }
        // Attach action options consistently (applies to all action types)
        const opts: any = {};
        if ((rule.action as any).dryRun === true) opts.dryRun = true;
        if (rule.action.type === 'rehome_app') {
          if ((rule.action as any).updateShortcuts === true) opts.updateShortcuts = true;
          if ((rule.action as any).updateServices === true) opts.updateServices = true;
        }
        if (Object.keys(opts).length) actionPayload.options = opts;
        actions.push(actionPayload);
        totalFree += item.sizeBytes;
      }
    }
  }

  return { actions, estimatedSpaceFreedBytes: totalFree };
}

export function saveManifest(sim: { actions: any[]; estimatedSpaceFreedBytes: number }, outPath: string) {
  const manifest: ActionManifest = {
    generatedAt: new Date().toISOString(),
    estimatedSpaceFreedBytes: sim.estimatedSpaceFreedBytes,
    items: sim.actions.map(a => ({
      rule: a.rule,
      itemPath: a.item,
      actionType: a.type,
      destination: a.to,
      verifyMode: a.verify,
      actionOptions: a.options
    }))
  };
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  return outPath;
}
