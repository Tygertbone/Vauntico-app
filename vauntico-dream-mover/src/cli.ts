import { Command } from "commander";
import fs from "fs";
import path from "path";
import { scanDrive } from "./scanner/windows.js";
import { loadPlan, simulate, saveManifest } from "./planner/simulate.js";
import { relocatePath } from "./migrator/relocate.js";
import { createJunction } from "./migrator/link.js";
import { explainDecision } from "./explain/narrative.js";
import { validatePlan } from "./planner/schema.js";
import { ActionManifest } from "./types.js";
import { hashFolder } from "./verify/hash.js";
import { timeCapsule } from "./rollback/capsule.js";

const program = new Command();
program.name("dream-mover").description("Vauntico Dream Mover CLI").version("0.1.0");

program
  .command("scan")
  .requiredOption("--drive <letter>", "Drive letter (e.g., C)")
  .requiredOption("--output <path>", "Output JSON path")
  .action(async (opts) => {
    const report = await scanDrive(opts.drive);
    fs.mkdirSync(path.dirname(opts.output), { recursive: true });
    fs.writeFileSync(opts.output, JSON.stringify(report, null, 2));
    console.log(`Scan complete → ${opts.output}`);
  });

program
  .command("simulate")
  .requiredOption("--plan <path>", "Plan YAML path")
  .requiredOption("--report <path>", "Scan report JSON")
  .option("--out <path>", "Manifest output JSON", "logs/manifest.json")
  .option("--use-rust", "Attempt to use Rust core for POC checks", false)
  .action(async (opts) => {
    const plan = loadPlan(opts.plan);
    const report = JSON.parse(fs.readFileSync(opts.report, "utf8"));
    const sim = simulate(plan, report);

    // Phase 3: Refined AI stubs — compute risk score, preview collisions, and render Mermaid with risk classes
    const { computeRiskScore, renderMermaidShadow, collisionPreview } = await import('./ai/risk.js');
    const risk = computeRiskScore(sim.actions.map((a: any) => ({
      itemPath: a.itemPath,
      destination: a.destination,
      actionType: a.actionType,
      sizeBytes: a.sizeBytes || 0
    })));
    fs.mkdirSync('logs', { recursive: true });
    const shadow = renderMermaidShadow(sim.actions as any);
    fs.writeFileSync('logs/shadow-map.mmd', shadow, 'utf8');

    // Collision preview
    const preview = collisionPreview(sim.actions as any)
    fs.writeFileSync('logs/collision-preview.json', JSON.stringify(preview, null, 2))

    // Persist manifest and augment with riskScore and collisionPreview
    const out = saveManifest(sim, opts.out);
    const manifest = JSON.parse(fs.readFileSync(out, 'utf8'));
    manifest.riskScore = risk;
    manifest.collisionPreview = preview;
    fs.writeFileSync(out, JSON.stringify(manifest, null, 2));

    const summaryMB = (sim.estimatedSpaceFreedBytes / 1_000_000).toFixed(2);
    console.log(`Simulation: ${sim.actions.length} actions, ~${summaryMB} MB freed`);
    console.log(`Manifest written → ${out}`);
    console.log(`Shadow map → logs/shadow-map.mmd`);

    // Phase 4: Rust core POC
    if (opts.useRust) {
      // Tier gate: require Practitioner or above for --use-rust
      const { checkTier } = await import('./tiers/gatekeeper.js');
      const prof = checkTier('local');
      const isAllowed = (prof.level === 'Practitioner' || prof.level === 'Guild' || prof.level === 'Oracle');
      if (!isAllowed) {
        console.warn('Tier gate: --use-rust requires Practitioner+. Continuing with Node driver.');
      } else {
        const { getRustDriver } = await import('./runtime/rust-bridge.js')
        const rust = await getRustDriver()
        console.log(`Rust core available: ${rust.available}`)
      }
    }

    // Reflective prompt (stub)
    console.log("Reflective: What felt safest? (A) Hashes (B) Samples");
    if ((preview || []).length) {
      console.log("Collision preview: " + preview.join(', '))
    }

    for (const a of sim.actions.slice(0, 50)) {
      console.log("—\n" + explainDecision(a));
    }
  });

program
  .command("migrate")
  .requiredOption("--manifest <path>", "Manifest JSON from simulate")
  .option("--checkpoint", "Create pre-move checkpoint", true)
  .option("--verify <mode>", "Verification mode: none|sample|hash", "hash")
  .action(async (opts) => {
    const manifest: ActionManifest = JSON.parse(fs.readFileSync(opts.manifest, "utf8"));
    const capsuleRoot = path.join("logs", "capsules");
    const verifyMode = String(opts.verify || 'hash');

    console.log(`Executing ${manifest.items.length} actions...`);

    const perItem: any[] = [];
    const runStartedAt = new Date().toISOString();
    const writeAudit = (runId: string) => {
      const runLogPath = path.join('logs', `migrate-${runId}.json`);
      const lastRunPath = path.join('logs', 'last-run.json');
      fs.mkdirSync('logs', { recursive: true });
      const audit = { runId, verifyMode, startedAt: runStartedAt, endedAt: new Date().toISOString(), items: perItem };
      fs.writeFileSync(runLogPath, JSON.stringify(audit, null, 2));
      fs.writeFileSync(lastRunPath, JSON.stringify({ manifestPath: runLogPath, runId }, null, 2));
      return runLogPath;
    };

    const runId = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];

    for (const item of manifest.items) {
      let capsule = "";
      const effectiveVerify = (item as any).verifyMode || verifyMode;
      const dryRunOpt = !!(item as any).actionOptions?.dryRun;
      const auditItem: any = {
        itemPath: item.itemPath,
        destination: item.destination,
        actionType: item.actionType,
        verifyMode: effectiveVerify,
        beforeHash: "",
        afterHash: "",
        capsulePath: "",
        result: "",
        error: "",
        startedAt: new Date().toISOString(),
        endedAt: "",
        durationsMs: { preHash: 0, capsule: 0, operation: 0, postHash: 0, total: 0 }
      };
      try {
        // pre-move verification (folder-only)
        const isDir = fs.existsSync(item.itemPath) && fs.statSync(item.itemPath).isDirectory();
        const t0 = Date.now();
        if (isDir && effectiveVerify !== 'none') {
          const tPre0 = Date.now();
          auditItem.beforeHash = effectiveVerify === 'sample'
            ? await (await import('./verify/hash.js')).hashFolderSample(item.itemPath)
            : await hashFolder(item.itemPath);
          auditItem.durationsMs.preHash = Date.now() - tPre0;
        }

        // Handle dry-run for relocate/link: log only, skip capsule and operation
        if (dryRunOpt && (item.actionType === 'relocate' || item.actionType === 'link')) {
          console.log(`[DRY-RUN] ${item.actionType} ${item.itemPath} → ${item.destination}`);
          auditItem.result = 'dry-run';
          auditItem.endedAt = new Date().toISOString();
          auditItem.durationsMs.total = Date.now() - t0;
          perItem.push(auditItem);
          continue;
        }

        // time capsule
        const tCap0 = Date.now();
        capsule = await timeCapsule(item.itemPath, capsuleRoot);
        auditItem.durationsMs.capsule = Date.now() - tCap0;
        auditItem.capsulePath = capsule;
        console.log(`Capsule created: ${capsule}`);

        // move or link
        const tOp0 = Date.now();
        if (item.actionType === "relocate") {
          await relocatePath(item.itemPath, item.destination);
        } else if (item.actionType === "link") {
          createJunction(item.itemPath, item.destination);
        } else if (item.actionType === "rehome_app") {
          const opts = item.actionOptions || {};
          const rehome = await import('./migrator/rehome.js');
          await rehome.rehomeApp(item.itemPath, item.destination, { updateShortcuts: !!opts.updateShortcuts, updateServices: !!opts.updateServices, dryRun: !!opts.dryRun });
        }
        auditItem.durationsMs.operation = Date.now() - tOp0;

        // post-move verification
        const afterPath = path.join(item.destination, path.basename(item.itemPath));
        if (fs.existsSync(afterPath) && fs.statSync(afterPath).isDirectory() && effectiveVerify !== 'none') {
          const tPost0 = Date.now();
          auditItem.afterHash = effectiveVerify === 'sample'
            ? await (await import('./verify/hash.js')).hashFolderSample(afterPath)
            : await hashFolder(afterPath);
          auditItem.durationsMs.postHash = Date.now() - tPost0;
          if (auditItem.beforeHash && auditItem.beforeHash !== auditItem.afterHash) {
            throw new Error(`Hash mismatch for ${item.itemPath}`);
          }
        }

        auditItem.result = 'success';
        auditItem.endedAt = new Date().toISOString();
        auditItem.durationsMs.total = Date.now() - t0;
        perItem.push(auditItem);
        console.log(`OK: ${item.actionType} ${item.itemPath} → ${item.destination}`);
      } catch (err: any) {
        auditItem.result = 'failure';
        auditItem.error = String(err?.message || err);
        auditItem.endedAt = new Date().toISOString();
        perItem.push(auditItem);
        console.error(`FAIL: ${item.itemPath} → ${item.destination}: ${auditItem.error}`);
        console.error("Auto-rollback in progress...");
        try {
          const rb = await import('./rollback/capsule.js');
          if (item.actionType === 'link') {
            rb.removeJunction(item.itemPath);
          } else if ((item.actionType === 'relocate' || item.actionType === 'rehome_app') && capsule) {
            // remove destination copy if present
            const afterPath = path.join(item.destination, path.basename(item.itemPath));
            if (fs.existsSync(afterPath)) {
              await (await import('fs-extra')).default.remove(afterPath);
            }
            // also remove junction at original if present (rehome_app)
            rb.removeJunction(item.itemPath);
            await rb.restoreCapsule(item.itemPath, capsule);
          }
          console.error("Rollback complete. Writing audit and exiting with failure.");
        } catch (e: any) {
          console.error("Rollback failed:", e.message);
        }
        const out = writeAudit(runId);
        console.error(`Audit → ${out}`);
        process.exit(1);
      }
    }

    const out = writeAudit(runId);
    console.log(`Migration complete. Audit → ${out}`);
  });

program
  .command("verify")
  .option("--last-run", "Verify last migration logs")
  .action(() => {
    console.log("Verification starter: integrate hash and launch probes in Milestone 2.");
  });

program
  .command("validate-plan")
  .requiredOption("--plan <path>")
  .action((opts) => {
    const plan = loadPlan(opts.plan);
    const res = validatePlan(plan);
    if (!res.ok) {
      console.error("Invalid plan:\n" + res.errors.map((e: string) => `- ${e}`).join("\n"));
      process.exit(1);
    } else {
      console.log("Plan is valid.");
    }
  });

program
  .command("rehome")
  .requiredOption("--path <appPath>", "Application folder path to rehome")
  .requiredOption("--dest <destination>", "Destination root (e.g., D:\\Apps)")
  .option("--verify <mode>", "Verification mode: none|sample|hash", "sample")
  .option("--update-shortcuts", "Update Start Menu/Desktop shortcuts", false)
  .option("--update-services", "Detect and log services referencing old path", false)
  .action(async (opts) => {
    const { rehomeApp } = await import("./migrator/rehome.js");
    const res = await rehomeApp(opts.path, opts.dest, { updateShortcuts: !!opts.updateShortcuts, updateServices: !!opts.updateServices });
    console.log(`Rehomed: ${res.appPath} → ${res.newLocation}`);
  });

program
  .command("rollback")
  .option("--last", "Rollback last migration run", false)
  .option("--manifest <path>", "Run manifest (JSON) to rollback deterministically")
  .action(async (opts) => {
    let runManifestPath = String(opts.manifest || '').trim();
    if (!runManifestPath) {
      const lastRunPath = path.join('logs', 'last-run.json');
      if (!fs.existsSync(lastRunPath)) {
        console.error('No last-run.json found, and no --manifest provided.');
        process.exit(1);
      }
      const auditMeta = JSON.parse(fs.readFileSync(lastRunPath, 'utf8'));
      runManifestPath = auditMeta.manifestPath || path.join('logs', 'manifest.json');
    }
    if (!fs.existsSync(runManifestPath)) {
      console.error('Run manifest not found:', runManifestPath);
      process.exit(1);
    }

    const runManifest = JSON.parse(fs.readFileSync(runManifestPath, 'utf8'));
    const items = Array.isArray(runManifest.items) ? runManifest.items : [];
    const rb = await import('./rollback/capsule.js');

    const cleanedJunctions: string[] = [];
    const restoredItems: string[] = [];

    for (const item of [...items].reverse()) {
      try {
        if (item.actionType === 'link') {
          rb.removeJunction(item.itemPath);
          cleanedJunctions.push(item.itemPath);
          console.log(`Cleaned junction: ${item.itemPath}`);
        } else if (item.actionType === 'relocate' || item.actionType === 'rehome_app') {
          const afterPath = path.join(item.destination, path.basename(item.itemPath));
          if (fs.existsSync(afterPath)) {
            await (await import('fs-extra')).default.remove(afterPath);
          }
          const capsulePath = item.capsulePath;
          // also remove junction at original if present (rehome_app)
          rb.removeJunction(item.itemPath);
          if (capsulePath && fs.existsSync(capsulePath)) {
            await rb.restoreCapsule(item.itemPath, capsulePath);
            restoredItems.push(item.itemPath);
            console.log(`Restored from capsule: ${item.itemPath}`);
          } else {
            console.warn(`No capsulePath recorded for ${item.itemPath}; nothing to restore.`);
          }
        }
      } catch (e: any) {
        console.error(`Rollback error for ${item.itemPath}:`, e.message);
      }
    }
    console.log(`Rollback complete. Restored: ${restoredItems.length}, Cleaned junctions: ${cleanedJunctions.length}`);
    if (restoredItems.length) console.log('Restored items:\n' + restoredItems.join('\n'));
    if (cleanedJunctions.length) console.log('Cleaned junctions:\n' + cleanedJunctions.join('\n'));
  });

program
  .command('validate-plans')
  .option('--dir <path>', 'Directory of plan files', 'plans')
  .action(async (opts) => {
    const fg = (await import('fast-glob')).default;
    const root = opts.dir;
    const files = await fg(['**/*.yml', '**/*.yaml'], { cwd: root, absolute: true });
    if (files.length === 0) {
      console.log('No plan files found.');
      return;
    }
    let ok = true;
    for (const f of files) {
      const plan = loadPlan(f);
      const res = validatePlan(plan);
      if (!res.ok) {
        ok = false;
        console.error(`Invalid plan: ${f}\n` + res.errors.map((e: string) => `- ${e}`).join('\n'));
      } else {
        console.log(`OK: ${f}`);
      }
    }
    if (!ok) process.exit(1);
  });

// Marketplace: pull a plan by name from local marketplace or URL
program
  .command('marketplace-pull')
  .requiredOption('--plan <name>', 'Plan name to pull (e.g., developer-storage.sample.yml)')
  .option('--source <pathOrUrl>', 'Marketplace index (local JSON path or URL)', 'marketplace/index.json')
  .option('--vet', 'Run marketplace vetting before pull', false)
  .action(async (opts) => {
    const isUrl = /^(https?:)?\/\//i.test(opts.source);
    let index: any;
    if (isUrl) {
      try {
        const res = await (await import('node:https')).get; // placeholder to avoid bundling fetch
        console.log('Remote marketplace pulling is not yet implemented in OSS. Use local marketplace/index.json.');
        process.exit(2);
      } catch {
        console.error('Remote marketplace unsupported in this build.');
        process.exit(2);
      }
    } else {
      const idxPath = path.resolve(process.cwd(), opts.source);
      if (!fs.existsSync(idxPath)) {
        console.error('Marketplace index not found:', idxPath);
        process.exit(1);
      }
      index = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
    }
    const entry = (index.entries || []).find((e: any) => e.file === opts.plan || e.name === opts.plan);
    if (!entry) {
      console.error('Plan not found in marketplace:', opts.plan);
      process.exit(1);
    }
    const srcPath = path.resolve(path.dirname(path.resolve(process.cwd(), opts.source)), entry.file);

    if (opts.vet) {
      const { vetPlan } = await import('./marketplace/vetter.js')
      const rulesPath = path.resolve(process.cwd(), 'vauntico-dream-mover/marketplace/vet-rules.json')
      const rulesCfg = JSON.parse(fs.readFileSync(rulesPath, 'utf8'))
      const issues = vetPlan(srcPath, rulesCfg)
      if (issues.length) {
        console.log('Vetting failed:')
        for (const i of issues) console.log(`- ${i.rule}: ${i.message}`)
        process.exit(1)
      } else {
        console.log('Certified ✅ — vetting passed')
      }
    }

    const dstPath = path.resolve(process.cwd(), 'plans', path.basename(entry.file));
    fs.mkdirSync(path.dirname(dstPath), { recursive: true });
    fs.copyFileSync(srcPath, dstPath);
    console.log(`Pulled ${entry.file} → ${dstPath}`);
  });

// Tiers: check current capability tier for an identity/email (stub)
program
  .command('tier-check')
  .option('--user <id>', 'User id (stub)')
  .option('--email <email>', 'User email for lookup (optional)')
  .option('--upgrade', 'Upgrade to Practitioner (stub + Paystack intent)', false)
  .option('--sso-provider <provider>', 'SSO provider (google|azure) to stub token')
  .option('--output <path>', 'Write JSON result to path')
  .action(async (opts) => {
    const { checkTier, upgradeToPractitioner } = await import('./tiers/gatekeeper.js');
    const { createPaystackIntent } = await import('./tiers/paystack-vault.js');
    const { ssoCheck } = await import('./auth/sentinel.js');
    let profile = checkTier(opts.user);
    if (opts.upgrade) {
      const email = opts.email || 'test@example.com';
      const intent = await createPaystackIntent(email, 600);
      console.log('Paystack checkout (stub):', intent.url);
      profile = upgradeToPractitioner(email);
    }
    if (opts.ssoProvider) {
      const email = opts.email || 'guild@example.com'
      const token = ssoCheck(opts.ssoProvider, email)
      console.log('SSO token stub → vauntico-dream-mover/logs/sso-token.json')
    }
    const out = String(opts.output || path.join('logs','tier-profile.json')).trim();
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(profile, null, 2));
    console.log('Tier profile →', out);
  });

program
  .command('rune-infuse')
  .requiredOption('--template <name>', 'gdpr|hipaa')
  .requiredOption('--plan <path>', 'Plan YAML path')
  .option('--out <path>', 'Output path (optional)')
  .action(async (opts) => {
    const { infusePlan } = await import('./compliance/rune-weaver.js');
    const res = infusePlan(opts.plan, opts.template, opts.out)
    console.log('Infused →', res.out)
  });

program
  .command('coven-share')
  .requiredOption('--plan-id <id>')
  .requiredOption('--team-id <id>')
  .option('--req <n>', 'Approvals required', '2')
  .action(async (opts) => {
    const { shareLib } = await import('./collab/coven-weaver.js');
    const entry = shareLib(opts.planId, opts.teamId, parseInt(opts.req))
    console.log('Shared →', JSON.stringify(entry, null, 2))
  });

program
  .command('coven-vote')
  .requiredOption('--plan-id <id>')
  .requiredOption('--team-id <id>')
  .action(async (opts) => {
    const { voteShare } = await import('./collab/coven-weaver.js');
    const entry = voteShare(opts.planId, opts.teamId)
    if (!entry) { console.error('Not found'); process.exit(1) }
    console.log('Vote recorded →', JSON.stringify(entry, null, 2))
  });

program
  .command('on-prem-init')
  .option('--compose', 'Write docker-compose stub to on-prem/', false)
  .action(async (opts) => {
    const outEnv = 'vauntico-dream-mover/logs/on-prem.env'
    fs.mkdirSync('vauntico-dream-mover/logs', { recursive: true })
    fs.writeFileSync(outEnv, 'DM_ON_PREM=true\n')
    console.log('On-prem env →', outEnv)
    if (opts.compose) {
      const dcPath = 'vauntico-dream-mover/on-prem/docker-compose.yml'
      fs.mkdirSync('vauntico-dream-mover/on-prem', { recursive: true })
      fs.writeFileSync(dcPath, `version: '3.8'\nservices:\n  web:\n    image: node:20-alpine\n    environment:\n      - DM_ON_PREM=true\n    command: sh -c \\\"node -v && sleep 3600\\\"\n    volumes:\n      - ./logs:/app/logs\n`, 'utf8')
      console.log('Docker compose stub →', dcPath)
    }
  });

program
  .command('white-label')
  .requiredOption('--org <name>')
  .option('--soc2', 'Include SOC2 terms', false)
  .option('--uptime <pct>', 'Uptime percentage', '99.9%')
  .option('--out <path>', 'Output SLA path', 'vauntico-dream-mover/white-label/white-label.sla.yml')
  .action(async (opts) => {
    const { generateSLA, writeSLA } = await import('../white-label/sla-weaver.js')
    const yaml = generateSLA({ org: opts.org, soc2: !!opts.soc2, uptime: opts.uptime })
    writeSLA(opts.out, yaml)
    console.log('SLA written →', opts.out)
  });

program
  .command('api-serve')
  .option('--port <n>', 'Port to listen on', '3001')
  .action(async (opts) => {
    const { serve } = await import('./api/portal.js')
    const server = serve(parseInt(opts.port))
    process.on('SIGINT', ()=> server.close())
  });

program
  .command('cron-rite')
  .requiredOption('--plan <path>')
  .requiredOption('--template <name>', 'gdpr|hipaa')
  .requiredOption('--expr <cron>', 'cron expression')
  .action(async (opts) => {
    const { scheduleInfuse } = await import('./cron/rite-weaver.js')
    const res = scheduleInfuse(opts.plan, opts.expr, opts.template)
    console.log('Scheduled →', JSON.stringify(res, null, 2))
  });

program.parseAsync(process.argv);
