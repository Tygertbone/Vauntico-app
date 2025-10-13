export const BRAND_ASSETS_BASE = "/brand-assets";

/**
 * Canonical asset keys; update paths after dropping in files.
 * Consumers can import this mapping without breaking if files are missing yet.
 */
export const BrandAssets = {
  favicon: `${BRAND_ASSETS_BASE}/favicon-obelisk.svg`,
  glyphPulse: `${BRAND_ASSETS_BASE}/glyphpulse.json`,
  blueNodes: `${BRAND_ASSETS_BASE}/blue-nodes.json`,
  orangeEmbers: `${BRAND_ASSETS_BASE}/orange-embers.json`,
  badgeGlow: `${BRAND_ASSETS_BASE}/badgeglow.json`,
  cliRitual: `${BRAND_ASSETS_BASE}/cliritual.json`,
  dualReveal: `${BRAND_ASSETS_BASE}/dualreveal.json`,
};

/** Utility to resolve asset URL safely */
export const getAssetUrl = (key) => BrandAssets[key] ?? null;
