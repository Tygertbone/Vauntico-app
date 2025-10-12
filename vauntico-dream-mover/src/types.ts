export type RiskLevel = "safe" | "caution" | "critical";

export interface ScanItem {
  path: string;
  type: "file" | "folder";
  sizeBytes: number;
  risk: RiskLevel;
  tags: string[];
  lastAccess?: string;
  dependencies?: string[];
}

export interface ScanReport {
  drive: string;
  generatedAt: string;
  items: ScanItem[];
  summary: { totalBytes: number; items: number; quickWinsBytes: number };
}

export interface ActionManifestItem {
  rule: string;
  itemPath: string;
  actionType: "relocate" | "link" | "rehome_app";
  destination: string;
  verifyMode?: "hash" | "sample" | "none";
  actionOptions?: {
    updateShortcuts?: boolean;
    updateServices?: boolean;
    dryRun?: boolean;
  };
}

export interface ActionManifest {
  generatedAt: string;
  estimatedSpaceFreedBytes: number;
  items: ActionManifestItem[];
}
