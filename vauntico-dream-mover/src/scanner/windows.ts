import fs from "fs";
import path from "path";
import { ScanItem, ScanReport } from "../types.js";
import fg from "fast-glob";

export async function scanDrive(drive: string): Promise<ScanReport> {
  const roots = [
    `${drive}:\\Users`,
    `${drive}:\\ProgramData`,
    `${drive}:\\Temp`,
    `${drive}:\\Windows\\Temp`,
    `${drive}:\\Program Files`,
    `${drive}:\\Program Files (x86)`
  ];

  const patterns = roots.map(r => path.join(r, "**/*"));
  const entries = await fg(patterns, { dot: true, onlyFiles: false, unique: true, suppressErrors: true });

  const items: ScanItem[] = [];
  let total = 0;
  let quickWins = 0;

  for (const p of entries) {
    try {
      const stat = fs.statSync(p);
      const type = stat.isFile() ? "file" : stat.isDirectory() ? "folder" : undefined;
      if (!type) continue;

      const size = type === "file" ? stat.size : 0; // lightweight first pass
      total += size;

      const tags: string[] = [];
      let risk: "safe" | "caution" | "critical" = "caution";

      if (p.toLowerCase().includes("\\downloads\\") || p.toLowerCase().includes("\\videos\\")) {
        tags.push("media");
        risk = "safe";
        quickWins += size;
      }

      if (p.toLowerCase().endsWith(".dmp") || p.toLowerCase().includes("\\windows\\temp\\")) {
        tags.push("temp", "crashdump");
        risk = "safe";
        quickWins += size;
      }

      if (p.toLowerCase().includes("\\program files")) {
        tags.push("app");
        risk = "caution";
      }

      items.push({ path: p, type, sizeBytes: size, risk, tags });
    } catch {
      // skip unreadable entries
    }
  }

  return {
    drive,
    generatedAt: new Date().toISOString(),
    items,
    summary: { totalBytes: total, items: items.length, quickWinsBytes: quickWins }
  };
}
