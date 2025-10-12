import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import WinReg from "winreg";
import { relocatePath } from "./relocate.js";
import { createJunction } from "./link.js";

async function updateRegistryInstallLocation(oldPath: string, newPath: string) {
  const keys = [
    new WinReg({ hive: WinReg.HKLM, key: "\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall" }),
    new WinReg({ hive: WinReg.HKLM, key: "\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall" })
  ];
  const tryUpdate = (key: any) => new Promise<void>((resolve) => {
    key.keys((err: any, subkeys: any[]) => {
      if (err || !subkeys) return resolve();
      let pending = subkeys.length;
      if (pending === 0) return resolve();
      subkeys.forEach((sk: any) => {
        sk.get("InstallLocation", (e: any, val: any) => {
          if (!e && val && typeof val.value === 'string' && path.normalize(val.value).toLowerCase() === path.normalize(oldPath).toLowerCase()) {
            sk.set("InstallLocation", WinReg.REG_SZ, newPath, () => {
              pending--; if (pending === 0) resolve();
            });
          } else {
            pending--; if (pending === 0) resolve();
          }
        });
      });
    });
  });
  for (const k of keys) await tryUpdate(k);
}

function updateShortcutsForPath(oldPath: string, newPath: string, dryRun = false) {
  const locations = [
    process.env["ProgramData"] ? path.join(process.env["ProgramData"]!, "Microsoft", "Windows", "Start Menu", "Programs") : undefined,
    process.env["APPDATA"] ? path.join(process.env["APPDATA"]!, "Microsoft", "Windows", "Start Menu", "Programs") : undefined,
    process.env["PUBLIC"] ? path.join(process.env["PUBLIC"]!, "Desktop") : undefined,
    process.env["USERPROFILE"] ? path.join(process.env["USERPROFILE"]!, "Desktop") : undefined
  ].filter(Boolean) as string[];

  for (const base of locations) {
    try {
      const ps = `$shell = New-Object -ComObject WScript.Shell; Get-ChildItem -Path '${base.replace(/'/g, "''")}' -Filter *.lnk -Recurse -ErrorAction SilentlyContinue | ForEach-Object { $s=$shell.CreateShortcut($_.FullName); if ($s.TargetPath -like '${oldPath.replace(/'/g, "''").replace(/\\/g, "\\\\")}*') { if (-not ${dryRun}) { $s.TargetPath = $s.TargetPath -replace [regex]::Escape('${oldPath.replace(/'/g, "''").replace(/\\/g, "\\\\")}'), '${newPath.replace(/'/g, "''").replace(/\\/g, "\\\\")}'; $s.Save() } else { Write-Host ('DRY-RUN shortcut: ' + $_.FullName) } } }`;
      execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${ps}"`, { stdio: 'ignore' });
    } catch {}
  }
}

function getServicesReferencing(oldPath: string) {
  try {
    const ps = `Get-WmiObject Win32_Service | Where-Object { $_.PathName -like '*${oldPath.replace(/\\/g, "\\\\").replace(/'/g, "''")}*' } | Select-Object Name,PathName | ConvertTo-Json -Depth 3`;
    const out = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${ps}"`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString('utf8');
    return out ? JSON.parse(out) : [];
  } catch { return []; }
}

function isElevated(): boolean {
  try {
    const cmd = "powershell -NoProfile -ExecutionPolicy Bypass -Command \"([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)\"";
    const out = execSync(cmd, { stdio: ['ignore','pipe','ignore'] }).toString('utf8').trim();
    return out.toLowerCase() === 'true';
  } catch { return false; }
}

function tryUpdateServices(oldPath: string, newPath: string, dryRun = false) {
  const svcs = getServicesReferencing(oldPath);
  if (!svcs || svcs.length === 0) return;
  const elevated = isElevated();
  for (const s of svcs) {
    const oldBin = String(s.PathName || '');
    const newBin = oldBin.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), newPath);
    const cmd = `sc.exe config "${s.Name}" binPath= "${newBin}"`;
    if (dryRun) {
      console.log(`[DRY-RUN] ${cmd}`);
      console.log(`[DRY-RUN] Service ${s.Name}: ${oldBin} -> ${newBin}`);
      continue;
    }
    if (!elevated) {
      console.warn(`Not elevated. Skipping service update for ${s.Name}. Run an elevated shell to apply: ${cmd}`);
      continue;
    }
    try {
      console.log(`Updating service ${s.Name}: ${oldBin} -> ${newBin}`);
      execSync(cmd, { stdio: 'ignore' });
      console.log(`Updated service ${s.Name}`);
    } catch (e) {
      console.warn(`Service update failed for ${s.Name}. Error: ${(e as any)?.message || e}`);
    }
  }
}

export async function rehomeApp(appPath: string, destRoot: string, opts?: { updateShortcuts?: boolean; updateServices?: boolean; dryRun?: boolean }) {
  const dryRun = !!opts?.dryRun;
  if (!fs.existsSync(appPath)) throw new Error(`App path not found: ${appPath}`);
  if (!dryRun) {
    await relocatePath(appPath, destRoot);
    createJunction(appPath, destRoot);
  } else {
    console.log(`[DRY-RUN] relocate ${appPath} → ${destRoot}`);
    console.log(`[DRY-RUN] junction ${appPath} → ${path.join(destRoot, path.basename(appPath))}`);
  }

  const newLocation = path.join(destRoot, path.basename(appPath));

  try { await updateRegistryInstallLocation(appPath, newLocation); } catch {}
  if (opts?.updateShortcuts) {
    try { updateShortcutsForPath(appPath, newLocation, dryRun); } catch {}
  }
  if (opts?.updateServices) {
    try { tryUpdateServices(appPath, newLocation, dryRun); } catch {}
  }
  return { appPath, newLocation };
}
